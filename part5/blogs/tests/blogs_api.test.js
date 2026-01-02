const assert = require("node:assert");
const bcrypt = require("bcrypt");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

describe("Test with Initialized DB", () => {
  let authToken;

  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    const passwordHash = await bcrypt.hash("password", 10);
    const user = new User({
      username: "root",
      name: "Root User",
      passwordHash,
    });
    const savedUser = await user.save();

    const savedBlogs = await Blog.insertMany(
      helper.initialBlogs.map((blog) => ({
        ...blog,
        user: savedUser._id,
      })),
    );

    savedUser.blogs = savedBlogs.map((blog) => blog._id);
    await savedUser.save();

    const loginResponse = await api
      .post("/api/login")
      .send({ username: "root", password: "password" });

    authToken = loginResponse.body.token;
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("confirm _id is named id", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(
      response.body[0].id,
      helper.initialBlogs[0]._id.toString(),
    );
  });

  describe("Adding new Blogs", () => {
    test("Create new valid blog post", async () => {
      const newBlog = {
        title: "New Blog Post",
        author: "John Doe",
        url: "http://example.com/new-blog-post",
        likes: 5,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");
      const titles = response.body.map((r) => r.title);
      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);
      assert.strictEqual(titles.includes(newBlog.title), true);
    });

    test("Test likes default to 0", async () => {
      const likelessBlog = {
        title: "New Blog Post",
        author: "John Doe",
        url: "http://example.com/new-blog-post",
      };
      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${authToken}`)
        .send(likelessBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");
      const newPost = response.body.find((r) => r.title === "New Blog Post");
      assert.strictEqual(newPost.likes, 0);
    });

    test("Title/URL missing --> bad request", async () => {
      const missingTitle = {
        author: "James Bond",
        url: "http://example.com/new-blog-post",
        likes: 5,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${authToken}`)
        .send(missingTitle)
        .expect(400);
      const endBlogs = await helper.blogsInDb();
      assert.strictEqual(endBlogs.length, helper.initialBlogs.length);
    });

    test("adding a blog without a token fails with 401", async () => {
      const newBlog = {
        title: "Tokenless Post",
        author: "Agent Zero",
        url: "http://example.com/secret",
        likes: 1,
      };

      const result = await api.post("/api/blogs").send(newBlog).expect(401);

      assert.strictEqual(result.body.error, "token missing");
      const endBlogs = await helper.blogsInDb();
      assert.strictEqual(endBlogs.length, helper.initialBlogs.length);
    });
  });

  describe("Accessing via ID", () => {
    test("Can delete blog using id", async () => {
      const deleteId = helper.initialBlogs[0]._id.toString();
      await api
        .delete(`/api/blogs/${deleteId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      const resultBlogs = await helper.blogsInDb();
      const ids = resultBlogs.map((blog) => blog.id);
      assert(!ids.includes(deleteId));
      assert.strictEqual(resultBlogs.length, helper.initialBlogs.length - 1);
    });

    test("Update blog data", async () => {
      const updateId = helper.initialBlogs[0]._id.toString();
      const updatedData = {
        title: "Updated Title",
        author: "Updated Author",
        url: "http://example.com/updated-blog-post",
        likes: 10,
      };

      await api.put(`/api/blogs/${updateId}`).send(updatedData).expect(200);
      const endBlogs = await helper.blogsInDb();
      const getUpdatedBlog = endBlogs.find((blog) => blog.id === updateId);
      assert.strictEqual(getUpdatedBlog.title, updatedData.title);
      assert.strictEqual(getUpdatedBlog.author, updatedData.author);
      assert.strictEqual(getUpdatedBlog.url, updatedData.url);
      assert.strictEqual(getUpdatedBlog.likes, updatedData.likes);
    });
  });
});

describe("when there is one user in the db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("secrect", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();
  });

  test("create succeeds with fresh username", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "rjnasm",
      name: "ryan naismith",
      password: "jimmycricket",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("fails for duplicate user", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "root",
      name: "ryan naismith",
      password: "jimmycricket",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);

    assert(result.body.error.includes("expected `username` to be unique"));
  });
});

after(async () => {
  await mongoose.connection.close();
});
