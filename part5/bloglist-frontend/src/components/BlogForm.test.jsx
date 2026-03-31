import { expect } from 'vitest'
import Blog from './Blog'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'


//test Blog renders title and author
test('New blog correct details', async () => {
  const blog = {
    title: 'Hello World',
    author: 'Bilbo Baggins',
    url: 'google.com',
  }

  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm onCreate={createBlog} />)
  screen.debug()

  const input1 = screen.getByLabelText('title:')
  const input2 = screen.getByLabelText('author:')
  const input3 = screen.getByLabelText('url:')
  const submit = screen.getByText('Create')

  await user.type(input1, blog.title)
  await user.type(input2, blog.author)
  await user.type(input3, blog.url)
  await user.click(submit)

  console.log(createBlog.mock.calls)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe(blog.title)
  expect(createBlog.mock.calls[0][0].author).toBe(blog.author)
  expect(createBlog.mock.calls[0][0].url).toBe(blog.url)
})

