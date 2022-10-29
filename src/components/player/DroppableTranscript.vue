<template>
  <FileDrop @drop="onDrop">
    <Transcript :transcription="droppedTranscription ?? transcription" :time="time" />
  </FileDrop>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SrtParser from 'srt-parser-2'

import FileDrop from '@components/FileDrop.vue'
import Transcript, { Transcription } from '@components/player/Transcript.vue'

const props = defineProps<{
  transcription: Transcription
  time: number
}>()

const parser = ref<SrtParser|null>(null)
const droppedTranscription = ref<Transcription|null>()

async function onDrop (file: File): Promise<void> {
  try {
    droppedTranscription.value = await parseFile(file)
  } catch (e) {
    alert('Wrong file type: please drop a .srt file')
  }
}

async function parseFile (file: File): Promise<Transcription> {
  if (!looksLikeSrt(file)) {
    throw new Error('no .srt extension')
  }

  const contents = await file.text()

  if (parser.value === null) {
    parser.value = new SrtParser()
  }

  const parsed = parser.value.fromSrt(contents)
  return parsed.map(({ text, startSeconds, endSeconds }) => ({
    text,
    start: startSeconds,
    end: endSeconds,
  }))
}

function looksLikeSrt (file: File): boolean {
  return /\.srt$/.test(file.name)
}

</script>

<style scoped>
</style>
