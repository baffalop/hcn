<template>
  <component
    :is="type"
    ref="media"
    :src="src"
    :loop="loop"
    @play="updatePlaying(true)"
    @pause="updatePlaying(false)"
    @timeupdate="updateTime"
    @durationchange="updateDuration"
  />
</template>

<script setup lang="ts">
import { ref, Ref, watch } from 'vue'
import { delta } from '@/utils/math'

const props = defineProps<{
  type: 'audio' | 'video'
  src: string
  playing: boolean
  time: number
  loop?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:playing', playing: boolean): void
  (e: 'update:time', time: number): void
  (e: 'update:duration', duration: number): void
}>()

defineExpose({ play })

// iOS quirk: we're only allowed to set currentTime after media is playing
// (bad things happen if it's tampered with before then)
const playPositionInitialised = ref(false)

const media: Ref<HTMLMediaElement|null> = ref(null)

watch(() => props.playing, playing => {
  playing ? media.value?.play() : media.value?.pause()
})

watch(() => props.time, (time, oldTime) => {
  if (media.value && playPositionInitialised.value && delta(time, oldTime) > 0.5) {
    media.value.currentTime = time
  }
})

watch(() => props.src, () => {
  playPositionInitialised.value = false
})

function play (): void {
  media.value?.play()
}

function updatePlaying (playing: boolean): void {
  emit('update:playing', playing)

  if (playing && media.value && !playPositionInitialised.value) {
    media.value.currentTime = props.time
    playPositionInitialised.value = true
  }
}

function updateTime (): void {
  if (media.value) emit('update:time', media.value.currentTime)
}

function updateDuration (): void {
  if (media.value) emit('update:duration', media.value.duration)
}
</script>

<style scoped>
</style>
