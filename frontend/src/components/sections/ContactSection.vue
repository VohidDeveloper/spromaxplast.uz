<template>
  <section class="section-padding bg-neutral-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Sarlavha -->
      <div class="text-center mb-10 md:mb-14">
        <span class="inline-block text-primary font-semibold text-sm uppercase tracking-widest mb-3">
          {{ $t('nav.contact') }}
        </span>
        <h2 class="section-title mx-auto">{{ $t('contact.title') }}</h2>
        <p class="section-subtitle mx-auto text-center">{{ $t('contact.subtitle') }}</p>
      </div>

      <!-- Asosiy grid: kontakt + forma -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8 md:mb-12">

        <!-- ===== CHAP: Kontakt ma'lumotlari ===== -->
        <div class="flex flex-col gap-6">

          <!-- Kontakt kartalar -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div
              v-for="info in contactInfo"
              :key="info.key"
              class="flex items-start gap-4 bg-white rounded-2xl border border-neutral-100 p-4 sm:p-5 shadow-sm"
            >
              <div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <component :is="info.icon" class="w-5 h-5 text-primary" />
              </div>
              <div class="min-w-0">
                <p class="text-neutral-500 text-xs font-medium uppercase tracking-wide mb-1">
                  {{ info.label[$i18n.locale] || info.label.uz }}
                </p>
                <component
                  :is="info.href ? 'a' : 'p'"
                  :href="info.href || undefined"
                  class="text-neutral-900 font-semibold text-sm sm:text-base leading-snug break-words"
                  :class="info.href ? 'hover:text-primary transition-colors' : ''"
                >
                  {{ info.value[$i18n.locale] || info.value.uz }}
                </component>
              </div>
            </div>
          </div>

          <!-- Ijtimoiy tarmoqlar -->
          <div class="bg-white rounded-2xl border border-neutral-100 p-4 sm:p-5 shadow-sm">
            <p class="text-neutral-500 text-xs font-medium uppercase tracking-wide mb-4">
              {{ socialLabel[$i18n.locale] || socialLabel.uz }}
            </p>
            <div class="flex items-center gap-3">
              <a
                v-for="s in socials"
                :key="s.name"
                :href="s.href"
                :aria-label="s.name"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-700
                       hover:border-primary hover:text-primary hover:bg-primary/5
                       transition-all duration-200"
              >
                <component :is="s.icon" class="w-4 h-4" />
                {{ s.name }}
              </a>
            </div>
          </div>

        </div>

        <!-- ===== O'NG: Murojaat formasi ===== -->
        <div class="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-8">

          <!-- Muvaffaqiyat xabari -->
          <Transition name="fade">
            <div
              v-if="submitted"
              class="flex flex-col items-center justify-center text-center gap-4 py-10"
            >
              <div class="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                <svg class="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 class="font-heading font-bold text-neutral-900 text-xl">
                {{ $t('contact.success') }}
              </h3>
              <button @click="resetForm" class="text-primary text-sm font-semibold hover:underline">
                {{ newMsgLabel[$i18n.locale] || newMsgLabel.uz }}
              </button>
            </div>
          </Transition>

          <!-- Forma -->
          <form v-if="!submitted" @submit.prevent="handleSubmit" novalidate class="flex flex-col gap-4 sm:gap-5">

            <h3 class="font-heading font-bold text-neutral-900 text-lg sm:text-xl mb-1">
              {{ formTitle[$i18n.locale] || formTitle.uz }}
            </h3>

            <!-- Ism -->
            <div>
              <label class="block text-sm font-semibold text-neutral-700 mb-1.5">
                {{ $t('contact.name') }} <span class="text-primary">*</span>
              </label>
              <input
                v-model.trim="form.name"
                type="text"
                :placeholder="namePlaceholder[$i18n.locale] || namePlaceholder.uz"
                :class="inputClass(errors.name)"
                @blur="validate('name')"
              />
              <p v-if="errors.name" class="mt-1 text-primary text-xs">{{ errors.name }}</p>
            </div>

            <!-- Telefon -->
            <div>
              <label class="block text-sm font-semibold text-neutral-700 mb-1.5">
                {{ $t('contact.phone') }} <span class="text-primary">*</span>
              </label>
              <input
                v-model.trim="form.phone"
                type="tel"
                placeholder="+998 90 123 45 67"
                :class="inputClass(errors.phone)"
                @blur="validate('phone')"
              />
              <p v-if="errors.phone" class="mt-1 text-primary text-xs">{{ errors.phone }}</p>
            </div>

            <!-- Mavzu -->
            <div>
              <label class="block text-sm font-semibold text-neutral-700 mb-1.5">
                {{ subjectLabel[$i18n.locale] || subjectLabel.uz }}
              </label>
              <select
                v-model="form.subject"
                :class="inputClass(false)"
              >
                <option value="" disabled>
                  {{ subjectPlaceholder[$i18n.locale] || subjectPlaceholder.uz }}
                </option>
                <option v-for="opt in subjectOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label[$i18n.locale] || opt.label.uz }}
                </option>
              </select>
            </div>

            <!-- Xabar -->
            <div>
              <label class="block text-sm font-semibold text-neutral-700 mb-1.5">
                {{ $t('contact.message') }} <span class="text-primary">*</span>
              </label>
              <textarea
                v-model.trim="form.message"
                rows="4"
                :placeholder="msgPlaceholder[$i18n.locale] || msgPlaceholder.uz"
                :class="[inputClass(errors.message), 'resize-none']"
                @blur="validate('message')"
              />
              <p v-if="errors.message" class="mt-1 text-primary text-xs">{{ errors.message }}</p>
            </div>

            <!-- Yuborish tugmasi -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold rounded-xl
                     py-3.5 text-base hover:bg-primary-dark active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-md shadow-primary/20 mt-1"
            >
              <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              {{ loading ? sendingLabel[$i18n.locale] : $t('contact.send') }}
            </button>

          </form>
        </div>
      </div>

      <!-- ===== Yandex Maps ===== -->
      <div class="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
        <iframe
          src="https://yandex.uz/map-widget/v1/?ll=65.932749%2C39.025904&mode=search&oid=141854928643&ol=biz&z=11.09"
          width="100%"
          height="400"
          frameborder="0"
          allowfullscreen
          style="border-radius: 12px; display: block;"
        />
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, reactive, h } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

