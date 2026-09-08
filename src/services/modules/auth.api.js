import { api } from '../api/axios'

/**
 * Auth endpoints. No login screen exists in this kiosk-only build (see
 * README assumptions) — this module just gives the backend integration a
 * ready home once one is designed.
 */
export const login = (credentials) => api.post('/auth/login', credentials)
export const logout = () => api.post('/auth/logout')
export const getCurrentUser = () => api.get('/auth/me')
