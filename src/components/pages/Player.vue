<template>
  <div class="w-4/5 max-w-lg">
    <h2 class="text-4xl mb-14">{{ track?.title }}</h2>

    <div class="grid grid-cols-2 gap-1">
      <Timeline
        v-model:time="time"
        :resolution="34"
        :duration="duration"
        :playing="playing"
        class="col-span-full"
      />

      <span class="timestamp justify-self-start">
        {{ timeFormatted }}
      </span>

      <span class="timestamp justify-self-end">
        {{ durationFormatted }}
      </span>
    </div>

    <div class="flex items-center justify-center gap-6 -mt-2">
      <button class="control" @click="time -= 10">
        <img src="/icon/rew-simple.svg" alt="Back 10 seconds">
      </button>

      <button class="control" @click="onClickPlayPause">
        <img v-show="!playing" src="/icon/play-simple.svg" alt="Play">
        <img v-show="playing" src="/icon/pause-simple.svg" alt="Pause">
      </button>

      <button class="control" @click="time += 10">
        <img src="/icon/ffw-simple.svg" alt="Forward 10 seconds">
      </button>
    </div>

    <RouterLink
      v-if="prevTrack"
      :to="{ name: 'player', params: { slug: prevTrack.slug } }"
      class="absolute bottom-14 left-2 w-1/3"
    >
      &lt; {{ prevTrack.title }}
    </RouterLink>

    <RouterLink
      v-if="nextTrack"
      :to="{ name: 'player', params: { slug: nextTrack.slug } }"
      class="absolute bottom-14 right-2 w-1/3"
    >
      {{ nextTrack.title }} &gt;
    </RouterLink>

    <Media
      ref="media"
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

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { Track, tracks } from '@/data/tracks'
import { formatSecs } from '@/utils/time'
import { useMediaMetadata } from '@/composable/media'
import { useLocalStorage } from '@/composable/localStorage'
import Media from '@components/Media.vue'
import Timeline from '@components/Timeline.vue'
import { delta } from '@/utils/math'

const props = defineProps<{
  track: Track
}>()

const playing = ref(false)
const duration = ref(props.track.duration)
const time = ref(0)

type MediaInstance = InstanceType<typeof Media>
const media = ref<MediaInstance|null>(null)

function onClickPlayPause () {
  playing.value = !playing.value
  if (playing.value) {
    media.value?.play()
  }
}

const durationFormatted = computed(() => formatSecs(duration.value))
const timeFormatted = computed(() => formatSecs(time.value))

const trackIndex = computed<number>(() => tracks.findIndex(track => track.slug === props.track.slug))
const nextTrack = computed<Track|null>(() => getTrack(1))
const prevTrack = computed<Track|null>(() => getTrack(-1))

const src = computed<string>(() => `/video/${props.track.slug}.mp4`)

useMediaMetadata(ref(props.track), playing)

const trackStorageKey = computed(() => `${props.track.slug}_position`)
useLocalStorage(
  trackStorageKey,
  time,
  (x, y) => delta(x, y) > 1,
  parseFloat,
)

function getTrack (offset: number): Track|null {
  if (trackIndex.value === -1) {
    return null
  }

  return tracks[trackIndex.value + offset] ?? null
}

</script>

<style scoped>
video {
  filter: invert(0.8) brightness(0.4) sepia(1) saturate(1.5) hue-rotate(139deg);
}

.control {
  @apply cursor-pointer w-10 invert;
}

.timestamp {
  @apply text-base text-gray-300 tabular-nums whitespace-nowrap;
}
</style>
