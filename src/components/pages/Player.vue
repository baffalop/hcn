<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import Media from '@components/Media.vue'
import Timeline from '@components/Timeline.vue'

const playing = ref(false)
const duration = ref(1)
const time = ref(0)

const route = useRoute()
const src = computed(() => `/video/${route.params.slug}.mp4`)
</script>

<template>
  <div class="space-y-8 w-3/4 max-w-lg">
    <Timeline
      v-model:time="time"
      :resolution="34"
      :duration="duration"
      :playing="playing"
    />

    <div class="flex items-center justify-center gap-6">
      <button class="control" @click="time -= 10">
        <img src="/icon/rew-simple.svg" alt="Back 10 seconds">
      </button>

      <button class="control" @click="playing = !playing">
        <img v-show="!playing" src="/icon/play-simple.svg" alt="Play">
        <img v-show="playing" src="/icon/pause-simple.svg" alt="Pause">
      </button>

      <button class="control" @click="time += 10">
        <img src="/icon/ffw-simple.svg" alt="Forward 10 seconds">
      </button>
    </div>

    <Media
      type="video"
      :src="src"
      preload="auto"
      playsinline
      class="fixed inset-0 -z-10 w-screen h-screen object-cover transition-opacity duration-500"
      :class="playing ? 'opacity-100' : 'opacity-0'"
      v-model:time="time"
      v-model:playing="playing"
      @update:duration="duration = $event"
    />
  </div>
</template>

<style scoped>
video {
  filter: invert(0.8) brightness(0.4) sepia(1) saturate(1.5) hue-rotate(139deg);
}

.control {
  @apply cursor-pointer w-10 invert;
}
</style>
