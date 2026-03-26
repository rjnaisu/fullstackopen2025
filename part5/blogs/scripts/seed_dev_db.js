const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { MONGODB_URI } = require('../utils/config')
const Blog = require('../models/blog')
const User = require('../models/user')

const usersData = [
  { username: 'alice', name: 'Alice Walker', password: 'secret1' },
  { username: 'ben', name: 'Ben Carter', password: 'secret2' },
  { username: 'cora', name: 'Cora Nguyen', password: 'secret3' },
  { username: 'drew', name: 'Drew Patel', password: 'secret4' },
]

const blogsData = [
  {
    title: 'Async Patterns in Node',
    author: 'Alice Walker',
    url: 'https://example.com/async-patterns-node',
    likes: 12,
    username: 'alice',
  },
  {
    title: 'Testing Express APIs with Supertest',
    author: 'Alice Walker',
    url: 'https://example.com/testing-express-apis',
    likes: 7,
    username: 'alice',
  },
  {
    title: 'From Callbacks to Promises',
    author: 'Ben Carter',
    url: 'https://example.com/callbacks-to-promises',
    likes: 4,
    username: 'ben',
  },
  {
    title: 'Debugging Mongoose Queries',
    author: 'Ben Carter',
    url: 'https://example.com/debugging-mongoose',
    likes: 9,
    username: 'ben',
  },
  {
    title: 'JWT Auth Done Right',
    author: 'Ben Carter',
    url: 'https://example.com/jwt-auth-done-right',
    likes: 11,
    username: 'ben',
  },
  {
    title: 'Clean API Error Handling',
    author: 'Cora Nguyen',
    url: 'https://example.com/clean-api-errors',
    likes: 6,
    username: 'cora',
  },
  {
    title: 'Designing RESTful Routes',
    author: 'Cora Nguyen',
    url: 'https://example.com/designing-restful-routes',
    likes: 3,
    username: 'cora',
  },
  {
    title: 'Scaling with Indexes',
    author: 'Drew Patel',
    url: 'https://example.com/scaling-with-indexes',
    likes: 8,
    username: 'drew',
  },
  {
    title: 'Schema Design for Blogs',
    author: 'Drew Patel',
    url: 'https://example.com/schema-design-blogs',
    likes: 5,
    username: 'drew',
  },
  {
    title: 'Keeping Dev Data Consistent',
    author: 'Drew Patel',
    url: 'https://example.com/dev-data-consistency',
    likes: 2,
    username: 'drew',
  },
]

const seed = async () => {
  if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI for development database.')
    process.exit(1)
  }

  await mongoose.connect(MONGODB_URI)

  await Blog.deleteMany({})
  await User.deleteMany({})

  const users = []
  for (const user of usersData) {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const newUser = new User({
      username: user.username,
      name: user.name,
      passwordHash,
    })
    users.push(await newUser.save())
  }

  const usersByUsername = new Map(users.map((user) => [user.username, user]))

  for (const blog of blogsData) {
    const blogOwner = usersByUsername.get(blog.username)
    const newBlog = new Blog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: blogOwner._id,
    })
    const savedBlog = await newBlog.save()
    blogOwner.blogs = blogOwner.blogs.concat(savedBlog._id)
  }

  await Promise.all(users.map((user) => user.save()))

  await mongoose.connection.close()
}

seed()
  .then(() => {
    console.log('Development database seeded with users and blogs.')
  })
  .catch((error) => {
    console.error('Seeding failed:', error)
    mongoose.connection.close()
    process.exit(1)
  })
