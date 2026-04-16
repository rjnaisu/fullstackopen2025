import { createContext, useEffect, useState } from "react";
import blogService from "../services/blogs";
import loginService from "../services/login";
import persistentUser from "../services/persistentUser";

const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, setUser] = useState(() => persistentUser.getUser());

  useEffect(() => {
    blogService.setToken(user?.token ?? null);
  }, [user]);

  const login = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });
      persistentUser.saveUser(user);
      setUser(user);
      return user;
    } catch {
      return null;
    }
  };

  const logout = () => {
    persistentUser.removeUser();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
