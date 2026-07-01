import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import router from '@/router/index.js'

export const useAuthStore = defineStore('auth', () => {
  const token   = ref(localStorage.getItem('admin_token') || null)
  const stored  = localStorage.getItem('admin_user')
  const user    = ref(stored && stored !== 'undefined' ? JSON.parse(stored) : null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    const { data } = await axios.post('/auth/login', { email, password })

    token.value = data.token
    user.value  = data.user

    localStorage.setItem('admin_token', data.token)
    localStorage.setItem('admin_user', JSON.stringify(data.user))

    // Axios header ni darhol yangilash
    axios.defaults.headers.common.Authorization = `Bearer ${data.token}`

    router.push('/')
  }

  async function fetchMe() {
    const { data } = await axios.get('/auth/me')
    user.value = data.user
    localStorage.setItem('admin_user', JSON.stringify(data.user))
  }

  function logout() {
    token.value = null
    user.value  = null

    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')

    delete axios.defaults.headers.common.Authorization

    router.push('/login')
  }

  return { token, user, isAuthenticated, login, logout, fetchMe }
})
