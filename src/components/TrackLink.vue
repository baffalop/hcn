<template>
  <RouterLink
    :to="{ name: 'player', params: { slug: track.slug } }"
    class="grid grid-cols-2 gap-1 gap-x-2 p-3 font-editorial justify-items-start items-end min-w-max max-w-max"
  >
    <span class="col-span-full text-xl">{{ track.title }}</span>
    <span class="filter-accent" v-bind="themeAttrs('text', theme)">
      {{ track.artist }}
    </span>
    <span class="font-agrandir text-base filter-accent-pale" v-bind="themeAttrs('text', theme)">
      {{ durationFormatted }}
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import { inject } from 'vue'

import { Track } from '@/data/tracks'
import { formatSecs } from '@/utils/time'
import { themeKey, themeAttrs } from '@/composable/theme'

const props = defineProps<{
  track: Track
}>()

const theme = inject(themeKey)

const durationFormatted = formatSecs(props.track.duration)
</script>

<style scoped>
.grid {
  grid-template-columns: auto 1fr;
}
</style>
