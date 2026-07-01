<template>
  <div class="min-h-screen flex flex-col">

    <!-- Har sahifada ko'rinadigan header -->
    <AppHeader />

    <!-- Sahifa kontent — transition bilan -->
    <main class="flex-1">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <!-- Har sahifada ko'rinadigan footer -->
    <AppFooter />

  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<style>
/* Sahifalar orasidagi global fade animatsiya */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
