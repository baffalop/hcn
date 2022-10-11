<template>
  <div class="h-full flex flex-col justify-center items-center" :class="{ placeholder }">
    <h2 class="text-4xl mb-14">{{ track.title }}</h2>

    <Timeline v-model:time="time" :duration="duration" :playing="playing" class="w-4/5 max-w-lg" />

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

    <div class="background fixed inset-0 -z-20" :style="{ backgroundColor: track.bgColor ?? 'unset' }"></div>

    <Media
      ref="audio"
      type="audio"
      :src="`/audio/${props.track.slug}.mp3`"
      preload="auto"
      v-model:time="time"
      v-model:playing="playing"
      @update:duration="duration = $event"
    />

    <Media
      ref="video"
      type="video"
      :src="`/video/${props.track.slug}.mp4`"
      muted
      preload="auto"
      playsinline
      class="fixed inset-0 -z-10 w-screen h-screen object-cover transition-opacity duration-500"
      :class="playing ? 'opacity-100' : 'opacity-0'"
      v-model:time="videoTime"
      v-model:playing="playing"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { Track, tracks } from '@/data/tracks'
import { delta } from '@/utils/math'
import { useMediaMetadata } from '@/composable/media'
import { useLocalStorage } from '@/composable/localStorage'
import Media from '@components/player/Media.vue'
import Timeline from '@components/player/Timeline.vue'
import { formatSecs } from '@/utils/time'

const SYNC_THRESHOLD = 0.5

const props = defineProps<{
  track: Track
}>()

const playing = ref(false)
const duration = ref(props.track.duration)
const time = ref(0)
const videoTime = ref(0)

const hasPlayed = ref(false)
watch(() => playing.value, playing => {
  if (playing) hasPlayed.value = true
})

watch(() => time.value, time => {
  if (delta(time, videoTime.value) > SYNC_THRESHOLD) {
    console.log(`syncing video (${formatSecs(videoTime.value)}) to audio (${formatSecs(time)})`)
    videoTime.value = time
  }
})

type MediaInstance = InstanceType<typeof Media>
const audio = ref<MediaInstance|null>(null)

function onClickPlayPause () {
  playing.value = !playing.value
  if (playing.value) {
    audio.value?.play()
  }
}

const trackIndex = computed<number>(() => tracks.findIndex(track => track.slug === props.track.slug))
const nextTrack = computed<Track|null>(() => getTrack(1))
const prevTrack = computed<Track|null>(() => getTrack(-1))

// TODO remove once all track videos are real
const placeholderTracks = [
  'restrictions-and-ejection',
  'saying-goodbye',
  'wire-and-fences',
]
const placeholder = computed<boolean>(() => placeholderTracks.includes(props.track.slug))

useMediaMetadata(ref(props.track), hasPlayed)

useLocalStorage(
  computed(() => `${props.track.slug}.position`),
  time,
  t => t.toFixed(1),
  parseFloat,
  (t1, t2) => delta(t1, t2) > 1,
)

function getTrack (offset: number): Track|null {
  if (trackIndex.value === -1) {
    return null
  }

  return tracks[trackIndex.value + offset] ?? null
}

</script>

<style scoped>
.placeholder video {
  filter: invert(0.8) brightness(0.4) sepia(1) saturate(1.5) hue-rotate(139deg);
}

.control {
  @apply cursor-pointer w-10 invert;
}
</style>
