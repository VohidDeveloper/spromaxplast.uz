<template>
  <section class="section-padding bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Sarlavha -->
      <div class="text-center mb-10 md:mb-14">
        <span class="inline-block text-secondary font-semibold text-sm uppercase tracking-widest mb-3">
          {{ $t('nav.partners') }}
        </span>
        <h2 class="section-title mx-auto">{{ $t('partners.title') }}</h2>
        <p class="section-subtitle mx-auto text-center">{{ $t('partners.subtitle') }}</p>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 mb-12 md:mb-16">
        <div v-for="i in 8" :key="i"
          class="bg-neutral-100 rounded-2xl aspect-[4/3] animate-pulse" />
      </div>

      <!-- Xato holati -->
      <div v-else-if="error" class="text-center py-10 text-neutral-400 mb-12">
        <p>{{ error }}</p>
      </div>

      <!-- Hamkorlar grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 mb-12 md:mb-16">
        <div
          v-for="partner in partners"
          :key="partner.id"
          class="group relative bg-neutral-50 border border-neutral-100 rounded-2xl p-5 sm:p-6
                 flex flex-col items-center justify-center gap-3 aspect-[4/3]
                 hover:-translate-y-1.5 hover:shadow-lg hover:border-secondary/30 hover:bg-secondary/5
                 transition-all duration-300 cursor-pointer"
        >
          <!-- Logo placeholder -->
          <div
            class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center
                   transition-all duration-300"
            :style="{ backgroundColor: partner.color + '18' }"
          >
            <span
              class="font-heading font-extrabold text-xl sm:text-2xl leading-none tracking-tight transition-colors duration-300"
              :style="{ color: partner.color }"
            >
              {{ partner.short }}
            </span>
          </div>

          <!-- Kompaniya nomi -->
          <p class="text-neutral-700 font-semibold text-xs sm:text-sm text-center leading-tight group-hover:text-secondary transition-colors duration-200">
            {{ partner.name }}
          </p>

          <!-- Soha -->
          <span class="text-neutral-400 text-xs text-center leading-tight">
            {{ partner.industry[$i18n.locale] || partner.industry.uz }}
          </span>

          <!-- Hover: yashil nuqta -->
          <div class="absolute top-3 right-3 w-2 h-2 rounded-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      <!-- Ajratuvchi chiziq + statistika -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 py-8 border-y border-neutral-100 mb-10 md:mb-12">
        <div v-for="stat in partnerStats" :key="stat.key" class="text-center">
          <p class="font-heading font-extrabold text-3xl sm:text-4xl text-neutral-900 leading-none mb-1">
            {{ stat.value }}
          </p>
          <p class="text-neutral-500 text-sm">
            {{ stat.label[$i18n.locale] || stat.label.uz }}
          </p>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center">
        <p class="text-neutral-500 text-sm sm:text-base mb-6 max-w-md mx-auto">
          {{ ctaDesc[$i18n.locale] || ctaDesc.uz }}
        </p>
        <RouterLink
          to="/contact"
          class="inline-flex items-center gap-2 bg-secondary text-white font-bold rounded-xl
                 px-7 sm:px-8 py-3.5 text-sm sm:text-base
                 hover:bg-secondary-dark active:scale-95
                 transition-all duration-200 shadow-lg shadow-secondary/25"
        >
          {{ ctaBtn[$i18n.locale] || ctaBtn.uz }}
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </RouterLink>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const partners = ref([])
const loading  = ref(true)
const error    = ref('')

// Logo yo'q bo'lganda rang palitrasidan tanlanadi
const colorPalette = ['#C8181E', '#2E8B3A', '#1A6BB5', '#7B4FCC', '#E07B18', '#0E9F9F', '#D4541A', '#3B5998']

function mapPartner(p, idx) {
  return {
    id:       p.id,
    name:     p.name,
    logo_url: p.logo_url || null,
    short:    p.name.slice(0, 2).toUpperCase(),
    color:    colorPalette[idx % colorPalette.length],
    industry: {
      uz: p.industry || '',
      ru: p.industry || '',
      en: p.industry || ''
    }
  }
}

onMounted(async () => {
  try {
    const { data } = await axios.get('/api/partners')
    partners.value = (data.data || []).map(mapPartner)
  } catch {
    error.value = 'Ma\'lumot yuklanmadi'
  } finally {
    loading.value = false
  }
})

const partnerStats = [
  { key: 'partners', value: '50+', label: { uz: 'Faol hamkor',       ru: 'Активных партнёров',    en: 'Active partners'    } },
  { key: 'regions',  value: '12',  label: { uz: 'Viloyat va shahar', ru: 'Регионов и городов',    en: 'Regions and cities' } },
  { key: 'countries',value: '5',   label: { uz: 'Davlatda eksport',  ru: 'Стран экспорта',        en: 'Export countries'   } }
]

const ctaDesc = {
  uz: 'Bizning hamkorlar tarmog\'iga qo\'shiling va o\'zaro foydali hamkorlikni boshlang.',
  ru: 'Присоединяйтесь к нашей партнёрской сети и начните взаимовыгодное сотрудничество.',
  en: 'Join our partner network and start a mutually beneficial cooperation.'
}

const ctaBtn = {
  uz: 'Hamkor bo\'lish',
  ru: 'Стать партнёром',
  en: 'Become a partner'
}
</script>
