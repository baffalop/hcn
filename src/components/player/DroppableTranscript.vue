<template>
  <FileDrop @drop="onDrop">
    <Transcript
      :enabled="enabled"
      :transcript="droppedTranscript ?? transcript"
      :time="time"
      @message="emit('message', $event)"
      @cancel-message="emit('cancel-message')"
    />
  </FileDrop>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SrtParser from 'srt-parser-2'

import FileDrop from '@components/FileDrop.vue'
import Transcript, { Transcription } from '@components/player/Transcript.vue'

const props = withDefaults(defineProps<{
  enabled?: boolean
  transcript: Transcription
  time: number
}>(), {
  enabled: true
})

const emit = defineEmits<{
  (e: 'message', message: string): void
  (e: 'cancel-message'): void
}>()

const droppedTranscript = ref<Transcription|null>()

async function onDrop (file: File): Promise<void> {
  try {
    droppedTranscript.value = await parseFile(file)
  } catch (e) {
    alert('Invalid file: please drop a .srt file')
  }
}

async function parseFile (file: File): Promise<Transcription> {
  if (!looksLikeSrt(file)) {
    throw new Error('no .srt extension')
  }

  const contents = await file.text()
  const parsed = new SrtParser().fromSrt(contents)

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
