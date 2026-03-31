import { beforeEach, expect } from 'vitest'
import Blog from './Blog'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  const blog = {
    title: 'Hello World',
    author: 'Bilbo Baggins',
    url: 'google.com',
    likes: 3,
    user: 'Grace Hopper'
  }
  beforeEach(() => {
    render(<Blog blog={blog} />)
  })

  test('Renders title and author', () => {
    const title = screen.getByText('Hello World')
    const author = screen.getByText('by Bilbo Baggins')
    const url = screen.queryByText('google.com')
    const like = screen.queryByText('3 likes')

    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(url).not.toBeInTheDocument()
    expect(like).not.toBeInTheDocument()
  })

  //URl and likes shown on button click
  test('Renders URL and Likes on click', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.queryByText('google.com')
    const like = screen.queryByText('3 likes')
    expect(url).toBeDefined()
    expect(like).toBeDefined()
  })
})

//test Blog renders title and author
test('Click like twice --> event handler twice', async () => {
  const blog = {
    title: 'Hello World',
    author: 'Bilbo Baggins',
    url: 'google.com',
    likes: 3,
    user: 'Grace Hopper'
  }

  const mockHandler = vi.fn()
  render(<Blog blog={blog} onLike={mockHandler}/>)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

