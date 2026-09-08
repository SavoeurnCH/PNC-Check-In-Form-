import axios from 'axios'

/**
 * Centralized Axios instance. Every API module imports this instead of
 * calling `axios` directly, so base URL, headers, and error handling stay
 * in one place when the real backend is wired up.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
