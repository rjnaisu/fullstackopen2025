import { test, expect } from '@playwright/test'
import {
  loginWith,
  createBlog,
  resetApp,
  createUserApi,
  loginViaApi,
  createBlogApi,
  findBlog
} from '../../blogs/tests/test_helper'

const alice = {
  name: 'Alice Walker',
  username: 'alice',
  password: 'secret1'
}

const bob = {
  name: 'Bob Builder',
  username: 'bob',
  password: 'secret2'
}

const testBlog = {
  title: 'Effective C++',
  author: 'John Wick',
  url: 'foobar.com',
  likes: 0
}

const orderedBlogs = [
  {
    title: 'Least liked',
    author: 'Author A',
    url: 'a.com',
    likes: 1
  },
  {
    title: 'Most liked',
    author: 'Author B',
    url: 'b.com',
    likes: 10
  },
  {
    title: 'Middle liked',
    author: 'Author C',
    url: 'c.com',
    likes: 5
  }
]

test.describe('Blog app', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeEach(async ({ page, request }) => {
    await resetApp(request)
    await createUserApi(request, alice)

    await page.goto('http://localhost:5173')
  })

  test('Login form shown', async ({ page }) => {
    await expect(page.getByText('Log in to the application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
  })

  test.describe('Login', () => {
    test('Success', async ({ page }) => {
      await loginWith(page, alice.username, alice.password)
      await expect(page.getByText(`${alice.name} logged in`)).toBeVisible()
    })
    test('Fail', async ({ page }) => {
      await loginWith(page, 'secret', 'foobar')
      const error = page.locator('.error')
      await expect(error).toContainText('Wrong username or password')
      await expect(page.getByText(`${alice.name} logged in`)).not.toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, alice.username, alice.password)
      await expect(page.getByText(`${alice.name} logged in`)).toBeVisible()
    })
    test('New note can be created and viewed', async ({ page }) => {
      await createBlog(page, testBlog.title, testBlog.author, testBlog.url)
      const blog = findBlog(page, testBlog.title, testBlog.author)
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByTestId('blog-url')).toHaveText(testBlog.url)
    })

  })

  test.describe('Modifying Blogs', () => {
    test.beforeEach(async ({ page, request }) => {
      const { token } = await loginViaApi(request, alice.username, alice.password)

      await createBlogApi(request, testBlog, token)
      await page.goto('http://localhost:5173')
      await loginWith(page, alice.username, alice.password)
      await expect(page.getByText(`${alice.name} logged in`)).toBeVisible()
    })

    test('Blog can be liked', async ({ page }) => {
      const blog = findBlog(page, testBlog.title, testBlog.author)

      await blog.getByRole('button', { name: 'view' }).click()

      const likeButton = blog.getByRole('button', { name: 'Like' })
      await expect(likeButton).toBeVisible()

      const likesText = await blog.getByTestId('blog-likes-count').textContent()
      const likes = Number(likesText.match(/\d+/)[0])

      await likeButton.click()

      await expect(blog.getByTestId('blog-likes-count')).toHaveText(`${likes + 1} likes`)
    })

    test('Delete a blog', async ({ page }) => {
      const blog = findBlog(page, testBlog.title, testBlog.author)
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'Remove' })).toBeVisible()

      page.once('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm')
        await dialog.accept()
      })

      await blog.getByRole('button', { name: 'Remove' }).click()

      await expect(blog).toHaveCount(0)
    })

    test('Only the user who added a blog can see delete', async ({ page, request }) => {
      await createUserApi(request, bob)

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, bob.username, bob.password)
      await expect(page.getByText(`${bob.name} logged in`)).toBeVisible()

      const blog = findBlog(page, testBlog.title, testBlog.author)

      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'Remove' })).toHaveCount(0)
    })
  })

  test.describe('Blog ordering', () => {
    test('Blogs are ordered by likes in descending order', async ({ page, request }) => {
      const { token } = await loginViaApi(request, alice.username, alice.password)

      for (const blog of orderedBlogs) {
        await createBlogApi(request, blog, token)
      }

      await page.goto('http://localhost:5173')
      await loginWith(page, alice.username, alice.password)
      await expect(page.getByText(`${alice.name} logged in`)).toBeVisible()

      const blogs = page.getByTestId('blog-item')

      await expect(blogs.nth(0).getByTestId('blog-title')).toHaveText('Most liked')
      await expect(blogs.nth(1).getByTestId('blog-title')).toHaveText('Middle liked')
      await expect(blogs.nth(2).getByTestId('blog-title')).toHaveText('Least liked')
    })
  })
})
