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
      {{ previousLine.line }}
    </p>

    <p
      :key="currentLine.start.toFixed(0)"
      class="text-grey-100 transition-opacity duration-700"
      :class="currentLine.end && time - currentLine.end > EXPIRY_SECS ? 'opacity-0' : 'opacity-100'"
    >
      {{ currentLine.line }}
    </p>
  </TransitionGroup>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'

import { Track } from '@/data/tracks'

const props = defineProps<{
  track: Track
  time: number
}>()

const EXPIRY_SECS = 6

interface TranscriptionLine {
  start: number
  end?: number
  line: string
}

const transcription = ref<TranscriptionLine[]>([
  {"start":148.445383,"line":"And not be part of the crowd","end":150.057817},
  {"start":141.622436,"line":"And, it's very very difficult for a kid of that age to resist that temptation","end":148.445383},
  {"start":137.913398,"line":"Things like that as they had in the Hitler Youth","end":141.622436},
  {"start":134.186143,"line":"Uniforms, campfires, learning to shoot rifles","end":137.913398},
  {"start":105.05566,"line":"to resist the temptations the Nazis offered for kids of that age","end":109.756262},
  {"start":101.749868,"line":"You know, it's very difficult for a 12, 13, 14 year-old","end":105.05566},
  {"start":81.545969,"line":"And I probably would","end":83.677251},
  {"start":79.575164,"line":"Would I have been a Nazi?","end":81.545969},
  {"start":73.704323,"line":"sometimes think what I would have been if I hadn't been Jewish","end":79.575164},
  {"start":70.002884,"line":"but I'm concerned that...","end":73.704323},
  {"start":60.522463,"line":"Well obviously my contemporaries who committed these atrocities are dreadful","end":70.002884},
  {"start":54.747394,"line":"Well, you know you're a survivor because you're there","end":60.522463},
  {"start":53.908808,"line":"And, erm...","end":54.747394}
])

const currentLine = computed(() => findMostRecentLine(transcription.value, props.time))
const previousLine = computed(() => findMostRecentLine(
  transcription.value.filter(line => line.line !== currentLine.value.line),
  props.time
))

function findMostRecentLine (lines: TranscriptionLine[], time: number): TranscriptionLine {
  return lines.reduce((prev, cur) => {
    if (cur.start > time) return prev
    return cur.start > prev.start ? cur : prev
  }, blankLine())
}

function blankLine (): TranscriptionLine {
  return { start: 0, line: '' }
}
</script>

<style scoped>
p {
  @apply mb-0;
}
</style>
