<template>
  <FileDrop class="h-full" @drop="onVideoFileDrop">
    <div class="player grid h-full grid-cols-1 gap-14 w-5/6 max-w-screen-md mx-auto content-center justify-items-center items-center">
      <div class="flex items-center justify-between w-full self-end">
        <RouterLink :to="{ name: 'menu' }" title="Back" class="w-10 text-gray-100 hover:text-gray-100">
          <Icon viewbox="0 20 300 300" src="/icon/arrow-back-bend.svg" />
        </RouterLink>

        <button :title="`Transcriptions ${showTranscript ? 'off' : 'on'}`" class="w-10" @click="showTranscript = !showTranscript">
          <Icon v-show="showTranscript" src="/icon/transcript-bubble-off.svg" />
          <Icon v-show="!showTranscript" src="/icon/transcript-bubble.svg" />
        </button>
      </div>

      <div class="space-y-3">
        <h2 class="text-4xl">{{ track.title }}</h2>
        <ClippingText :text="track.artist" class="text-3xl backdrop-filter-accent" />
      </div>

      <div class="h-32 w-full">
        <Transition mode="out-in" name="staggered" :duration="{ leave: 700, enter: 1100 }">
          <div v-if="!hasEnded" key="controls" class="h-32 w-full space-y-14">
            <div class="controls flex items-center justify-center gap-10">
              <button class="control" title="Back 10 seconds" @click="skip(-10)">
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

              <button class="control" title="Forward 10 seconds" @click="skip(10)">
                <Icon src="/icon/ffw-plain.svg" />
              </button>
            </div>

            <Timeline v-model:time="time" :duration="duration" :playing="playing" class="w-full" />
          </div>

          <div v-else class="grid grid-cols-2 gap-10 place-items-center h-24">
            <button class="control !w-12 !h-12 justify-self-end" title="Replay" @click="replay">
              <Icon src="/icon/rew-plain.svg" />
            </button>

            <RouterLink
              v-if="nextTrack"
              :to="{ name: 'player', params: { slug: nextTrack.slug } }"
              class="w-12 h-12 justify-self-start text-gray-100 hover:text-gray-100"
            >
              <button title="Next Track" class="w-full h-full">
                <Icon src="/icon/chevron-back.svg" class="transform -scale-100" />
              </button>
            </RouterLink>

            <div class="col-span-full">
              <p>
                With grateful thanks to:
              </p>

              <p>
                {{ track.credits }}
              </p>
            </div>
          </div>
        </Transition>
      </div>

      <div class="relative">
        <DroppableTranscript
          :enabled="showTranscript"
          :transcript="track.transcript ?? []"
          :time="time"
          class="-mt-6"
          @message="toast?.show($event, 'short')"
          @cancel-message="toast?.dismiss()"
        />

        <Toast ref="toast" />
      </div>

      <Media
        ref="audio"
        type="audio"
        :src="`/audio/${props.track.slug}.mp3`"
        preload="auto"
        v-model:time="time"
        :playing="playState === PlayState.Playing"
        @update:playing="onMediaPlaying"
        @update:duration="duration = $event"
        @update:state="audioState = $event"
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
        @update:state="videoState = $event"
      />
    </div>
  </FileDrop>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { Track, tracks } from '@/data/tracks'
import { Transcription } from '@components/player/Transcript.vue'
import { clamp, delta } from '@/utils/math'
import { formatSecs } from '@/utils/time'
import { useMediaSession } from '@/composable/media'
import { useLocalStorage } from '@/composable/localStorage'
import { setTheme } from '@/composable/theme'

import Media, { MediaState } from '@components/player/Media.vue'
import Timeline from '@components/player/Timeline.vue'
import Icon from '@components/Icon.vue'
import DroppableTranscript from '@components/player/DroppableTranscript.vue'
import FileDrop from '@components/FileDrop.vue'
import Toast from '@components/Toast.vue'
import ClippingText from '@components/ClippingText.vue'

