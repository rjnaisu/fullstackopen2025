import { test, expect } from "@playwright/test";
import {
  loginWith,
  createBlog,
  resetApp,
  createUserApi,
  findBlog,
} from "../helpers/test_helper.js";

const alice = {
  name: "Alice Walker",
  username: "alice",
  password: "secret1",
};

const testBlog = {
  title: "Effective C++",
  author: "John Wick",
  url: "foobar.com",
  likes: 0,
};

test.describe("Blog app", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page, request }) => {
    await resetApp(request);
    await createUserApi(request, alice);

    await page.goto("http://localhost:5173");
  });

  test("Login successuful", async ({ page }) => {
    await page.goto("http://localhost:5173/login");
    await loginWith(page, alice.username, alice.password);
    await expect(page.getByRole("button", { name: "logout" })).toBeVisible();
  });
  test("Login failure", async ({ page }) => {
    await page.goto("http://localhost:5173/login");
    await loginWith(page, "foo", "bar");
    await expect(page.getByRole("button", { name: "logout" })).not.toBeVisible();
    await expect(page.getByText("Welcome foo bar")).not.toBeVisible();
    await expect(page.locator(".error")).toContainText("Wrong username or password");
  });
  test.describe("Logged in user can:", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("http://localhost:5173/login");
      await loginWith(page, alice.username, alice.password);
      await expect(page.getByRole("button", { name: "logout" })).toBeVisible();
    });
    test("Create a blog", async ({ page }) => {
      await createBlog(page, testBlog.title, testBlog.author, testBlog.url);
      await expect(page.getByTestId("blog-title")).toHaveText(testBlog.title);
      await expect(page.getByTestId("blog-author")).toHaveText(`by ${testBlog.author}`);
    });
    test("Like blogs", async ({ page }) => {
      await createBlog(page, testBlog.title, testBlog.author, testBlog.url);
      const blog = findBlog(page, testBlog.title, testBlog.author);
      await blog.getByRole("link").click();

      const likeButton = page.getByRole("button", { name: "Like" });
      await expect(likeButton).toBeVisible();

      const likesText = await page.getByTestId("blog-likes-count").textContent();
      const likes = Number(likesText.match(/\d+/)[0]);

      await likeButton.click();
      await expect(page.getByTestId("blog-likes-count")).toHaveText(`${likes + 1} likes`);
    });
    test("Delete blog", async ({ page }) => {
      await createBlog(page, testBlog.title, testBlog.author, testBlog.url);
      const blog = findBlog(page, testBlog.title, testBlog.author);
      await blog.getByRole("link").click();
      await expect(page.getByRole("button", { name: "Remove" })).toBeVisible();

      page.once("dialog", async (dialog) => {
        expect(dialog.type()).toBe("confirm");
        await dialog.accept();
      });

      await page.getByRole("button", { name: "Remove" }).click();

      await expect(blog).toHaveCount(0);
    });
  });
});
