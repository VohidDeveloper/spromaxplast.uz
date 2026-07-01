<template>
  <section class="section-padding bg-neutral-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Sarlavha -->
      <div class="text-center mb-10 md:mb-14">
        <span class="inline-block text-primary font-semibold text-sm uppercase tracking-widest mb-3">
          {{ $t('nav.products') }}
        </span>
        <h2 class="section-title mx-auto">{{ $t('products.title') }}</h2>
        <p class="section-subtitle mx-auto text-center">{{ $t('products.subtitle') }}</p>
      </div>

      <!-- Kategoriya filtri -->
      <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 md:mb-10">
        <button
          v-for="cat in categories"
          :key="cat.key"
          @click="activeCategory = cat.key"
          :class="[
            'px-4 sm:px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200',
            activeCategory === cat.key
              ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
              : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary hover:text-primary'
          ]"
        >
          {{ cat.label[$i18n.locale] || cat.label.uz }}
          <span
            v-if="activeCategory === cat.key"
            class="ml-1.5 inline-flex items-center justify-center w-4 h-4 bg-white/25 rounded-full text-xs"
          >
            {{ filteredProducts.length }}
          </span>
        </button>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        <div v-for="i in 6" :key="i"
          class="bg-white rounded-2xl overflow-hidden border border-neutral-100 animate-pulse">
          <div class="aspect-[4/3] bg-neutral-200" />
          <div class="p-5 space-y-3">
            <div class="h-5 bg-neutral-200 rounded w-3/4" />
            <div class="h-4 bg-neutral-200 rounded w-full" />
            <div class="h-4 bg-neutral-200 rounded w-5/6" />
          </div>
        </div>
      </div>

      <!-- Xato holati -->
      <div v-else-if="error"
        class="text-center py-16 text-neutral-500">
        <svg class="w-12 h-12 mx-auto mb-3 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>{{ error }}</p>
      </div>

      <!-- Mahsulotlar grid -->
      <Transition v-else name="fade" mode="out-in">
        <div
          :key="activeCategory"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="group bg-white rounded-2xl overflow-hidden border border-transparent
                   hover:border-primary hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10
                   transition-all duration-300 cursor-pointer"
          >
            <!-- Rasm -->
            <div class="relative overflow-hidden bg-neutral-100 aspect-[4/3]">
              <!-- Haqiqiy rasm -->
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name[$i18n.locale] || product.name.uz"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <!-- Placeholder (rasm yo'q bo'lsa) -->
              <div v-else class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-neutral-100 to-neutral-200">
                <div class="w-14 h-14 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
                  <svg class="w-7 h-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                  </svg>
                </div>
                <span class="text-neutral-400 text-xs">{{ product.name[$i18n.locale] || product.name.uz }}</span>
              </div>

              <!-- Kategoriya badge -->
              <div class="absolute top-3 left-3">
                <span class="bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/20">
                  {{ getCategoryLabel(product.category) }}
                </span>
              </div>

              <!-- Hover overlay -->
              <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <!-- Karta kontent -->
            <div class="p-4 sm:p-5">
              <!-- Nom -->
              <h3 class="font-heading font-bold text-neutral-900 text-base sm:text-lg mb-2 group-hover:text-primary transition-colors duration-200">
                {{ product.name[$i18n.locale] || product.name.uz }}
              </h3>

              <!-- Tavsif -->
              <p class="text-neutral-600 text-sm leading-relaxed mb-4 line-clamp-2">
                {{ product.desc[$i18n.locale] || product.desc.uz }}
              </p>

              <!-- Texnik parametrlar -->
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="spec in product.specs"
                  :key="spec"
                  class="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-lg font-medium"
                >
                  {{ spec }}
                </span>
              </div>

              <!-- "Batafsil" tugmasi -->
              <RouterLink
                :to="'/products/' + product.id"
                class="w-full flex items-center justify-center gap-2
                       border border-primary/30 text-primary font-semibold text-sm rounded-xl py-2.5
                       hover:bg-primary hover:text-white hover:border-primary
                       group-hover:bg-primary group-hover:text-white group-hover:border-primary
                       transition-all duration-200"
              >
                {{ $t('products.details') }}
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </RouterLink>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Bo'sh holat -->
      <div v-if="!loading && !error && !filteredProducts.length"
        class="text-center py-16 text-neutral-400">
        <p>Mahsulotlar topilmadi</p>
      </div>

      <!-- Barchasi tugmasi -->
      <div class="flex justify-center mt-10 md:mt-12">
        <RouterLink
          to="/products"
          class="inline-flex items-center gap-2 bg-primary text-white font-bold rounded-xl
                 px-7 py-3.5 text-sm sm:text-base
                 hover:bg-primary-dark active:scale-95
                 transition-all duration-200 shadow-lg shadow-primary/25"
        >
          {{ $t('products.view_all') }}
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </RouterLink>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const activeCategory = ref('all')
const loading        = ref(true)
const error          = ref('')
const products       = ref([])
const categories     = ref([
  { key: 'all', label: { uz: 'Hammasi', ru: 'Все', en: 'All' } }
])

// API mahsulotini template formatiga moslashtirish
function mapProduct(p) {
  return {
    id:       p.id,
    category: p.category_id,
    image:    p.image_url || null,
    name: { uz: p.name_uz || '', ru: p.name_ru || '', en: p.name_en || '' },
    desc: { uz: p.description_uz || '', ru: p.description_ru || '', en: p.description_en || '' },
    specs: []
  }
}

// API kategoriyasini template formatiga moslashtirish
function mapCategory(c) {
  return {
    key:   c.id,
    label: { uz: c.name_uz || '', ru: c.name_ru || '', en: c.name_en || '' }
  }
}

const filteredProducts = computed(() =>
  activeCategory.value === 'all'
    ? products.value
    : products.value.filter(p => p.category === activeCategory.value)
)

function getCategoryLabel(categoryId) {
  const cat = categories.value.find(c => c.key === categoryId)
  return cat ? (cat.label[locale.value] || cat.label.uz) : ''
}

onMounted(async () => {
  try {
    const [prodRes, catRes] = await Promise.all([
      axios.get('/api/products', { params: { limit: 6 } }),
      axios.get('/api/categories')
    ])

    products.value = (prodRes.data.data || []).map(mapProduct)

    const apiCats = (catRes.data.data || []).map(mapCategory)
    categories.value = [
      { key: 'all', label: { uz: 'Hammasi', ru: 'Все', en: 'All' } },
      ...apiCats
    ]
  } catch (err) {
    error.value = 'Ma\'lumot yuklanmadi'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to     { opacity: 0; }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
