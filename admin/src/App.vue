<template>
  <!-- Login sahifasi: faqat RouterView -->
  <RouterView v-if="isPublicRoute" />

  <!-- Admin layout -->
  <div v-else class="flex h-screen overflow-hidden bg-gray-100">

    <!-- Sidebar -->
    <AdminSidebar
      :is-open="isSidebarOpen"
      :unread-count="unreadCount"
      @close="isSidebarOpen = false"
    />

    <!-- Asosiy kontent: sidebar yonida -->
    <div class="flex-1 flex flex-col min-w-0 lg:ml-64 overflow-auto">

      <!-- Header -->
      <AdminHeader
        :unread-count="unreadCount"
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
      />

      <!-- Sahifa kontent -->
      <main class="flex-1 p-4 md:p-6">
        <RouterView />
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdminSidebar from '@/components/layout/AdminSidebar.vue'
import AdminHeader  from '@/components/layout/AdminHeader.vue'

const route          = useRoute()
const isSidebarOpen  = ref(false)
const unreadCount    = ref(0)

const isPublicRoute = computed(() => route.meta?.public === true)

// Sahifa o'zgarganda mobile sidebari yopiladi
watch(() => route.path, () => {
  isSidebarOpen.value = false
})
</script>
