import { api } from './axios'
import { AUTH_TOKEN_STORAGE_KEY } from '@/constants/auth.constants'

/**
 * Registers request/response interceptors on the shared Axios instance.
 * Call once from main.js before the app mounts.
 */
export function registerInterceptors(router) {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status

      if (status === 401) {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
        // No protected/login route exists yet in this kiosk-only build — this
        // guard is here so wiring one up later doesn't require touching the
        // interceptor.
        if (router?.hasRoute('login')) {
          router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
        }
      }

      // Normalize into a consistent shape UI code can rely on.
      const message =
        error.response?.data?.message || error.message || 'Something went wrong. Please try again.'

      return Promise.reject({ ...error, message })
    },
  )
}
