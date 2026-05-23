import axios from 'axios'
import { getAccessToken, setAccessToken } from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api',
  withCredentials: true
})

// attach access token
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  return config
})

// simple response interceptor to handle 401 by trying refresh
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config
    if (error.response && error.response.status === 401 && !original._retry) {
      original._retry = true
      try {
        const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true })
        const accessToken = res.data.accessToken
        setAccessToken(accessToken)
        original.headers['Authorization'] = `Bearer ${accessToken}`
        return api(original)
      } catch (e) {
        setAccessToken(null)
        return Promise.reject(e)
      }
    }
    return Promise.reject(error)
  }
)

export default api
