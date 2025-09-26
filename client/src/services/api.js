import axios from 'axios'
import Swal from 'sweetalert2'

const API_BASE_URL = 'http://localhost:8000/api'
const API_ROOT = 'http://localhost:8000' // root without /api

// Create the axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // allow cookies from Sanctum and to be sent back
  headers: {
    'Content-Type': 'application/json',
  },
})

const rootApi = axios.create({
  baseURL: API_ROOT,
  withCredentials: true,
})

export const initializeCsrf = async () => {
  try {
    await rootApi.get('/sanctum/csrf-cookie')
  } catch (error) {
    console.error('Failed to initialize CSRF token:', error)
  }
}

// request interceptor to get the csrf token and add it to the header
api.interceptors.request.use((config) => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  if (match) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[1])
  }
  return config
})

// Optional: Response interceptor for logging or error handling
// ok so here the error thrown here is the error from the axios that is from the backend that the response and error which is like the .result and .error in promise will be the error catch in the signup and others
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response?.data || error.message)
    return Promise.reject(error)
  },
)

// auth services
export const authuser = {
  async signup(userData) {
    try {
      await initializeCsrf() // Get CSRF token first

      const response = await api.post('/register', userData)
      if (response.status === 201) {
        return response.data.user
      } else {
        // well this error here is thrown if after the backend response successful and the status is not what is expexted like its 500 instead of 200
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('signup err', error)
      throw new Error(error.response?.data?.message || error.message || 'Signup failed')
    }
  },

  async login(userData) {
    try {
      await initializeCsrf() // Get CSRF token first

      const response = await api.post('/login', userData)
      if (response.status === 200) {
        return response.data.user
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('login err', error)
      throw new Error(error.response?.data?.message || error.message || 'Login failed')
    }
  },

  async logout() {
    try {
      await initializeCsrf() // Get CSRF token first
      const response = await api.post('/logout')
      if (response.status === 200) {
        return response.data?.message ?? 'Logged out successfully'
      } else {
        throw new Error(response.data.error)
      }
    } catch (error) {
      console.error('logout err', error)
      throw new Error(error.response?.data?.message || error.message || 'logout failed')
    }
  },

  async me() {
    const response = await api.get('/user')
    return response.data
  },
}
