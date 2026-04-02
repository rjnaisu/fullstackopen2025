import { useState } from 'react'

const Blog = ({ blog, onLike, onRemove, canRemove }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="blogStyle" data-testid="blog-item">
      <div className="blogSummary">
        <div className="blogHeading">
          <span className="blogTitle" data-testid="blog-title">{blog.title}</span>
          <span className="blogAuthor" data-testid="blog-author">by {blog.author}</span>
        </div>
        <button className="blogToggle" type="button" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'hide' : 'view'}
        </button>
      </div>

      {expanded && (
        <div className="blogDetails">
          <div className="blogMeta blogUrl" data-testid="blog-url">{blog.url}</div>
          <div className="blogMeta blogLikes" data-testid="blog-likes">
            <span className="blogLikesCount" data-testid="blog-likes-count">{blog.likes} likes</span>{' '}
            <button className="blogLikeButton" type="button" onClick={() => onLike(blog)}>
              Like
            </button>
          </div>
          <div className="blogMeta blogOwner" data-testid="blog-owner">
            added by {blog.user?.name ?? 'unknown'}
          </div>
          {canRemove && (
            <div className="blogActions">
              <button
                className="blogRemoveButton"
                type="button"
                onClick={() => onRemove(blog)}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export default Blog
