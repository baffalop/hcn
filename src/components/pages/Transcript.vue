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
        :class="previousLine.end && time - previousLine.end > 5 ? 'opacity-0' : 'opacity-100'"
      >
        {{ previousLine.line }}
      </p>

      <p
        :key="currentLine.start.toFixed(0)"
        class="transition-opacity duration-500"
        :class="currentLine.end && time - currentLine.end > 5 ? 'opacity-0' : 'opacity-100'"
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
  end?: number
  line: string
}

const transcription = ref<Line[]>([
  {"start":109.756262,"line":""},
  {"start":105.05566,"line":"to resist the temptations the Nazis offered for kids of that age","end":109.756262},
  {"start":101.749868,"line":"You know, it's very difficult for a 12, 13, 14 year-old","end":105.05566},
  {"start":81.545969,"line":"And I probably would","end":83.677251},
  {"start":79.575164,"line":"Would I have been a Nazi?","end":81.545969},
  {"start":73.704323,"line":"sometimes think what I would have been if I hadn't been Jewish","end":79.575164},
  {"start":70.002884,"line":"but I'm concerned that...","end":73.704323},
  {"start":60.522463,"line":"Well obviously my contemporaries who committed these atrocities are dreadful","end":70.002884},
  {"start":54.747394,"line":"Well, you know you're a survivor because you're there","end":60.522463},
  {"start":53.908808,"line":"And, erm...","end":54.747394},
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
    currentLine.value.end = time.value
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
