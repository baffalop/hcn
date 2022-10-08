<template>
  <input
    type="range"
    v-model.number="current"
    :max="max"
    :step="0.1"
    class="h-1 rounded cursor-pointer appearance-none focus:outline-none focus:shadow-none"
    :style="{ '--fill-position': fillPosition }"
  >
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  time: number
  duration: number
  playing?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:time', value: number): void
}>()

const current = computed({
  get: () => props.time,
  set: (value: number) => emit('update:time', value)
})

const max = computed(() => Math.floor(props.duration * 10) / 10)

// position of cutoff for fill colour, adjusted for thumb position
// see https://css-tricks.com/value-bubbles-for-range-inputs/#:~:text=We%20can%20use%20some%20magic%20numbers%20there%20that%20seem%20to%20work%20decently%20well%20across%20browsers%3A
const fillPosition = computed(() => {
  const progress = props.time / max.value
  const progressPercent = progress * 100
  return `calc(${progressPercent}% + 0.125rem - ${progress * 0.25}rem)`
})

</script>

<style scoped>
input {
  background: linear-gradient(
    to right,
    theme('colors.gray.100') 0%,
    theme('colors.gray.100') var(--fill-position),
    theme('colors.gray.600') var(--fill-position),
    theme('colors.gray.600') 100%
  );
}

input::-webkit-slider-thumb {
  @apply appearance-none h-1 w-1 rounded-full bg-gray-100;
}
</style>
