<template>
  <div class="space-y-6">

    <!-- Sarlavha + qo'shish -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="font-heading text-2xl font-bold text-gray-800">Hamkorlar</h2>
        <p class="text-gray-500 text-sm mt-1">Jami: {{ partners.length }} ta</p>
      </div>
      <button @click="openModal()" class="btn-primary self-start sm:self-auto">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Hamkor qo'shish
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
          <div class="w-12 h-12 bg-gray-200 rounded-xl animate-pulse shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded animate-pulse w-40" />
            <div class="h-3 bg-gray-200 rounded animate-pulse w-24" />
          </div>
          <div class="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>

      <!-- Bo'sh holat -->
      <div v-else-if="!partners.length" class="text-center py-16 text-gray-400">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
               M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
               m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p>Hamkorlar yo'q</p>
      </div>

      <!-- Jadval -->
      <div v-else class="overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Nom</th>
              <th class="hidden md:table-cell">Soha</th>
              <th class="hidden lg:table-cell">Sayt</th>
              <th class="hidden sm:table-cell">Tartib</th>
              <th>Holat</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="partner in partners" :key="partner.id">
              <!-- Logo -->
              <td>
                <div class="w-12 h-12 rounded-xl border border-gray-100 overflow-hidden
                            flex items-center justify-center bg-gray-50 shrink-0">
                  <img v-if="partner.logo_url" :src="partner.logo_url" :alt="partner.name"
                    class="w-full h-full object-contain p-1" />
                  <svg v-else class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0
                         L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </td>
              <!-- Nom -->
              <td class="font-medium text-gray-800">{{ partner.name }}</td>
              <!-- Soha -->
              <td class="hidden md:table-cell text-gray-500 text-sm">{{ partner.industry || '—' }}</td>
              <!-- Sayt -->
              <td class="hidden lg:table-cell">
                <a v-if="partner.website" :href="partner.website" target="_blank"
                  class="text-blue-500 hover:text-blue-700 text-sm truncate max-w-[160px] block transition-all duration-150 ease-in-out">
                  {{ partner.website.replace(/^https?:\/\//, '') }}
                </a>
                <span v-else class="text-gray-400 text-sm">—</span>
              </td>
              <!-- Tartib -->
              <td class="hidden sm:table-cell">
                <span class="text-gray-500 text-sm font-medium">{{ partner.sort_order }}</span>
              </td>
              <!-- Holat -->
              <td>
                <span :class="['badge', partner.is_active ? 'badge-success' : 'badge-gray']">
                  {{ partner.is_active ? 'Aktiv' : 'Noaktiv' }}
                </span>
              </td>
              <!-- Amallar -->
              <td>
                <div class="flex items-center gap-1">
                  <button @click="openModal(partner)"
                    class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-150 ease-in-out"
                    title="Tahrirlash">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                           m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(partner)"
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
        class="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto"
        @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="font-heading font-semibold text-lg text-gray-800">
              {{ editing ? 'Hamkorni tahrirlash' : 'Yangi hamkor' }}
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

            <!-- Nom -->
            <div>
              <label class="form-label">Hamkor nomi <span class="text-primary">*</span></label>
              <input v-model="form.name" type="text" class="input-field" placeholder="Kompaniya nomi" />
            </div>

            <!-- Soha -->
            <div>
              <label class="form-label">Soha / Tarmoq</label>
              <input v-model="form.industry" type="text" class="input-field"
                placeholder="Qurilish materiallari" />
            </div>

            <!-- Sayt URL -->
            <div>
              <label class="form-label">Sayt manzili</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">
                  https://
                </span>
                <input
                  v-model="websiteInput"
                  type="text"
                  class="input-field pl-16"
                  placeholder="example.com"
                />
              </div>
            </div>

            <!-- Logo yuklash -->
            <div>
              <label class="form-label">Logo</label>
              <div class="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center
                          hover:border-primary transition-all duration-150 ease-in-out cursor-pointer"
                @click="$refs.logoInput.click()">
                <img v-if="logoPreview" :src="logoPreview"
                  class="max-h-28 max-w-[180px] mx-auto object-contain mb-2 rounded-lg" />
                <div v-else class="py-4">
                  <svg class="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0
                         L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-sm text-gray-400">Logo yuklash uchun bosing</p>
                  <p class="text-xs text-gray-300 mt-1">PNG, SVG, JPG (max 2MB)</p>
                </div>
              </div>
              <input ref="logoInput" type="file" accept="image/*" class="hidden" @change="onLogoChange" />
            </div>

            <!-- Tartib raqami -->
            <div>
              <label class="form-label">Tartib raqami</label>
              <input v-model.number="form.sort_order" type="number" min="1" class="input-field"
                placeholder="1" />
              <p class="text-xs text-gray-400 mt-1">Kichik raqam — sahifada oldin ko'rinadi</p>
            </div>

            <!-- Aktiv toggle -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <p class="text-sm font-medium text-gray-700">Aktiv holat</p>
              <button type="button" @click="form.is_active = !form.is_active"
                :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  form.is_active ? 'bg-secondary' : 'bg-gray-300']">
                <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                  form.is_active ? 'translate-x-6' : 'translate-x-1']" />
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <button @click="closeModal" class="btn-secondary">Bekor qilish</button>
            <button @click="savePartner" :disabled="saving" class="btn-primary">
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
            <strong>{{ deleteTarget.name }}</strong> hamkori o'chiriladi.
          </p>
          <div class="flex gap-3">
            <button @click="deleteTarget = null" class="btn-secondary flex-1">Bekor qilish</button>
            <button @click="deletePartner" :disabled="deleting"
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
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const partners     = ref([])
const loading      = ref(true)
const error        = ref('')

const showModal  = ref(false)
const editing    = ref(null)
const saving     = ref(false)
const formError  = ref('')
const logoPreview  = ref('')
const logoFile     = ref(null)
const logoInput    = ref(null)

const deleteTarget = ref(null)
const deleting     = ref(false)

// https:// prefiksiz input, saqlashda qo'shiladi
const websiteInput = ref('')

const emptyForm = () => ({
  name: '', industry: '', sort_order: 1, is_active: true
})
const form = ref(emptyForm())

// Saytga https:// qo'shish
const websiteUrl = computed(() => {
  const w = websiteInput.value.trim()
  if (!w) return ''
  return w.startsWith('http') ? w : `https://${w}`
})

async function fetchPartners() {
  loading.value = true
  error.value   = ''
  try {
    const { data } = await axios.get('/partners')
    partners.value = data.data || []
  } catch {
    error.value = 'Hamkorlarni yuklashda xatolik'
  } finally {
    loading.value = false
  }
}

function openModal(partner = null) {
  editing.value   = partner
  formError.value = ''
  logoFile.value  = null

  if (partner) {
    form.value = {
      name:       partner.name       || '',
      industry:   partner.industry   || '',
      sort_order: partner.sort_order ?? 1,
      is_active:  partner.is_active  ?? true
    }
    const w = partner.website || ''
    websiteInput.value = w.replace(/^https?:\/\//, '')
    logoPreview.value  = partner.logo_url || ''
  } else {
    form.value         = emptyForm()
    websiteInput.value = ''
    logoPreview.value  = ''
  }
  showModal.value = true
}

function closeModal() { showModal.value = false; editing.value = null }

function onLogoChange(e) {
  const file = e.target.files[0]
  if (!file) return
  logoFile.value    = file
  logoPreview.value = URL.createObjectURL(file)
}

async function savePartner() {
  if (!form.value.name.trim()) { formError.value = 'Hamkor nomi majburiy'; return }

  saving.value    = true
  formError.value = ''
  try {
    const fd = new FormData()
    Object.entries(form.value).forEach(([k, v]) => fd.append(k, v))
    if (websiteUrl.value) fd.append('website', websiteUrl.value)
    if (logoFile.value)   fd.append('logo', logoFile.value)

    const cfg = { headers: { 'Content-Type': 'multipart/form-data' } }
    if (editing.value) {
      await axios.put(`/partners/${editing.value.id}`, fd, cfg)
    } else {
      await axios.post('/partners', fd, cfg)
    }
    closeModal()
    fetchPartners()
  } catch (err) {
    formError.value = err.response?.data?.message || 'Xatolik yuz berdi'
  } finally {
    saving.value = false
  }
}

function confirmDelete(partner) { deleteTarget.value = partner }

async function deletePartner() {
  deleting.value = true
  try {
    await axios.delete(`/partners/${deleteTarget.value.id}`)
    deleteTarget.value = null
    fetchPartners()
  } catch { deleteTarget.value = null }
  finally { deleting.value = false }
}

onMounted(fetchPartners)
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
