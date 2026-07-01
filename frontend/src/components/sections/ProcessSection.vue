<template>
  <section class="section-padding" style="background-color: #f8f8f8;">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Sarlavha -->
      <div class="text-center mb-12 md:mb-16">
        <span class="inline-block text-primary font-semibold text-sm uppercase tracking-widest mb-3">
          {{ $t('nav.process') }}
        </span>
        <h2 class="section-title mx-auto">{{ $t('process.title') }}</h2>
        <p class="section-subtitle mx-auto text-center">{{ $t('process.subtitle') }}</p>
      </div>

      <!-- ===== DESKTOP: Gorizontal timeline (lg+) ===== -->
      <div class="hidden lg:block">

        <!-- Ulovchi chiziq -->
        <div class="relative flex items-start justify-between gap-4">

          <!-- Faqat raqamlar qatori (chiziq ular ustidan o'tadi) -->
          <div class="absolute top-8 left-0 right-0 flex items-center px-[calc(100%/10)]">
            <div class="flex-1 h-0.5 bg-neutral-200" />
            <div
              v-for="(_, i) in steps.slice(0, -1)"
              :key="i"
              class="flex items-center flex-1"
            >
              <div class="flex-1 h-0.5 bg-neutral-200" />
            </div>
          </div>

          <!-- Qadamlar -->
          <div
            v-for="(step, index) in steps"
            :key="step.key"
            class="relative flex flex-col items-center text-center flex-1 group"
          >
            <!-- Ulovchi chiziq (oxirgidan tashqari) -->
            <div
              v-if="index < steps.length - 1"
              class="absolute top-8 left-1/2 w-full h-0.5 bg-neutral-200 z-0"
            />

            <!-- Raqam doirasi -->
            <div class="relative z-10 mb-5">
              <div
                :class="[
                  'w-16 h-16 rounded-full flex items-center justify-center font-heading font-extrabold text-xl shadow-lg transition-transform duration-300 group-hover:scale-110',
                  index === activeStep
                    ? 'bg-primary text-white ring-4 ring-primary/30'
                    : 'bg-white text-primary border-2 border-primary/30 group-hover:bg-primary group-hover:text-white group-hover:border-primary'
                ]"
                @mouseenter="activeStep = index"
                @mouseleave="activeStep = null"
              >
                {{ String(index + 1).padStart(2, '0') }}
              </div>
            </div>

            <!-- Ikonka -->
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors duration-200">
              <component :is="step.icon" class="w-5 h-5 text-primary" />
            </div>

            <!-- Sarlavha -->
            <h3 class="font-heading font-bold text-neutral-900 text-sm xl:text-base mb-2 leading-tight">
              {{ step.label[$i18n.locale] || step.label.uz }}
            </h3>

            <!-- Tavsif -->
            <p class="text-neutral-500 text-xs xl:text-sm leading-relaxed max-w-[160px]">
              {{ step.desc[$i18n.locale] || step.desc.uz }}
            </p>
          </div>

        </div>
      </div>

      <!-- ===== MOBILE & TABLET: Vertikal timeline (< lg) ===== -->
      <div class="lg:hidden">
        <div class="relative">

          <!-- Vertikal chiziq -->
          <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-neutral-200" />

          <!-- Qadamlar -->
          <div class="flex flex-col gap-0">
            <div
              v-for="(step, index) in steps"
              :key="step.key"
              class="relative flex items-start gap-5 pb-8 last:pb-0 group"
            >
              <!-- Raqam doirasi -->
              <div class="relative z-10 shrink-0">
                <div
                  class="w-16 h-16 rounded-full flex items-center justify-center font-heading font-extrabold text-lg shadow-md
                         bg-primary text-white"
                >
                  {{ String(index + 1).padStart(2, '0') }}
                </div>
                <!-- Oxirgi qadamda chiziq ko'rinmasin -->
                <div
                  v-if="index < steps.length - 1"
                  class="absolute top-16 left-1/2 -translate-x-1/2 w-0.5 bg-neutral-200"
                  :style="{ height: 'calc(100% + 2rem)' }"
                />
              </div>

              <!-- Kontent -->
              <div class="flex-1 pt-2 pb-2 bg-white rounded-2xl border border-neutral-100 shadow-sm px-4 sm:px-5 py-4 ml-1">
                <!-- Ikonka + Sarlavha -->
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <component :is="step.icon" class="w-4 h-4 text-primary" />
                  </div>
                  <h3 class="font-heading font-bold text-neutral-900 text-base leading-tight">
                    {{ step.label[$i18n.locale] || step.label.uz }}
                  </h3>
                </div>

                <!-- Tavsif -->
                <p class="text-neutral-500 text-sm leading-relaxed">
                  {{ step.desc[$i18n.locale] || step.desc.uz }}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Pastki info blok -->
      <div class="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          v-for="info in bottomInfo"
          :key="info.key"
          class="flex items-center gap-4 bg-white rounded-2xl border border-neutral-100 shadow-sm px-5 py-4"
        >
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <component :is="info.icon" class="w-5 h-5 text-primary" />
          </div>
          <div>
            <p class="font-heading font-bold text-neutral-900 text-base leading-tight">{{ info.value }}</p>
            <p class="text-neutral-500 text-sm">{{ info.label[$i18n.locale] || info.label.uz }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, h } from 'vue'

