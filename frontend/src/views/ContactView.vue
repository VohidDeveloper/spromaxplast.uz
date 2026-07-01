<template>
  <div class="min-h-screen bg-neutral-50">

    <!-- ===== BREADCRUMB ===== -->
    <div class="bg-white border-b border-neutral-100">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <RouterLink to="/" class="text-neutral-500 hover:text-primary transition-colors">
            {{ $t('nav.home') }}
          </RouterLink>
          <svg class="w-4 h-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="text-primary font-semibold">{{ $t('nav.contact') }}</span>
        </nav>
        <h1 class="font-heading font-extrabold text-neutral-900 text-3xl sm:text-4xl">
          {{ $t('contact.title') }}
        </h1>
        <p class="text-neutral-500 text-base mt-2">{{ $t('contact.subtitle') }}</p>
      </div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

      <!-- ===== 3 TA KONTAKT KARTA ===== -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-10 md:mb-14">
        <a
          v-for="card in topCards"
          :key="card.key"
          :href="card.href || undefined"
          :target="card.href?.startsWith('http') ? '_blank' : undefined"
          :class="[
            'flex items-center gap-4 bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-6 transition-all duration-200',
            card.href ? 'hover:border-primary hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''
          ]"
        >
          <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <component :is="card.icon" class="w-6 h-6 text-primary" />
          </div>
          <div>
            <p class="text-neutral-400 text-xs font-medium uppercase tracking-wide mb-1">
              {{ card.label[$i18n.locale] || card.label.uz }}
            </p>
            <p class="text-neutral-900 font-bold text-sm sm:text-base leading-snug">
              {{ card.value[$i18n.locale] || card.value.uz }}
            </p>
          </div>
        </a>
      </div>

      <!-- ===== ASOSIY GRID: FORMA + XARITA ===== -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        <!-- ===== CHAP: Murojaat formasi ===== -->
        <div class="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-8">

          <!-- Muvaffaqiyat holati -->
          <Transition name="fade">
            <div v-if="submitted" class="flex flex-col items-center justify-center text-center gap-5 py-12">
              <div class="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
                <svg class="w-10 h-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div>
                <h3 class="font-heading font-bold text-neutral-900 text-xl mb-2">
                  {{ successTitle[$i18n.locale] || successTitle.uz }}
                </h3>
                <p class="text-neutral-500 text-sm">{{ $t('contact.success') }}</p>
              </div>
              <button
                @click="resetForm"
                class="inline-flex items-center gap-2 border border-primary text-primary font-semibold rounded-xl px-6 py-2.5 text-sm hover:bg-primary hover:text-white transition-all duration-200"
              >
                {{ newMsgLabel[$i18n.locale] || newMsgLabel.uz }}
              </button>
            </div>
          </Transition>

          <!-- Forma -->
          <form v-if="!submitted" @submit.prevent="handleSubmit" novalidate>

            <h2 class="font-heading font-bold text-neutral-900 text-xl sm:text-2xl mb-6">
              {{ formTitle[$i18n.locale] || formTitle.uz }}
            </h2>

            <div class="flex flex-col gap-4 sm:gap-5">

              <!-- Ism + Telefon (yonma-yon sm+) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label class="block text-sm font-semibold text-neutral-700 mb-1.5">
                    {{ $t('contact.name') }} <span class="text-primary">*</span>
                  </label>
                  <input
                    v-model.trim="form.name"
                    type="text"
                    :placeholder="namePh[$i18n.locale] || namePh.uz"
                    :class="inputCls(errors.name)"
                    @blur="touch('name')"
                  />
                  <p v-if="errors.name" class="mt-1.5 text-primary text-xs flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                    {{ errors.name }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-neutral-700 mb-1.5">
                    {{ $t('contact.phone') }} <span class="text-primary">*</span>
                  </label>
                  <input
                    v-model.trim="form.phone"
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    :class="inputCls(errors.phone)"
                    @blur="touch('phone')"
                  />
                  <p v-if="errors.phone" class="mt-1.5 text-primary text-xs flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                    {{ errors.phone }}
                  </p>
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-semibold text-neutral-700 mb-1.5">
                  {{ $t('contact.email') }}
                </label>
                <input
                  v-model.trim="form.email"
                  type="email"
                  placeholder="email@example.com"
                  :class="inputCls(errors.email)"
                  @blur="touch('email')"
                />
                <p v-if="errors.email" class="mt-1.5 text-primary text-xs flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                  {{ errors.email }}
                </p>
              </div>

              <!-- Mavzu -->
              <div>
                <label class="block text-sm font-semibold text-neutral-700 mb-1.5">
                  {{ subjectLabel[$i18n.locale] || subjectLabel.uz }}
                </label>
                <select v-model="form.subject" :class="inputCls(false)">
                  <option value="" disabled>
                    {{ subjectPh[$i18n.locale] || subjectPh.uz }}
                  </option>
                  <option v-for="opt in subjectOpts" :key="opt.value" :value="opt.value">
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
                  rows="5"
                  :placeholder="msgPh[$i18n.locale] || msgPh.uz"
                  :class="[inputCls(errors.message), 'resize-none']"
                  @blur="touch('message')"
                />
                <div class="flex items-center justify-between mt-1.5">
                  <p v-if="errors.message" class="text-primary text-xs flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                    {{ errors.message }}
                  </p>
                  <span class="text-neutral-400 text-xs ml-auto">{{ form.message.length }}/500</span>
                </div>
              </div>

              <!-- Yuborish tugmasi -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full flex items-center justify-center gap-2.5 bg-primary text-white font-bold rounded-xl
                       py-4 text-base hover:bg-primary-dark active:scale-[0.99]
                       disabled:opacity-60 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-lg shadow-primary/20"
              >
                <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                {{ loading ? sendingLabel[$i18n.locale] : $t('contact.send') }}
              </button>

            </div>
          </form>
        </div>

        <!-- ===== O'NG: Xarita + Ish vaqti + Ijtimoiy ===== -->
        <div class="flex flex-col gap-5">

          <!-- Yandex Maps -->
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

          <!-- Ish vaqti -->
          <div class="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-6">
            <h3 class="font-heading font-bold text-neutral-900 text-base mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ hoursTitle[$i18n.locale] || hoursTitle.uz }}
            </h3>
            <div class="flex flex-col gap-3">
              <div v-for="h in workHours" :key="h.day" class="flex items-center justify-between">
                <span class="text-neutral-600 text-sm">{{ h.day[$i18n.locale] || h.day.uz }}</span>
                <span :class="['text-sm font-semibold', h.open ? 'text-secondary' : 'text-neutral-400']">
                  {{ h.open ? h.time : (closedLabel[$i18n.locale] || closedLabel.uz) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Ijtimoiy tarmoqlar -->
          <div class="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-6">
            <h3 class="font-heading font-bold text-neutral-900 text-base mb-4">
              {{ socialTitle[$i18n.locale] || socialTitle.uz }}
            </h3>
            <div class="flex flex-col gap-3">
              <a
                v-for="s in socials"
                :key="s.name"
                :href="s.href"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 px-4 py-3 rounded-xl border border-neutral-200
                       hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
              >
                <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  :style="{ backgroundColor: s.color + '18' }">
                  <component :is="s.icon" class="w-4 h-4" :style="{ color: s.color }" />
                </div>
                <div>
                  <p class="font-semibold text-neutral-900 text-sm group-hover:text-primary transition-colors">{{ s.name }}</p>
                  <p class="text-neutral-400 text-xs">{{ s.handle }}</p>
                </div>
                <svg class="w-4 h-4 text-neutral-300 ml-auto group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, h } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

const { locale } = useI18n()

const form     = reactive({ name: '', phone: '', email: '', subject: '', message: '' })
const errors   = reactive({ name: '', phone: '', email: '', message: '' })
const loading  = ref(false)
const submitted = ref(false)

const errMsgs = {
  required: { uz: 'Bu maydon majburiy',         ru: 'Это поле обязательно',        en: 'This field is required' },
  phone:    { uz: 'Telefon raqam noto\'g\'ri',  ru: 'Неверный номер телефона',     en: 'Invalid phone number' },
  email:    { uz: 'Email noto\'g\'ri',           ru: 'Неверный email',              en: 'Invalid email' },
  minLen:   { uz: 'Kamida 10 ta belgi kiriting', ru: 'Введите минимум 10 символов', en: 'Enter at least 10 characters' }
}

function touch(field) {
  const loc = locale.value
  if (field === 'name')    errors.name    = form.name.length < 2    ? errMsgs.required[loc] : ''
  if (field === 'phone')   errors.phone   = form.phone.replace(/\D/g,'').length < 9 ? errMsgs.phone[loc] : ''
  if (field === 'email')   errors.email   = form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? errMsgs.email[loc] : ''
  if (field === 'message') errors.message = form.message.length < 10 ? errMsgs.minLen[loc] : ''
}

function touchAll() {
  ['name','phone','email','message'].forEach(touch)
  return !Object.values(errors).some(Boolean)
}

async function handleSubmit() {
  if (!touchAll()) return
  loading.value = true
  try {
    await axios.post('/api/contacts', {
      name:    form.name,
      phone:   form.phone,
      email:   form.email,
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
  Object.assign(form,   { name: '', phone: '', email: '', subject: '', message: '' })
  Object.assign(errors, { name: '', phone: '', email: '', message: '' })
  submitted.value = false
}

function inputCls(hasErr) {
  return [
    'w-full rounded-xl border px-4 py-3 text-sm text-neutral-900 bg-neutral-50 outline-none',
    'placeholder:text-neutral-400 transition-colors duration-150 focus:bg-white focus:ring-2',
    hasErr
      ? 'border-primary ring-primary/15 focus:ring-primary/15'
      : 'border-neutral-200 focus:border-primary focus:ring-primary/10'
  ].join(' ')
}

// Matnlar
const formTitle    = { uz: 'Xabar yuboring',          ru: 'Отправьте сообщение',       en: 'Send a message' }
const successTitle = { uz: 'Xabar yuborildi!',        ru: 'Сообщение отправлено!',     en: 'Message sent!' }
const newMsgLabel  = { uz: 'Yangi xabar',             ru: 'Новое сообщение',           en: 'New message' }
const sendingLabel = { uz: 'Yuborilmoqda...',         ru: 'Отправка...',               en: 'Sending...' }
const subjectLabel = { uz: 'Mavzu',                   ru: 'Тема',                      en: 'Subject' }
const subjectPh    = { uz: 'Mavzu tanlang',           ru: 'Выберите тему',             en: 'Select subject' }
const namePh       = { uz: 'To\'liq ismingiz',        ru: 'Ваше полное имя',           en: 'Your full name' }
const msgPh        = { uz: 'Xabaringizni yozing...',  ru: 'Напишите ваше сообщение...', en: 'Write your message...' }
const mapPh        = { uz: "Toshkent, O'zbekiston — Google Maps iframe keyinchalik qo'yiladi", ru: 'Ташкент, Узбекистан — Google Maps iframe будет добавлен позже', en: 'Tashkent, Uzbekistan — Google Maps iframe will be added later' }
const hoursTitle   = { uz: 'Ish vaqti',              ru: 'Часы работы',               en: 'Working hours' }
const closedLabel  = { uz: 'Dam olish',              ru: 'Выходной',                  en: 'Closed' }
const socialTitle  = { uz: 'Bizni kuzating',         ru: 'Следите за нами',           en: 'Follow us' }

const subjectOpts = [
  { value: 'product',     label: { uz: 'Mahsulot haqida',      ru: 'О продукции',         en: 'About products' } },
  { value: 'price',       label: { uz: 'Narx so\'rovi',        ru: 'Запрос цены',         en: 'Price inquiry' } },
  { value: 'partnership', label: { uz: 'Hamkorlik taklifi',    ru: 'Предложение о партнёрстве', en: 'Partnership proposal' } },
  { value: 'complaint',   label: { uz: 'Shikoyat / taklif',    ru: 'Жалоба / предложение', en: 'Complaint / suggestion' } },
  { value: 'other',       label: { uz: 'Boshqa',               ru: 'Другое',              en: 'Other' } }
]

const workHours = [
  { day: { uz: 'Dushanba – Juma',  ru: 'Понедельник – Пятница', en: 'Monday – Friday'   }, time: '08:00 – 18:00', open: true  },
  { day: { uz: 'Shanba',           ru: 'Суббота',               en: 'Saturday'          }, time: '09:00 – 15:00', open: true  },
  { day: { uz: 'Yakshanba',        ru: 'Воскресенье',           en: 'Sunday'            }, time: '',              open: false }
]

// Inline SVG ikonlar
const LocationIcon = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' })]) }
const PhoneIcon    = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' })]) }
const EmailIcon    = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })]) }
const TgIcon       = { render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { d: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z' })]) }
const IgIcon       = { render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z' })]) }
const YtIcon       = { render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' })]) }

const topCards = [
  { key: 'address', icon: LocationIcon, href: null,                           label: { uz: 'Manzil',          ru: 'Адрес',                 en: 'Address'  }, value: { uz: "Qashqadaryo viloyati, Ko'kdala tumani, Toshli mahalla fuqarolar yig'ini", ru: 'Кашкадарьинская область, Кукдалинский район, Тошли махалла', en: 'Kashkadarya region, Kukdala district, Toshli mahalla' } },
  { key: 'phone',   icon: PhoneIcon,    href: 'tel:+998994164112',            label: { uz: 'Telefon',         ru: 'Телефон',               en: 'Phone'    }, value: { uz: '+998994164112 | +998700331515', ru: '+998 70 033 15 15 | +998 99 416 41 12', en: '+998 70 033 15 15 | +998 99 416 41 12' } },
  { key: 'email',   icon: EmailIcon,    href: 'mailto:spromaxplast@gmail.com',       label: { uz: 'Elektron pochta', ru: 'Электронная почта',     en: 'Email'    }, value: { uz: 'spromaxplast@gmail.com',                ru: 'info@spromax.uz',                en: 'info@spromax.uz'             } }
]

const socials = [
  { name: 'Telegram',  handle: '@spromaxplast_uz',        href: 'https://t.me/spromaxplast_uz',           icon: TgIcon, color: '#229ED9' },
  { name: 'Instagram', handle: '@spromaxplast.uz',         href: 'https://instagram.com/spromaxplast.uz',  icon: IgIcon, color: '#E1306C' },
  { name: 'YouTube',   handle: 'S PROMAX PLAST',    href: 'https://youtube.com/@spromaxplast',   icon: YtIcon, color: '#FF0000' }
]
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }
</style>
