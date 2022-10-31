<template>
  <FileDrop class="h-full" @drop="onVideoFileDrop">
    <div class="player grid h-full grid-cols-1 gap-12 p-6 max-w-screen-md mx-auto content-center justify-items-center items-center">
      <div class="flex items-center justify-between w-full self-end">
        <RouterLink :to="{ name: 'index' }" title="Back" class="control text-gray-100 hover:text-gray-100">
          <Icon src="/icon/play-borderless.svg" class="transform -scale-100" />
        </RouterLink>

        <button class="control !w-6 !h-6" :title="`${showTranscript ? 'Hide' : 'Show'} transcriptions`" @click="showTranscript = !showTranscript">
          <Icon src="/icon/menu-borderless.svg" />
        </button>
      </div>

      <h2 class="text-4xl">{{ track.title }}</h2>

      <div class="flex items-center justify-center gap-10">
        <button class="control" title="Back 10 seconds" @click="time -= 10">
          <Icon src="/icon/rew-borderless.svg" />
        </button>

        <button
          class="control !w-14 !h-14 transition-opacity duration-500"
          :class="playState === PlayState.Suspended ? 'opacity-50' : 'opacity-100'"
          :title="playing ? 'Pause' : 'Play'"
          @click="onClickPlayPause"
        >
          <Icon v-show="!playing" src="/icon/play-borderless.svg" />
          <Icon v-show="playing" src="/icon/pause-borderless.svg" />
        </button>

        <button class="control" title="Forward 10 seconds" @click="time += 10">
          <Icon src="/icon/ffw-borderless.svg" />
        </button>
      </div>

      <Timeline v-model:time="time" :duration="duration" :playing="playing" class="w-full" />

      <DroppableTranscript :transcript="track.transcript ?? []" :time="time" :class="{ invisible: !showTranscript }" class="-mt-6" />

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
import Icon from '@components/Icon.vue'
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

const showTranscript = ref(false)

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
  grid-template-rows: 1fr 15% max-content max-content minmax(max-content, 1fr);
}

.control {
  @apply w-8 h-8;
}
</style>
