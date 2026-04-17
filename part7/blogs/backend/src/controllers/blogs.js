const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const { userExtractor } = require("../utils/middleware");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.post("/", userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body;
  const user = request.user;

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  const populatedBlog = await savedBlog.populate("user", {
    username: 1,
    name: 1,
  });

  user.blogs = user.blogs.concat(blog._id);
  await user.save();

  response.status(201).json(populatedBlog);
});

blogRouter.delete("/:id", userExtractor, async (req, res) => {
  const id = req.params.id;
  const user = req.user;

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ error: "blog not found" });
  }

  if (blog.user.toString() !== user._id.toString()) {
    return res.status(401).json({ error: "user not authorized" });
  }

  await Blog.findByIdAndDelete(id);
  res.status(204).end();
});

blogRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true }).populate("user", {
    username: 1,
    name: 1,
  });
  res.status(200).json(updatedBlog);
});

blogRouter.post("/:id/comments", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ error: "blog not found" });
  }
  blog.comments = blog.comments.concat(req.body.comment);
  const savedBlog = await blog.save();
  const populatedBlog = await savedBlog.populate("user", {
    username: 1,
    name: 1,
  });
  res.status(200).json(populatedBlog);
});

module.exports = blogRouter;
