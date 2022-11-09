<template>
  <div
    class="group relative h-6 flex items-center -mb-2"
    :style="{
      '--progress-percent': `${progressPercent}%`,
      '--progress': `${progress}`,
    }"
  >
    <div class="track w-full backdrop-brightness-70 -backdrop-hue-rotate-30"></div>
    <div class="progress bg-gray-100 absolute left-0 top-1/2 transform -translate-y-1/2"></div>
    <input
      type="range"
      v-model.number="current"
      :max="max"
      :step="0.1"
      class="opacity-0 absolute inset-0 cursor-pointer"
    >
  </div>
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
.track, .progress {
  @apply h-1 rounded-full group-hover:h-2 transition-height duration-200 ease-out;
}

.progress {
  --thumb-width: 0.5rem;
  width: calc(var(--progress-percent) + (var(--thumb-width) - (var(--thumb-width) * var(--progress))));
}
</style>
