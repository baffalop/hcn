<template>
  <input
    type="range"
    v-model.number="current"
    :max="max"
    :step="0.1"
    class="h-2 cursor-pointer bg-transparent appearance-none focus:outline-none focus:shadow-none"
    :style="{
      '--progress-percent': `${progressPercent}%`,
      '--progress': `${progress}`,
    }"
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

// floor to 1dp precision
const max = computed(() => Math.floor(props.duration * 10) / 10)

const progress = computed(() => props.time / max.value)
const progressPercent = computed(() => progress.value * 100)

</script>

<style scoped>
@tailwind components;

input::-webkit-slider-runnable-track {
  @apply h-1 rounded-full duration-200 ease-out;
  --thumb-size: 0.25rem;
  /* position of cutoff for fill colour, adjusted for thumb position */
  /* see https://css-tricks.com/value-bubbles-for-range-inputs/#:~:text=We%20can%20use%20some%20magic%20numbers%20there%20that%20seem%20to%20work%20decently%20well%20across%20browsers%3A */
  --fill-position: calc(var(--progress-percent) + (var(--thumb-size) / 2) - (var(--progress) * var(--thumb-size)));
  transition-property: height;
  background: linear-gradient(
    to right,
    theme('colors.gray.100') 0%,
    theme('colors.gray.100') var(--fill-position),
    theme('colors.gray.600') var(--fill-position),
    theme('colors.gray.600') 100%
  );
}

input:hover::-webkit-slider-runnable-track {
  @apply h-2;
  --thumb-size: 0.5rem;
}

input::-webkit-slider-thumb {
  @apply thumb;
}

input::-moz-range-thumb {
  @apply thumb;
}

input::-ms-thumb {
  @apply thumb;
}

@layer components {
  .thumb {
    @apply appearance-none h-full w-3 rounded-full bg-gray-100;
  }
}
</style>
