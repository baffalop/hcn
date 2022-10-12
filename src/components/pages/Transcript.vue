<template>
  <div class="h-full flex flex-col justify-center mx-auto w-4/5 max-w-lg">
    <Player :track="track" />
  </div>
</template>

<script setup lang="ts">

import { Track } from '@/data/tracks'
import Player from '@components/pages/Player.vue'

const props = defineProps<{
  track: Track
}>()

</script>

<style scoped>
</style>
