<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps<{
  time: number,
  duration: number,
  resolution?: number,
}>()

const emit = defineEmits<{
  (e: 'update:time', value: number): void
}>()

const resolution = computed(() => props.resolution ?? 15)
const max = computed(() => Math.floor(props.duration))

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
</script>

<template>
  <div class="relative flex items-center justify-between gap-3 h-3">
    <div
      v-for="point in points"
      :key="point"
      class="h-1 w-1 min-w-1 rounded-full"
      :class="point < current || current === max ? 'bg-neutral-100' : 'bg-neutral-500'"
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

<style scoped>
</style>
