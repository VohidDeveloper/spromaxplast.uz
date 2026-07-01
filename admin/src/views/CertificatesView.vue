<template>
  <div class="space-y-6">

    <!-- Sarlavha + qo'shish -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="font-heading text-2xl font-bold text-gray-800">Sertifikatlar</h2>
        <p class="text-gray-500 text-sm mt-1">Jami: {{ certificates.length }} ta</p>
      </div>
      <button @click="openModal()" class="btn-primary self-start sm:self-auto">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Sertifikat qo'shish
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
          <div class="w-28 h-4 bg-gray-200 rounded animate-pulse" />
          <div class="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>

      <!-- Bo'sh holat -->
      <div v-else-if="!certificates.length" class="text-center py-16 text-gray-400">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0
               3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946
               3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138
               3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806
               3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438
               3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        <p>Sertifikatlar yo'q</p>
      </div>

      <!-- Jadval -->
      <div v-else class="overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th class="hidden sm:table-cell">Kod</th>
              <th class="hidden md:table-cell">Kim bergan</th>
              <th class="hidden lg:table-cell">Amal muddati</th>
              <th>Holat</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cert in certificates" :key="cert.id">
              <!-- Nom -->
              <td>
                <div class="flex items-center gap-3">
                  <!-- Fayl preview mini -->
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    :class="cert.file_url ? 'bg-yellow-50' : 'bg-gray-100'">
                    <svg v-if="isPdf(cert.file_url)" class="w-5 h-5 text-yellow-500"
                      fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                      <path d="M14 2v6h6M9 13h6M9 17h4"/>
                    </svg>
                    <svg v-else-if="cert.file_url" class="w-5 h-5 text-blue-400"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0
                           L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <svg v-else class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414
                           a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span class="font-medium text-gray-800">{{ cert.name }}</span>
                </div>
              </td>
              <!-- Kod -->
              <td class="hidden sm:table-cell">
                <code class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{{ cert.code }}</code>
              </td>
              <!-- Kim bergan -->
              <td class="hidden md:table-cell text-gray-500 text-sm">{{ cert.issued_by || '—' }}</td>
              <!-- Amal muddati -->
              <td class="hidden lg:table-cell">
                <span :class="isExpired(cert.valid_until)
                  ? 'text-primary text-xs font-medium'
                  : 'text-gray-400 text-xs'">
                  {{ formatDate(cert.valid_until) }}
                  <span v-if="isExpired(cert.valid_until)" class="ml-1">(Muddati o'tgan)</span>
                </span>
              </td>
              <!-- Holat -->
              <td>
                <span :class="['badge', cert.is_active ? 'badge-success' : 'badge-gray']">
                  {{ cert.is_active ? 'Aktiv' : 'Noaktiv' }}
                </span>
              </td>
              <!-- Amallar -->
              <td>
                <div class="flex items-center gap-1">
                  <a v-if="cert.file_url" :href="cert.file_url" target="_blank"
                    class="p-1.5 text-gray-400 hover:text-secondary hover:bg-secondary-light rounded-lg transition-fast"
                    title="Ko'rish">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
                           -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </a>
                  <button @click="openModal(cert)"
                    class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-fast"
                    title="Tahrirlash">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                           m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(cert)"
                    class="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-light rounded-lg transition-fast"
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
              {{ editing ? 'Sertifikatni tahrirlash' : 'Yangi sertifikat' }}
            </h3>
            <button @click="closeModal"
              class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-fast">
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
              <label class="form-label">Sertifikat nomi <span class="text-primary">*</span></label>
              <input v-model="form.name" type="text" class="input-field"
                placeholder="ISO 9001:2015 Sertifikat" />
            </div>

            <!-- Kod -->
            <div>
              <label class="form-label">Sertifikat kodi <span class="text-primary">*</span></label>
              <input v-model="form.code" type="text" class="input-field"
                placeholder="UZ-2024-001" />
            </div>

            <!-- Kim bergan -->
            <div>
              <label class="form-label">Kim bergan</label>
              <input v-model="form.issued_by" type="text" class="input-field"
                placeholder="O'zstandart" />
            </div>

            <!-- Amal muddati -->
            <div>
              <label class="form-label">Amal muddati</label>
              <input v-model="form.valid_until" type="date" class="input-field" />
            </div>

            <!-- Fayl yuklash -->
            <div>
              <label class="form-label">Fayl (PDF yoki rasm)</label>
              <div class="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center
                          hover:border-primary transition-fast cursor-pointer"
                @click="$refs.fileInput.click()">

                <!-- PDF preview -->
                <div v-if="filePreview === 'pdf'" class="py-3">
                  <div class="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <svg class="w-7 h-7 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                      <path fill="none" stroke="white" stroke-width="1.5" d="M14 2v6h6M9 13h6M9 17h4"/>
                    </svg>
                  </div>
                  <p class="text-sm text-gray-600 font-medium">{{ uploadedFileName }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">PDF fayl yuklandi</p>
                </div>

                <!-- Rasm preview -->
                <img v-else-if="filePreview && filePreview !== 'pdf'"
                  :src="filePreview"
                  class="max-h-40 mx-auto rounded-lg object-contain mb-2" />

                <!-- Mavjud fayl (tahrirlashda) -->
                <div v-else-if="editing?.file_url" class="py-3">
                  <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656
                           l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </div>
                  <p class="text-xs text-gray-400">Mavjud fayl bor. Yangi yuklash uchun bosing</p>
                </div>

                <!-- Bo'sh holat -->
                <div v-else class="py-4">
                  <svg class="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p class="text-sm text-gray-400">PDF yoki rasm yuklash uchun bosing</p>
                  <p class="text-xs text-gray-300 mt-1">PDF, JPG, PNG, WEBP (max 10MB)</p>
                </div>
              </div>
              <input ref="fileInput" type="file" accept=".pdf,image/*" class="hidden" @change="onFileChange" />
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
            <button @click="saveCertificate" :disabled="saving" class="btn-primary">
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
            <strong>{{ deleteTarget.name }}</strong> sertifikati o'chiriladi.
          </p>
          <div class="flex gap-3">
            <button @click="deleteTarget = null" class="btn-secondary flex-1">Bekor qilish</button>
            <button @click="deleteCertificate" :disabled="deleting"
              class="flex-1 px-4 py-2 bg-primary hover:bg-primary-hover text-white
                     text-sm font-medium rounded-lg transition-fast disabled:opacity-60">
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

const certificates = ref([])
const loading      = ref(true)
const error        = ref('')

const showModal  = ref(false)
const editing    = ref(null)
const saving     = ref(false)
const formError  = ref('')
const filePreview      = ref('')
const uploadedFileName = ref('')
const uploadedFile     = ref(null)
const fileInput        = ref(null)

const deleteTarget = ref(null)
const deleting     = ref(false)

const emptyForm = () => ({
  name: '', code: '', issued_by: '', valid_until: '', is_active: true
})
const form = ref(emptyForm())

function isPdf(url) {
  return url?.toLowerCase().endsWith('.pdf')
}

function isExpired(date) {
  if (!date) return false
  return new Date(date) < new Date()
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

async function fetchCertificates() {
  loading.value = true
  error.value   = ''
  try {
    const { data } = await axios.get('/certificates')
    certificates.value = data.data || []
  } catch {
    error.value = 'Sertifikatlarni yuklashda xatolik'
  } finally {
    loading.value = false
  }
}

function openModal(cert = null) {
  editing.value         = cert
  formError.value       = ''
  uploadedFile.value    = null
  filePreview.value     = ''
  uploadedFileName.value = ''

  form.value = cert
    ? { name: cert.name || '', code: cert.code || '',
        issued_by: cert.issued_by || '',
        valid_until: cert.valid_until ? cert.valid_until.split('T')[0] : '',
        is_active: cert.is_active ?? true }
    : emptyForm()

  showModal.value = true
}

function closeModal() { showModal.value = false; editing.value = null }

function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  uploadedFile.value     = file
  uploadedFileName.value = file.name

  if (file.type === 'application/pdf') {
    filePreview.value = 'pdf'
  } else {
    filePreview.value = URL.createObjectURL(file)
  }
}

async function saveCertificate() {
  if (!form.value.name.trim()) { formError.value = 'Sertifikat nomi majburiy'; return }
  if (!form.value.code.trim()) { formError.value = 'Sertifikat kodi majburiy'; return }

  saving.value    = true
  formError.value = ''
  try {
    const fd = new FormData()
    Object.entries(form.value).forEach(([k, v]) => fd.append(k, v))
    if (uploadedFile.value) fd.append('file', uploadedFile.value)

    const cfg = { headers: { 'Content-Type': 'multipart/form-data' } }
    if (editing.value) {
      await axios.put(`/certificates/${editing.value.id}`, fd, cfg)
    } else {
      await axios.post('/certificates', fd, cfg)
    }
    closeModal()
    fetchCertificates()
  } catch (err) {
    formError.value = err.response?.data?.message || 'Xatolik yuz berdi'
  } finally {
    saving.value = false
  }
}

function confirmDelete(cert) { deleteTarget.value = cert }

async function deleteCertificate() {
  deleting.value = true
  try {
    await axios.delete(`/certificates/${deleteTarget.value.id}`)
    deleteTarget.value = null
    fetchCertificates()
  } catch { deleteTarget.value = null }
  finally { deleting.value = false }
}

onMounted(fetchCertificates)
</script>

<style scoped>
.btn-primary {
  @apply flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover
         text-white text-sm font-medium rounded-lg transition-fast
         disabled:opacity-60 disabled:cursor-not-allowed;
}
.btn-secondary {
  @apply px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50
         text-sm font-medium rounded-lg transition-fast;
}
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
         transition-fast placeholder-gray-400;
}
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1.5;
}
</style>
