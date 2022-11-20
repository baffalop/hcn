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
      :key="enabled ? previousLine?.start.toFixed(0) ?? 'noprev' : 'noprev'"
      class="text-gray-100/60 transition-opacity duration-700"
      :class="enabled && hasPreviousLine ? 'opacity-100' : 'opacity-0'"
    >
      {{ enabled ? previousLine?.text : '' }}
    </p>

    <p
      :key="enabled ? currentLine?.start.toFixed(0) ?? 'none' : 'none'"
      class="text-grey-100 transition-opacity duration-700"
      :class="enabled && hasCurrentLine ? 'opacity-100' : 'opacity-0'"
    >
      {{ enabled ? currentLine?.text : '' }}
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

type LineEntry = [index: number, line: TranscriptionLine] | [null, null]

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

const currentEntry = computed<LineEntry>(() => findMostRecentLine(props.transcript, props.time))
const currentIndex = computed<number|null>(() => currentEntry.value[0])
const currentLine = computed<TranscriptionLine|null>(() => currentEntry.value[1])
const previousLine = computed<TranscriptionLine|null>(
  () => currentIndex.value ? props.transcript[currentIndex.value - 1] ?? null : null
)

const hasCurrentLine = computed(() => isExtant(currentLine.value, props.time))
const hasPreviousLine = computed(() => isExtant(previousLine.value, props.time))

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

function findMostRecentLine (lines: TranscriptionLine[], time: number, to?: number): LineEntry {
  if (!props.enabled) {
    return [null, null]
  }

  let prev: LineEntry = [null, null]

  for (const [index, line] of lines.slice(0, to).entries()) {
    if (line.start > time) {
      return prev
    }

    prev = [index, line]
  }

  return [null, null]
}

function isExtant (line: TranscriptionLine|null, time: number): boolean {
  return line !== null && line.end + EXPIRY_SECS >= time
}
</script>

<style scoped>
p {
  @apply mb-0;
}
</style>
