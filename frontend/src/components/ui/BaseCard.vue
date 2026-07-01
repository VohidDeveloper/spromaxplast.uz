<template>
  <div :class="classes">
    <!-- Rasm bo'limi -->
    <div v-if="image" class="overflow-hidden">
      <img
        :src="image"
        :alt="title"
        class="w-full h-48 md:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>

    <!-- Kontent bo'limi -->
    <div class="p-4 md:p-6">
      <slot name="badge" />

      <h3 v-if="title" class="text-lg md:text-xl font-heading font-bold text-neutral-900 mt-2 mb-2">
        {{ title }}
      </h3>

      <p v-if="description" class="text-sm md:text-base text-neutral-700 leading-relaxed">
        {{ description }}
      </p>

      <slot />

      <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-neutral-100">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title:       { type: String, default: '' },
  description: { type: String, default: '' },
  image:       { type: String, default: '' },
  hoverable:   { type: Boolean, default: false },
  bordered:    { type: Boolean, default: false }
})

const classes = computed(() => [
  'group bg-white rounded-xl overflow-hidden',
  props.hoverable ? 'transition-shadow duration-300 hover:shadow-xl cursor-pointer' : 'shadow-md',
  props.bordered  ? 'border border-neutral-200' : ''
])
</script>
