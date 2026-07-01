<template>
  <div class="min-h-screen bg-white">

    <!-- ===== BREADCRUMB + HERO ===== -->
    <div class="bg-neutral-900 text-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-14 md:pb-24">

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm mb-8">
          <RouterLink to="/" class="text-white/50 hover:text-white transition-colors">
            {{ $t('nav.home') }}
          </RouterLink>
          <svg class="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="text-primary font-semibold">{{ $t('nav.about') }}</span>
        </nav>

        <!-- Hero grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          <!-- Chap: matn -->
          <div>
            <span class="inline-block text-primary font-semibold text-sm uppercase tracking-widest mb-4">
              {{ $t('nav.about') }}
            </span>
            <h1 class="font-heading font-extrabold text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-6">
              {{ $t('about.title') }}
            </h1>
            <p class="text-white/70 text-base sm:text-lg leading-relaxed mb-8">
              {{ $t('about.description') }}
            </p>

            <!-- Missiya + Vizyon -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-white/10 border border-white/20 rounded-2xl p-5">
                <div class="w-9 h-9 rounded-xl bg-primary/30 flex items-center justify-center mb-3">
                  <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
                  </svg>
                </div>
                <h3 class="font-heading font-bold text-white text-base mb-2">
                  {{ missionLabel[$i18n.locale] || missionLabel.uz }}
                </h3>
                <p class="text-white/60 text-sm leading-relaxed">
                  {{ missionText[$i18n.locale] || missionText.uz }}
                </p>
              </div>

              <div class="bg-white/10 border border-white/20 rounded-2xl p-5">
                <div class="w-9 h-9 rounded-xl bg-secondary/30 flex items-center justify-center mb-3">
                  <svg class="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </div>
                <h3 class="font-heading font-bold text-white text-base mb-2">
                  {{ visionLabel[$i18n.locale] || visionLabel.uz }}
                </h3>
                <p class="text-white/60 text-sm leading-relaxed">
                  {{ visionText[$i18n.locale] || visionText.uz }}
                </p>
              </div>
            </div>
          </div>

          <!-- O'ng: zavod tarixi timeline -->
          <div class="flex flex-col gap-0">
            <div
              v-for="(event, i) in history"
              :key="event.year"
              class="relative flex gap-5 pb-7 last:pb-0"
            >
              <!-- Chiziq -->
              <div class="flex flex-col items-center">
                <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 z-10">
                  <span class="text-white font-heading font-bold text-xs">{{ event.year.slice(2) }}</span>
                </div>
                <div v-if="i < history.length - 1" class="flex-1 w-0.5 bg-white/20 mt-1" />
              </div>
              <!-- Kontent -->
              <div class="pt-1.5 pb-2">
                <p class="text-primary font-bold text-sm mb-0.5">{{ event.year }}</p>
                <p class="text-white font-semibold text-base mb-1">
                  {{ event.title[$i18n.locale] || event.title.uz }}
                </p>
                <p class="text-white/55 text-sm leading-relaxed">
                  {{ event.desc[$i18n.locale] || event.desc.uz }}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ===== RAQAMLAR ===== -->
    <div class="bg-primary">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div v-for="stat in stats" :key="stat.key" class="text-center">
            <p class="font-heading font-extrabold text-white text-4xl sm:text-5xl leading-none mb-2">
              {{ stat.value }}
            </p>
            <p class="text-white/70 text-sm sm:text-base">
              {{ $t(`about.stats.${stat.key}`) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== QADRIYATLAR ===== -->
    <div class="bg-neutral-50 section-padding">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">

        <div class="text-center mb-10 md:mb-14">
          <h2 class="section-title mx-auto">{{ valuesTitle[$i18n.locale] || valuesTitle.uz }}</h2>
          <p class="section-subtitle mx-auto text-center">{{ valuesSubtitle[$i18n.locale] || valuesSubtitle.uz }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          <div
            v-for="val in values"
            :key="val.key"
            class="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 text-center
                   hover:-translate-y-1 hover:shadow-md hover:border-secondary/30
                   transition-all duration-300"
          >
            <div class="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              :style="{ backgroundColor: val.color + '18' }">
              <component :is="val.icon" class="w-7 h-7" :style="{ color: val.color }" />
            </div>
            <h3 class="font-heading font-bold text-neutral-900 text-base mb-2">
              {{ val.label[$i18n.locale] || val.label.uz }}
            </h3>
            <p class="text-neutral-500 text-sm leading-relaxed">
              {{ val.desc[$i18n.locale] || val.desc.uz }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== JAMOA ===== -->
    <div class="bg-white section-padding">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">

        <div class="text-center mb-10 md:mb-14">
          <h2 class="section-title mx-auto">{{ teamTitle[$i18n.locale] || teamTitle.uz }}</h2>
          <p class="section-subtitle mx-auto text-center">{{ teamSubtitle[$i18n.locale] || teamSubtitle.uz }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          <div
            v-for="member in team"
            :key="member.id"
            class="group text-center"
          >
            <!-- Avatar placeholder -->
            <div class="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4">
              <div class="w-full h-full rounded-2xl bg-neutral-100 border-2 border-neutral-200
                          group-hover:border-primary transition-colors duration-300
                          flex items-center justify-center overflow-hidden">
                <svg class="w-14 h-14 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                </svg>
              </div>
              <!-- Rang aksent -->
              <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary border-2 border-white" />
            </div>

            <h3 class="font-heading font-bold text-neutral-900 text-base mb-1 group-hover:text-primary transition-colors">
              {{ member.name[$i18n.locale] || member.name.uz }}
            </h3>
            <p class="text-primary font-semibold text-sm mb-2">
              {{ member.role[$i18n.locale] || member.role.uz }}
            </p>
            <p class="text-neutral-400 text-xs leading-relaxed max-w-[200px] mx-auto">
              {{ member.bio[$i18n.locale] || member.bio.uz }}
            </p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { h } from 'vue'

// Inline SVG ikonlar
const ShieldIcon = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })]) }
const StarIcon   = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' })]) }
const LightIcon  = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' })]) }
const LeafIcon   = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })]) }

