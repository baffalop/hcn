<template>
  <FileDrop @drop="onDrop">
    <Transcript :transcription="transcription" :time="time" />
  </FileDrop>
</template>

<script setup lang="ts">
import FileDrop from '@components/FileDrop.vue'
import Transcript, { Transcription } from '@components/player/Transcript.vue'

const props = defineProps<{
  transcription: Transcription
  time: number
}>()

function onDrop (file: File): void {
  console.log('drop', file)
}

</script>

<style scoped>
</style>
