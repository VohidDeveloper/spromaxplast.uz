<template>
  <div class="space-y-6">

    <!-- Sarlavha + qo'shish -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="font-heading text-2xl font-bold text-gray-800">Kategoriyalar</h2>
        <p class="text-gray-500 text-sm mt-1">Jami: {{ categories.length }} ta</p>
      </div>
      <button @click="openModal()" class="btn-primary self-start sm:self-auto">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Kategoriya qo'shish
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
          <div class="flex-1 h-4 bg-gray-200 rounded animate-pulse" />
          <div class="w-24 h-4 bg-gray-200 rounded animate-pulse" />
          <div class="w-16 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <!-- Bo'sh holat -->
      <div v-else-if="!categories.length" class="text-center py-16 text-gray-400">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9
               a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p>Kategoriyalar yo'q</p>
      </div>

      <!-- Jadval -->
      <div v-else class="overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom (O'zbek)</th>
              <th class="hidden md:table-cell">Nom (Rus)</th>
              <th class="hidden sm:table-cell">Slug</th>
              <th>Mahsulotlar</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cat, idx) in categories" :key="cat.id">
              <td class="text-gray-400 text-xs w-10">{{ idx + 1 }}</td>
              <td class="font-medium text-gray-800">{{ cat.name_uz }}</td>
              <td class="hidden md:table-cell text-gray-500">{{ cat.name_ru }}</td>
              <td class="hidden sm:table-cell">
                <code class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {{ cat.slug }}
                </code>
              </td>
              <td>
                <span class="badge badge-gray">{{ cat.products_count ?? 0 }} ta</span>
              </td>
              <td>
                <div class="flex items-center gap-1">
                  <button @click="openModal(cat)"
                    class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-150 ease-in-out"
                    title="Tahrirlash">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                           m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(cat)"
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
    </div>

    <!-- ===== Qo'shish/Tahrirlash MODAL ===== -->
    <Teleport to="body">
      <div v-if="showModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="font-heading font-semibold text-lg text-gray-800">
              {{ editing ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya' }}
            </h3>
            <button @click="closeModal"
              class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-150 ease-in-out">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4">
            <div v-if="formError" class="text-sm text-primary bg-primary-light rounded-lg px-4 py-3">
              {{ formError }}
            </div>

            <!-- O'zbek nomi -->
            <div>
              <label class="form-label">Nom (O'zbek) <span class="text-primary">*</span></label>
              <input
                v-model="form.name_uz"
                @input="autoSlug"
                type="text"
                class="input-field"
                placeholder="masalan: Devor panellari"
              />
            </div>

            <!-- Rus nomi -->
            <div>
              <label class="form-label">Название (Русский) <span class="text-primary">*</span></label>
              <input v-model="form.name_ru" type="text" class="input-field" placeholder="Настенные панели" />
</div>

            <!-- Ingliz nomi -->
            <div>
              <label class="form-label">Name (English) <span class="text-primary">*</span></label>
              <input v-model="form.name_en" type="text" class="input-field" placeholder="Wall panels" />
            </div>

            <!-- Slug -->
            <div>
              <label class="form-label">
                Slug
                <span class="text-gray-400 font-normal text-xs ml-1">(avtomatik yoki qo'lda)</span>
              </label>
              <div class="relative">
                <input
                  v-model="form.slug"
                  type="text"
                  class="input-field pr-24"
                  placeholder="devor-panellari"
                />
                <button
                  type="button"
                  @click="generateSlug"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1
                         bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-all duration-150 ease-in-out"
                >
                  Yaratish
                </button>
              </div>
              <p class="text-xs text-gray-400 mt-1">URL da ishlatiladi: /products?category={{ form.slug || 'slug' }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <button @click="closeModal" class="btn-secondary">Bekor qilish</button>
            <button @click="saveCategory" :disabled="saving" class="btn-primary">
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
          <div :class="['w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4',
            hasProducts ? 'bg-yellow-50' : 'bg-primary-light']">
            <svg :class="['w-6 h-6', hasProducts ? 'text-yellow-500' : 'text-primary']"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4
                   c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <!-- Mahsulotlar bor bo'lsa ogohlantirish -->
          <template v-if="hasProducts">
            <h3 class="font-heading font-semibold text-gray-800 mb-2">Ogohlantirish</h3>
            <p class="text-sm text-gray-500 mb-6">
              <strong>{{ deleteTarget.name_uz }}</strong> kategoriyasida
              <strong class="text-primary">{{ deleteTarget.products_count }} ta mahsulot</strong> mavjud.
              Avval mahsulotlarni boshqa kategoriyaga o'tkazing yoki o'chiring.
            </p>
            <button @click="deleteTarget = null" class="w-full btn-secondary">Tushunarli</button>
          </template>

          <!-- Oddiy o'chirish -->
          <template v-else>
            <h3 class="font-heading font-semibold text-gray-800 mb-2">O'chirishni tasdiqlang</h3>
            <p class="text-sm text-gray-500 mb-6">
              <strong>{{ deleteTarget.name_uz }}</strong> kategoriyasi o'chiriladi.
            </p>
            <div class="flex gap-3">
              <button @click="deleteTarget = null" class="btn-secondary flex-1">Bekor qilish</button>
              <button @click="deleteCategory" :disabled="deleting"
                class="flex-1 px-4 py-2 bg-primary hover:bg-primary-hover text-white
                       text-sm font-medium rounded-lg transition-all duration-150 ease-in-out disabled:opacity-60">
                {{ deleting ? 'O\'chirilmoqda...' : 'O\'chirish' }}
              </button>
            </div>
          </template>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const categories  = ref([])
const loading     = ref(true)
const error       = ref('')
const showModal   = ref(false)
const editing     = ref(null)
const saving      = ref(false)
const formError   = ref('')
const deleteTarget = ref(null)
const deleting    = ref(false)

const hasProducts = computed(() => (deleteTarget.value?.products_count ?? 0) > 0)

const emptyForm = () => ({ name_uz: '', name_ru: '', name_en: '', slug: '' })
const form = ref(emptyForm())

// O'zbek matndan slug yaratish
function toSlug(text) {
  const map = { 'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z',
    'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s',
    'т':'t','у':'u','ф':'f','х':'x','ц':'ts','ч':'ch','ш':'sh','щ':'sh','ъ':'','ы':'i',
    'ь':'','э':'e','ю':'yu','я':'ya','ў':'o','қ':'q','ғ':'g','ҳ':'h','ж':'j' }
  return text.toLowerCase()
    .split('').map(c => map[c] ?? c).join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function generateSlug() {
  if (form.value.name_uz) form.value.slug = toSlug(form.value.name_uz)
}

// name_uz o'zgarganda slug avtomatik yangilanadi (faqat yangi qo'shishda)
function autoSlug() {
  if (!editing.value) form.value.slug = toSlug(form.value.name_uz)
}

async function fetchCategories() {
  loading.value = true
  error.value   = ''
  try {
    const { data } = await axios.get('/categories')
    categories.value = data.data || []
  } catch {
    error.value = 'Kategoriyalarni yuklashda xatolik'
  } finally {
    loading.value = false
  }
}

function openModal(cat = null) {
  editing.value   = cat
  formError.value = ''
  form.value = cat
    ? { name_uz: cat.name_uz || '', name_ru: cat.name_ru || '',
        name_en: cat.name_en || '', slug: cat.slug || '' }
    : emptyForm()
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editing.value   = null
}

async function saveCategory() {
  if (!form.value.name_uz.trim()) { formError.value = 'O\'zbek tilida nom kiritilishi shart'; return }
  if (!form.value.name_ru.trim()) { formError.value = 'Rus tilida nom kiritilishi shart'; return }
  if (!form.value.name_en.trim()) { formError.value = 'Ingliz tilida nom kiritilishi shart'; return }
  if (!form.value.slug.trim())    { generateSlug() }

  saving.value    = true
  formError.value = ''
  try {
    if (editing.value) {
      await axios.put(`/categories/${editing.value.id}`, form.value)
    } else {
      await axios.post('/categories', form.value)
    }
    closeModal()
    fetchCategories()
  } catch (err) {
    formError.value = err.response?.data?.message || 'Xatolik yuz berdi'
  } finally {
    saving.value = false
  }
}

function confirmDelete(cat) { deleteTarget.value = cat }

async function deleteCategory() {
  deleting.value = true
  try {
    await axios.delete(`/categories/${deleteTarget.value.id}`)
    deleteTarget.value = null
    fetchCategories()
  } catch (err) {
    error.value        = err.response?.data?.message || 'O\'chirishda xatolik'
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}

onMounted(fetchCategories)
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
