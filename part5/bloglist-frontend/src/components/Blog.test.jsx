import { expect, vi, test, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'
import BlogDetails from './BlogDetails'

const blog = {
  title: 'Hello World',
  author: 'Bilbo Baggins',
  url: 'google.com',
  likes: 3,
  user: 'Grace Hopper'
}

const renderBlog = () => {
  return render(
    <MemoryRouter>
      <Blog blog={blog}/>
    </MemoryRouter>
  )
}

const renderBlogDetails = (props = {}) => {
  const defaultProps = {
    blog,
    onLike: vi.fn(),
    onRemove: vi.fn(),
    canRemove: false
  }
  return render(
    <MemoryRouter>
      <BlogDetails {...defaultProps} {...props} />
    </MemoryRouter>
  )
}

describe('Blog --> Not Logged In', () => {
  test('Blog info shown', () => {
    renderBlog()
    const title = screen.getByText('Hello World')
    const author = screen.getByText('by Bilbo Baggins')
    expect(title).toBeInTheDocument()
    expect(author).toBeInTheDocument()
  })

  test('Buttons not shown', () => {
    renderBlog()
    const likeButton = screen.queryByRole('button', { name: 'Like' })
    const removeButton = screen.queryByRole('button', { name: 'Remove' })
    expect(likeButton).not.toBeInTheDocument()
    expect(removeButton).not.toBeInTheDocument()
  })
})

describe('BlogDetails --> Logged In', () => {
  test('Only like button', async () => {
    renderBlogDetails({ canRemove:false })

    const likeButton = screen.queryByRole('button', { name: 'Like' })
    expect(likeButton).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()
  })

  test('Creator shown delete button', async () => {
    renderBlogDetails({ canRemove: true })

    const likeButton = screen.queryByRole('button', { name: 'Like' })
    const removeButton = screen.queryByRole('button', { name: 'Remove' })
    expect(likeButton).toBeInTheDocument()
    expect(removeButton).toBeInTheDocument()
  })
})
