<template>
  <div class="min-h-screen bg-neutral-50">

    <!-- Sahifa sarlavhasi + breadcrumb -->
    <div class="bg-white border-b border-neutral-100">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm mb-4">
          <RouterLink to="/" class="text-neutral-500 hover:text-primary transition-colors">
            {{ $t('nav.home') }}
          </RouterLink>
          <svg class="w-4 h-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="text-primary font-semibold">{{ $t('nav.products') }}</span>
        </nav>

        <!-- Sarlavha -->
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 class="font-heading font-extrabold text-neutral-900 text-3xl sm:text-4xl mb-2">
              {{ $t('products.title') }}
            </h1>
            <p class="text-neutral-500 text-base">
              {{ totalLabel[$i18n.locale] }}: <span class="font-semibold text-neutral-700">{{ filteredProducts.length }}</span>
            </p>
          </div>

          <!-- Saralash -->
          <select
            v-model="sortBy"
            class="self-start sm:self-auto border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-700 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
          >
            <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
              {{ opt.label[$i18n.locale] || opt.label.uz }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div class="flex flex-col lg:flex-row gap-8">

        <!-- ===== CHAP: Filtr panel ===== -->
        <aside class="lg:w-60 shrink-0">

          <!-- Mobil: filtr tugmasi -->
          <button
            @click="filterOpen = !filterOpen"
            class="lg:hidden w-full flex items-center justify-between gap-2 bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm font-semibold text-neutral-700 mb-4"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
              </svg>
              {{ filterLabel[$i18n.locale] || filterLabel.uz }}
            </span>
            <svg class="w-4 h-4 transition-transform" :class="filterOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <!-- Filtr kontent -->
          <div :class="['lg:block', filterOpen ? 'block' : 'hidden']">
            <div class="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">

              <h3 class="font-heading font-bold text-neutral-900 text-base mb-4">
                {{ categoryLabel[$i18n.locale] || categoryLabel.uz }}
              </h3>

              <div class="flex flex-col gap-2">
                <button
                  v-for="cat in categories"
                  :key="cat.key"
                  @click="activeCategory = cat.key"
                  :class="[
                    'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                    activeCategory === cat.key
                      ? 'bg-primary text-white'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-primary'
                  ]"
                >
                  <span>{{ cat.label[$i18n.locale] || cat.label.uz }}</span>
                  <span
                    :class="[
                      'text-xs px-1.5 py-0.5 rounded-full font-semibold',
                      activeCategory === cat.key ? 'bg-white/25 text-white' : 'bg-neutral-100 text-neutral-500'
                    ]"
                  >
                    {{ getCategoryCount(cat.key) }}
                  </span>
                </button>
              </div>

              <!-- Filtrni tozalash -->
              <button
                v-if="activeCategory !== 'all'"
                @click="activeCategory = 'all'"
                class="mt-4 w-full text-xs text-primary font-semibold hover:underline text-center"
              >
                {{ clearLabel[$i18n.locale] || clearLabel.uz }}
              </button>

            </div>
          </div>
        </aside>

        <!-- ===== O'NG: Mahsulotlar grid ===== -->
        <div class="flex-1 min-w-0">

          <!-- Natija yo'q holati -->
          <div v-if="paginatedProducts.length === 0" class="flex flex-col items-center justify-center py-20 gap-4">
            <div class="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center">
              <svg class="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z"/>
              </svg>
            </div>
            <p class="text-neutral-500 font-medium">{{ emptyLabel[$i18n.locale] || emptyLabel.uz }}</p>
          </div>

          <!-- Grid -->
          <Transition name="fade" mode="out-in">
            <div
              v-if="paginatedProducts.length > 0"
              :key="activeCategory"
              class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              <div
                v-for="product in paginatedProducts"
                :key="product.id"
                class="group bg-white rounded-2xl overflow-hidden border border-transparent
                       hover:border-primary hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10
                       transition-all duration-300"
              >
                <!-- Rasm -->
                <div class="relative bg-neutral-100 aspect-[4/3] overflow-hidden">
                  <img
                    v-if="product.image"
                    :src="product.image"
                    :alt="product.name[$i18n.locale] || product.name.uz"
                    class="absolute inset-0 w-full h-full object-cover"
                  />
                  <div v-else class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-neutral-100 to-neutral-200">
                    <div class="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
                      <svg class="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                      </svg>
                    </div>
                  </div>

                  <!-- Kategoriya badge -->
                  <span class="absolute top-3 left-3 bg-white/90 text-primary text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/20">
                    {{ getCategoryName(product.category) }}
                  </span>

                  <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <!-- Kontent -->
                <div class="p-4 sm:p-5">
                  <h3 class="font-heading font-bold text-neutral-900 text-base mb-1.5 group-hover:text-primary transition-colors">
                    {{ product.name[$i18n.locale] || product.name.uz }}
                  </h3>

                  <p class="text-neutral-500 text-sm leading-relaxed mb-3 line-clamp-2">
                    {{ product.desc[$i18n.locale] || product.desc.uz }}
                  </p>

                  <!-- Parametrlar -->
                  <div class="flex flex-wrap gap-1.5 mb-4">
                    <span v-for="spec in product.specs" :key="spec"
                      class="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-lg font-medium">
                      {{ spec }}
                    </span>
                  </div>

                  <!-- Narx yo'q — so'rov asosida -->
                  <div class="flex items-center justify-between gap-3">
                    <p class="text-xs text-neutral-400 italic">
                      {{ priceLabel[$i18n.locale] || priceLabel.uz }}
                    </p>
                    <RouterLink
                      :to="'/products/' + product.id"
                      class="flex items-center gap-1.5 bg-primary text-white text-sm font-semibold rounded-xl px-4 py-2
                             hover:bg-primary-dark active:scale-95 transition-all duration-200"
                    >
                      {{ $t('products.details') }}
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Ko'proq yuklash -->
          <div v-if="hasMore" class="flex justify-center mt-10">
            <button
              @click="loadMore"
              class="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold rounded-xl
                     px-8 py-3.5 text-sm sm:text-base hover:bg-primary hover:text-white
                     active:scale-95 transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ loadMoreLabel[$i18n.locale] || loadMoreLabel.uz }}
              <span class="text-xs opacity-70">({{ filteredProducts.length - visibleCount }} ta qoldi)</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const activeCategory = ref('all')
