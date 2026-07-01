<template>
  <section class="relative min-h-screen flex items-center overflow-hidden bg-neutral-900">

    <!-- Fon gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary via-[#8B1015] to-[#1a1a1a]" />

    <!-- Dekorativ doiralar (fon uchun) -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
    <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
    <div class="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />

    <!-- Kontent -->
    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        <!-- ===== CHAP: Matn va tugmalar ===== -->
        <div class="flex flex-col items-center text-center lg:items-start lg:text-left">

          <!-- Ustki badge -->
          <div
            class="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in"
          >
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span class="text-white/90 text-xs sm:text-sm font-medium tracking-wide">
              {{ $t('hero.badge') || "O'zbekiston ishlab chiqarishi" }}
            </span>
          </div>

          <!-- Asosiy sarlavha -->
          <h1
            class="font-heading font-extrabold text-white leading-tight tracking-tight mb-5
                   text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl
                   animate-slide-up"
          >
            {{ $t('hero.title') }}
          </h1>

          <!-- Tavsif -->
          <p
            class="text-white/75 leading-relaxed mb-8 max-w-lg
                   text-base sm:text-lg
                   animate-slide-up [animation-delay:150ms]"
          >
            {{ $t('hero.subtitle') }}
          </p>

          <!-- CTA tugmalar -->
          <div
            class="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto
                   animate-slide-up [animation-delay:300ms]"
          >
            <!-- Primary tugma -->
            <RouterLink
              to="/products"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2
                     bg-white text-primary font-bold rounded-xl
                     px-6 py-3.5 text-sm sm:text-base
                     hover:bg-neutral-100 active:scale-95
                     transition-all duration-200 shadow-lg shadow-black/20"
            >
              {{ $t('hero.cta_primary') }}
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </RouterLink>

            <!-- Outline tugma -->
            <RouterLink
              to="/contact"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2
                     border-2 border-white/60 text-white font-bold rounded-xl
                     px-6 py-3.5 text-sm sm:text-base
                     hover:bg-white/10 hover:border-white active:scale-95
                     transition-all duration-200"
            >
              {{ $t('hero.cta_secondary') }}
            </RouterLink>
          </div>

          <!-- Statistika raqamlar -->
          <div
            class="grid grid-cols-3 gap-4 sm:gap-6 mt-10 pt-8 border-t border-white/20 w-full
                   animate-slide-up [animation-delay:450ms]"
          >
            <div v-for="(stat, i) in stats" :key="i" class="text-center lg:text-left">
              <p class="text-white font-heading font-extrabold text-2xl sm:text-3xl">
                {{ stat.value }}
              </p>
              <p class="text-white/60 text-xs sm:text-sm mt-1">
                {{ stat.label }}
              </p>
            </div>
          </div>
        </div>

        <!-- ===== O'NG: Rasm placeholder ===== -->
        <div class="flex justify-center lg:justify-end animate-slide-up [animation-delay:200ms]">
          <div class="relative w-full max-w-sm sm:max-w-md lg:max-w-full">

            <!-- Asosiy karta -->
            <div
              class="relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-[3/2]
                     shadow-2xl shadow-black/40"
              style="background: rgba(0,0,0,0.3); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2)"
            >
              <!-- Hero rasm (settings dan) -->
              <img
                v-if="hero_image_url"
                :src="hero_image_url"
                alt="S PROMAX PLAST"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <!-- Fon dekorativ doiralar -->
              <div class="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
              <div class="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/20 blur-2xl" />

              <!-- Markaziy kontent -->
              <div class="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6">

                <!-- Logo blok -->
                <div class="flex items-center justify-center gap-3">
                  <div class="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-lg">
                    <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>S
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="font-heading font-extrabold text-white text-xl leading-tight tracking-wide">
                      S PROMAX PLAST
                    </p>
                    <p class="font-heading font-bold text-white/70 text-sm tracking-widest">
                      Premium
                    </p>
                  </div>
                </div>

                <!-- Ajratuvchi chiziq -->
                <div class="w-16 h-px bg-white/30" />

                <!-- Tavsif -->
                <div class="text-center space-y-1">
                  <p class="text-white font-semibold text-base sm:text-lg">Ishlab chiqarish zavodi</p>
                  <p class="text-white/55 text-xs sm:text-sm">PVC Dekorativ Panellar</p>
                </div>

                <!-- Tag qatorlar -->
                <div class="flex flex-wrap justify-center gap-2 mt-1">
                  <span class="text-xs bg-white/10 border border-white/15 text-white/80 px-3 py-1 rounded-full">
                    ISO 9001
                  </span>
                  <span class="text-xs bg-white/10 border border-white/15 text-white/80 px-3 py-1 rounded-full">
                    O'zbekiston
                  </span>
                  <span class="text-xs bg-white/10 border border-white/15 text-white/80 px-3 py-1 rounded-full">
                    2014 yildan
                  </span>
                </div>
              </div>

              <!-- Pastki chiziq -->
              <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>

            <!-- Suzuvchi badge (yuqori o'ng) -->
            <div class="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 bg-secondary text-white rounded-2xl px-4 py-3 shadow-xl">
              <p class="font-heading font-bold text-xl sm:text-2xl leading-none">10+</p>
              <p class="text-white/80 text-xs mt-0.5">{{ $t('about.stats.years') }}</p>
            </div>

            <!-- Suzuvchi badge (pastki chap) -->
            <div class="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-white rounded-2xl px-4 py-3 shadow-xl">
              <p class="font-heading font-bold text-xl sm:text-2xl text-primary leading-none">500+</p>
              <p class="text-neutral-600 text-xs mt-0.5">{{ $t('about.stats.clients') }}</p>
            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- Pastga siljish belgisi -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
      <span class="text-white/50 text-xs">Scroll</span>
      <svg class="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
      </svg>
    </div>

  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useLanguageStore } from '@/stores/language.js'
import { useSettingsStore } from '@/stores/settings.js'
import axios from 'axios'

const { mergeLocaleMessage } = useI18n()
const { current } = storeToRefs(useLanguageStore())
const { hero_image_url } = storeToRefs(useSettingsStore())
const loading = ref(true)

// Settingsdan kelgan xom qiymatlar
const rawStats = ref([
  { number: { uz: '10+',  ru: '10+',  en: '10+'  }, label: { uz: 'Yillik tajriba', ru: 'Лет опыта',       en: 'Years experience' } },
  { number: { uz: '50+',  ru: '50+',  en: '50+'  }, label: { uz: 'Mahsulot turi',  ru: 'Видов продукции', en: 'Product types'    } },
  { number: { uz: '500+', ru: '500+', en: '500+' }, label: { uz: 'Mijozlar',       ru: 'Клиентов',        en: 'Clients'          } }
])

// Joriy tilga qarab stats — til o'zgarganda avtomatik yangilanadi
const stats = computed(() =>
  rawStats.value.map(s => ({
    value: s.number[current.value] || s.number.uz,
    label: s.label[current.value]  || s.label.uz
  }))
)

onMounted(async () => {
  try {
    const { data } = await axios.get('/api/settings')
    const rows = data.data || []
    const find = (key) => rows.find(r => r.key === key)

    // Hero title va subtitle — i18n ga yozamiz
    const title    = find('hero_title')
    const subtitle = find('hero_subtitle')
    if (title) {
      mergeLocaleMessage('uz', { hero: { title: title.value_uz } })
      mergeLocaleMessage('ru', { hero: { title: title.value_ru } })
      mergeLocaleMessage('en', { hero: { title: title.value_en } })
    }
    if (subtitle) {
      mergeLocaleMessage('uz', { hero: { subtitle: subtitle.value_uz } })
      mergeLocaleMessage('ru', { hero: { subtitle: subtitle.value_ru } })
      mergeLocaleMessage('en', { hero: { subtitle: subtitle.value_en } })
    }

    // Statistika raqamlarini settingsdan olamiz
    const s1n = find('hero_stat1_number')
    const s1l = find('hero_stat1_label')
    const s2n = find('hero_stat2_number')
    const s2l = find('hero_stat2_label')
    const s3n = find('hero_stat3_number')
    const s3l = find('hero_stat3_label')

    if (s1n && s1l && s2n && s2l && s3n && s3l) {
      rawStats.value = [
        { number: { uz: s1n.value_uz, ru: s1n.value_ru, en: s1n.value_en },
          label:  { uz: s1l.value_uz, ru: s1l.value_ru, en: s1l.value_en } },
        { number: { uz: s2n.value_uz, ru: s2n.value_ru, en: s2n.value_en },
          label:  { uz: s2l.value_uz, ru: s2l.value_ru, en: s2l.value_en } },
        { number: { uz: s3n.value_uz, ru: s3n.value_ru, en: s3n.value_en },
          label:  { uz: s3l.value_uz, ru: s3l.value_ru, en: s3l.value_en } }
      ]
    }
  } catch {
    // Fallback: rawStats dagi statik qiymatlar ishlaydi
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out both;
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
