<template>
  <header class="bg-white border-b-2 border-primary sticky top-0 z-20">
    <div class="flex items-center justify-between px-4 md:px-6 h-16">

      <!-- Chap: hamburger (mobile) + sahifa nomi -->
      <div class="flex items-center gap-4">
        <button
          @click="$emit('toggle-sidebar')"
          class="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700
                 hover:bg-gray-100 transition-all duration-150 ease-in-out"
          aria-label="Menyuni ochish"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 class="font-heading font-semibold text-gray-800 text-lg">
          {{ pageTitle }}
        </h1>
      </div>

      <!-- O'ng: xabarlar + admin info -->
      <div class="flex items-center gap-3">

        <!-- Xabarlar qo'ng'irog'i -->
        <button
          @click="$router.push('/messages')"
          class="relative p-2 rounded-lg text-gray-500 hover:text-gray-700
                 hover:bg-gray-100 transition-all duration-150 ease-in-out"
          aria-label="Xabarlar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7
                 a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span
            v-if="unreadCount > 0"
            class="absolute top-1 right-1 inline-flex items-center justify-center
                   w-4 h-4 text-xs font-bold bg-primary text-white rounded-full"
          >
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        </button>

        <!-- Ajratuvchi chiziq -->
        <div class="hidden sm:block w-px h-8 bg-gray-200" />

        <!-- Admin avatar + ism -->
        <div class="hidden sm:flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary flex items-center
                      justify-center shrink-0">
            <span class="text-white text-xs font-bold">{{ userInitial }}</span>
          </div>
          <div class="hidden md:block">
            <p class="text-sm font-medium text-gray-800 leading-tight">{{ userName }}</p>
            <p class="text-xs text-gray-400 leading-tight">{{ userRole }}</p>
          </div>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { storeToRefs } from 'pinia'

defineProps({
  unreadCount: { type: Number, default: 0 }
})
defineEmits(['toggle-sidebar'])

const route     = useRoute()
const authStore = useAuthStore()
const { user }  = storeToRefs(authStore)

const pageTitle   = computed(() => route.meta?.title || 'Dashboard')
const userName    = computed(() => user.value?.full_name || 'Admin')
const userRole    = computed(() => user.value?.role === 'superadmin' ? 'Super Admin' : 'Admin')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())
</script>