const missionLabel  = { uz: 'Missiyamiz',     ru: 'Наша миссия',   en: 'Our Mission' }
const missionText   = { uz: 'O\'zbek bozoriga va xorijga sifatli, qulay narxdagi PVC panellar etkazib berish.', ru: 'Поставка качественных и доступных ПВХ панелей на узбекский рынок и за рубеж.', en: 'Delivering quality, affordable PVC panels to the Uzbek market and abroad.' }
const visionLabel   = { uz: 'Vizyonimiz',     ru: 'Наше видение',  en: 'Our Vision' }
const visionText    = { uz: 'Markaziy Osiyoning yetakchi PVC panel ishlab chiqaruvchisiga aylanish.', ru: 'Стать ведущим производителем ПВХ панелей в Центральной Азии.', en: 'To become the leading PVC panel manufacturer in Central Asia.' }
const valuesTitle   = { uz: 'Bizning qadriyatlar', ru: 'Наши ценности', en: 'Our Values' }
const valuesSubtitle = { uz: 'Har bir qadam sifat, ishonch va mas\'uliyat asosida', ru: 'Каждый шаг основан на качестве, доверии и ответственности', en: 'Every step is based on quality, trust and responsibility' }
const teamTitle     = { uz: 'Bizning jamoa',   ru: 'Наша команда',  en: 'Our Team' }
const teamSubtitle  = { uz: 'Tajribali mutaxassislar jamoasi', ru: 'Команда опытных специалистов', en: 'A team of experienced specialists' }

const history = [
  { year: '2014', title: { uz: 'Kompaniya tashkil etildi',    ru: 'Основание компании',          en: 'Company founded'              }, desc: { uz: 'S PROMAX PLAST zavodi rasmiy tashkil etildi.',             ru: 'Официальное основание завода S PROMAX PLAST.',         en: 'S PROMAX PLAST factory officially established.'        } },
  { year: '2016', title: { uz: 'Birinchi mahsulot liniyasi',  ru: 'Первая производственная линия', en: 'First production line'       }, desc: { uz: 'Shift panellari ishlab chiqarish boshlandi.',              ru: 'Запущено производство потолочных панелей.',            en: 'Ceiling panel production launched.'                    } },
  { year: '2019', title: { uz: 'Kengayish va sertifikat',     ru: 'Расширение и сертификация',    en: 'Expansion & certification'    }, desc: { uz: 'ISO 9001 sertifikati olindi, ishlab chiqarish kengaydi.', ru: 'Получен сертификат ISO 9001, расширено производство.', en: 'ISO 9001 obtained, production expanded.'               } },
  { year: '2022', title: { uz: 'Eksport boshlandi',           ru: 'Начало экспорта',              en: 'Export launched'              }, desc: { uz: 'MDH mamlakatlariga mahsulot eksport qilina boshlandi.',   ru: 'Начат экспорт продукции в страны СНГ.',               en: 'Product export to CIS countries started.'              } },
  { year: '2024', title: { uz: 'Premium liniya',              ru: 'Премиум линейка',              en: 'Premium line'                 }, desc: { uz: 'Yangi premium mahsulot liniyasi ishga tushirildi.',       ru: 'Запущена новая линейка премиум продукции.',            en: 'New premium product line launched.'                    } }
]

