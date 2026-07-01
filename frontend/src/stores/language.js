import { defineStore } from 'pinia'
import { ref } from 'vue'
import i18n from '@/plugins/i18n.js'

export const useLanguageStore = defineStore('language', () => {
  const current = ref(localStorage.getItem('locale') || 'uz')

  // ref() bilan — storeToRefs to'g'ri ishlashi uchun
  const languages = ref([
    { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ])

  function setLanguage(code) {
    current.value = code
    i18n.global.locale.value = code
    localStorage.setItem('locale', code)
    document.documentElement.lang = code
  }

  return { current, languages, setLanguage }
})
