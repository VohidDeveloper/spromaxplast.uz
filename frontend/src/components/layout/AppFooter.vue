<template>
  <footer class="bg-neutral-900 text-white">

    <!-- Asosiy footer qismi -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

        <!-- 1. Logo va tavsif -->
        <div class="sm:col-span-2 lg:col-span-1">
          <RouterLink to="/" class="flex items-center gap-3 mb-4">
            <img
              v-if="logoSrc"
              :src="logoSrc"
              alt="S PROMAX PLAST"
              class="h-8 w-auto object-contain max-h-10"
            />
            <div v-else class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <span class="text-white font-heading font-extrabold text-base">SP</span>
            </div>
          </RouterLink>
          <p class="text-neutral-400 text-sm leading-relaxed max-w-xs">
            {{ $t('about.description') }}
          </p>

          <!-- Ijtimoiy tarmoqlar -->
          <div class="flex items-center gap-3 mt-6">
            <a
              v-for="social in socials"
              :key="social.name"
              :href="social.href"
              :aria-label="social.name"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-neutral-400 hover:bg-primary hover:text-white transition-colors duration-200"
            >
              <component :is="social.icon" class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- 2. Tezkor havolalar -->
        <div>
          <h4 class="font-heading font-bold text-white text-sm uppercase tracking-wider mb-5">
            {{ $t('nav.home') === 'Bosh sahifa' ? 'Havolalar' : 'Ссылки' }}
          </h4>
          <ul class="flex flex-col gap-3">
            <li v-for="item in navItems" :key="item.key">
              <RouterLink
                :to="item.path"
                class="text-neutral-400 text-sm hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
              >
                <span class="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                {{ $t(`nav.${item.key}`) }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- 3. Mahsulotlar -->
        <div>
          <h4 class="font-heading font-bold text-white text-sm uppercase tracking-wider mb-5">
            {{ $t('nav.products') }}
          </h4>
          <ul class="flex flex-col gap-3">
            <li v-for="product in productLinks" :key="product.key">
              <RouterLink
                to="/products"
                class="text-neutral-400 text-sm hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
              >
                <span class="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                {{ product.label[$i18n.locale] || product.label.uz }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- 4. Kontakt ma'lumotlari -->
        <div>
          <h4 class="font-heading font-bold text-white text-sm uppercase tracking-wider mb-5">
            {{ $t('nav.contact') }}
          </h4>
          <ul class="flex flex-col gap-4">
            <li class="flex items-start gap-3">
              <!-- Joylashuv -->
              <svg class="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span class="text-neutral-400 text-sm leading-relaxed">
                Qashqadaryo viloyati, Ko'kdala tumani, Toshli mahalla
              </span>
            </li>
            <li class="flex items-center gap-3">
              <!-- Telefon -->
              <svg class="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <a href="tel:+998700331515" class="text-neutral-400 text-sm hover:text-primary transition-colors">
                +998 70 033 15 15 <br> +998 99 416 41 12
              </a>
            </li>
            <li class="flex items-center gap-3">
              <!-- Email -->
              <svg class="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <a href="mailto:info@sproplast.uz" class="text-neutral-400 text-sm hover:text-primary transition-colors">
                spromaxplast@gmail.com
              </a>
            </li>
          </ul>
        </div>

      </div>
    </div>

    <!-- Pastki chiziq -->
    <div class="border-t border-white/10">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-neutral-500 text-xs text-center sm:text-left">
          © {{ currentYear }} S PROMAX PLAST. {{ $t('footer.rights') }}.
        </p>
        <p class="text-neutral-500 text-xs flex items-center gap-1">
          🇺🇿 {{ $t('footer.made_in') }}
        </p>
      </div>
    </div>

  </footer>
</template>

<script setup>
import { computed, h } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings.js'

const { logo_url, social_telegram, social_instagram, social_youtube } = storeToRefs(useSettingsStore())

const logoSrc = computed(() => logo_url.value ? 'http://localhost:3000' + logo_url.value : null)

const currentYear = computed(() => new Date().getFullYear())

const navItems = [
  { key: 'home',     path: '/' },
  { key: 'products', path: '/products' },
  { key: 'about',    path: '/about' },
  { key: 'contact',  path: '/contact' }
]

const productLinks = [
  { key: 'wall',    label: { uz: 'Devoriy panellar', ru: 'Настенные панели',   en: 'Wall Panels' } },
  { key: 'ceiling', label: { uz: 'Shift panellari',  ru: 'Потолочные панели',  en: 'Ceiling Panels' } },
  { key: 'facade',  label: { uz: 'Fasad panellari',  ru: 'Фасадные панели',    en: 'Facade Panels' } }
]

// Inline SVG ikonlar (tashqi kutubxonasiz)
const TelegramIcon = {
  render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { d: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z' })
  ])
}

const InstagramIcon = {
  render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z' })
  ])
}

const YoutubeIcon = {
  render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' })
  ])
}

const socials = computed(() => [
  { name: 'Telegram',  href: social_telegram.value,  icon: TelegramIcon  },
  { name: 'Instagram', href: social_instagram.value, icon: InstagramIcon },
  { name: 'YouTube',   href: social_youtube.value,   icon: YoutubeIcon   }
].filter(s => s.href))
</script>
