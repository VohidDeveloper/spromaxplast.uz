<template>
  <section class="section-padding bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Sarlavha -->
      <div class="text-center mb-12 md:mb-16">
        <span class="inline-block text-secondary font-semibold text-sm uppercase tracking-widest mb-3">
          {{ $t('nav.about') }}
        </span>
        <h2 class="section-title mx-auto">{{ $t('about.title') }}</h2>
        <p class="section-subtitle mx-auto text-center">{{ $t('about.subtitle') }}</p>
      </div>

      <!-- Asosiy grid: chap matn + o'ng statistika -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

        <!-- ===== CHAP: Matn va qadriyatlar ===== -->
        <div>
          <p class="text-neutral-700 text-base sm:text-lg leading-relaxed mb-8">
            {{ $t('about.description') }}
          </p>

          <!-- Asosiy qadriyatlar -->
          <div class="flex flex-col gap-5">
            <div
              v-for="value in coreValues"
              :key="value.key"
              class="flex items-start gap-4 p-4 rounded-xl border border-neutral-100 hover:border-secondary/30 hover:bg-secondary/5 transition-colors duration-200"
            >
              <!-- Ikonka -->
              <div class="shrink-0 w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center">
                <component :is="value.icon" class="w-5 h-5 text-secondary" />
              </div>

              <div>
                <h4 class="font-heading font-bold text-neutral-900 text-base mb-1">
                  {{ value.label[$i18n.locale] || value.label.uz }}
                </h4>
                <p class="text-neutral-600 text-sm leading-relaxed">
                  {{ value.desc[$i18n.locale] || value.desc.uz }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== O'NG: Statistika kartochkalar ===== -->
        <div class="grid grid-cols-2 gap-4 sm:gap-5">
          <div
            v-for="stat in stats"
            :key="stat.key"
            :class="[
              'relative rounded-2xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden',
              stat.featured
                ? 'bg-secondary text-white col-span-2 sm:col-span-1'
                : 'bg-neutral-50 border border-neutral-100'
            ]"
          >
            <!-- Dekorativ doira -->
            <div
              :class="[
                'absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20',
                stat.featured ? 'bg-white' : 'bg-secondary'
              ]"
            />

            <!-- Ikonka -->
            <div
              :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center mb-4',
                stat.featured ? 'bg-white/20' : 'bg-secondary/10'
              ]"
            >
              <component
                :is="stat.icon"
                :class="['w-5 h-5', stat.featured ? 'text-white' : 'text-secondary']"
              />
            </div>

            <!-- Raqam -->
            <div>
              <p
                :class="[
                  'font-heading font-extrabold text-3xl sm:text-4xl leading-none mb-1',
                  stat.featured ? 'text-white' : 'text-neutral-900'
                ]"
              >
                {{ stat.value }}
              </p>
              <p
                :class="[
                  'text-sm font-medium',
                  stat.featured ? 'text-white/80' : 'text-neutral-600'
                ]"
              >
                {{ $t(`about.stats.${stat.key}`) }}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, h } from 'vue'
import axios from 'axios'

// Inline SVG ikonlar (o'zgarishsiz)
const ShieldIcon = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })] ) }
const StarIcon   = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' })] ) }
const LightIcon  = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' })] ) }
const ClockIcon  = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })] ) }
const BoxIcon    = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' })] ) }
const UserIcon   = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' })] ) }
const CertIcon   = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' })] ) }

// 2014 dan hozirgi yilgacha avtomatik hisoblash
const yearsActive = new Date().getFullYear() - 2014

// Static fallback qiymatlar
const stats = ref([
  { key: 'years',    value: '...',  icon: ClockIcon, featured: true  },
  { key: 'products', value: '...',  icon: BoxIcon,   featured: false },
  { key: 'clients',  value: '500+', icon: UserIcon,  featured: false },
  { key: 'certificates', value: '...', icon: CertIcon, featured: false }
])

onMounted(async () => {
  try {
    const [prodRes, partRes, certRes] = await Promise.all([
      axios.get('/api/products'),
      axios.get('/api/partners'),
      axios.get('/api/certificates')
    ])

    const productCount = prodRes.data.total ?? (prodRes.data.data?.length ?? 0)
    const partnerCount = partRes.data.data?.length ?? 0
    const certCount    = certRes.data.data?.length ?? 0

    stats.value = [
      { key: 'years',        value: `${yearsActive}+`, icon: ClockIcon, featured: true  },
      { key: 'products',     value: productCount > 0 ? `${productCount}+` : '50+', icon: BoxIcon,  featured: false },
      { key: 'clients',      value: partnerCount > 0 ? `${partnerCount}+` : '500+', icon: UserIcon, featured: false },
      { key: 'certificates', value: certCount    > 0 ? `${certCount}+`    : '4+',  icon: CertIcon, featured: false }
    ]
  } catch {
    // Xato bo'lsa static fallback
    stats.value = [
      { key: 'years',        value: `${yearsActive}+`, icon: ClockIcon, featured: true  },
      { key: 'products',     value: '50+',  icon: BoxIcon,   featured: false },
      { key: 'clients',      value: '500+', icon: UserIcon,  featured: false },
      { key: 'certificates', value: '4+',   icon: CertIcon,  featured: false }
    ]
  }
})

const coreValues = [
  {
    key: 'quality',
    icon: ShieldIcon,
    label: { uz: 'Sifat kafolati',  ru: 'Гарантия качества',  en: 'Quality Guarantee' },
    desc:  { uz: 'Har bir panel ishlab chiqarish jarayonida qat\'iy sifat nazoratidan o\'tkaziladi.', ru: 'Каждая панель проходит строгий контроль качества в процессе производства.', en: 'Every panel undergoes strict quality control during the production process.' }
  },
  {
    key: 'trust',
    icon: StarIcon,
    label: { uz: 'Ishonch va obro\'', ru: 'Доверие и репутация', en: 'Trust & Reputation' },
    desc:  { uz: '10 yildan ortiq tajriba va 500+ mamnun mijoz bizning eng yaxshi tavsifnomamiz.', ru: 'Более 10 лет опыта и 500+ довольных клиентов — наша лучшая рекомендация.', en: 'Over 10 years of experience and 500+ satisfied clients are our best recommendation.' }
  },
  {
    key: 'innovation',
    icon: LightIcon,
    label: { uz: 'Innovatsiya',      ru: 'Инновации',          en: 'Innovation' },
    desc:  { uz: 'Zamonaviy uskunalar va ilg\'or texnologiyalar yordamida ishlab chiqaramiz.', ru: 'Производим с использованием современного оборудования и передовых технологий.', en: 'We manufacture using modern equipment and advanced technologies.' }
  }
]
</script>
