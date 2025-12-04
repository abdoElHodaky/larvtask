import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authAPI, type User, type LoginCredentials, type RegisterData } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Initialize from localStorage
  function initializeAuth() {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        // Invalid stored user data, clear everything
        clearAuth()
      }
    }
  }

  function setAuth(userData: User, authToken: string) {
    user.value = userData
    token.value = authToken
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
    error.value = null
  }

  function clearAuth() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null
    
    try {
      const response = await authAPI.login(credentials)
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.token)
        return true
      } else {
        error.value = response.message || 'Login failed'
        return false
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await authAPI.register(data)
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.token)
        return true
      } else {
        error.value = response.message || 'Registration failed'
        return false
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    
    try {
      await authAPI.logout()
    } catch (err) {
      // Even if logout fails on server, clear local auth
      console.error('Logout error:', err)
    } finally {
      clearAuth()
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return false
    
    loading.value = true
    
    try {
      const response = await authAPI.me()
      if (response.success && response.data) {
        user.value = response.data.user
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return true
      } else {
        clearAuth()
        return false
      }
    } catch (err) {
      clearAuth()
      return false
    } finally {
      loading.value = false
    }
  }

  // Initialize auth on store creation
  initializeAuth()

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    initializeAuth,
    login,
    register,
    logout,
    fetchUser,
    clearAuth,
  }
})
