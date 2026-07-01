<template>
  <div class="min-h-screen bg-dark flex items-center justify-center p-4">
    <div class="w-full max-w-md">

      <!-- Logo + sarlavha -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
          <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
          </svg>
        </div>
        <h1 class="font-heading text-2xl font-bold text-white">S PROMAX PLAST</h1>
        <p class="text-gray-400 text-sm mt-1">Admin Panel</p>
      </div>

      <!-- Login karta -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">Tizimga kirish</h2>

        <!-- Xato xabari -->
        <div v-if="errorMsg" class="flex items-center gap-2 bg-primary-light text-primary
             text-sm rounded-lg px-4 py-3 mb-5">
          <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-5.25a.75.75 0 001.5 0v-4a.75.75 0 00-1.5 0v4zm.75-7a1 1 0 100 2 1 1 0 000-2z"
              clip-rule="evenodd" />
          </svg>
          {{ errorMsg }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="admin@spromax.uz"
              autocomplete="email"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     transition-fast placeholder-gray-400"
            />
          </div>

          <!-- Parol -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Parol</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                required
                class="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       transition-fast placeholder-gray-400"
              />
              <!-- Ko'rish/yashirish toggle -->
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                       hover:text-gray-600 transition-fast"
              >
                <!-- Ko'z ochiq -->
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
                       -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <!-- Ko'z yopiq -->
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7
                       a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243
                       M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29
                       m7.532 7.532l3.29 3.29M3 3l3.59 3.59
                       m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7
                       a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Kirish tugmasi -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover
                   text-white font-medium py-2.5 rounded-lg transition-fast
                   disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <!-- Loading spinner -->
            <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ loading ? 'Kirmoqda...' : 'Kirish' }}
          </button>

        </form>
      </div>

      <p class="text-center text-gray-500 text-xs mt-6">
        © {{ new Date().getFullYear() }} S PROMAX PLAST. Barcha huquqlar himoyalangan.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()

const form = reactive({ email: '', password: '' })
const showPassword = ref(false)
const loading      = ref(false)
const errorMsg     = ref('')

async function handleLogin() {
  loading.value  = true
  errorMsg.value = ''
  try {
    await authStore.login(form.email, form.password)
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Email yoki parol noto\'g\'ri'
  } finally {
    loading.value = false
  }
}
</script>