const SYNC_THRESHOLD_SECS = 2

const props = defineProps<{
  track: Track
}>()

const emit = defineEmits<{
  (e: 'update:time', time: number): void
}>()

enum PlayState {
  Paused,
  Playing,
  Suspended,
  Error,
}

const playing = ref(false)
const duration = ref(props.track.duration)
const videoTime = ref(0)

const time = useLocalStorage(
  computed(() => `player.position.${props.track.slug}`),
  0,
  t => t.toFixed(1),
  parseFloat,
  (newTime, oldTime) => delta(newTime, oldTime) > 1 || newTime >= duration.value - 0.1,
)

const audioState = ref(MediaState.Waiting)
const videoState = ref(MediaState.Waiting)

const playState = computed<PlayState>(() => {
  if (!playing.value) {
    return PlayState.Paused
  }

  if (atLeastOneMediaIs(MediaState.Waiting)) {
    return PlayState.Suspended
  }

  if (audioState.value === MediaState.Error) {
    return PlayState.Error
  }

  return PlayState.Playing
})

const showTranscript = useLocalStorage('player.transcriptEnabled', false)
const hasEnded = computed<boolean>(() => time.value >= duration.value - 0.1)

setTheme(computed(
  () => props.track.bgColor
    ? { color: props.track.bgColor }
    : {
      class: {
        bg: 'bg-stone-600',
        text: 'text-stone-600',
      }
    }
))

type MediaInstance = InstanceType<typeof Media>
const audio = ref<MediaInstance|null>(null)
const video = ref<MediaInstance|null>(null)
const toast = ref<InstanceType<typeof Toast>>()

function onClickPlayPause () {
  playing.value = !playing.value
  if (playing.value) {
    video.value?.play()
    audio.value?.play()
  }
}

function skip (interval: number): void {
  time.value = clamp(time.value + interval, 0, duration.value - 0.1)
}

function replay (): void {
  time.value = 0
  playing.value = true
}

watch(() => time.value, time => {
  emit('update:time', time)

  if (delta(time, videoTime.value) > SYNC_THRESHOLD_SECS) {
    console.log(`syncing video (${formatSecs(videoTime.value)}) to audio (${formatSecs(time)})`)
    videoTime.value = time
  }
})

watch(() => playState.value, state => {
  if (state === PlayState.Error) {
    playing.value = false
    toast.value?.show('Error loading audio. Please check your network and try again.', 'long')
  }
})

watch(() => videoState.value, state => {
  if (state === MediaState.Error) {
    toast.value?.show('Error loading video', 'long')
  }
})

useMediaSession(computed(() => props.track), playing, time)

const trackIndex = computed<number>(() => tracks.findIndex(track => track.slug === props.track.slug))
const nextTrack = computed<Track|null>(() => getTrack(1))

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
  return audioState.value === state || videoState.value === state
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
@tailwind components;

.player {
  grid-template-rows: 1fr max-content max-content minmax(max-content, 1fr);
}

.control {
  @apply w-8 h-8;
}

.staggered-enter-active > *, .staggered-leave-active > * {
  transition-property: transform, opacity;
  @apply transform duration-300 ease-in-out;
}

.staggered-enter-active > * {
  @apply duration-700;
}

.staggered-enter-active > :nth-child(2), .staggered-leave-active > :nth-last-child(2) {
  @apply delay-200;
}

.staggered-enter-active > :nth-child(3), .staggered-leave-active > :nth-last-child(3) {
  @apply delay-400;
}

.staggered-enter-from > * {
  @apply -translate-y-6 opacity-0;
}

.staggered-enter-to > * {
  @apply translate-y-0 opacity-100;
}

.staggered-leave-to > * {
  @apply translate-y-0 opacity-100;
}

.staggered-leave-to > * {
  @apply translate-y-6 opacity-0;
}
</style>
