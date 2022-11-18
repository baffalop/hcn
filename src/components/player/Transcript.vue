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
      :key="previousLine.start.toFixed(0)"
      class="text-gray-100/60 transition-opacity duration-700"
      :class="previousLine.end && time - previousLine.end > EXPIRY_SECS ? 'opacity-0' : 'opacity-100'"
    >
      {{ previousLine.text }}
    </p>

    <p
      :key="currentLine.start.toFixed(0)"
      class="text-grey-100 transition-opacity duration-700"
      :class="currentLine.end && time - currentLine.end > EXPIRY_SECS ? 'opacity-0' : 'opacity-100'"
    >
      {{ currentLine.text }}
    </p>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

const EXPIRY_SECS = 4

const currentLine = computed(() => findMostRecentLine(props.transcript, props.time))
const previousLine = computed(() => findMostRecentLine(
  props.transcript.filter(line => line.text !== currentLine.value.text),
  props.time
))

function findMostRecentLine (lines: TranscriptionLine[], time: number): TranscriptionLine {
  if (!props.enabled) {
    return blankLine()
  }

  return lines.reduce((prev, cur) => {
    if (cur.start > time) return prev
    return cur.start > prev.start ? cur : prev
  }, blankLine())
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
