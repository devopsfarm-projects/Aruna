import axios from 'axios'

const payload = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
})

export default payload
