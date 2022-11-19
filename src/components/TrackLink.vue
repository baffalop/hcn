<template>
  <RouterLink
    :to="{ name: 'player', params: { slug: track.slug } }"
    class="grid grid-cols-2 gap-1 gap-x-2 p-3 font-editorial justify-items-start items-end min-w-max max-w-max"
  >
    <span class="col-span-full text-xl">{{ track.title }}</span>
    <span class="filter-accent" :class="{ 'text-primary-brick-600': !color }" :style="{ color }">
      {{ track.artist }}
    </span>
    <span class="font-agrandir text-base filter-accent-pale" :class="{ 'text-primary-brick': !color }" :style="{ color }">
      {{ durationFormatted }}
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import { Track } from '@/data/tracks'
import { formatSecs } from '@/utils/time'

const props = defineProps<{
  track: Track
  color?: string
}>()

const durationFormatted = formatSecs(props.track.duration)
</script>

<style scoped>
.grid {
  grid-template-columns: auto 1fr;
}
</style>
