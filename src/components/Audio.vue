<script setup lang="ts">
import { ref, Ref, watch } from 'vue'
import { delta } from '@/utils/math'

const props = defineProps<{
  src: string
  playing: boolean
  time: number
}>()

const emit = defineEmits<{
  (e: 'update:playing', playing: boolean): void
  (e: 'update:time', time: number): void
  (e: 'update:duration', duration: number): void
}>()

const audio: Ref<HTMLAudioElement|null> = ref(null)

watch(() => props.playing, playing => {
  playing ? audio.value?.play() : audio.value?.pause()
})

watch(() => props.time, (time, oldTime) => {
  if (audio.value && delta(time, oldTime) > 0.5) {
    audio.value.currentTime = time
  }
})

function updateTime (): void {
  if (audio.value) emit('update:time', audio.value.currentTime)
}

function updateDuration (): void {
  if (audio.value) emit('update:duration', audio.value.duration)
}

function notPlaying (): void {
  emit('update:playing', false)
}
</script>

<template>
  <audio
    ref="audio"
    :src="src"
    @timeupdate="updateTime"
    @durationchange="updateDuration"
    @ended="notPlaying"
  />
</template>

<style scoped>
</style>
