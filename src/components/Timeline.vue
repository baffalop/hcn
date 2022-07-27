<script setup lang="ts">
import { ref, computed, defineProps } from 'vue'

const props = defineProps<{
  modelValue: number,
  resolution?: number
}>()

const resolution = computed(() => props.resolution ?? 15)
const points = computed(
  () => [...Array(resolution.value).keys()]
)

const current = ref(0)
</script>

<template>
  <div class="relative flex items-center justify-between gap-3 h-3">
    <div
      v-for="point in points"
      :key="point"
      class="h-1 w-1 min-w-1 rounded-full"
      :class="point < current ? 'bg-neutral-100' : 'bg-neutral-500'"
    ></div>

    <input
      type="range"
      :max="resolution"
      step="0.1"
      v-model.number="current"
      class="absolute inset-0 cursor-pointer
        opacity-0 appearance-none focus:outline-none focus:shadow-none"
    >
  </div>
</template>

<style scoped>
</style>
