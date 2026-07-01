<template>
  <div class="min-h-screen bg-neutral-50">

    <!-- Breadcrumb -->
    <div class="bg-white border-b border-neutral-100">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav class="flex items-center gap-2 text-sm flex-wrap">
          <RouterLink to="/" class="text-neutral-500 hover:text-primary transition-colors">
            {{ $t('nav.home') }}
          </RouterLink>
          <svg class="w-4 h-4 text-neutral-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
          <RouterLink to="/news" class="text-neutral-500 hover:text-primary transition-colors">
            {{ $t('news.title') }}
          </RouterLink>
          <svg class="w-4 h-4 text-neutral-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="text-primary font-semibold truncate max-w-[200px]">
            {{ newsTitle || '...' }}
          </span>
        </nav>
      </div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-4xl">

      <!-- Loading skeleton -->
      <div v-if="loading" class="space-y-6 animate-pulse">
        <div class="h-8 bg-neutral-200 rounded w-3/4" />
        <div class="h-4 bg-neutral-200 rounded w-32" />
        <div class="aspect-[16/9] bg-neutral-200 rounded-2xl" />
        <div class="space-y-3">
          <div class="h-4 bg-neutral-200 rounded w-full" />
          <div class="h-4 bg-neutral-200 rounded w-5/6" />
          <div class="h-4 bg-neutral-200 rounded w-4/6" />
        </div>
      </div>

      <!-- 404 holati -->
      <div v-else-if="notFound" class="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div class="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center">
          <svg class="w-10 h-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
          </svg>
        </div>
        <h2 class="font-heading font-bold text-2xl text-neutral-800">Yangilik topilmadi</h2>
        <RouterLink to="/news"
          class="inline-flex items-center gap-2 bg-primary text-white font-semibold rounded-xl px-6 py-3 hover:bg-primary-dark transition-all duration-200">
          ← Yangiliklarga qaytish
        </RouterLink>
      </div>

      <!-- Yangilik kontent -->
      <article v-else-if="item">

        <!-- Sarlavha -->
        <h1 class="font-heading font-extrabold text-neutral-900 text-2xl sm:text-3xl md:text-4xl leading-tight mb-3">
          {{ newsTitle }}
        </h1>

        <!-- Sana -->
        <p class="text-sm text-neutral-400 font-medium mb-6">
          {{ formatDate(item.published_at || item.created_at) }}
        </p>

        <!-- Rasm -->
        <div v-if="item.image_url" class="aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-100 mb-8">
          <img :src="item.image_url" :alt="newsTitle" class="w-full h-full object-cover" />
        </div>

        <!-- To'liq matn -->
        <div class="prose text-neutral-700 text-base leading-relaxed whitespace-pre-line mb-10">
          {{ newsContent }}
        </div>

        <!-- Orqaga tugma -->
        <div class="pt-6 border-t border-neutral-100">
          <RouterLink
            to="/news"
            class="inline-flex items-center gap-2 border-2 border-neutral-200 text-neutral-700
                   font-semibold rounded-xl px-6 py-3 text-sm
                   hover:border-primary hover:text-primary transition-all duration-200"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            {{ $t('news.back') }}
          </RouterLink>
        </div>

      </article>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useLanguageStore } from '@/stores/language.js'
import axios from 'axios'

const route = useRoute()
const { current } = storeToRefs(useLanguageStore())

const item     = ref(null)
const loading  = ref(true)
const notFound = ref(false)

const newsTitle = computed(() => {
  if (!item.value) return ''
  return item.value[`title_${current.value}`] || item.value.title_uz || ''
})

const newsContent = computed(() => {
  if (!item.value) return ''
  return item.value[`content_${current.value}`] || item.value.content_uz || ''
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(
    current.value === 'uz' ? 'uz-UZ' : current.value === 'ru' ? 'ru-RU' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )
}

onMounted(async () => {
  try {
    const { data } = await axios.get(`/api/news/${route.params.id}`)
    if (!data.success || !data.data) {
      notFound.value = true
      return
    }
    item.value = data.data
  } catch (err) {
    notFound.value = true
  } finally {
    loading.value = false
  }
})
</script>
