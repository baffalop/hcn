<template>
  <div
    class="h-full flex flex-col mx-auto w-4/5 max-w-lg"
    :class="{ 'justify-center': playerLaunched }"
  >
    <h2 class="text-4xl mb-14" :class="{ 'mt-36': !playerLaunched }">{{ track?.title }}</h2>

    <Timeline v-if="playerLaunched" v-model:time="time" :duration="duration" :playing="playing" />

    <div class="flex items-start justify-center gap-6 -mt-2">
      <button v-if="playerLaunched" class="control" @click="time -= 10">
        <img src="/icon/rew-simple.svg" alt="Back 10 seconds">
      </button>

      <button
        class="control flex-shrink-0"
        :class="{ '!w-16': !playerLaunched }"
        @click="onClickPlayPause"
      >
        <img v-show="!playing" src="/icon/play-simple.svg" alt="Play">
        <img v-show="playing" src="/icon/pause-simple.svg" alt="Pause">
      </button>

      <button v-if="playerLaunched" class="control" @click="time += 10">
        <img src="/icon/ffw-simple.svg" alt="Forward 10 seconds">
      </button>

      <TrackCredits v-if="!playerLaunched" />
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
      :src="`/video/${track.slug}.mp4`"
      preload="auto"
      playsinline
      class="fixed inset-0 -z-10 w-screen h-screen object-cover transition-opacity duration-500"
      :class="playing ? 'opacity-100' : 'opacity-0'"
      v-model:time="time"
      v-model:playing="playing"
      @update:duration="duration = $event"
      @ended="onEnded"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { Track, tracks } from '@/data/tracks'
import { useMediaMetadata } from '@/composable/media'
import { useLocalStorage } from '@/composable/localStorage'
import Media from '@components/player/Media.vue'
import Timeline from '@components/player/Timeline.vue'
import { delta } from '@/utils/math'
import TrackCredits from '@components/TrackCredits.vue'

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

// before player is launched, we show track credits and no media controls other than play
// afterwards, track credits are minimised, show media controls
const playerLaunched = ref(false)

watch(() => playing.value, playing => {
  if (playing) playerLaunched.value = true
})

watch(() => time.value, time => {
  if (time > 0) playerLaunched.value = true
})

const trackIndex = computed<number>(() => tracks.findIndex(track => track.slug === props.track.slug))
const nextTrack = computed<Track|null>(() => getTrack(1))
const prevTrack = computed<Track|null>(() => getTrack(-1))

useMediaMetadata(ref(props.track), playing)

useLocalStorage(
  computed(() => `${props.track.slug}_position`),
  time,
  t => t.toFixed(1),
  parseFloat,
  (t1, t2) => delta(t1, t2) > 1,
)

function onEnded (): void {
  setTimeout(() => playerLaunched.value = false, 1500)
}

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
</style>
