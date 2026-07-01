import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useSettingsStore = defineStore('settings', () => {
  const logo_url            = ref('')
  const hero_image_url      = ref('')
  const meta_title          = ref('S PROMAX PLAST')
  const meta_description    = ref('')
  const contact_phone       = ref('')
  const contact_email       = ref('')
  const contact_address_uz  = ref('')
  const contact_address_ru  = ref('')
  const contact_address_en  = ref('')
  const social_telegram     = ref('')
  const social_instagram    = ref('')
  const social_youtube      = ref('')

  async function fetchSettings() {
    try {
      const { data } = await axios.get('/api/settings')
      const rows = data.data || []
      const get  = (key) => rows.find(r => r.key === key)

      const apply = (ref, key, field = 'value_uz') => {
        const row = get(key)
        if (row?.[field]) ref.value = row[field]
      }

      apply(logo_url,           'logo_url')
      apply(hero_image_url,     'hero_image_url')
      apply(meta_title,         'meta_title')
      apply(meta_description,   'meta_description')
      apply(contact_phone,      'contact_phone')
      apply(contact_email,      'contact_email')
      apply(contact_address_uz, 'contact_address_uz')
      apply(contact_address_ru, 'contact_address_ru')
      apply(contact_address_en, 'contact_address_en')
      apply(social_telegram,    'social_telegram')
      apply(social_instagram,   'social_instagram')
      apply(social_youtube,     'social_youtube')

      // meta_title uchun document.title yangilash
      if (meta_title.value) document.title = meta_title.value

      // meta description tag yangilash
      if (meta_description.value) {
        let tag = document.querySelector('meta[name="description"]')
        if (!tag) {
          tag = document.createElement('meta')
          tag.setAttribute('name', 'description')
          document.head.appendChild(tag)
        }
        tag.setAttribute('content', meta_description.value)
      }
    } catch {
      // Xatolikda default qiymatlar ishlaydi
    }
  }

  return {
    logo_url,
    hero_image_url,
    meta_title,
    meta_description,
    contact_phone,
    contact_email,
    contact_address_uz,
    contact_address_ru,
    contact_address_en,
    social_telegram,
    social_instagram,
    social_youtube,
    fetchSettings
  }
})
