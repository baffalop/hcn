<template>
  <FileDrop @drop="onDrop">
    <Transcript :transcription="transcription" :time="time" />
  </FileDrop>
</template>

<script setup lang="ts">
import FileDrop from '@components/FileDrop.vue'
import Transcript, { Transcription } from '@components/player/Transcript.vue'
import { ref } from 'vue'

const props = defineProps<{
  transcription: Transcription
  time: number
}>()

const droppedSrt = ref<string|null>()

async function onDrop (file: File): Promise<void> {
  try {
    await parseFile(file)
  } catch (e) {
    alert('Wrong file type: please drop a .srt file')
  }
}

async function parseFile (file: File): Promise<void> {
  if (!looksLikeSrt(file)) {
    throw new Error('no .srt extension')
  }

  droppedSrt.value = await file.text()
  console.log('srt', droppedSrt.value)
}

function looksLikeSrt (file: File): boolean {
  return /\.srt$/.test(file.name)
}

</script>

<style scoped>
</style>