const { locale } = useI18n()

// Form holati
const form = reactive({ name: '', phone: '', subject: '', message: '' })
const errors = reactive({ name: '', phone: '', message: '' })
const loading = ref(false)
const submitted = ref(false)

// Validation xabarlari
const required = { uz: 'Bu maydon majburiy', ru: 'Это поле обязательно', en: 'This field is required' }
const phoneErr = { uz: 'Telefon raqam noto\'g\'ri', ru: 'Неверный номер телефона', en: 'Invalid phone number' }

function validate(field) {
  if (field === 'name') {
    errors.name = form.name.length < 2 ? (required[locale.value] || required.uz) : ''
  }
  if (field === 'phone') {
    const clean = form.phone.replace(/\D/g, '')
    errors.phone = clean.length < 9 ? (phoneErr[locale.value] || phoneErr.uz) : ''
  }
  if (field === 'message') {
    errors.message = form.message.length < 5 ? (required[locale.value] || required.uz) : ''
  }
}

function validateAll() {
  validate('name'); validate('phone'); validate('message')
  return !errors.name && !errors.phone && !errors.message
}

async function handleSubmit() {
  if (!validateAll()) return
  loading.value = true
  try {
    await axios.post('/api/contacts', {
      name:    form.name,
      phone:   form.phone,
      subject: form.subject,
      message: form.message
    })
    submitted.value = true
  } catch (err) {
    console.error('Xabar yuborishda xato:', err)
    errors.message = 'Xabar yuborilmadi. Iltimos qayta urinib ko\'ring.'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  Object.assign(form, { name: '', phone: '', subject: '', message: '' })
  Object.assign(errors, { name: '', phone: '', message: '' })
  submitted.value = false
}

function inputClass(hasError) {
  return [
    'w-full rounded-xl border px-4 py-3 text-sm text-neutral-900 bg-neutral-50',
    'placeholder:text-neutral-400 outline-none transition-colors duration-200',
    'focus:bg-white focus:ring-2',
    hasError
      ? 'border-primary ring-primary/20 focus:ring-primary/20'
      : 'border-neutral-200 focus:border-primary focus:ring-primary/10'
  ].flat().join(' ')
}

// Matnlar
const formTitle     = { uz: 'Xabar yuboring',          ru: 'Отправьте сообщение',    en: 'Send a message' }
const namePlaceholder = { uz: 'Ismingizni kiriting',    ru: 'Введите ваше имя',       en: 'Enter your name' }
const msgPlaceholder  = { uz: 'Xabaringizni yozing...', ru: 'Напишите ваше сообщение...', en: 'Write your message...' }
const subjectLabel    = { uz: 'Mavzu',                  ru: 'Тема',                   en: 'Subject' }
const subjectPlaceholder = { uz: 'Mavzu tanlang',       ru: 'Выберите тему',          en: 'Select a subject' }
const socialLabel     = { uz: 'Ijtimoiy tarmoqlar',     ru: 'Социальные сети',        en: 'Social media' }
const sendingLabel    = { uz: 'Yuborilmoqda...',        ru: 'Отправка...',            en: 'Sending...' }
const newMsgLabel     = { uz: 'Yangi xabar yuborish',   ru: 'Отправить новое сообщение', en: 'Send another message' }

const subjectOptions = [
  { value: 'product',     label: { uz: 'Mahsulot haqida',     ru: 'О продукции',        en: 'About products' } },
  { value: 'price',       label: { uz: 'Narx so\'rovi',       ru: 'Запрос цены',        en: 'Price inquiry' } },
  { value: 'partnership', label: { uz: 'Hamkorlik',           ru: 'Партнёрство',        en: 'Partnership' } },
  { value: 'other',       label: { uz: 'Boshqa',              ru: 'Другое',             en: 'Other' } }
]

// Inline SVG ikonlar
const LocationIcon = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' })]) }
const PhoneIcon    = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' })]) }
const EmailIcon    = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })]) }
const ClockIcon    = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })]) }
const TgIcon       = { render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { d: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z' })]) }
const IgIcon       = { render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z' })]) }

const contactInfo = [
  {
    key: 'address', icon: LocationIcon,
    label: { uz: 'Manzil', ru: 'Адрес', en: 'Address' },
    value: { uz: "Qashqadaryo viloyati, Ko'kdala tumani, Toshli mahalla fuqarolar yig'ini", ru: 'Кашкадарьинская область, Кукдалинский район, Тошли махалла', en: 'Kashkadarya region, Kukdala district, Toshli mahalla' },
    href: null
  },
  {
    key: 'phone', icon: PhoneIcon,
    label: { uz: 'Telefon', ru: 'Телефон', en: 'Phone' },
    value: { uz: '+998 70 033 15 15 | +998 99 416 41 12', ru: '+998 70 033 15 15 | +998 99 416 41 12', en: '+998 70 033 15 15 | +998 99 416 41 12' },
    href: 'tel:+998994164112'
  },
  {
    key: 'email', icon: EmailIcon,
    label: { uz: 'Elektron pochta', ru: 'Электронная почта', en: 'Email' },
    value: { uz: 'spromaxplast@gmail.com', ru: 'spromaxplast@gmail.com', en: 'spromaxplast@gmail.com' },
    href: 'mailto:spromaxplast@gmail.com'
  },
  {
    key: 'hours', icon: ClockIcon,
    label: { uz: 'Ish vaqti', ru: 'Часы работы', en: 'Working hours' },
    value: { uz: 'Dush–Shan: 08:00–18:00', ru: 'Пн–Сб: 08:00–18:00', en: 'Mon–Sat: 08:00–18:00' },
    href: null
  }
]

const socials = [
  { name: 'Telegram',  href: 'https://t.me/spromaxplast_uz',          icon: TgIcon },
  { name: 'Instagram', href: 'https://instagram.com/spromaxplast.uz',  icon: IgIcon }
]
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
