<template>
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

    <Transcript :transcription="transcription" :track="track" :time="time" />

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
      :src="`/video/${props.track.slug}.mp4`"
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
import Transcript, { Transcription } from '@components/player/Transcript.vue'

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

const transcription: Transcription = [
  {"start":148.445383,"line":"And not be part of the crowd","end":150.057817},
  {"start":141.622436,"line":"And, it's very very difficult for a kid of that age to resist that temptation","end":148.445383},
  {"start":137.913398,"line":"Things like that as they had in the Hitler Youth","end":141.622436},
  {"start":134.186143,"line":"Uniforms, campfires, learning to shoot rifles","end":137.913398},
  {"start":105.05566,"line":"to resist the temptations the Nazis offered for kids of that age","end":109.756262},
  {"start":101.749868,"line":"You know, it's very difficult for a 12, 13, 14 year-old","end":105.05566},
  {"start":81.545969,"line":"And I probably would","end":83.677251},
  {"start":79.575164,"line":"Would I have been a Nazi?","end":81.545969},
  {"start":73.704323,"line":"sometimes think what I would have been if I hadn't been Jewish","end":79.575164},
  {"start":70.002884,"line":"but I'm concerned that...","end":73.704323},
  {"start":60.522463,"line":"Well obviously my contemporaries who committed these atrocities are dreadful","end":70.002884},
  {"start":54.747394,"line":"Well, you know you're a survivor because you're there","end":60.522463},
  {"start":53.908808,"line":"And, erm...","end":54.747394}
]

</script>

<style scoped>
.player {
  grid-template-rows: 1.2fr min-content min-content 1fr;
}

.control {
  @apply cursor-pointer w-10 invert;
}
</style>
