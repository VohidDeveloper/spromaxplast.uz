<template>
  <div class="min-h-screen bg-neutral-50">

    <!-- Breadcrumb + sarlavha -->
    <div class="bg-white border-b border-neutral-100">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav class="flex items-center gap-2 text-sm flex-wrap">
          <RouterLink to="/" class="text-neutral-500 hover:text-primary transition-colors">
            {{ $t('nav.home') }}
          </RouterLink>
          <svg class="w-4 h-4 text-neutral-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
          <RouterLink to="/products" class="text-neutral-500 hover:text-primary transition-colors">
            {{ $t('nav.products') }}
          </RouterLink>
          <svg class="w-4 h-4 text-neutral-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="text-primary font-semibold truncate max-w-[200px]">
            {{ product ? productName : '...' }}
          </span>
        </nav>
      </div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

      <!-- ===== LOADING SKELETON ===== -->
      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div class="aspect-[4/3] bg-neutral-200 rounded-2xl animate-pulse" />
        <div class="space-y-4 py-2">
          <div class="h-4 bg-neutral-200 rounded w-24 animate-pulse" />
          <div class="h-8 bg-neutral-200 rounded w-3/4 animate-pulse" />
          <div class="h-4 bg-neutral-200 rounded w-full animate-pulse" />
          <div class="h-4 bg-neutral-200 rounded w-5/6 animate-pulse" />
          <div class="h-4 bg-neutral-200 rounded w-4/6 animate-pulse" />
          <div class="flex gap-2 pt-2">
            <div class="h-8 w-20 bg-neutral-200 rounded-lg animate-pulse" />
            <div class="h-8 w-20 bg-neutral-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      <!-- ===== 404 HOLATI ===== -->
      <div v-else-if="notFound" class="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div class="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center mb-2">
          <svg class="w-10 h-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
          </svg>
        </div>
        <h2 class="font-heading font-bold text-2xl text-neutral-800">Mahsulot topilmadi</h2>
        <p class="text-neutral-500">Bu mahsulot mavjud emas yoki o'chirilgan.</p>
        <RouterLink to="/products"
          class="mt-2 inline-flex items-center gap-2 bg-primary text-white font-semibold
                 rounded-xl px-6 py-3 hover:bg-primary-dark transition-all duration-200">
          ← Mahsulotlarga qaytish
        </RouterLink>
      </div>

      <!-- ===== MAHSULOT DETAIL ===== -->
      <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        <!-- CHAP: Rasm -->
        <div class="relative">
          <div class="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
            <img
              v-if="product.image"
              :src="product.image"
              :alt="productName"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex flex-col items-center justify-center gap-3">
              <svg class="w-16 h-16 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409
                     a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0
                     00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"/>
              </svg>
              <p class="text-neutral-400 text-sm">Rasm mavjud emas</p>
            </div>
          </div>
        </div>

        <!-- O'NG: Ma'lumotlar -->
        <div class="flex flex-col gap-5">

          <!-- Kategoriya badge -->
          <div>
            <span class="inline-block bg-primary/10 text-primary text-xs font-semibold
                         px-3 py-1 rounded-full border border-primary/20">
              {{ categoryName }}
            </span>
          </div>

          <!-- Nom -->
          <div>
            <h1 class="font-heading font-extrabold text-neutral-900 text-2xl sm:text-3xl leading-tight">
              {{ productName }}
            </h1>
          </div>

          <!-- Tavsif -->
          <p v-if="productDesc" class="text-neutral-600 text-base leading-relaxed">
            {{ productDesc }}
          </p>

          <!-- Texnik parametrlar -->
          <div v-if="product.specs && product.specs.length">
            <p class="text-sm font-semibold text-neutral-700 mb-2">Texnik parametrlar:</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="spec in product.specs"
                :key="spec"
                class="text-sm bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-lg font-medium border border-neutral-200"
              >
                {{ spec }}
              </span>
            </div>
          </div>

          <!-- Narx -->
          <div class="flex items-center gap-3 py-4 border-y border-neutral-100">
            <svg class="w-5 h-5 text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-neutral-600 text-sm italic">Narx — so'rov asosida</span>
          </div>

          <!-- Tugmalar -->
          <div class="flex flex-col sm:flex-row gap-3">
            <RouterLink
              to="/contact"
              class="flex-1 flex items-center justify-center gap-2 bg-primary text-white
                     font-bold rounded-xl px-6 py-3.5 text-sm
                     hover:bg-primary-dark active:scale-95 transition-all duration-200
                     shadow-lg shadow-primary/25"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Bog'lanish
            </RouterLink>
            <RouterLink
              to="/products"
              class="flex items-center justify-center gap-2 border-2 border-neutral-200
                     text-neutral-700 font-semibold rounded-xl px-6 py-3.5 text-sm
                     hover:border-primary hover:text-primary transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Orqaga
            </RouterLink>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useLanguageStore } from '@/stores/language.js'
import axios from 'axios'

const route   = useRoute()
const langStore = useLanguageStore()
const { current } = storeToRefs(langStore)

const product  = ref(null)
const loading  = ref(true)
const notFound = ref(false)
const categoryNames = ref({ uz: '', ru: '', en: '' })

// Joriy tilga qarab nom — til o'zgarganda avtomatik yangilanadi
const productName = computed(() => {
  if (!product.value) return ''
  return product.value.name[current.value] || product.value.name.uz
})

const productDesc = computed(() => {
  if (!product.value) return ''
  return product.value.desc[current.value] || product.value.desc.uz
})

const categoryName = computed(() =>
  categoryNames.value[current.value] || categoryNames.value.uz
)

onMounted(async () => {
  try {
    const { data } = await axios.get(`/api/products/${route.params.id}`)

    if (!data.success || !data.data) {
      notFound.value = true
      return
    }

    const p = data.data
    product.value = {
      id:    p.id,
      image: p.image_url || null,
      name:  { uz: p.name_uz || '', ru: p.name_ru || '', en: p.name_en || '' },
      desc:  { uz: p.description_uz || '', ru: p.description_ru || '', en: p.description_en || '' },
      specs: p.specs || []
    }

    if (p.category_id) {
      try {
        const catRes = await axios.get('/api/categories')
        const cat = (catRes.data.data || []).find(c => c.id === p.category_id)
        if (cat) categoryNames.value = { uz: cat.name_uz || '', ru: cat.name_ru || '', en: cat.name_en || '' }
      } catch { /* silent */ }
    }
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
})
</script>
