<script setup lang="ts">
import { Ref, ref, watch } from 'vue'

import Timeline from './components/Timeline.vue'

const playing = ref(false)
const duration = ref(1)
const time = ref(0)

const audio: Ref<HTMLAudioElement|null> = ref(null)

watch(playing, playing => playing ? audio.value?.play() : audio.value?.pause())

function seek (t: number): void {
  if (audio.value) audio.value.currentTime = t
}

function updateTime (): void {
  if (audio.value) time.value = audio.value.currentTime
}

function updateDuration (): void {
  if (audio.value) duration.value = audio.value.duration
}
</script>

<template>
  <div class="flex items-center gap-4">
    <button class="text-lg cursor-pointer" @click="playing = !playing">▶</button>
    <Timeline
      v-model:time="time"
      :resolution="34"
      :duration="duration"
      :playing="playing"
      @update:time="seek"
    />
  </div>

  <audio
    ref="audio"
    src="/example.mp3"
    preload="auto"
    @timeupdate="updateTime"
    @durationchange="updateDuration"
  />
</template>

<style scoped>
</style>
