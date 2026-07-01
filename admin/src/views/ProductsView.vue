<template>
  <div class="space-y-6">

    <!-- Sarlavha + qo'shish -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="font-heading text-2xl font-bold text-gray-800">Mahsulotlar</h2>
        <p class="text-gray-500 text-sm mt-1">Jami: {{ total }} ta</p>
      </div>
      <button @click="openModal()" class="btn-primary flex items-center gap-2 self-start sm:self-auto">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Mahsulot qo'shish
      </button>
    </div>

    <!-- Filter qator -->
    <div class="flex flex-col sm:flex-row gap-3">
      <input
        v-model="search"
        @input="onSearch"
        type="text"
        placeholder="Nom bo'yicha qidirish..."
        class="input-field flex-1"
      />
      <select v-model="filterCategory" @change="fetchProducts" class="input-field sm:w-48">
        <option value="">Barcha kategoriya</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name_uz }}
        </option>
      </select>
    </div>

    <!-- Jadval -->
    <div class="admin-card p-0 overflow-hidden">
      <!-- Loading skeleton -->
      <div v-if="loading" class="p-6 space-y-4">
        <div v-for="i in 5" :key="i" class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gray-200 rounded-lg animate-pulse shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded animate-pulse w-48" />
            <div class="h-3 bg-gray-200 rounded animate-pulse w-24" />
          </div>
        </div>
      </div>

      <!-- Bo'sh holat -->
      <div v-else-if="!products.length" class="text-center py-16 text-gray-400">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
        </svg>
        <p>Mahsulotlar topilmadi</p>
      </div>

      <!-- Jadval -->
      <div v-else class="overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Rasm</th>
              <th>Nom</th>
              <th class="hidden md:table-cell">Kategoriya</th>
              <th class="hidden sm:table-cell">Holat</th>
              <th class="hidden lg:table-cell">Sana</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <!-- Rasm -->
              <td>
                <img
                  v-if="product.image_url"
                  :src="product.image_url"
                  :alt="product.name_uz"
                  class="w-12 h-12 object-cover rounded-lg border border-gray-200"
                />
                <div v-else
                  class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </td>
              <!-- Nom -->
              <td>
                <p class="font-medium text-gray-800">{{ product.name_uz }}</p>
                <p class="text-xs text-gray-400">{{ product.name_ru }}</p>
              </td>
              <!-- Kategoriya -->
              <td class="hidden md:table-cell text-gray-500">
                {{ getCategoryName(product.category_id) }}
              </td>
              <!-- Holat -->
              <td class="hidden sm:table-cell">
                <span :class="['badge', product.is_active ? 'badge-success' : 'badge-gray']">
                  {{ product.is_active ? 'Aktiv' : 'Noaktiv' }}
                </span>
              </td>
              <!-- Sana -->
              <td class="hidden lg:table-cell text-gray-400 text-xs">
                {{ formatDate(product.created_at) }}
              </td>
              <!-- Amallar -->
              <td>
                <div class="flex items-center gap-2">
                  <button
                    @click="openModal(product)"
                    class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50
                           rounded-lg transition-all duration-200"
                    title="Tahrirlash"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                           m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(product)"
                    class="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-light
                           rounded-lg transition-all duration-200"
                    title="O'chirish"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7
                           m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="total > limit" class="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <p class="text-sm text-gray-500">
          {{ offset + 1 }}–{{ Math.min(offset + limit, total) }} / {{ total }}
        </p>
        <div class="flex gap-2">
          <button
            @click="changePage(-1)"
            :disabled="offset === 0"
            class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40
                   hover:bg-gray-50 transition-all duration-200"
          >← Oldingi</button>
          <button
            @click="changePage(1)"
            :disabled="offset + limit >= total"
            class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40
                   hover:bg-gray-50 transition-all duration-200"
          >Keyingi →</button>
        </div>
      </div>
    </div>

    <!-- ===== Qo'shish/Tahrirlash MODAL ===== -->
    <Teleport to="body">
      <div v-if="showModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">

          <!-- Modal header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="font-heading font-semibold text-lg text-gray-800">
              {{ editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot' }}
            </h3>
            <button @click="closeModal"
              class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal body -->
          <div class="p-6 space-y-5">

            <!-- Xato -->
            <div v-if="formError" class="text-sm text-primary bg-primary-light rounded-lg px-4 py-3">
              {{ formError }}
            </div>

            <!-- Til tablari -->
            <div class="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                v-for="lang in langs"
                :key="lang.code"
                @click="activeLang = lang.code"
                :class="['flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                  activeLang === lang.code
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700']"
              >
                {{ lang.label }}
              </button>
            </div>

            <!-- Nomlar -->
            <div v-show="activeLang === 'uz'">
              <label class="form-label">Nomi (O'zbek)</label>
              <input v-model="form.name_uz" type="text" class="input-field" placeholder="Mahsulot nomi" />
            </div>
            <div v-show="activeLang === 'ru'">
              <label class="form-label">Название (Русский)</label>
              <input v-model="form.name_ru" type="text" class="input-field" placeholder="Название продукта" />
            </div>
            <div v-show="activeLang === 'en'">
              <label class="form-label">Name (English)</label>
              <input v-model="form.name_en" type="text" class="input-field" placeholder="Product name" />
            </div>

            <!-- Tavsif -->
            <div v-show="activeLang === 'uz'">
              <label class="form-label">Tavsif (O'zbek)</label>
              <textarea v-model="form.description_uz" rows="3" class="input-field resize-none"
                placeholder="Mahsulot tavsifi" />
            </div>
            <div v-show="activeLang === 'ru'">
              <label class="form-label">Описание (Русский)</label>
              <textarea v-model="form.description_ru" rows="3" class="input-field resize-none"
                placeholder="Описание продукта" />
            </div>
            <div v-show="activeLang === 'en'">
              <label class="form-label">Description (English)</label>
              <textarea v-model="form.description_en" rows="3" class="input-field resize-none"
                placeholder="Product description" />
            </div>

            <!-- Kategoriya -->
            <div>
              <label class="form-label">Kategoriya</label>
              <select v-model="form.category_id" class="input-field">
                <option value="">Tanlang...</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name_uz }}
                </option>
              </select>
            </div>

            <!-- Rasm yuklash -->
            <div>
              <label class="form-label">Rasm</label>
              <div
                class="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center
                       hover:border-primary transition-all duration-200 cursor-pointer"
                @click="$refs.imageInput.click()"
              >
                <img
                  v-if="imagePreview"
                  :src="imagePreview"
                  class="max-h-40 mx-auto rounded-lg object-contain mb-2"
                />
                <div v-else class="py-4">
                  <svg class="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0
                         L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-sm text-gray-400">Rasmni yuklash uchun bosing</p>
                  <p class="text-xs text-gray-300 mt-1">JPG, PNG, WEBP (max 5MB)</p>
                </div>
              </div>
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onImageChange"
              />
            </div>

            <!-- Aktiv toggle -->
            <div class="flex items-center justify-between">
              <label class="form-label mb-0">Aktiv holat</label>
              <button
                type="button"
                @click="form.is_active = !form.is_active"
                :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  form.is_active ? 'bg-secondary' : 'bg-gray-300']"
              >
                <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                  form.is_active ? 'translate-x-6' : 'translate-x-1']" />
              </button>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <button @click="closeModal" class="btn-secondary">Bekor qilish</button>
            <button @click="saveProduct" :disabled="saving" class="btn-primary">
              <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ saving ? 'Saqlanmoqda...' : 'Saqlash' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ===== O'chirish tasdiqlash dialog ===== -->
    <Teleport to="body">
      <div v-if="deleteTarget"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
          <div class="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4
                   c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="font-heading font-semibold text-gray-800 mb-2">O'chirishni tasdiqlang</h3>
          <p class="text-sm text-gray-500 mb-6">
            <strong>{{ deleteTarget.name_uz }}</strong> mahsuloti o'chiriladi. Bu amalni qaytarib bo'lmaydi.
          </p>
          <div class="flex gap-3">
            <button @click="deleteTarget = null" class="btn-secondary flex-1">Bekor qilish</button>
            <button @click="deleteProduct" :disabled="deleting" class="flex-1 btn-danger">
              {{ deleting ? 'O\'chirilmoqda...' : 'O\'chirish' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// --- Ma'lumotlar ---
const products       = ref([])
const categories     = ref([])
const total          = ref(0)
const loading        = ref(true)
const search         = ref('')
const filterCategory = ref('')
const limit          = 10
const offset         = ref(0)

// --- Modal ---
const showModal      = ref(false)
const editingProduct = ref(null)
const activeLang     = ref('uz')
const saving         = ref(false)
const formError      = ref('')
const imagePreview   = ref('')
const imageFile      = ref(null)
const imageInput     = ref(null)

const langs = [
  { code: 'uz', label: "O'zbek" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' }
]

const emptyForm = () => ({
  name_uz: '', name_ru: '', name_en: '',
  description_uz: '', description_ru: '', description_en: '',
  category_id: '', is_active: true
})
const form = ref(emptyForm())

// --- O'chirish ---
const deleteTarget = ref(null)
const deleting     = ref(false)

// --- Yordamchi ---
let searchTimer = null

function getCategoryName(id) {
  return categories.value.find(c => c.id === id)?.name_uz || '—'
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// --- API ---
async function fetchProducts() {
  loading.value = true
  try {
    const params = { limit, offset: offset.value }
    if (search.value)         params.search      = search.value
    if (filterCategory.value) params.category_id = filterCategory.value

    const { data } = await axios.get('/products', { params })
    products.value = data.data  || []
    total.value    = data.total ?? products.value.length
  } catch {
    products.value = []
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const { data } = await axios.get('/categories')
    categories.value = data.data || []
  } catch { /* silent */ }
}

function onSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { offset.value = 0; fetchProducts() }, 400)
}

function changePage(dir) {
  offset.value = Math.max(0, offset.value + dir * limit)
  fetchProducts()
}

// --- Modal ---
function openModal(product = null) {
  editingProduct.value = product
  activeLang.value     = 'uz'
  formError.value      = ''
  imageFile.value      = null

  if (product) {
    form.value = {
      name_uz: product.name_uz || '', name_ru: product.name_ru || '', name_en: product.name_en || '',
      description_uz: product.description_uz || '', description_ru: product.description_ru || '',
      description_en: product.description_en || '',
      category_id: product.category_id || '',
      is_active: product.is_active ?? true
    }
    imagePreview.value = product.image_url || ''
  } else {
    form.value         = emptyForm()
    imagePreview.value = ''
  }
  showModal.value = true
}

function closeModal() {
  showModal.value      = false
  editingProduct.value = null
}

function onImageChange(e) {
  const file = e.target.files[0]
  if (!file) return
  imageFile.value    = file
  imagePreview.value = URL.createObjectURL(file)
}

async function saveProduct() {
  if (!form.value.name_uz.trim()) {
    formError.value = 'O\'zbek tilida nom kiritilishi shart'
    return
  }
  saving.value    = true
  formError.value = ''
  try {
    const fd = new FormData()
    Object.entries(form.value).forEach(([k, v]) => fd.append(k, v))
    if (imageFile.value) fd.append('image', imageFile.value)

    if (editingProduct.value) {
      await axios.put(`/products/${editingProduct.value.id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else {
      await axios.post('/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    closeModal()
    fetchProducts()
  } catch (err) {
    formError.value = err.response?.data?.message || 'Xatolik yuz berdi'
  } finally {
    saving.value = false
  }
}

// --- O'chirish ---
function confirmDelete(product) {
  deleteTarget.value = product
}

async function deleteProduct() {
  deleting.value = true
  try {
    await axios.delete(`/products/${deleteTarget.value.id}`)
    deleteTarget.value = null
    fetchProducts()
  } catch {
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>

<style scoped>
.btn-primary {
  @apply flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover
         text-white text-sm font-medium rounded-lg transition-all duration-200
         disabled:opacity-60 disabled:cursor-not-allowed;
}
.btn-secondary {
  @apply px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50
         text-sm font-medium rounded-lg transition-all duration-200;
}
.btn-danger {
  @apply px-4 py-2 bg-primary hover:bg-primary-hover text-white
         text-sm font-medium rounded-lg transition-all duration-200
         disabled:opacity-60 disabled:cursor-not-allowed;
}
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
         transition-all duration-200 placeholder-gray-400;
}
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1.5;
}
</style>
