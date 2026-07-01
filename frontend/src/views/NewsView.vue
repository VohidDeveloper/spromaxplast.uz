<template>
  <div class="min-h-screen bg-neutral-50">

    <!-- Sarlavha -->
    <div class="bg-white border-b border-neutral-100">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <RouterLink to="/" class="text-neutral-500 hover:text-primary transition-colors">
            {{ $t('nav.home') }}
          </RouterLink>
          <svg class="w-4 h-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="text-primary font-semibold">{{ $t('news.title') }}</span>
        </nav>
        <h1 class="font-heading font-extrabold text-neutral-900 text-3xl sm:text-4xl">
          {{ $t('news.title') }}
        </h1>
        <p class="text-neutral-500 text-base mt-2">{{ $t('news.subtitle') }}</p>
      </div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 9" :key="i" class="bg-white rounded-2xl overflow-hidden border border-neutral-100 animate-pulse">
          <div class="aspect-[16/9] bg-neutral-200" />
          <div class="p-5 space-y-3">
            <div class="h-3 bg-neutral-200 rounded w-24" />
            <div class="h-5 bg-neutral-200 rounded w-3/4" />
            <div class="h-4 bg-neutral-200 rounded w-full" />
            <div class="h-4 bg-neutral-200 rounded w-5/6" />
          </div>
        </div>
      </div>

      <!-- Bo'sh holat -->
      <div v-else-if="!news.length" class="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div class="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center">
          <svg class="w-10 h-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
          </svg>
        </div>
        <p class="text-neutral-500 font-medium">{{ $t('news.empty') }}</p>
      </div>

      <!-- Yangiliklar grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RouterLink
          v-for="item in news"
          :key="item.id"
          :to="'/news/' + item.id"
          class="group bg-white rounded-2xl overflow-hidden border border-transparent
                 hover:border-primary hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10
                 transition-all duration-300"
        >
          <!-- Rasm -->
          <div class="aspect-[16/9] bg-neutral-100 overflow-hidden relative">
            <img
              v-if="item.image_url"
              :src="item.image_url"
              :alt="item.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
              <svg class="w-12 h-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
              </svg>
            </div>
          </div>

          <!-- Kontent -->
          <div class="p-5">
            <p class="text-xs text-neutral-400 font-medium mb-2">{{ formatDate(item.published_at || item.created_at) }}</p>
            <h3 class="font-heading font-bold text-neutral-900 text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {{ item.title }}
            </h3>
            <p class="text-neutral-500 text-sm leading-relaxed line-clamp-3">
              {{ item.excerpt }}
            </p>
            <span class="inline-flex items-center gap-1 text-primary text-xs font-semibold mt-3">
              {{ $t('news.read_more') }}
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </span>
          </div>
        </RouterLink>
      </div>

      <!-- Pagination -->
      <div v-if="total > perPage" class="flex justify-center items-center gap-3 mt-10">
        <button
          @click="changePage(page - 1)"
          :disabled="page === 1"
          class="w-10 h-10 rounded-xl border-2 border-neutral-200 flex items-center justify-center
                 text-neutral-600 hover:border-primary hover:text-primary transition-all
                 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <span class="text-sm text-neutral-600 font-medium">
          {{ page }} / {{ totalPages }}
        </span>

        <button
          @click="changePage(page + 1)"
          :disabled="page >= totalPages"
          class="w-10 h-10 rounded-xl border-2 border-neutral-200 flex items-center justify-center
                 text-neutral-600 hover:border-primary hover:text-primary transition-all
                 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useLanguageStore } from '@/stores/language.js'
import axios from 'axios'

const { current } = storeToRefs(useLanguageStore())

const loading = ref(true)
const news    = ref([])
const total   = ref(0)
const page    = ref(1)
const perPage = 9

const totalPages = computed(() => Math.ceil(total.value / perPage))

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(
    current.value === 'uz' ? 'uz-UZ' : current.value === 'ru' ? 'ru-RU' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )
}

function mapNews(item) {
  return {
    id:         item.id,
    image_url:  item.image_url || null,
    published_at: item.published_at,
    created_at:   item.created_at,
    title:   item[`title_${current.value}`]   || item.title_uz   || '',
    excerpt: item[`content_${current.value}`] || item.content_uz || ''
  }
}

async function fetchNews() {
  loading.value = true
  try {
    const { data } = await axios.get('/api/news', {
      params: { limit: perPage, offset: (page.value - 1) * perPage }
    })
    total.value = data.total || 0
    news.value  = (data.data || []).map(mapNews)
  } catch {
    news.value = []
  } finally {
    loading.value = false
  }
}

function changePage(n) {
  page.value = n
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Sahifa yoki til o'zgarganda qayta yukla
watch(page, fetchNews)
watch(current, fetchNews)

onMounted(fetchNews)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
