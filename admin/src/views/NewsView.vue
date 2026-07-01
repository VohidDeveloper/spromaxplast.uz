<template>
  <div class="space-y-6">

    <!-- Sarlavha + qo'shish -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="font-heading text-2xl font-bold text-gray-800">Yangiliklar</h2>
        <p class="text-gray-500 text-sm mt-1">Jami: {{ total }} ta</p>
      </div>
      <button @click="openModal()" class="btn-primary self-start sm:self-auto">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Yangilik qo'shish
      </button>
    </div>

    <!-- Filter tugmalar -->
    <div class="flex items-center gap-2 flex-wrap">
      <button v-for="f in filters" :key="f.value" @click="setFilter(f.value)"
        :class="['px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ease-in-out',
          activeFilter === f.value
            ? 'bg-dark text-white'
            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50']">
        {{ f.label }}
      </button>
    </div>

    <!-- Xato -->
    <div v-if="error" class="admin-card text-primary text-sm border-l-4 border-primary">
      {{ error }}
    </div>

    <!-- Jadval karta -->
    <div class="admin-card p-0 overflow-hidden">

      <!-- Loading -->
      <div v-if="loading" class="p-6 space-y-4">
        <div v-for="i in 5" :key="i" class="flex items-center gap-4">
          <div class="w-16 h-12 bg-gray-200 rounded-lg animate-pulse shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded animate-pulse w-56" />
            <div class="h-3 bg-gray-200 rounded animate-pulse w-32" />
          </div>
          <div class="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>

      <!-- Bo'sh holat -->
      <div v-else-if="!news.length" class="text-center py-16 text-gray-400">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7
               m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <p>Yangiliklar topilmadi</p>
      </div>

      <!-- Jadval -->
      <div v-else class="overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Rasm</th>
              <th>Sarlavha</th>
              <th class="hidden sm:table-cell">Holat</th>
              <th class="hidden md:table-cell">Sana</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in news" :key="item.id">
              <!-- Rasm -->
              <td>
                <img v-if="item.image_url" :src="item.image_url" :alt="item.title_uz"
                  class="w-16 h-11 object-cover rounded-lg border border-gray-200" />
                <div v-else class="w-16 h-11 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0
                         L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </td>
              <!-- Sarlavha -->
              <td>
                <p class="font-medium text-gray-800 line-clamp-1">{{ item.title_uz }}</p>
                <p class="text-xs text-gray-400 line-clamp-1">{{ item.title_ru }}</p>
              </td>
              <!-- Holat -->
              <td class="hidden sm:table-cell">
                <span :class="['badge', item.is_published ? 'badge-success' : 'badge-gray']">
                  {{ item.is_published ? 'Chop etilgan' : 'Qoralama' }}
                </span>
              </td>
              <!-- Sana -->
              <td class="hidden md:table-cell text-gray-400 text-xs">
                {{ formatDate(item.published_at || item.created_at) }}
              </td>
              <!-- Amallar -->
              <td>
                <div class="flex items-center gap-1">
                  <button @click="openModal(item)"
                    class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-150 ease-in-out"
                    title="Tahrirlash">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                           m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(item)"
                    class="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-light rounded-lg transition-all duration-150 ease-in-out"
                    title="O'chirish">
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
          <button @click="changePage(-1)" :disabled="offset === 0"
            class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-all duration-150 ease-in-out">
            ← Oldingi
          </button>
          <button @click="changePage(1)" :disabled="offset + limit >= total"
            class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-all duration-150 ease-in-out">
            Keyingi →
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Qo'shish/Tahrirlash MODAL ===== -->
    <Teleport to="body">
      <div v-if="showModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto"
        @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="font-heading font-semibold text-lg text-gray-800">
              {{ editing ? 'Yangilikni tahrirlash' : 'Yangi yangilik' }}
            </h3>
            <button @click="closeModal"
              class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-150 ease-in-out">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-5">
            <div v-if="formError" class="text-sm text-primary bg-primary-light rounded-lg px-4 py-3">
              {{ formError }}
            </div>

            <!-- Til tablari -->
            <div class="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button v-for="lang in langs" :key="lang.code" @click="activeLang = lang.code"
                :class="['flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ease-in-out',
                  activeLang === lang.code
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700']">
                {{ lang.label }}
              </button>
            </div>

            <!-- Sarlavhalar -->
            <div v-show="activeLang === 'uz'">
              <label class="form-label">Sarlavha (O'zbek) <span class="text-primary">*</span></label>
              <input v-model="form.title_uz" type="text" class="input-field" placeholder="Yangilik sarlavhasi" />
            </div>
            <div v-show="activeLang === 'ru'">
              <label class="form-label">Заголовок (Русский) <span class="text-primary">*</span></label>
              <input v-model="form.title_ru" type="text" class="input-field" placeholder="Заголовок новости" />
            </div>
            <div v-show="activeLang === 'en'">
              <label class="form-label">Title (English) <span class="text-primary">*</span></label>
              <input v-model="form.title_en" type="text" class="input-field" placeholder="News title" />
            </div>

            <!-- Matn -->
            <div v-show="activeLang === 'uz'">
              <label class="form-label">Matn (O'zbek)</label>
              <textarea v-model="form.content_uz" rows="5" class="input-field resize-none"
                placeholder="Yangilik to'liq matni..." />
            </div>
            <div v-show="activeLang === 'ru'">
              <label class="form-label">Текст (Русский)</label>
              <textarea v-model="form.content_ru" rows="5" class="input-field resize-none"
                placeholder="Полный текст новости..." />
            </div>
            <div v-show="activeLang === 'en'">
              <label class="form-label">Content (English)</label>
              <textarea v-model="form.content_en" rows="5" class="input-field resize-none"
                placeholder="Full news content..." />
            </div>

            <!-- Rasm yuklash -->
            <div>
              <label class="form-label">Rasm</label>
              <div class="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center
                          hover:border-primary transition-all duration-150 ease-in-out cursor-pointer"
                @click="$refs.imageInput.click()">
                <img v-if="imagePreview" :src="imagePreview"
                  class="max-h-40 mx-auto rounded-lg object-contain mb-2" />
                <div v-else class="py-4">
                  <svg class="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0
                         L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-sm text-gray-400">Rasmni yuklash uchun bosing</p>
                  <p class="text-xs text-gray-300 mt-1">JPG, PNG, WEBP (max 5MB)</p>
                </div>
              </div>
              <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="onImageChange" />
            </div>

            <!-- Chop etish toggle -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p class="text-sm font-medium text-gray-700">Chop etish</p>
                <p class="text-xs text-gray-400 mt-0.5">
                  {{ form.is_published ? 'Sayt da ko\'rinadi' : 'Qoralama holatida' }}
                </p>
              </div>
              <button type="button" @click="form.is_published = !form.is_published"
                :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  form.is_published ? 'bg-secondary' : 'bg-gray-300']">
                <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                  form.is_published ? 'translate-x-6' : 'translate-x-1']" />
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <button @click="closeModal" class="btn-secondary">Bekor qilish</button>
            <button @click="saveNews" :disabled="saving" class="btn-primary">
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

    <!-- ===== O'chirish tasdiqlash ===== -->
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
            <strong>{{ deleteTarget.title_uz }}</strong> yangiligi o'chiriladi.
          </p>
          <div class="flex gap-3">
            <button @click="deleteTarget = null" class="btn-secondary flex-1">Bekor qilish</button>
            <button @click="deleteNews" :disabled="deleting"
              class="flex-1 px-4 py-2 bg-primary hover:bg-primary-hover text-white
                     text-sm font-medium rounded-lg transition-all duration-150 ease-in-out disabled:opacity-60">
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

