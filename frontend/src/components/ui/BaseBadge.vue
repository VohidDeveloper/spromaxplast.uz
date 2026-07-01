<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: v => ['primary', 'secondary', 'neutral', 'success', 'warning'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: v => ['sm', 'md'].includes(v)
  }
})

const variants = {
  primary:   'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  neutral:   'bg-neutral-100 text-neutral-700',
  success:   'bg-green-100 text-green-700',
  warning:   'bg-yellow-100 text-yellow-700'
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm'
}

const classes = computed(() => [
  'inline-flex items-center font-medium rounded-full',
  variants[props.variant],
  sizes[props.size]
])
</script>
