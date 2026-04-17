const apiBaseUrl = "http://localhost:5173/api";

export const loginWith = async (page, username, password) => {
  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

export const createBlog = async (page, title, author, url) => {
  await page.getByRole("link", { name: "New Blog" }).click();
  await page.getByLabel("title").fill(title);
  await page.getByLabel("author").fill(author);
  await page.getByLabel("url").fill(url);
  await page.getByRole("button", { name: "Create" }).click();
};

export const resetApp = async (request) => {
  await request.post(`${apiBaseUrl}/testing/reset`);
};

export const createUserApi = async (request, user) => {
  await request.post(`${apiBaseUrl}/users`, {
    data: user,
  });
};

export const loginViaApi = async (request, username, password) => {
  const response = await request.post(`${apiBaseUrl}/login`, {
    data: { username, password },
  });

  return response.json();
};

export const createBlogApi = async (request, blog, token) => {
  await request.post(`${apiBaseUrl}/blogs`, {
    data: blog,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const findBlog = (page, title, author) =>
  page
    .getByTestId("blog-item")
    .filter({
      has: page.getByTestId("blog-title", { hasText: title }),
    })
    .filter({
      has: page.getByTestId("blog-author", { hasText: `by ${author}` }),
    });
