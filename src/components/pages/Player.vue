<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { fromSlug, Track } from '@/data/tracks'
import Media from '@components/Media.vue'
import Timeline from '@components/Timeline.vue'

const hasPlayed = ref(false)
const playing = ref(false)
const duration = ref(1)
const time = ref(0)

watch(() => playing.value, playing => {
  if (playing) hasPlayed.value = true
})

const route = useRoute()
const slug = computed<string>(() => route.params.slug as string)
const src = computed<string>(() => `/video/${slug.value}.mp4`)
const track = computed<Track|null>(() => fromSlug(slug.value))

watch(() => track.value, () => {
  hasPlayed.value = false
  clearMediaMetadata()
})

watch(() => hasPlayed.value, hasPlayed => {
  if (hasPlayed && track.value) {
    setMediaMetadataFrom(track.value)
  }
})

onUnmounted(() => {
  clearMediaMetadata()
})

function setMediaMetadataFrom (track: Track): void {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: 'Linda O\'Keefe',
  })
}

function clearMediaMetadata (): void {
  navigator.mediaSession.playbackState = 'none'
}
</script>

<template>
  <div class="w-3/4 max-w-lg">
    <h2 class="text-4xl mb-14">{{ track?.title }}</h2>

    <Timeline
      v-model:time="time"
      :resolution="34"
      :duration="duration"
      :playing="playing"
    />

    <div class="flex items-center justify-center gap-6 -mt-2">
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
