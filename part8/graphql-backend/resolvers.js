import { GraphQLError } from 'graphql'
import Author from './models/author.js'
import Book from './models/book.js'
import User from './models/user.js'
import jwt from 'jsonwebtoken'

const validateMinLength = (fieldName, value, minLength) => {
  if (value.length < minLength) {
    throw new GraphQLError(`${fieldName} must be at least ${minLength} characters long`, {
      extensions: {
        code: 'BAD_USER_INPUT',
        invalidArgs: [fieldName],
      },
    })
  }
}

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_, args) => {
      const filter = {}

      if (args.genre) {
        filter.genres = args.genre
      }

      if (args.author) {
        const author = await Author.findOne({ name: args.author })

        if (!author) {
          return []
        }

        filter.author = author._id
      }

      return Book.find(filter).populate('author')
    },
    allAuthors: async () => Author.find({}),
    me: async (_, args, context) => {
      return context.currentUser
    },
    allGenres: async () => {
      const books = await Book.find({}, { genres: 1 })
      const genres = books.flatMap((book) => book.genres)
      return [...new Set(genres)]
    },
  },
  Author: {
    bookCount: async (root) => Book.countDocuments({ author: root._id }),
  },
  Mutation: {
    addBook: async (_, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }
      validateMinLength('title', args.title, Book.schema.path('title').options.minlength)
      validateMinLength('author', args.author, Author.schema.path('name').options.minlength)

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: author._id,
      })

      const savedBook = await book.save()
      return savedBook.populate('author')
    },
    editAuthor: async (_, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }
      validateMinLength('name', args.name, Author.schema.path('name').options.minlength)

      let author = await Author.findOne({ name: args.name })
      if (!author) return null

      author.born = args.setBornTo
      return await author.save()
    },
    createUser: async (_, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      try {
        return await user.save()
      } catch (error) {
        throw new GraphQLError(`Creating user failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      }
    },
    login: async (_, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong creds', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
}

export default resolvers