const activeStep = ref(null)

// Inline SVG ikonlar
const BoxIcon    = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' })]) }
const MixIcon    = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' })]) }
const CogIcon    = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }), h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })]) }
const PaintIcon  = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' })]) }
const ShieldIcon = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })]) }
const ClockIcon  = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })]) }
const CheckIcon  = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M5 13l4 4L19 7' })]) }

const steps = [
  {
    key: 'material',
    icon: BoxIcon,
    label: { uz: 'Xom ashyo qabul qilish',    ru: 'Приёмка сырья',           en: 'Raw Material Intake' },
    desc:  { uz: 'Yuqori sifatli PVC granulalar va qo\'shimchalar qabul qilinib, laboratoriyada tekshiriladi.', ru: 'Высококачественные ПВХ гранулы и добавки принимаются и проверяются в лаборатории.', en: 'High-quality PVC granules and additives are received and tested in the laboratory.' }
  },
  {
    key: 'mixing',
    icon: MixIcon,
    label: { uz: 'Aralashma tayyorlash',       ru: 'Подготовка смеси',        en: 'Mixture Preparation' },
    desc:  { uz: 'PVC granulalar aniq nisbatda stabilizatorlar va bo\'yoqlar bilan aralashtiriladi.', ru: 'ПВХ гранулы смешиваются со стабилизаторами и красителями в точных пропорциях.', en: 'PVC granules are mixed with stabilizers and colorants in precise proportions.' }
  },
  {
    key: 'extrusion',
    icon: CogIcon,
    label: { uz: 'Ekstruziya (qoliplash)',     ru: 'Экструзия (формовка)',    en: 'Extrusion (Molding)' },
    desc:  { uz: 'Aralashma ekstruder mashina orqali yuqori haroratda eritilib, panel shakliga keltiriladi.', ru: 'Смесь плавится при высокой температуре через экструдер и формуется в панель.', en: 'The mixture is melted at high temperature through an extruder and shaped into a panel.' }
  },
  {
    key: 'surface',
    icon: PaintIcon,
    label: { uz: 'Sirt ishlov berish',         ru: 'Обработка поверхности',   en: 'Surface Treatment' },
    desc:  { uz: 'Panel sirtiga naqsh bosiladi, UV himoya qatlami va laminat qo\'llaniladi.', ru: 'На поверхность панели наносится рисунок, UV-защитный слой и ламинат.', en: 'Pattern, UV protection layer and laminate are applied to the panel surface.' }
  },
  {
    key: 'quality',
    icon: ShieldIcon,
    label: { uz: 'Sifat nazorati va qadoqlash', ru: 'Контроль качества и упаковка', en: 'Quality Control & Packaging' },
    desc:  { uz: 'Tayyor panellar sifat nazoratidan o\'tkaziladi va standart o\'lchamda qadoqlanadi.', ru: 'Готовые панели проходят контроль качества и упаковываются стандартными размерами.', en: 'Finished panels undergo quality control and are packaged in standard sizes.' }
  }
]

const bottomInfo = [
  {
    key: 'time',
    icon: ClockIcon,
    value: '24 soat',
    label: { uz: 'Ishlab chiqarish sikli', ru: 'Производственный цикл', en: 'Production cycle' }
  },
  {
    key: 'check',
    icon: CheckIcon,
    value: '12 bosqich',
    label: { uz: 'Sifat nazorati', ru: 'Контроль качества', en: 'Quality checks' }
  },
  {
    key: 'capacity',
    icon: BoxIcon,
    value: '10 000 m²',
    label: { uz: 'Kunlik ishlab chiqarish', ru: 'Суточное производство', en: 'Daily production' }
  }
]
</script>
