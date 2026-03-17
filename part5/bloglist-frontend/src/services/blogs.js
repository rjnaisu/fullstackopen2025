import axios from 'axios'
const baseUrl = '/api/blogs'

//set token
let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
};

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
 
// 'create' function to add new blogs, set authorization token in the header
const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default { getAll, create, setToken}