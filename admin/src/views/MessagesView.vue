<template>
  <div class="space-y-6">

    <!-- Sarlavha -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="font-heading text-2xl font-bold text-gray-800">Xabarlar</h2>
        <p class="text-gray-500 text-sm mt-1">Jami: {{ total }} ta</p>
      </div>
      <!-- Filter tugmalar -->
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <button
          @click="setFilter('all')"
          :class="['px-4 py-2 text-sm font-medium rounded-lg transition-fast',
            activeFilter === 'all'
              ? 'bg-dark text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50']"
        >
          Barchasi
        </button>
        <button
          @click="setFilter('unread')"
          :class="['flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-fast',
            activeFilter === 'unread'
              ? 'bg-primary text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50']"
        >
          O'qilmagan
          <span v-if="unreadCount > 0"
            :class="['inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full',
              activeFilter === 'unread' ? 'bg-white text-primary' : 'bg-primary text-white']">
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        </button>
      </div>
    </div>

    <!-- Xato -->
    <div v-if="error" class="admin-card border-l-4 border-primary text-primary text-sm">
      {{ error }}
    </div>

    <!-- Jadval karta -->
    <div class="admin-card p-0 overflow-hidden">

      <!-- Loading skeleton -->
      <div v-if="loading" class="p-6 space-y-4">
        <div v-for="i in 8" :key="i" class="flex items-center gap-4">
          <div class="w-2 h-10 bg-gray-200 rounded animate-pulse shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded animate-pulse w-40" />
            <div class="h-3 bg-gray-200 rounded animate-pulse w-64" />
          </div>
          <div class="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>

      <!-- Bo'sh holat -->
      <div v-else-if="!messages.length" class="text-center py-16 text-gray-400">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p>{{ activeFilter === 'unread' ? 'O\'qilmagan xabarlar yo\'q' : 'Xabarlar yo\'q' }}</p>
      </div>

      <!-- Jadval -->
      <div v-else class="overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Ism</th>
              <th class="hidden sm:table-cell">Telefon</th>
              <th class="hidden md:table-cell">Email</th>
              <th class="hidden lg:table-cell">Mavzu</th>
              <th class="hidden md:table-cell">Sana</th>
              <th>Holat</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="msg in messages"
              :key="msg.id"
              :class="['cursor-pointer', !msg.is_read ? 'bg-red-50/50' : '']"
              @click="openDetail(msg)"
            >
              <!-- Ism -->
              <td>
                <div class="flex items-center gap-2">
                  <span v-if="!msg.is_read" class="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span v-else class="w-2 h-2 shrink-0" />
                  <span :class="['text-sm', !msg.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700']">
                    {{ msg.name }}
                  </span>
                </div>
              </td>
              <!-- Telefon -->
              <td class="hidden sm:table-cell text-gray-500 text-sm">{{ msg.phone || '—' }}</td>
              <!-- Email -->
              <td class="hidden md:table-cell text-gray-500 text-sm">{{ msg.email || '—' }}</td>
              <!-- Mavzu -->
              <td class="hidden lg:table-cell text-gray-500 text-sm max-w-xs truncate">
                {{ msg.subject || '—' }}
              </td>
              <!-- Sana -->
              <td class="hidden md:table-cell text-gray-400 text-xs">
                {{ formatDate(msg.created_at) }}
              </td>
              <!-- Holat -->
              <td @click.stop>
                <span :class="['badge', msg.is_read ? 'badge-gray' : 'badge-success font-semibold']">
                  {{ msg.is_read ? 'O\'qilgan' : 'Yangi' }}
                </span>
              </td>
              <!-- Amallar -->
              <td @click.stop>
                <div class="flex items-center gap-1">
                  <button
                    v-if="!msg.is_read"
                    @click="markRead(msg)"
                    class="p-1.5 text-gray-400 hover:text-secondary hover:bg-secondary-light
                           rounded-lg transition-fast"
                    title="O'qildi belgilash"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(msg)"
                    class="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-light
                           rounded-lg transition-fast"
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
          <button @click="changePage(-1)" :disabled="offset === 0"
            class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg
                   disabled:opacity-40 hover:bg-gray-50 transition-fast">
            ← Oldingi
          </button>
          <button @click="changePage(1)" :disabled="offset + limit >= total"
            class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg
                   disabled:opacity-40 hover:bg-gray-50 transition-fast">
            Keyingi →
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Detail MODAL ===== -->
    <Teleport to="body">
      <div v-if="selectedMsg"
        class="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto"
        @click.self="selectedMsg = null"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">

          <!-- Modal header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <h3 class="font-heading font-semibold text-lg text-gray-800">Xabar tafsiloti</h3>
              <span :class="['badge', selectedMsg.is_read ? 'badge-gray' : 'badge-success']">
                {{ selectedMsg.is_read ? 'O\'qilgan' : 'Yangi' }}
              </span>
            </div>
            <button @click="selectedMsg = null"
              class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-fast">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal body -->
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-400 mb-0.5">Ism</p>
                <p class="text-sm font-medium text-gray-800">{{ selectedMsg.name }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-0.5">Telefon</p>
                <p class="text-sm font-medium text-gray-800">{{ selectedMsg.phone || '—' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-0.5">Email</p>
                <p class="text-sm font-medium text-gray-800">{{ selectedMsg.email || '—' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-0.5">Sana</p>
                <p class="text-sm font-medium text-gray-800">{{ formatDate(selectedMsg.created_at) }}</p>
              </div>
            </div>

            <div v-if="selectedMsg.subject">
              <p class="text-xs text-gray-400 mb-0.5">Mavzu</p>
              <p class="text-sm font-medium text-gray-800">{{ selectedMsg.subject }}</p>
            </div>

            <div>
              <p class="text-xs text-gray-400 mb-1.5">Xabar matni</p>
              <div class="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {{ selectedMsg.message || '—' }}
              </div>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100">
            <button
              @click="confirmDelete(selectedMsg)"
              class="flex items-center gap-2 px-4 py-2 text-primary border border-primary-light
                     hover:bg-primary-light rounded-lg text-sm font-medium transition-fast"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7
                     m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              O'chirish
            </button>
            <button
              v-if="!selectedMsg.is_read"
              @click="markRead(selectedMsg)"
              :disabled="marking"
              class="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary-hover
                     text-white rounded-lg text-sm font-medium transition-fast
                     disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ marking ? 'Belgilanmoqda...' : 'O\'qildi deb belgilash' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ===== O'chirish tasdiqlash ===== -->
    <Teleport to="body">
      <div v-if="deleteTarget"
        class="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
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
            <strong>{{ deleteTarget.name }}</strong> xabari o'chiriladi.
          </p>
          <div class="flex gap-3">
            <button @click="deleteTarget = null"
              class="flex-1 px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50
                     text-sm font-medium rounded-lg transition-fast">
              Bekor qilish
            </button>
            <button @click="deleteMessage" :disabled="deleting"
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

const messages     = ref([])
const total        = ref(0)
const unreadCount  = ref(0)
const loading      = ref(true)
const error        = ref('')
const activeFilter = ref('all')
const limit        = 10
const offset       = ref(0)

const selectedMsg  = ref(null)
const marking      = ref(false)
const deleteTarget = ref(null)
const deleting     = ref(false)

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('uz-UZ', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

async function fetchMessages() {
  loading.value = true
  error.value   = ''
  try {
    const params = { limit, offset: offset.value }
    if (activeFilter.value === 'unread') params.is_read = false

    const { data } = await axios.get('/contacts', { params })
    messages.value = data.data  || []
    total.value    = data.total ?? messages.value.length
    unreadCount.value = (data.data || []).filter(m => !m.is_read).length
  } catch {
    error.value = 'Xabarlarni yuklashda xatolik yuz berdi'
  } finally {
    loading.value = false
  }
}

function setFilter(filter) {
  activeFilter.value = filter
  offset.value       = 0
  fetchMessages()
}

function changePage(dir) {
  offset.value = Math.max(0, offset.value + dir * limit)
  fetchMessages()
}

function openDetail(msg) {
  selectedMsg.value = { ...msg }
  if (!msg.is_read) markRead(msg, false)
}

async function markRead(msg, closeModal = true) {
  marking.value = true
  try {
    await axios.put(`/contacts/${msg.id}/read`)
    msg.is_read = true
    if (selectedMsg.value?.id === msg.id) selectedMsg.value.is_read = true
    if (unreadCount.value > 0) unreadCount.value--
    if (closeModal) selectedMsg.value = null
    if (activeFilter.value === 'unread') fetchMessages()
  } catch { /* silent */ } finally {
    marking.value = false
  }
}

function confirmDelete(msg) {
  deleteTarget.value = msg
}

async function deleteMessage() {
  deleting.value = true
  try {
    await axios.delete(`/contacts/${deleteTarget.value.id}`)
    deleteTarget.value = null
    selectedMsg.value  = null
    fetchMessages()
  } catch { /* silent */ } finally {
    deleting.value = false
  }
}

onMounted(fetchMessages)
</script>
