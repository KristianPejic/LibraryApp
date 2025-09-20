import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'
const REQUEST_TIMEOUT = 10000

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: new Date().getTime()
    }

    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.params)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status}`, response.data)
    return response
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message)

    // Handle different error types
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Request timeout - server is taking too long to respond',
        type: 'timeout'
      })
    }

    if (error.response) {
      // Server responded with error status
      return Promise.reject({
        message: error.response.data?.error || 'Server error',
        status: error.response.status,
        type: 'server_error'
      })
    } else if (error.request) {
      // Network error
      return Promise.reject({
        message: 'Network error - please check your connection',
        type: 'network_error'
      })
    } else {
      // Other error
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        type: 'unknown_error'
      })
    }
  }
)

export default apiClient
