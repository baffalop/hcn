<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'

import { Track, tracks } from '@/data/tracks'
import { formatSecs } from '@/utils/time'
import Media from '@components/Media.vue'
import Timeline from '@components/Timeline.vue'

const props = defineProps<{
  track: Track
}>()

const hasPlayed = ref(false)
const playing = ref(false)
const duration = ref(props.track.duration)
const time = ref(0)

const durationFormatted = computed(() => formatSecs(duration.value))
const timeFormatted = computed(() => formatSecs(time.value))

watch(() => playing.value, playing => {
  if (playing) hasPlayed.value = true
})

const trackIndex = computed<number>(() => tracks.findIndex(track => track.slug === props.track.slug))
const nextTrack = computed<Track|null>(() => getTrack(1))
const prevTrack = computed<Track|null>(() => getTrack(-1))

const src = computed<string>(() => `/video/${props.track.slug}.mp4`)

watch(() => props.track, () => {
  hasPlayed.value = false
  clearMediaMetadata()
})

watch(() => hasPlayed.value, hasPlayed => {
  if (hasPlayed && props.track) {
    setMediaMetadataFrom(props.track)
  }
})

onUnmounted(() => {
  clearMediaMetadata()
})

function getTrack (offset: number): Track|null {
  if (trackIndex.value === -1) {
    return null
  }

  return tracks[trackIndex.value + offset] ?? null
}

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

    <div class="grid grid-cols-2 gap-2">
      <Timeline
        v-model:time="time"
        :resolution="34"
        :duration="duration"
        :playing="playing"
        class="col-span-full"
      />

      <span class="justify-self-start text-base tabular-nums whitespace-nowrap">
        {{ timeFormatted }}
      </span>

      <span class="justify-self-end text-base tabular-nums whitespace-nowrap">
        {{ durationFormatted }}
      </span>
    </div>

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

    <div class="grid grid-cols-2 items-start mt-8">
      <RouterLink
        v-if="prevTrack"
        :to="{ name: 'player', params: { slug: prevTrack.slug } }"
        class="justify-self-start -ml-12"
      >
        &lt; {{ prevTrack.title }}
      </RouterLink>

      <RouterLink
        v-if="nextTrack"
        :to="{ name: 'player', params: { slug: nextTrack.slug } }"
        class="justify-self-end col-start-2 -mr-12"
      >
        {{ nextTrack.title }} &gt;
      </RouterLink>
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
