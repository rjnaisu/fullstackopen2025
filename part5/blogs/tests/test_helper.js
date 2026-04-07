const Blog = require('../models/blog')
const User = require('../models/user')
const apiBaseUrl = 'http://localhost:5173/api'

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'New Blog' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'Create' }).click()
}

const resetApp = async (request) => {
  await request.post(`${apiBaseUrl}/testing/reset`)
}

const createUserApi = async (request, user) => {
  await request.post(`${apiBaseUrl}/users`, {
    data: user
  })
}

const loginViaApi = async (request, username, password) => {
  const response = await request.post(`${apiBaseUrl}/login`, {
    data: { username, password }
  })

  return response.json()
}

const createBlogApi = async (request, blog, token) => {
  await request.post(`${apiBaseUrl}/blogs`, {
    data: blog,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const findBlog = (page, title, author) => page.getByTestId('blog-item').filter({
  has: page.getByTestId('blog-title', { hasText: title })
}).filter({
  has: page.getByTestId('blog-author', { hasText: `by ${author}` })
})

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  loginWith,
  createBlog,
  resetApp,
  createUserApi,
  loginViaApi,
  createBlogApi,
  findBlog
}
