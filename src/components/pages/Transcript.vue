<template>
  <div class="h-full flex flex-col justify-center mx-auto w-4/5 max-w-lg">
    <Player :track="track" @update:time="time = $event" />

    <form class="flex mt-10 w-full gap-2" @submit.prevent="addLine">
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
  {"start":80.854896,"line":"and I probably would!"},
  {"start":70.53638,"line":"but I'm concerned that... sometimes think... what I would have been if I hadn't been Jewish, would I have been a Nazi?"},
  {"start":60.966579,"line":"Well, obviously my contemporaries who committed these atrocities are dreadful"},
])

const currentLine = computed(() => transcription.value.reduce(
  (prev, cur) => {
    if (cur.start > time.value) return prev
    return cur.start > prev.start ? cur : prev
  },
  blankLine()
))

function addLine (): void {
  if (currentLine.value.line === '') {
    console.log(`time set: ${time.value}`)
    currentLine.value.start = time.value
  } else {
    console.log(`new line: ${time.value}`)
    transcription.value.push({ start: time.value, line: '' })
    transcription.value.sort((a, b) => b.start - a.start)
  }

  input.value?.focus()
}

function blankLine (): Line {
  return { start: 0, line: '' }
}
</script>

<style scoped>
</style>
