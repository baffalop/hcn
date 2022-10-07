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

const media: Ref<HTMLMediaElement|null> = ref(null)

watch(() => media.value, media => {
  if (media !== null) media.currentTime = props.time
})

watch(() => props.playing, playing => {
  if (!playing) media.value?.pause()
})

watch(() => props.time, (time, oldTime) => {
  if (media.value && delta(time, oldTime) > 0.5) {
    media.value.currentTime = time
  }
})

function play (): void {
  media.value?.play()
}

function updatePlaying (playing: boolean): void {
  emit('update:playing', playing)
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
