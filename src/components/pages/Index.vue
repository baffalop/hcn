<template>
  <div class="min-h-full w-full">
    <header class="h-[67vh] mb-8">
      <h1 class="text-5xl font-light italic text-stone-900 sticky top-0 pt-20 mb-10">
        Encountering Survival
      </h1>

      <img
        src="/img/toms-knife.jpeg"
        alt="A hand holding a silverware knife"
        class="fixed w-full mx-auto px-6 h-[65vh] object-contain object-top"
        :style="{ opacity: `${titleImageOpacity}%` }"
      >
    </header>

    <div class="px-4 mx-auto max-w-screen-md relative">
      <p>
        Welcome to some audio guides for Holocaust Centre North.
      </p>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>

      <p>
        Now please scroll down and select a track.
      </p>
    </div>

    <div id="menu" class="relative min-h-screen px-3 flex flex-col items-center justify-center">
      <ul class="w-full max-w-lg space-y-8">
        <li v-for="(track, i) in tracks" :style="{ marginLeft: `${itemMargin(i)}%` }">
          <TrackLink :track="track" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { tracks } from '@/data/tracks'
import { setBackground } from '@/composable/body'
import TrackLink from '@components/TrackLink.vue'

setBackground({ class: 'bg-primary-brick' })

const SCROLL_SCALE = 280

const scrollY = ref(0)
const titleImageOpacity = computed(
  () => Math.max(0, SCROLL_SCALE - scrollY.value) * 100 / SCROLL_SCALE
)

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function onScroll (): void {
  scrollY.value = window.scrollY
}

function itemMargin (index: number): number {
  return Math.sin(index * 1.2) * -20 + 20
}
</script>

<style scoped>
</style>
