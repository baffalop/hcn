<template>
  <FileDrop class="h-full" @drop="onVideoFileDrop">
    <div class="player grid h-full grid-cols-1 gap-12 w-5/6 max-w-screen-md mx-auto content-center justify-items-center items-center">
      <div class="flex items-center justify-between w-full self-end">
        <RouterLink :to="{ name: 'index' }" title="Back" class="w-10 text-gray-100 hover:text-gray-100">
          <Icon src="/icon/arrow-back-bend.svg" />
        </RouterLink>

        <button
          :title="`Transcriptions ${showTranscript ? 'off' : 'on'}`"
          class="w-10"
          @click="showTranscript = !showTranscript"
        >
          <Icon v-show="showTranscript" src="/icon/transcript-bubble-off.svg" />
          <Icon v-show="!showTranscript" src="/icon/transcript-bubble.svg" />
        </button>
      </div>

      <h2 class="text-4xl cursor-pointer" :class="titleClass" @click="cycleFont">{{ track.title }}</h2>

      <div class="flex items-center justify-center gap-10">
        <button class="control" title="Back 10 seconds" @click="time -= 10">
          <Icon src="/icon/rew-plain.svg" />
        </button>

        <button
          class="control !w-14 !h-14 transition-opacity duration-500"
          :class="playState === PlayState.Suspended ? 'opacity-50' : 'opacity-100'"
          :title="playing ? 'Pause' : 'Play'"
          @click="onClickPlayPause"
        >
          <Icon v-show="!playing" src="/icon/play-plain.svg" />
          <Icon v-show="playing" src="/icon/pause-plain.svg" />
        </button>

        <button class="control" title="Forward 10 seconds" @click="time += 10">
          <Icon src="/icon/ffw-plain.svg" />
        </button>
      </div>

      <Timeline v-model:time="time" :duration="duration" :playing="playing" class="w-full" />

      <DroppableTranscript :enabled="showTranscript" :transcript="track.transcript ?? []" :time="time" class="-mt-6" />

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
const videoTime = ref(0)

const time = useLocalStorage(
  computed(() => `player.position.${props.track.slug}`),
  0,
  t => t.toFixed(1),
  parseFloat,
  (t1, t2) => delta(t1, t2) > 1,
)

const showTranscript = useLocalStorage('player.transcriptEnabled', false)

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

useMediaSession(computed(() => props.track), playing, time)

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

enum Font {
  AgrandirWide = 0,
  AgrandirNarrow,
  EditorialUltralight,
  EditorialRegular,
}

const fontCount = Object.keys(Font).length / 2

const font = useLocalStorage<Font>('player.title.font', Font.AgrandirWide)

function cycleFont (): void {
  font.value = (font.value + 1) % fontCount
}

const titleClass = computed<string>(() => {
  switch (font.value) {
    case Font.AgrandirWide:
      return 'font-agrandir font-wide'
    case Font.AgrandirNarrow:
      return 'font-agrandir font-narrow'
    case Font.EditorialUltralight:
      return 'font-editorial font-light'
    case Font.EditorialRegular:
      return 'font-editorial font-normal'
  }
})

</script>

<style scoped>
.player {
  grid-template-rows: 1fr 15% max-content max-content minmax(max-content, 1fr);
}

.font-wide {
  font-stretch: normal;
}

.font-narrow {
  font-stretch: condensed;
}

.control {
  @apply w-8 h-8;
}
</style>
