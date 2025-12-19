const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const sum = blogs.reduce((acc, blog) => {
    return acc + blog.likes;
  }, 0);
  return sum;
};

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map((blog) => blog.likes));
  const favorite = blogs.find((blog) => blog.likes === maxLikes);
  return favorite;
};

const mostBlogs = (blogs) => {
  const countMap = {};
  blogs.forEach((blog) => {
    if (!countMap[blog.author]) {
      countMap[blog.author] = 1;
    } else {
      countMap[blog.author]++;
    }
  });
  const numBlogs = Math.max(...Object.values(countMap));
  const author = Object.keys(countMap).find(
    (key) => countMap[key] === numBlogs,
  );
  return {
    author: author,
    blogs: numBlogs,
  };
};

const mostLikes = (blogs) => {
  const likeMap = {};
  blogs.forEach((blog) => {
    if (!likeMap[blog.author]) {
      likeMap[blog.author] = blog.likes;
    } else {
      likeMap[blog.author] += blog.likes;
    }
  });
  const maxLikes = Math.max(...Object.values(likeMap));
  const author = Object.keys(likeMap).find((key) => likeMap[key] === maxLikes);
  return {
    author: author,
    likes: maxLikes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
