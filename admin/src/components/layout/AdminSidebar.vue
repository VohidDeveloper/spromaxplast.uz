<template>
  <!-- Mobile overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 z-30 lg:hidden"
    @click="$emit('close')"
  />

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 h-full w-64 bg-dark flex flex-col z-40 transition-transform duration-300',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 px-5 py-5 border-b border-white/10">
      <div class="flex items-center justify-center w-9 h-9 bg-primary rounded-lg shrink-0">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
        </svg>
      </div>
      <div class="overflow-hidden">
        <p class="font-heading font-bold text-white text-sm leading-tight">S PROMAX PLAST</p>
        <p class="text-gray-400 text-xs">Admin Panel</p>
      </div>
    </div>

    <!-- Navigatsiya -->
    <nav class="flex-1 overflow-y-auto py-4 space-y-0.5">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        custom
        v-slot="{ isActive, navigate }"
      >
        <button
          @click="navigate(); $emit('close')"
          :class="['sidebar-link w-full', isActive ? 'active' : '']"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span class="flex-1 text-left">{{ item.label }}</span>
          <!-- O'qilmagan xabarlar badge -->
          <span
            v-if="item.badge && unreadCount > 0"
            class="inline-flex items-center justify-center w-5 h-5 text-xs
                   font-bold bg-primary text-white rounded-full"
          >
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        </button>
      </router-link>
    </nav>

    <!-- Admin info + Logout -->
    <div class="border-t border-white/10 p-4">
      <div class="flex items-center gap-3 mb-3 px-2">
        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span class="text-white text-xs font-bold">
            {{ userInitial }}
          </span>
        </div>
        <div class="overflow-hidden">
          <p class="text-white text-sm font-medium truncate">{{ userName }}</p>
          <p class="text-gray-400 text-xs truncate">{{ userRole }}</p>
        </div>
      </div>
      <button
        @click="handleLogout"
        class="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg
               text-gray-300 hover:text-white hover:bg-red-600/20
               transition-fast text-sm font-medium"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7
               a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Chiqish
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed, defineComponent, h } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { storeToRefs } from 'pinia'

defineProps({
  isOpen:      { type: Boolean, default: false },
  unreadCount: { type: Number,  default: 0 }
})
defineEmits(['close'])

const authStore = useAuthStore()
const { user }  = storeToRefs(authStore)

const userName    = computed(() => user.value?.full_name || 'Admin')
const userRole    = computed(() => user.value?.role === 'superadmin' ? 'Super Admin' : 'Admin')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

// Inline SVG icon komponenti yaratish uchun helper
function icon(pathD) {
  return defineComponent({
    render() {
      return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-5 h-5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: pathD })
      ])
    }
  })
}

const navItems = [
  {
    path:  '/dashboard',
    label: 'Dashboard',
    icon:  icon('M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6')
  },
  {
    path:  '/products',
    label: 'Mahsulotlar',
    icon:  icon('M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10')
  },
  {
    path:  '/categories',
    label: 'Kategoriyalar',
    icon:  icon('M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10')
  },
  {
    path:  '/news',
    label: 'Yangiliklar',
    icon:  icon('M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z')
  },
  {
    path:  '/certificates',
    label: 'Sertifikatlar',
    icon:  icon('M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z')
  },
  {
    path:  '/partners',
    label: 'Hamkorlar',
    icon:  icon('M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z')
  },
  {
    path:  '/messages',
    label: 'Xabarlar',
    icon:  icon('M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'),
    badge: true
  },
  {
    path:  '/settings',
    label: 'Sozlamalar',
    icon:  icon('M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z')
  }
]

function handleLogout() {
  authStore.logout()
}
</script>
