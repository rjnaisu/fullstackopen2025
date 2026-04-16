const USER_KEY = "loggedBlogappUser";

const getUser = () => {
  try {
    const storedUser = window.localStorage.getItem(USER_KEY);
    if (!storedUser) {
      return null;
    }
    const user = JSON.parse(storedUser);
    return user;
  } catch {
    return null;
  }
};

const saveUser = (user) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const removeUser = () => {
  window.localStorage.removeItem(USER_KEY);
};

export default { getUser, saveUser, removeUser };
