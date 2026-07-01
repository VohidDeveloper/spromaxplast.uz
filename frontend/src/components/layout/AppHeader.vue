<template>
  <!-- Sticky header: scroll qilganda soya paydo bo'ladi -->
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300',
      scrolled ? 'shadow-md' : 'shadow-none'
    ]"
  >
    <!-- Yuqori qizil chiziq -->
    <div class="h-1 bg-primary w-full" />

    <!-- Asosiy header qatori -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 md:h-20">

        <!-- ===== LOGO ===== -->
        <RouterLink to="/" class="flex items-center gap-2 sm:gap-3 shrink-0">
          <!-- Logo rasmi yoki fallback belgi -->
          <div class="shrink-0">
            <img
              v-if="logoSrc"
              :src="logoSrc"
              alt="S PROMAX PLAST logo"
              class="h-8 w-auto object-contain max-h-10"
            />
            <div v-else class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary flex items-center justify-center">
              <span class="text-white font-heading font-extrabold text-base sm:text-lg leading-none">SP</span>
            </div>
          </div>

        </RouterLink>

        <!-- ===== DESKTOP NAVIGATSIYA ===== -->
        <nav class="hidden lg:flex items-center gap-1 xl:gap-2">
          <RouterLink
            v-for="item in navItems"
            :key="item.key"
            :to="item.path"
            class="relative px-4 py-2 text-sm font-semibold text-neutral-700 rounded-lg transition-colors duration-200 hover:text-primary hover:bg-primary/5 group"
            active-class="!text-primary"
          >
            {{ $t(`nav.${item.key}`) }}
            <!-- Aktiv holat pastki chiziq -->
            <span
              class="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-200 w-0 group-[.router-link-active]:w-2/3"
            />
          </RouterLink>
        </nav>

        <!-- ===== O'NG TOMON: TIL + HAMBURGER ===== -->
        <div class="flex items-center gap-2 sm:gap-3">

          <!-- Til almashtirish dropdown -->
          <div class="relative" ref="langDropdownRef">
            <button
              @click="langOpen = !langOpen"
              class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 hover:border-primary hover:text-primary transition-colors duration-200"
              aria-haspopup="true"
              :aria-expanded="langOpen"
            >
              <span class="text-base leading-none">{{ currentLang.flag }}</span>
              <span class="hidden sm:inline">{{ currentLang.code.toUpperCase() }}</span>
              <!-- Chevron icon -->
              <svg
                class="w-3.5 h-3.5 transition-transform duration-200"
                :class="langOpen ? 'rotate-180' : ''"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Dropdown menyu -->
            <Transition name="dropdown">
              <div
                v-if="langOpen"
                class="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-neutral-100 py-1.5 min-w-[140px] overflow-hidden"
                role="menu"
              >
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  @click="selectLang(lang.code)"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-primary/5"
                  :class="lang.code === current ? 'text-primary bg-primary/5' : 'text-neutral-700'"
                  role="menuitem"
                >
                  <span class="text-base">{{ lang.flag }}</span>
                  <span>{{ lang.label }}</span>
                  <!-- Aktiv belgisi -->
                  <svg v-if="lang.code === current" class="w-4 h-4 ml-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </button>
              </div>
            </Transition>
          </div>

          <!-- Mobil hamburger tugma (faqat lg dan kichik ekranlarda) -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden p-2 rounded-lg text-neutral-700 hover:bg-primary/5 hover:text-primary transition-colors duration-200"
            :aria-label="mobileMenuOpen ? 'Menyuni yopish' : 'Menyuni ochish'"
            :aria-expanded="mobileMenuOpen"
          >
            <Transition name="icon-swap" mode="out-in">
              <!-- Hamburger icon -->
              <svg v-if="!mobileMenuOpen" key="open" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <!-- X icon -->
              <svg v-else key="close" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </Transition>
          </button>

        </div>
      </div>
    </div>

    <!-- ===== MOBIL MENU (faqat lg dan kichik) ===== -->
    <Transition name="mobile-menu">
      <div
        v-if="mobileMenuOpen"
        class="lg:hidden bg-white border-t border-neutral-100 shadow-lg"
      >
        <nav class="container mx-auto px-4 sm:px-6 py-3 flex flex-col gap-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.key"
            :to="item.path"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-neutral-700 hover:text-primary hover:bg-primary/5 transition-colors duration-200"
            active-class="!text-primary bg-primary/5"
          >
            <!-- Nav item icon -->
            <span class="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
            {{ $t(`nav.${item.key}`) }}
          </RouterLink>

          <!-- Mobil til almashtirish -->
          <div class="flex items-center gap-2 px-4 pt-3 mt-2 border-t border-neutral-100">
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="selectLang(lang.code)"
              :class="[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-150',
                lang.code === current
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-primary/10 hover:text-primary'
              ]"
            >
              <span>{{ lang.flag }}</span>
              <span>{{ lang.code.toUpperCase() }}</span>
            </button>
          </div>
        </nav>
      </div>
    </Transition>
  </header>

  <!-- Header balandligiga teng bo'shliq (fixed header uchun) -->
  <div class="h-[65px] md:h-[85px]" aria-hidden="true" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useLanguageStore } from '@/stores/language.js'
import { useSettingsStore } from '@/stores/settings.js'

const langStore = useLanguageStore()
const { current, languages } = storeToRefs(langStore)

const { logo_url: logoSrc } = storeToRefs(useSettingsStore())

const scrolled        = ref(false)
const langOpen        = ref(false)
const mobileMenuOpen  = ref(false)
const langDropdownRef = ref(null)

const navItems = [
  { key: 'home',     path: '/' },
  { key: 'products', path: '/products' },
  { key: 'news',     path: '/news' },
  { key: 'about',    path: '/about' },
  { key: 'contact',  path: '/contact' }
]

const currentLang = computed(
  () => languages.value.find(l => l.code === current.value) ?? languages.value[0]
)

function selectLang(code) {
  langStore.setLanguage(code)
  langOpen.value = false
}

function onScroll() {
  scrolled.value = window.scrollY > 10
}

// Dropdown tashqarisiga bosilganda yopilsin
function onClickOutside(e) {
  if (langDropdownRef.value && !langDropdownRef.value.contains(e.target)) {
    langOpen.value = false
  }
}

// Katta ekranga o'tganda mobil menyuni yopish
function onResize() {
  if (window.innerWidth >= 1024) mobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onClickOutside)
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onClickOutside)
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
/* Til dropdown animatsiyasi */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Mobil menu slayd animatsiyasi */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Hamburger ↔ X icon almashtirish */
.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.icon-swap-enter-from,
.icon-swap-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}
</style>
