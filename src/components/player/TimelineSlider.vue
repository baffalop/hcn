<template>
  <div
    class="relative h-6 flex items-center -mb-2"
    :style="{
      '--progress-percent': `${progressPercent}%`,
      '--progress': `${progress}`,
    }"
  >
    <div class="track h-1 w-full rounded-full bg-gray-600"></div>
    <div class="progress absolute top-1/2 transform -translate-y-1/2 left-0 h-1 rounded-full bg-gray-100"></div>
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
.progress {
  --thumb-width: 0.5rem;
  width: calc(var(--progress-percent) + (var(--thumb-width) - (var(--thumb-width) * var(--progress))));
}
</style>
