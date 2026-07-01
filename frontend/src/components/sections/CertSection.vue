<template>
  <section class="section-padding bg-[#0f0f0f] relative overflow-hidden">

    <!-- Fon dekoratsiya -->
    <div class="absolute inset-0 opacity-30">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-[#F5A623]/10 rounded-full blur-3xl" />
      <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
    </div>

    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Sarlavha -->
      <div class="text-center mb-12 md:mb-16">
        <span class="inline-block text-[#F5A623] font-semibold text-sm uppercase tracking-widest mb-3">
          {{ $t('nav.certificates') }}
        </span>
        <h2 class="font-heading font-extrabold text-white text-3xl sm:text-4xl md:text-5xl mb-4">
          {{ $t('certificates.title') }}
        </h2>
        <p class="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto">
          {{ $t('certificates.subtitle') }}
        </p>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-12 md:mb-16">
        <div v-for="i in 4" :key="i"
          class="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
          <div class="w-16 h-16 rounded-2xl bg-white/10 mx-auto sm:mx-0 mb-5" />
          <div class="h-5 bg-white/10 rounded w-3/4 mb-2" />
          <div class="h-3 bg-white/10 rounded w-1/2 mb-4" />
          <div class="h-3 bg-white/10 rounded w-full mb-2" />
          <div class="h-3 bg-white/10 rounded w-5/6" />
        </div>
      </div>

      <!-- Xato -->
      <div v-else-if="error" class="text-center py-10 text-neutral-400 mb-12">
        <p>{{ error }}</p>
      </div>

      <!-- Sertifikatlar grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-12 md:mb-16">
        <div
          v-for="cert in certs"
          :key="cert.id"
          class="group relative bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col
                 hover:bg-white/10 hover:border-[#F5A623]/40
                 transition-all duration-300 cursor-pointer"
        >
          <!-- Oltin uchburchak aksent (yuqori o'ng) -->
          <div class="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
            <div class="absolute top-0 right-0 w-0 h-0
                        border-l-[64px] border-l-transparent
                        border-t-[64px] border-t-[#F5A623]/20
                        group-hover:border-t-[#F5A623]/40
                        transition-colors duration-300" />
          </div>

          <!-- Sertifikat logo placeholder -->
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/20
                      flex items-center justify-center mb-5 mx-auto sm:mx-0
                      group-hover:bg-[#F5A623]/15 group-hover:border-[#F5A623]/30
                      transition-all duration-300">
            <span class="font-heading font-extrabold text-[#F5A623] text-xl sm:text-2xl leading-none tracking-tight">
              {{ cert.short }}
            </span>
          </div>

          <!-- Nom -->
          <h3 class="font-heading font-bold text-white text-lg sm:text-xl mb-1 text-center sm:text-left">
            {{ cert.name }}
          </h3>

          <!-- Standart kodi -->
          <p class="text-[#F5A623] text-xs font-semibold uppercase tracking-widest mb-3 text-center sm:text-left">
            {{ cert.code }}
          </p>

          <!-- Tavsif -->
          <p class="text-neutral-400 text-sm leading-relaxed flex-1 mb-5 text-center sm:text-left">
            {{ cert.desc[$i18n.locale] || cert.desc.uz }}
          </p>

          <!-- Amal qilish muddati -->
          <div class="flex items-center gap-2 mb-4 justify-center sm:justify-start">
            <svg class="w-3.5 h-3.5 text-[#F5A623]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="text-neutral-500 text-xs">{{ cert.valid[$i18n.locale] || cert.valid.uz }}</span>
          </div>

          <!-- Yuklab olish tugmasi -->
          <a
            v-if="cert.file_url"
            :href="cert.file_url"
            target="_blank"
            download
            class="w-full flex items-center justify-center gap-2
                   border border-white/20 text-white/70 text-sm font-semibold rounded-xl py-2.5
                   hover:border-[#F5A623] hover:text-[#F5A623]
                   group-hover:border-[#F5A623]/60 group-hover:text-[#F5A623]
                   transition-all duration-200"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            {{ downloadLabel[$i18n.locale] || downloadLabel.uz }}
          </a>
          <button
            v-else
            disabled
            class="w-full flex items-center justify-center gap-2
                   border border-white/20 text-white/70 text-sm font-semibold rounded-xl py-2.5
                   opacity-40 cursor-not-allowed"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            {{ downloadLabel[$i18n.locale] || downloadLabel.uz }}
          </button>
        </div>
      </div>

      <!-- Ishonch ko'rsatkichlari -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 md:mb-16 py-8 border-y border-white/10">
        <div
          v-for="trust in trustStats"
          :key="trust.key"
          class="text-center"
        >
          <p class="font-heading font-extrabold text-[#F5A623] text-2xl sm:text-3xl xl:text-4xl mb-1">
            {{ trust.value }}
          </p>
          <p class="text-neutral-500 text-xs sm:text-sm">
            {{ trust.label[$i18n.locale] || trust.label.uz }}
          </p>
        </div>
      </div>

      <!-- Pastki CTA -->
      <div class="text-center">
        <p class="text-neutral-400 text-sm sm:text-base mb-6">
          {{ ctaText[$i18n.locale] || ctaText.uz }}
        </p>
        <RouterLink
          to="/contact"
          class="inline-flex items-center gap-2 bg-[#F5A623] text-[#0f0f0f] font-bold rounded-xl
                 px-7 sm:px-8 py-3.5 text-sm sm:text-base
                 hover:bg-[#e09520] active:scale-95
                 transition-all duration-200 shadow-lg shadow-[#F5A623]/25"
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

const certs   = ref([])
const loading = ref(true)
const error   = ref('')

function formatValid(dateStr) {
  if (!dateStr) return { uz: '—', ru: '—', en: '—' }
  const year = new Date(dateStr).getFullYear()
  return {
    uz: `Amal muddati: ${year} yilgacha`,
    ru: `Действителен до: ${year} года`,
    en: `Valid until: ${year}`
  }
}

function mapCert(c) {
  return {
    id:       c.id,
    short:    (c.code || c.name).slice(0, 4).toUpperCase(),
    name:     c.name,
    code:     c.code,
    file_url: c.file_url || null,
    desc: {
      uz: c.issued_by ? `${c.issued_by} tomonidan berilgan sertifikat.` : c.name,
      ru: c.issued_by ? `Сертификат выдан организацией ${c.issued_by}.` : c.name,
      en: c.issued_by ? `Certificate issued by ${c.issued_by}.` : c.name
    },
    valid: formatValid(c.valid_until)
  }
}

onMounted(async () => {
  try {
    const { data } = await axios.get('/api/certificates')
    certs.value = (data.data || []).map(mapCert)
  } catch {
    error.value = 'Ma\'lumot yuklanmadi'
  } finally {
    loading.value = false
  }
})

const downloadLabel = { uz: 'Yuklab olish',           ru: 'Скачать',               en: 'Download'              }
const ctaText       = { uz: 'Mahsulotlarimiz sifati haqida batafsil ma\'lumot olishni xohlaysizmi?', ru: 'Хотите узнать больше о качестве нашей продукции?', en: 'Want to learn more about the quality of our products?' }
const ctaBtn        = { uz: 'Sifatimiz haqida ko\'proq', ru: 'Подробнее о качестве', en: 'Learn more about quality' }

const trustStats = [
  { key: 'certs',   value: '4+',  label: { uz: 'Xalqaro sertifikat', ru: 'Международных сертификатов', en: 'International certificates' } },
  { key: 'years',   value: '10+', label: { uz: 'Yillik tajriba',     ru: 'Лет опыта',                  en: 'Years of experience'        } },
  { key: 'tests',   value: '12',  label: { uz: 'Sifat tekshiruvi',   ru: 'Проверок качества',          en: 'Quality checks'             } },
  { key: 'markets', value: '5+',  label: { uz: 'Bozor (davlat)',     ru: 'Рынков (стран)',              en: 'Markets (countries)'        } }
]
</script>
