<template>
  <component
    :is="tag"
    :href="href"
    :to="to"
    :type="tag === 'button' ? type : undefined"
    :disabled="disabled || loading"
    :class="classes"
    v-bind="$attrs"
  >
    <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: v => ['primary', 'secondary', 'outline', 'ghost'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: v => ['sm', 'md', 'lg'].includes(v)
  },
  tag:      { type: String, default: 'button' },
  href:     { type: String, default: null },
  to:       { type: [String, Object], default: null },
  type:     { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading:  { type: Boolean, default: false },
  full:     { type: Boolean, default: false }
})

const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

const variants = {
  primary:   'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
  secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary',
  outline:   'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
  ghost:     'text-primary hover:bg-primary/10 focus:ring-primary'
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg'
}

const classes = computed(() => [
  base,
  variants[props.variant],
  sizes[props.size],
  props.full ? 'w-full' : ''
])
</script>
