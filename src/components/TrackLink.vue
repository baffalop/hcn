<template>
  <RouterLink
    :to="{ name: 'player', params: { slug: track.slug } }"
    class="grid grid-cols-2 gap-1 gap-x-2 p-3 justify-items-start items-end max-w-max font-editorial"
  >
    <span class="col-span-full">{{ track.title }}</span>
    <span>{{ track.artist }}</span>
    <span class="font-agrandir text-neutral-300 text-base">{{ durationFormatted }}</span>
  </RouterLink>
</template>

<script setup lang="ts">
import { Track } from '@/data/tracks'
import { formatSecs } from '@/utils/time'

const props = defineProps<{
  track: Track,
}>()

const durationFormatted = formatSecs(props.track.duration)
</script>

<style scoped>
.grid {
  grid-template-columns: auto 1fr;
}
</style>
