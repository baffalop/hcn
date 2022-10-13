<template>
  <div class="h-full flex flex-col justify-center items-center mx-auto">
    <Player :track="track" @update:time="time = $event" />

    <TransitionGroup
      tag="div"
      class="my-10 h-20 w-screen px-4 overflow-hidden flex flex-col justify-center relative"
      name="line"
      move-class="transition-all duration-500 ease-in-out"
      enter-from-class="!opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="!opacity-0 -translate-y-10"
      leave-active-class="ease-in-out absolute w-screen transform"
    >
      <p
        :key="previousLine.start.toFixed(0)"
        class="text-gray-400 transition-opacity duration-500"
        :class="time - previousLine.start > 15 ? 'opacity-0' : 'opacity-100'"
      >
        {{ previousLine.line }}
      </p>

      <p
        :key="currentLine.start.toFixed(0)"
        class="transition-opacity duration-500"
        :class="time - previousLine.start > 15 ? 'opacity-0' : 'opacity-100'"
      >
        {{ currentLine.line }}
      </p>
    </TransitionGroup>

    <form class="flex w-4/5 max-w-lg gap-2" @submit.prevent="addLine">
      <input ref="input" type="text" v-model="currentLine.line" class="text-black w-full">
      <button type="submit" class="px-3 max-w-min bg-primary-blue text-xl font-bold rounded-lg">+</button>
    </form>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'

import { Track } from '@/data/tracks'
import Player from '@components/pages/Player.vue'

const props = defineProps<{
  track: Track
}>()

const time = ref(0)
const input = ref<HTMLInputElement|null>(null)

interface Line {
  start: number
  line: string
}

const transcription = ref<Line[]>([
  { "start": 104.763893, "line": "to resist the temptations the Nazis offered for kids of that age" },
  { "start": 102.091437, "line": "you know, it's very difficult for a 12, 13, 14 year old" },
  { "start": 80.854896, "line": "and I probably would!" },
  { "start": 70.53638, "line": "but I'm concerned that... sometimes think... what I would have been if I hadn't been Jewish, would I have been a Nazi?" },
  { "start": 60.966579, "line": "Well, obviously my contemporaries who committed these atrocities are dreadful" },
  { "start":59.839864, "line":"Well, you know you're a survivor because you're there" },
  { "start":53.263789, "line":"And, erm..." },
])

const currentLine = computed(() => findMostRecentLine(transcription.value, time.value))
const previousLine = computed(() => findMostRecentLine(
  transcription.value.filter(line => line.line !== currentLine.value.line),
  time.value
))

function addLine (): void {
  if (currentLine.value.line === '' && currentLine.value.start !== 0) {
    console.log(`time set: ${time.value}`)
    currentLine.value.start = time.value
  } else {
    console.log(`new line: ${time.value}`)
    transcription.value.push({ start: time.value, line: '' })
    transcription.value.sort((a, b) => b.start - a.start)
  }

  input.value?.focus()
}

function findMostRecentLine (lines: Line[], time: number): Line {
  return lines.reduce((prev, cur) => {
    if (cur.start > time) return prev
    return cur.start > prev.start ? cur : prev
  }, blankLine())
}

function blankLine (): Line {
  return { start: 0, line: '' }
}
</script>

<style scoped>
p {
  @apply mb-0;
}
</style>
