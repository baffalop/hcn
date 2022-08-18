<script setup lang="ts">
import { ref, Ref, watch } from 'vue'
import { delta } from '@/utils/math'

const props = defineProps<{
  type: 'audio' | 'video'
  src: string
  playing: boolean
  time: number
}>()

const emit = defineEmits<{
  (e: 'update:playing', playing: boolean): void
  (e: 'update:time', time: number): void
  (e: 'update:duration', duration: number): void
}>()

const media: Ref<HTMLMediaElement|null> = ref(null)

watch(() => props.playing, playing => {
  playing ? media.value?.play() : media.value?.pause()
})

watch(() => props.time, (time, oldTime) => {
  if (media.value && delta(time, oldTime) > 0.5) {
    media.value.currentTime = time
  }
})

function updateTime (): void {
  if (media.value) emit('update:time', media.value.currentTime)
}

function updateDuration (): void {
  if (media.value) emit('update:duration', media.value.duration)
}

function notPlaying (): void {
  emit('update:playing', false)
}
</script>

<template>
  <component
    :is="type"
    ref="media"
    :src="src"
    @timeupdate="updateTime"
    @durationchange="updateDuration"
    @ended="notPlaying"
  />
</template>

<style scoped>
</style>
