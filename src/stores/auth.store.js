import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { AUTH_TOKEN_STORAGE_KEY } from '@/constants/auth.constants'
import * as authApi from '@/services/modules/auth.api'

/**
 * Auth state, kept minimal since this build only ships the public kiosk
 * flow. Wired up so a future login page / protected routes can plug straight
 * in without restructuring.
 */
export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY))
  const user = ref(null)

  const isAuthenticated = computed(() => Boolean(token.value))

  function setToken(newToken) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, newToken)
    } else {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    }
  }

  async function login(credentials) {
    const { data } = await authApi.login(credentials)
    setToken(data.token)
    user.value = data.user ?? null
    return data
  }

  async function logout() {
    try {
      await authApi.logout()
    } finally {
      setToken(null)
      user.value = null
    }
  }

  return { token, user, isAuthenticated, login, logout, setToken }
})
