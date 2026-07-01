<template>
  <div class="space-y-6">

    <!-- Sahifa sarlavha -->
    <div>
      <h2 class="font-heading text-2xl font-bold text-gray-800">Dashboard</h2>
      <p class="text-gray-500 text-sm mt-1">Tizim umumiy ko'rinishi</p>
    </div>

    <!-- Xato holati -->
    <div v-if="error" class="admin-card border-primary-light text-primary text-sm">
      {{ error }}
    </div>

    <!-- Statistika kartalar -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div
        v-for="card in statCards"
        :key="card.key"
        class="admin-card flex items-center gap-4"
      >
        <!-- Skeleton -->
        <template v-if="loading">
          <div class="w-12 h-12 rounded-xl bg-gray-200 animate-pulse shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded animate-pulse w-16" />
            <div class="h-6 bg-gray-200 rounded animate-pulse w-10" />
          </div>
        </template>
        <!-- Kontent -->
        <template v-else>
          <div :class="['flex items-center justify-center w-12 h-12 rounded-xl shrink-0', card.bg]">
            <component :is="card.icon" :class="['w-6 h-6', card.color]" />
          </div>
          <div>
            <p class="text-gray-500 text-sm">{{ card.label }}</p>
            <p class="font-heading font-bold text-2xl text-gray-800">{{ stats[card.key] }}</p>
            <p v-if="card.sub" class="text-xs text-primary font-medium mt-0.5">
              {{ card.sub }}
            </p>
          </div>
        </template>
      </div>
    </div>

    <!-- So'nggi xabarlar -->
    <div class="admin-card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-heading font-semibold text-gray-800">So'nggi xabarlar</h3>
        <button
          @click="$router.push('/messages')"
          class="text-sm text-primary hover:text-primary-hover font-medium transition-all duration-150 ease-in-out"
        >
          Barchasi →
        </button>
      </div>

      <!-- Skeleton -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="flex items-center gap-3">
          <div class="flex-1 h-4 bg-gray-200 rounded animate-pulse" />
          <div class="w-20 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <!-- Jadval -->
      <div v-else-if="recentMessages.length" class="overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Ism</th>
              <th class="hidden sm:table-cell">Telefon</th>
              <th class="hidden md:table-cell">Mavzu</th>
              <th class="hidden lg:table-cell">Sana</th>
              <th>Holat</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="msg in recentMessages" :key="msg.id">
              <td class="font-medium text-gray-800">{{ msg.name }}</td>
              <td class="hidden sm:table-cell text-gray-500">{{ msg.phone }}</td>
              <td class="hidden md:table-cell text-gray-500 max-w-xs truncate">
                {{ msg.subject || '—' }}
              </td>
              <td class="hidden lg:table-cell text-gray-400 text-xs">
                {{ formatDate(msg.created_at) }}
              </td>
              <td>
                <span :class="['badge', msg.is_read ? 'badge-gray' : 'badge-success']">
                  {{ msg.is_read ? 'O\'qilgan' : 'Yangi' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Bo'sh holat -->
      <p v-else class="text-gray-400 text-sm text-center py-8">
        Hali xabarlar yo'q
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, defineComponent, h } from 'vue'
import axios from 'axios'

const loading        = ref(true)
const error          = ref('')
const recentMessages = ref([])

const stats = ref({
  products:     0,
  messages:     0,
  unread:       0,
  partners:     0,
  certificates: 0
})

// Inline SVG icon helper
function icon(pathD) {
  return defineComponent({
    render() {
      return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: pathD })
      ])
    }
  })
}

const statCards = [
  {
    key:   'products',
    label: 'Mahsulotlar',
    bg:    'bg-red-50',
    color: 'text-primary',
    icon:  icon('M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10')
  },
  {
    key:   'messages',
    label: 'Xabarlar',
    bg:    'bg-blue-50',
    color: 'text-blue-600',
    icon:  icon('M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'),
    get sub() { return stats.value.unread > 0 ? `${stats.value.unread} ta yangi` : '' }
  },
  {
    key:   'partners',
    label: 'Hamkorlar',
    bg:    'bg-green-50',
    color: 'text-secondary',
    icon:  icon('M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z')
  },
  {
    key:   'certificates',
    label: 'Sertifikatlar',
    bg:    'bg-yellow-50',
    color: 'text-yellow-600',
    icon:  icon('M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z')
  }
]

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('uz-UZ', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
}

onMounted(async () => {
  try {
    const [products, contacts, partners, certificates] = await Promise.all([
      axios.get('/products'),
      axios.get('/contacts'),
      axios.get('/partners'),
      axios.get('/certificates')
    ])

    stats.value.products     = products.data.data?.length     ?? products.data.total     ?? 0
    stats.value.partners     = partners.data.data?.length     ?? partners.data.total     ?? 0
    stats.value.certificates = certificates.data.data?.length ?? certificates.data.total ?? 0

    const contactData        = contacts.data.data || []
    stats.value.messages     = contacts.data.total ?? contactData.length
    stats.value.unread       = contactData.filter(m => !m.is_read).length

    recentMessages.value = contactData.slice(0, 5)
  } catch (err) {
    error.value = 'Ma\'lumotlarni yuklashda xatolik yuz berdi'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>