const news         = ref([])
const total        = ref(0)
const loading      = ref(true)
const error        = ref('')
const activeFilter = ref('all')
const limit        = 10
const offset       = ref(0)

const showModal  = ref(false)
const editing    = ref(null)
const saving     = ref(false)
const formError  = ref('')
const activeLang = ref('uz')
const imagePreview = ref('')
const imageFile    = ref(null)
const imageInput   = ref(null)

const deleteTarget = ref(null)
const deleting     = ref(false)

const filters = [
  { value: 'all',       label: 'Barchasi' },
  { value: 'published', label: 'Chop etilgan' },
  { value: 'draft',     label: 'Qoralama' }
]

const langs = [
  { code: 'uz', label: "O'zbek" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' }
]

const emptyForm = () => ({
  title_uz: '', title_ru: '', title_en: '',
  content_uz: '', content_ru: '', content_en: '',
  is_published: false
})
const form = ref(emptyForm())

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

async function fetchNews() {
  loading.value = true
  error.value   = ''
  try {
    const params = { limit, offset: offset.value, admin: true }
    if (activeFilter.value === 'published') params.is_published = true
    if (activeFilter.value === 'draft')     params.is_published = false

    const { data } = await axios.get('/news', { params })
    news.value  = data.data  || []
    total.value = data.total ?? news.value.length
  } catch {
    error.value = 'Yangiliklarni yuklashda xatolik'
  } finally {
    loading.value = false
  }
}

function setFilter(f) { activeFilter.value = f; offset.value = 0; fetchNews() }
function changePage(dir) { offset.value = Math.max(0, offset.value + dir * limit); fetchNews() }

function openModal(item = null) {
  editing.value    = item
  activeLang.value = 'uz'
  formError.value  = ''
  imageFile.value  = null

  if (item) {
    form.value = {
      title_uz: item.title_uz || '', title_ru: item.title_ru || '', title_en: item.title_en || '',
      content_uz: item.content_uz || '', content_ru: item.content_ru || '', content_en: item.content_en || '',
      is_published: item.is_published ?? false
    }
    imagePreview.value = item.image_url || ''
  } else {
    form.value         = emptyForm()
    imagePreview.value = ''
  }
  showModal.value = true
}

function closeModal() { showModal.value = false; editing.value = null }

function onImageChange(e) {
  const file = e.target.files[0]
  if (!file) return
  imageFile.value    = file
  imagePreview.value = URL.createObjectURL(file)
}

async function saveNews() {
  if (!form.value.title_uz.trim()) { formError.value = 'O\'zbek sarlavhasi majburiy'; return }

  saving.value    = true
  formError.value = ''
  try {
    const fd = new FormData()
    Object.entries(form.value).forEach(([k, v]) => fd.append(k, v))
    if (imageFile.value) fd.append('image', imageFile.value)

    const cfg = { headers: { 'Content-Type': 'multipart/form-data' } }
    if (editing.value) {
      await axios.put(`/news/${editing.value.id}`, fd, cfg)
    } else {
      await axios.post('/news', fd, cfg)
    }
    closeModal()
    fetchNews()
  } catch (err) {
    formError.value = err.response?.data?.message || 'Xatolik yuz berdi'
  } finally {
    saving.value = false
  }
}

function confirmDelete(item) { deleteTarget.value = item }

async function deleteNews() {
  deleting.value = true
  try {
    await axios.delete(`/news/${deleteTarget.value.id}`)
    deleteTarget.value = null
    fetchNews()
  } catch { deleteTarget.value = null }
  finally { deleting.value = false }
}

onMounted(fetchNews)
</script>

<style scoped>
.btn-primary {
  @apply flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover
         text-white text-sm font-medium rounded-lg transition-all duration-150 ease-in-out
         disabled:opacity-60 disabled:cursor-not-allowed;
}
.btn-secondary {
  @apply px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50
         text-sm font-medium rounded-lg transition-all duration-150 ease-in-out;
}
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
         transition-all duration-150 ease-in-out placeholder-gray-400;
}
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1.5;
}
</style>
