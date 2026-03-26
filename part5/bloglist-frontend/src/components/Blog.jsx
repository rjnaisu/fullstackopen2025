import { useState } from 'react'

const Blog = ({ blog, onLike, onRemove, canRemove }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="blogStyle">
      <div className="blogSummary">
        <div className="blogHeading">
          <span className="blogTitle">{blog.title}</span>
          <span className="blogAuthor">by {blog.author}</span>
        </div>
        <button className="blogToggle" type="button" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'hide' : 'view'}
        </button>
      </div>

      {expanded && (
        <div className="blogDetails">
          <div className="blogMeta">{blog.url}</div>
          <div className="blogMeta">
            {blog.likes} likes <button onClick={() => onLike(blog)}>Like</button>
          </div>
          <div className="blogMeta">added by {blog.user?.name ?? 'unknown'}</div>
          {canRemove && (
            <div>
              <button onClick={() => onRemove(blog)}>Remove</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
