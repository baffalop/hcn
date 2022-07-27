<script setup lang="ts">
import { Ref, ref, watch } from 'vue'

import Timeline from './components/Timeline.vue'

const playing = ref(false)
const duration = ref(1)
const time = ref(0)

const audio: Ref<HTMLAudioElement|null> = ref(null)

watch(playing, playing => playing ? audio.value?.play() : audio.value?.pause())

function updateTime (t: number): void {
  if (audio.value) audio.value.currentTime = t
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
      @update:time="updateTime"
    />
  </div>

  <audio
    ref="audio"
    src="/example.mp3"
    preload
    @timeupdate="time = $event.target.currentTime"
    @durationchange="duration = $event.target.duration"
  />
</template>

<style scoped>
</style>
