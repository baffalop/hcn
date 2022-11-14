<template>
  <div class="bg-primary-brick h-full w-full py-24">
    <h1 class="text-5xl font-light italic text-stone-900">Encountering Survival</h1>

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

    <div id="menu" class="bg-primary-brick h-screen w-full px-3 mx-auto flex flex-col justify-center">
      <h2 class="mt-10 mb-6 text-3xl">Menu</h2>

      <table class="text-left w-auto mx-auto font-editorial">
        <tbody>
        <tr v-for="(track, i) in tracks" class="align-top">
          <td class="font-agrandir">{{ i + 1 }}.</td>
          <td class="px-2"><RouterLink :to="{ name: 'player', params: { slug: track.slug } }">{{ track.title }}</RouterLink></td>
          <td class="px-2">{{ track.artist }}</td>
          <td class="px-2 text-base text-gray-300 font-agrandir">{{ formatSecs(track.duration) }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { tracks } from '@/data/tracks'
import { formatSecs } from '@/utils/time'
</script>

<style scoped>
</style>
