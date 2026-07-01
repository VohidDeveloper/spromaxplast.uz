import { createI18n } from 'vue-i18n'
import uz from '@/locales/uz.json'
import ru from '@/locales/ru.json'
import en from '@/locales/en.json'

// Brauzer tilini aniqlab, standart til tanlash
const savedLocale = localStorage.getItem('locale')
const browserLocale = navigator.language.slice(0, 2)
const supportedLocales = ['uz', 'ru', 'en']
const defaultLocale = supportedLocales.includes(savedLocale)
  ? savedLocale
  : supportedLocales.includes(browserLocale)
    ? browserLocale
    : 'uz'

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'uz',
  messages: { uz, ru, en }
})

export default i18n
