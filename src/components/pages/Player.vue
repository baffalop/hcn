<template>
  <FileDrop class="h-full" @drop="onVideoFileDrop">
    <div class="player grid h-full grid-cols-1 gap-10 content-center justify-items-center">
      <h2 class="text-4xl place-self-end justify-self-center">{{ track.title }}</h2>

      <Timeline v-model:time="time" :duration="duration" :playing="playing" class="w-4/5 max-w-lg" />

      <div class="flex items-center justify-center gap-6 -mt-12">
        <button class="control" @click="time -= 10">
          <img src="/icon/rew-simple.svg" alt="Back 10 seconds">
        </button>

        <button
          class="control transition-opacity duration-500"
          :class="playState === PlayState.Suspended ? 'opacity-50' : 'opacity-100'"
          @click="onClickPlayPause"
        >
          <img v-show="!playing" src="/icon/play-simple.svg" alt="Play">
          <img v-show="playing" src="/icon/pause-simple.svg" alt="Pause">
        </button>

        <button class="control" @click="time += 10">
          <img src="/icon/ffw-simple.svg" alt="Forward 10 seconds">
        </button>
      </div>

      <DroppableTranscript :transcript="track.transcript ?? []" :time="time" />

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
        :playing="playState === PlayState.Playing"
        @update:playing="onMediaPlaying"
        @update:duration="duration = $event"
        @waiting="onMediaStateChange('audio', MediaState.Waiting)"
        @canplay="onMediaStateChange('audio', MediaState.CanPlay)"
      />

      <Media
        ref="video"
        type="video"
        :src="droppedVideoUrl ?? `/video/${props.track.slug}.mp4`"
        v-model:time="videoTime"
        :playing="playState === PlayState.Playing"
        muted
        preload="auto"
        playsinline
        class="fixed inset-0 -z-10 w-screen h-screen object-cover transition-opacity duration-500"
        :class="playState === PlayState.Playing ? 'opacity-100' : 'opacity-0'"
        @waiting="onMediaStateChange('video', MediaState.Waiting)"
        @canplay="onMediaStateChange('video', MediaState.CanPlay)"
      />
    </div>
  </FileDrop>
</template>

<script setup lang="ts">
import { computed, ref, UnwrapRef, watch } from 'vue'

import { Track, tracks } from '@/data/tracks'
import { delta } from '@/utils/math'
import { formatSecs } from '@/utils/time'
import { useMediaSession } from '@/composable/media'
import { useLocalStorage } from '@/composable/localStorage'
import Media from '@components/player/Media.vue'
import Timeline from '@components/player/Timeline.vue'
import DroppableTranscript from '@components/player/DroppableTranscript.vue'
import FileDrop from '@components/FileDrop.vue'
import { Transcription } from '@components/player/Transcript.vue'

const SYNC_THRESHOLD_SECS = 2

const props = defineProps<{
  track: Track
}>()

const emit = defineEmits<{
  (e: 'update:time', time: number): void
}>()

enum MediaState {
  Waiting,
  CanPlay,
}

enum PlayState {
  Paused,
  Playing,
  Suspended,
}

const playing = ref(false)
const duration = ref(props.track.duration)
const time = ref(0)
const videoTime = ref(0)

type MediaInstance = InstanceType<typeof Media>
const audio = ref<MediaInstance|null>(null)
const video = ref<MediaInstance|null>(null)

function onClickPlayPause () {
  playing.value = !playing.value
  if (playing.value) {
    video.value?.play()
    audio.value?.play()
  }
}

watch(() => time.value, time => {
  emit('update:time', time)

  if (delta(time, videoTime.value) > SYNC_THRESHOLD_SECS) {
    console.log(`syncing video (${formatSecs(videoTime.value)}) to audio (${formatSecs(time)})`)
    videoTime.value = time
  }
})

useMediaSession(ref(props.track), playing, time)

useLocalStorage(
  computed(() => `${props.track.slug}.position`),
  time,
  t => t.toFixed(1),
  parseFloat,
  (t1, t2) => delta(t1, t2) > 1,
)

const mediaStates = ref({
  audio: MediaState.Waiting,
  video: MediaState.Waiting,
})

const playState = computed<PlayState>(() => {
  if (!playing.value) {
    return PlayState.Paused
  }

  if (atLeastOneMediaIs(MediaState.Waiting)) {
    return PlayState.Suspended
  }

  return PlayState.Playing
})

const trackIndex = computed<number>(() => tracks.findIndex(track => track.slug === props.track.slug))
const nextTrack = computed<Track|null>(() => getTrack(1))
const prevTrack = computed<Track|null>(() => getTrack(-1))

function onMediaStateChange (mediaKey: keyof UnwrapRef<typeof mediaStates>, state: MediaState): void {
  mediaStates.value[mediaKey] = state
}

function onMediaPlaying (nowPlaying: boolean): void {
  // break feedback loop of media reporting it's paused when it's been paused to wait for the other media
  if (!nowPlaying && playState.value === PlayState.Suspended) {
    return
  }

  playing.value = nowPlaying
}

function getTrack (offset: number): Track|null {
  if (trackIndex.value === -1) {
    return null
  }

  return tracks[trackIndex.value + offset] ?? null
}

function atLeastOneMediaIs (state: MediaState): boolean {
  return mediaStates.value.audio === state || mediaStates.value.video === state
}

const droppedVideo = ref<File|null>(null)
const droppedVideoUrl = computed<string|null>(() => {
  if (droppedVideo.value === null) {
    return null
  }

  return URL.createObjectURL(droppedVideo.value)
})

function onVideoFileDrop (file: File): void {
  if (file.type !== 'video/mp4') {
    console.log('wrong type', file.type)
    return
  }

  droppedVideo.value = file

  if (playing.value) {
    video.value?.play()
  }
}

</script>

<style scoped>
.player {
  grid-template-rows: 1.2fr min-content min-content 1fr;
}

.control {
  @apply cursor-pointer w-10 invert;
}
</style>
