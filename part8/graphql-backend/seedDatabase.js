import Author from './models/author.js'
import Book from './models/book.js'
import { seedAuthors, seedBooks } from './data/seedData.js'

const seedDatabase = async () => {
  const [authorCount, bookCount] = await Promise.all([
    Author.countDocuments({}),
    Book.countDocuments({}),
  ])

  if (authorCount > 0 || bookCount > 0) {
    console.log('Skipping database seed, existing data found')
    return
  }

  const createdAuthors = await Author.insertMany(seedAuthors)
  const authorsByName = new Map(createdAuthors.map((author) => [author.name, author._id]))

  const booksToInsert = seedBooks.map((book) => ({
    title: book.title,
    published: book.published,
    genres: book.genres,
    author: authorsByName.get(book.author),
  }))

  await Book.insertMany(booksToInsert)

  console.log('Database seeded with default authors and books')
}

export default seedDatabase
