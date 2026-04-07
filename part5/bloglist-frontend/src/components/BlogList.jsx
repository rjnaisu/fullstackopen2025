import Blog from './Blog'

const BlogsList = ({ blogs }) => {
  if (blogs.length === 0) {
    return <p>No blogs here yet</p>
  }
  return (
    <div>
      <section>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </section>
    </div>
  )
}

export default BlogsList
