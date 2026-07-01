<template>
  <div class="space-y-6">

    <!-- Sarlavha -->
    <div>
      <h2 class="font-heading text-2xl font-bold text-gray-800">Sozlamalar</h2>
      <p class="text-gray-500 text-sm mt-1">Sayt uchun umumiy sozlamalar</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
      <div v-for="i in 6" :key="i" class="space-y-2">
        <div class="h-3 w-20 bg-gray-200 rounded animate-pulse" />
        <div class="h-10 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>

    <!-- Form -->
    <div v-else class="space-y-6">

      <!-- ── Hero Sarlavha ── -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Hero — Sarlavha</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">O'zbek</label>
            <input
              v-model="form.hero_title.uz"
              type="text"
              class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none
                     focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Русский</label>
            <input
              v-model="form.hero_title.ru"
              type="text"
              class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none
                     focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">English</label>
            <input
              v-model="form.hero_title.en"
              type="text"
              class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none
                     focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <!-- ── Hero Tavsif ── -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Hero — Tavsif</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">O'zbek</label>
            <textarea
              v-model="form.hero_subtitle.uz"
              rows="3"
              class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 resize-none focus:border-indigo-500 focus:outline-none
                     focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Русский</label>
            <textarea
              v-model="form.hero_subtitle.ru"
              rows="3"
              class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 resize-none focus:border-indigo-500 focus:outline-none
                     focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">English</label>
            <textarea
              v-model="form.hero_subtitle.en"
              rows="3"
              class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 resize-none focus:border-indigo-500 focus:outline-none
                     focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <!-- ── Hero Statistika ── -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Hero — Statistika</h3>
        <div class="space-y-5">
          <div
            v-for="(stat, i) in form.stats"
            :key="i"
            class="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4"
          >
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ i + 1 }}-raqam</p>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Raqam (masalan: 10+)</label>
              <input
                v-model="stat.number"
                type="text"
                placeholder="10+"
                class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                       text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1
                       focus:ring-indigo-500"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Label — O'zbek</label>
                <input
                  v-model="stat.label_uz"
                  type="text"
                  class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                         text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1
                         focus:ring-indigo-500"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Label — Русский</label>
                <input
                  v-model="stat.label_ru"
                  type="text"
                  class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                         text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1
                         focus:ring-indigo-500"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Label — English</label>
                <input
                  v-model="stat.label_en"
                  type="text"
                  class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                         text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1
                         focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Logo ── -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Logo</h3>
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
            <img v-if="logoPreview" :src="logoPreview" alt="Logo" class="w-full h-full object-contain" />
            <span v-else class="text-2xl font-extrabold text-gray-300">SP</span>
          </div>
          <div>
            <input ref="logoInputRef" type="file" accept="image/*" class="hidden" @change="uploadLogo" />
            <button
              @click="logoInputRef.click()"
              :disabled="logoUploading"
              class="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white
                     px-4 py-2 text-sm font-semibold text-gray-700 hover:border-indigo-500
                     hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="logoUploading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              {{ logoUploading ? 'Yuklanmoqda...' : 'Logo yuklash' }}
            </button>
            <p v-if="logoPreview" class="text-xs text-gray-400 mt-2 break-all max-w-xs">{{ logoPreview }}</p>
          </div>
        </div>
      </div>

      <!-- ── Hero Rasmi ── -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Hero — Rasm</h3>
        <div class="flex items-start gap-6">
          <div class="w-32 h-24 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
            <img v-if="heroImgPreview" :src="heroImgPreview" alt="Hero rasm" class="w-full h-full object-cover" />
            <svg v-else class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <input ref="heroImgInputRef" type="file" accept="image/*" class="hidden" @change="uploadHeroImg" />
            <button
              @click="heroImgInputRef.click()"
              :disabled="heroImgUploading"
              class="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white
                     px-4 py-2 text-sm font-semibold text-gray-700 hover:border-indigo-500
                     hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="heroImgUploading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              {{ heroImgUploading ? 'Yuklanmoqda...' : 'Rasm yuklash' }}
            </button>
            <p v-if="heroImgPreview" class="text-xs text-gray-400 mt-2 break-all max-w-xs">{{ heroImgPreview }}</p>
          </div>
        </div>
      </div>

      <!-- ── SEO ── -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">SEO</h3>
        <div class="space-y-6">
          <div>
            <p class="text-sm font-semibold text-gray-700 mb-3">Meta sarlavha</p>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">O'zbek</label>
                <input v-model="form.seo.meta_title.uz" type="text"
                  class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                         text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">Русский</label>
                <input v-model="form.seo.meta_title.ru" type="text"
                  class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                         text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">English</label>
                <input v-model="form.seo.meta_title.en" type="text"
                  class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                         text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
            </div>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-700 mb-3">Meta tavsif</p>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">O'zbek</label>
                <textarea v-model="form.seo.meta_description.uz" rows="2"
                  class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                         text-gray-900 resize-none focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">Русский</label>
                <textarea v-model="form.seo.meta_description.ru" rows="2"
                  class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                         text-gray-900 resize-none focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">English</label>
                <textarea v-model="form.seo.meta_description.en" rows="2"
                  class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                         text-gray-900 resize-none focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Xabarlar -->
      <div v-if="successMsg"
        class="flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ successMsg }}
      </div>
      <div v-if="errorMsg"
        class="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        {{ errorMsg }}
      </div>

      <!-- Saqlash -->
      <div class="flex justify-end">
        <button
          @click="saveAll"
          :disabled="saving"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600
                 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700
                 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed min-w-[140px]
                 transition-colors"
        >
          <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          {{ saving ? 'Saqlanmoqda...' : 'Saqlash' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const loading    = ref(true)
const saving     = ref(false)
const successMsg = ref('')
const errorMsg   = ref('')

const logoPreview      = ref('')
const heroImgPreview   = ref('')
const logoUploading    = ref(false)
const heroImgUploading = ref(false)
const logoInputRef     = ref(null)
const heroImgInputRef  = ref(null)

const form = ref({
  hero_title:    { uz: '', ru: '', en: '' },
  hero_subtitle: { uz: '', ru: '', en: '' },
  seo: {
    meta_title:       { uz: '', ru: '', en: '' },
    meta_description: { uz: '', ru: '', en: '' }
  },
  stats: [
    { number: '10+',  label_uz: 'Yillik tajriba', label_ru: 'Лет опыта',       label_en: 'Years experience' },
    { number: '50+',  label_uz: 'Mahsulot turi',  label_ru: 'Видов продукции', label_en: 'Product types'    },
    { number: '500+', label_uz: 'Mijozlar',        label_ru: 'Клиентов',        label_en: 'Clients'          }
  ]
})

onMounted(async () => {
  try {
    const res = await axios.get('/settings')
    console.log('[Settings] response:', res.data)

    const rows = res.data?.data || []
    const find = (key) => rows.find(r => r.key === key)

    const title    = find('hero_title')
    const subtitle = find('hero_subtitle')
    if (title)    form.value.hero_title    = { uz: title.value_uz    || '', ru: title.value_ru    || '', en: title.value_en    || '' }
    if (subtitle) form.value.hero_subtitle = { uz: subtitle.value_uz || '', ru: subtitle.value_ru || '', en: subtitle.value_en || '' }

    const logoRow    = find('logo_url')
    const heroImgRow = find('hero_image_url')
    const metaTitle  = find('meta_title')
    const metaDesc   = find('meta_description')

    if (logoRow?.value_uz)    logoPreview.value    = logoRow.value_uz
    if (heroImgRow?.value_uz) heroImgPreview.value = heroImgRow.value_uz
    if (metaTitle) form.value.seo.meta_title       = { uz: metaTitle.value_uz || '', ru: metaTitle.value_ru || '', en: metaTitle.value_en || '' }
    if (metaDesc)  form.value.seo.meta_description = { uz: metaDesc.value_uz  || '', ru: metaDesc.value_ru  || '', en: metaDesc.value_en  || '' }

    for (let i = 1; i <= 3; i++) {
      const num   = find(`hero_stat${i}_number`)
      const label = find(`hero_stat${i}_label`)
      if (num)   form.value.stats[i - 1].number   = num.value_uz || ''
      if (label) {
        form.value.stats[i - 1].label_uz = label.value_uz || ''
        form.value.stats[i - 1].label_ru = label.value_ru || ''
        form.value.stats[i - 1].label_en = label.value_en || ''
      }
    }
  } catch (err) {
    console.error('[Settings] xato:', err?.response?.status, err?.response?.data || err?.message)
    errorMsg.value = `Sozlamalar yuklanmadi (${err?.response?.status || err?.message || 'network error'})`
  } finally {
    loading.value = false
  }
})

async function saveAll() {
  saving.value     = true
  successMsg.value = ''
  errorMsg.value   = ''

  try {
    const puts = [
      axios.put('/settings/hero_title',    { value_uz: form.value.hero_title.uz,    value_ru: form.value.hero_title.ru,    value_en: form.value.hero_title.en    }),
      axios.put('/settings/hero_subtitle', { value_uz: form.value.hero_subtitle.uz, value_ru: form.value.hero_subtitle.ru, value_en: form.value.hero_subtitle.en })
    ]

    form.value.stats.forEach((s, i) => {
      const n = i + 1
      puts.push(axios.put(`/settings/hero_stat${n}_number`, { value_uz: s.number,   value_ru: s.number,   value_en: s.number   }))
      puts.push(axios.put(`/settings/hero_stat${n}_label`,  { value_uz: s.label_uz, value_ru: s.label_ru, value_en: s.label_en }))
    })

    puts.push(
      axios.put('/settings/meta_title',       { value_uz: form.value.seo.meta_title.uz,       value_ru: form.value.seo.meta_title.ru,       value_en: form.value.seo.meta_title.en       }),
      axios.put('/settings/meta_description', { value_uz: form.value.seo.meta_description.uz, value_ru: form.value.seo.meta_description.ru, value_en: form.value.seo.meta_description.en })
    )

    await Promise.all(puts)
    successMsg.value = 'Sozlamalar muvaffaqiyatli saqlandi!'
    setTimeout(() => { successMsg.value = '' }, 3000)
  } catch {
    errorMsg.value = 'Saqlashda xatolik yuz berdi'
  } finally {
    saving.value = false
  }
}

async function uploadLogo(e) {
  const file = e.target.files?.[0]
  if (!file) return
  logoUploading.value = true
  errorMsg.value = ''
  try {
    const fd = new FormData()
    fd.append('image', file)
    const { data } = await axios.post('/upload/image', fd)
    if (data.success) {
      logoPreview.value = data.url
      await axios.put('/settings/logo_url', { value_uz: data.url, value_ru: data.url, value_en: data.url })
      successMsg.value = 'Logo saqlandi!'
      setTimeout(() => { successMsg.value = '' }, 3000)
    }
  } catch {
    errorMsg.value = 'Logo yuklanmadi'
  } finally {
    logoUploading.value = false
    if (logoInputRef.value) logoInputRef.value.value = ''
  }
}

async function uploadHeroImg(e) {
  const file = e.target.files?.[0]
  if (!file) return
  heroImgUploading.value = true
  errorMsg.value = ''
  try {
    const fd = new FormData()
    fd.append('image', file)
    const { data } = await axios.post('/upload/image', fd)
    if (data.success) {
      heroImgPreview.value = data.url
      await axios.put('/settings/hero_image_url', { value_uz: data.url, value_ru: data.url, value_en: data.url })
      successMsg.value = 'Hero rasmi saqlandi!'
      setTimeout(() => { successMsg.value = '' }, 3000)
    }
  } catch {
    errorMsg.value = 'Rasm yuklanmadi'
  } finally {
    heroImgUploading.value = false
    if (heroImgInputRef.value) heroImgInputRef.value.value = ''
  }
}
</script>
