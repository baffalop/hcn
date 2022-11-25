<template>
  <div class="grid grid-cols-2">
    <span class="timestamp justify-self-start">
      {{ timeFormatted }}
    </span>

    <span class="timestamp justify-self-end">
      {{ durationFormatted }}
    </span>

    <TimelineSlider v-model:time="timeValue" :duration="duration" :playing="playing" class="col-span-full" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { formatSecs } from '@/utils/time'
import { clamp } from '@/utils/math'
import TimelineSlider from '@components/player/TimelineSlider.vue'

const props = defineProps<{
  time: number
  duration: number
  playing: boolean
}>()

const emit = defineEmits<{
  (e: 'update:time', time: number): void
}>()

const timeValue = computed({
  get: (): number => props.time,
  set: (time: number) => emit('update:time', time)
})

const timeFormatted = computed(() => formatSecs(clamp(props.time, 0, props.duration)))
const durationFormatted = computed(() => formatSecs(props.duration))
</script>

<style scoped>
.timestamp {
  @apply text-base text-accent filter-accent-pale tabular-nums whitespace-nowrap;
}
</style>
