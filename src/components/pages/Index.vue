<template>
  <div class="h-full w-full">
    <div class="h-4/5 px-4 mx-auto max-w-screen-md flex flex-col justify-center">
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

    <div id="menu" class="h-screen w-full mx-auto flex flex-col justify-center">
      <h2 class="mt-10 mb-6 text-3xl">Menu</h2>

      <ul class="text-left max-w-max mx-auto">
        <li v-for="(track, i) in tracks">
          <span>{{ formatTrackNumber(i) }}.</span>
          <RouterLink :to="{ name: 'player', params: { slug: track.slug } }" class="mx-1.5">{{ track.title }}</RouterLink>
          <span>{{ track.artist }}</span>
          <span class="ml-2 text-base text-gray-300">{{ formatSecs(track.duration) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { tracks } from '@/data/tracks'
import { formatSecs } from '@/utils/time'

function formatTrackNumber (i: number): string {
  return (i + 1).toFixed(0).padStart(2, '0')
}
</script>

<style scoped>
#menu {
  background: linear-gradient(
    to bottom,
    transparent,
    theme(colors.primary.green.900) 20%,
    theme(colors.primary.green.900)
  );
}
</style>