const sortBy         = ref('default')
const filterOpen     = ref(false)
const visibleCount   = ref(6)
const perPage        = 6
const loading        = ref(true)
const error          = ref('')
const allProducts    = ref([])

const categories = ref([
  { key: 'all', label: { uz: 'Hammasi', ru: 'Все', en: 'All' } }
])

// API formatini template formatiga moslashtirish
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

onMounted(async () => {
  try {
    // Mahsulotlar: { success, total, data: [...] }
    const prodRes = await axios.get('/api/products')
    allProducts.value = (prodRes.data.data || []).map(mapProduct)

    // Kategoriyalar: { success, data: [...] }
    const catRes = await axios.get('/api/categories')
    const apiCats = (catRes.data.data || []).map(c => ({
      key:   c.id,
      label: { uz: c.name_uz || '', ru: c.name_ru || '', en: c.name_en || '' }
    }))
    categories.value = [
      { key: 'all', label: { uz: 'Hammasi', ru: 'Все', en: 'All' } },
      ...apiCats
    ]
  } catch (err) {
    error.value = err?.response?.data?.message || 'Ma\'lumot yuklanmadi'
  } finally {
    loading.value = false
  }
})

const filteredProducts = computed(() => {
  let list = activeCategory.value === 'all'
    ? allProducts.value
    : allProducts.value.filter(p => p.category === activeCategory.value)

  if (sortBy.value === 'name-az') {
    list = [...list].sort((a, b) => a.name.uz.localeCompare(b.name.uz))
  }
  return list
})

const paginatedProducts = computed(() =>
  filteredProducts.value.slice(0, visibleCount.value)
)

const hasMore = computed(() =>
  visibleCount.value < filteredProducts.value.length
)

function loadMore() { visibleCount.value += perPage }

function getCategoryCount(key) {
  return key === 'all'
    ? allProducts.value.length
    : allProducts.value.filter(p => p.category === key).length
}

function getCategoryName(categoryId) {
  const cat = categories.value.find(c => c.key === categoryId)
  return cat?.label[locale.value] || cat?.label.uz || ''
}

// Matnlar (o'zgarishsiz)
const totalLabel    = { uz: 'Jami mahsulot',         ru: 'Всего товаров',    en: 'Total products'  }
const filterLabel   = { uz: 'Filtr',                 ru: 'Фильтр',           en: 'Filter'          }
const categoryLabel = { uz: 'Kategoriyalar',          ru: 'Категории',        en: 'Categories'      }
const clearLabel    = { uz: 'Filtrni tozalash',       ru: 'Сбросить фильтр',  en: 'Clear filter'    }
const priceLabel    = { uz: 'Narx — so\'rov asosida', ru: 'Цена — по запросу', en: 'Price — on request' }
const loadMoreLabel = { uz: 'Ko\'proq yuklash',       ru: 'Загрузить ещё',    en: 'Load more'       }
const emptyLabel    = { uz: 'Mahsulot topilmadi',     ru: 'Товары не найдены', en: 'No products found' }

const sortOptions = [
  { value: 'default', label: { uz: 'Standart tartib',    ru: 'По умолчанию',    en: 'Default order'  } },
  { value: 'name-az', label: { uz: 'Nom bo\'yicha A-Z',  ru: 'По названию А-Я', en: 'By name A-Z'    } }
]
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
