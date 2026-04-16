import axios from "axios";

const baseUrl = "/api/users";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getById = async (id) => {
  const users = await getAll();
  return users.find((user) => user.id === id) ?? null;
};

export default { getAll, getById };
