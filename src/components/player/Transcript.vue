<template>
  <TransitionGroup
    tag="div"
    class="h-24 w-screen px-4 flex flex-col justify-center relative"
    name="line"
    move-class="transition-all !duration-500 ease-in-out"
    enter-from-class="!opacity-0 translate-y-10"
    enter-to-class="opacity-100"
    enter-active-class="!duration-700 transition-all ease-in-out transform"
    leave-from-class="opacity-100"
    leave-to-class="!opacity-0 -translate-y-10"
    leave-active-class="!duration-500 ease-in-out absolute w-screen transform"
  >
    <p
      :key="enabled ? previousLine.start.toFixed(0) : 0"
      class="text-gray-100/60 transition-opacity duration-700"
      :class="enabled && hasPreviousLine ? 'opacity-100' : 'opacity-0'"
    >
      {{ enabled ? previousLine.text : '' }}
    </p>

    <p
      :key="enabled ? currentLine.start.toFixed(0) : 0"
      class="text-grey-100 transition-opacity duration-700"
      :class="enabled && hasCurrentLine ? 'opacity-100' : 'opacity-0'"
    >
      {{ enabled ? currentLine.text : '' }}
    </p>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

export type Transcription = TranscriptionLine[]
export interface TranscriptionLine {
  start: number
  end: number
  text: string
}

const props = withDefaults(defineProps<{
  enabled?: boolean
  transcript: Transcription
  time: number
}>(), {
  enabled: true,
})

const emit = defineEmits<{
  (e: 'message', message: string): void
  (e: 'cancel-message'): void
}>()

const EXPIRY_SECS = 4

const currentLine = computed(() => findMostRecentLine(props.transcript, props.time))
const previousLine = computed(() => findMostRecentLine(
  props.transcript.filter(line => line.text !== currentLine.value.text),
  props.time
))

const hasCurrentLine = computed(() => isExtant(currentLine.value))
const hasPreviousLine = computed(() => isExtant(previousLine.value))

watch(() => props.enabled, enabled => {
  if (!hasCurrentLine.value) {
    emit('message', `Transcriptions ${enabled ? 'on' : 'off'}`)
  }
})

watch(() => hasCurrentLine.value, has => {
  if (has) {
    emit('cancel-message')
  }
})

function findMostRecentLine (lines: TranscriptionLine[], time: number): TranscriptionLine {
  return lines.reduce((prev, cur) => {
    if (cur.start > time) return prev
    return cur.start > prev.start ? cur : prev
  }, blankLine())
}

function isExtant (line: TranscriptionLine): boolean {
  return !!line.end && props.time - line.end < EXPIRY_SECS
}

function blankLine (): TranscriptionLine {
  return { start: -1, end: 0, text: '' }
}
</script>

<style scoped>
p {
  @apply mb-0;
}
</style>
