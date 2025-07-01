import axios from 'axios'

const api = axios.create({
  // baseURL: 'http://localhost:8000/api', // update if needed
  baseURL: 'https://test.manishadhikari7.com.np/api', // update if needed
})

export default api