const stats = [
  { key: 'years',     value: '10+' },
  { key: 'products',  value: '50+' },
  { key: 'clients',   value: '500+' },
  { key: 'employees', value: '50+' }
]

const values = [
  { key: 'quality',     icon: ShieldIcon, color: '#C8181E', label: { uz: 'Sifat',        ru: 'Качество',    en: 'Quality'     }, desc: { uz: 'Har bir mahsulot qat\'iy sifat nazoratidan o\'tkaziladi.',       ru: 'Каждый продукт проходит строгий контроль качества.',    en: 'Every product undergoes strict quality control.'         } },
  { key: 'trust',       icon: StarIcon,   color: '#F5A623', label: { uz: 'Ishonch',      ru: 'Доверие',     en: 'Trust'       }, desc: { uz: '10 yildan ortiq vaqt davomida mijozlar ishonchini qozonganmiz.', ru: 'Завоёвываем доверие клиентов на протяжении более 10 лет.', en: 'We\'ve earned client trust for over 10 years.'          } },
  { key: 'innovation',  icon: LightIcon,  color: '#1A6BB5', label: { uz: 'Innovatsiya',  ru: 'Инновации',   en: 'Innovation'  }, desc: { uz: 'Zamonaviy texnologiyalarni ishlab chiqarishga tadbiq etamiz.',    ru: 'Внедряем современные технологии в производство.',        en: 'We implement modern technologies in production.'         } },
  { key: 'ecology',     icon: LeafIcon,   color: '#2E8B3A', label: { uz: 'Ekologiya',    ru: 'Экология',    en: 'Ecology'     }, desc: { uz: 'Atrof-muhitga zararli bo\'lmagan materiallar va jarayonlar.',    ru: 'Используем материалы и процессы, безвредные для природы.', en: 'We use materials and processes safe for the environment.' } }
]

const team = [
  { id: 1, name: { uz: 'Abdullayev Jasur',  ru: 'Абдуллаев Жасур',   en: 'Jasur Abdullayev'  }, role: { uz: 'Bosh direktor',      ru: 'Генеральный директор',     en: 'General Director'     }, bio: { uz: '15 yillik tajriba, qurilish sanoati mutaxassisi.',      ru: '15 лет опыта, специалист строительной отрасли.',     en: '15 years of experience, construction industry expert.'    } },
  { id: 2, name: { uz: 'Karimov Bobur',     ru: 'Каримов Бобур',      en: 'Bobur Karimov'     }, role: { uz: 'Texnik direktor',    ru: 'Технический директор',     en: 'Technical Director'   }, bio: { uz: 'Ishlab chiqarish jarayonlarini boshqaradi, 10 yil tajriba.', ru: 'Управляет производственными процессами, 10 лет опыта.', en: 'Manages production processes, 10 years of experience.'   } },
  { id: 3, name: { uz: 'Yusupova Nilufar',  ru: 'Юсупова Нилуфар',   en: 'Nilufar Yusupova'  }, role: { uz: 'Savdo bo\'limi boshlig\'i', ru: 'Руководитель отдела продаж', en: 'Sales Department Head' }, bio: { uz: 'Mijozlar bilan ishlash va savdo strategiyasi bo\'yicha ekspert.', ru: 'Эксперт по работе с клиентами и стратегии продаж.',   en: 'Expert in client relations and sales strategy.'           } },
  { id: 4, name: { uz: 'Toshmatov Sardor',  ru: 'Тошматов Сардор',   en: 'Sardor Toshmatov'  }, role: { uz: 'Sifat nazorati',     ru: 'Контроль качества',        en: 'Quality Control'      }, bio: { uz: 'ISO standartlari bo\'yicha sertifikatlangan mutaxassis.',   ru: 'Специалист, сертифицированный по стандартам ISO.',   en: 'ISO standards certified specialist.'                      } }
]
</script>
