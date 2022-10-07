<template>
  <div class="relative timeline flex items-center justify-between h-3">
    <div
      v-for="point in points"
      :key="point"
      class="h-1 w-1 min-w-1 rounded-full
        transform transition-transform duration-300 ease-out"
      :class="pointClasses(point)"
    ></div>

    <input
      type="range"
      v-model.number="current"
      :max="max"
      step="0.1"
      class="absolute inset-0 cursor-pointer
        opacity-0 appearance-none focus:outline-none focus:shadow-none"
    >
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { delta } from '@/utils/math'

const props = defineProps<{
  time: number
  duration: number
  resolution?: number
  playing?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:time', value: number): void
}>()

const resolution = computed(() => props.resolution ?? 15)
const max = computed(() => Math.floor(props.duration))
const gap = computed(() => props.duration / resolution.value)
const atEnd = computed(() => delta(max.value, current.value) < 0.1)

const points = computed(
  () => range(resolution.value).map(scaleToMax)
)

const current = computed({
  get: () => props.time,
  set: (value: number) => emit('update:time', value)
})

function range (length: number): number[] {
  return [...Array(length).keys()]
}

function scaleToMax (value: number): number {
  return (value * max.value) / (resolution.value - 1)
}

function pointClasses (point: number): Record<string, boolean> {
  const hasPlayed = atEnd.value || point < current.value
  return {
    'bg-neutral-100': hasPlayed,
    'bg-neutral-500': !hasPlayed,
    'scale-[2]': !!props.playing && hasPlayed && delta(point, current.value) <= gap.value,
  }
}
</script>

<style scoped>
</style>
