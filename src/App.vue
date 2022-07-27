<script setup lang="ts">
import { ref } from 'vue'
import Audio from './components/Audio.vue'

import Timeline from './components/Timeline.vue'

const playing = ref(false)
const duration = ref(1)
const time = ref(0)
</script>

<template>
  <div class="flex items-center gap-4">
    <button class="text-lg cursor-pointer" @click="playing = !playing">▶</button>
    <Timeline
      v-model:time="time"
      :resolution="34"
      :duration="duration"
      :playing="playing"
    />
  </div>

  <Audio
    src="/example.mp3"
    preload="auto"
    v-model:time="time"
    v-model:playing="playing"
    @update:duration="duration = $event"
  />
</template>

<style scoped>
</style>
