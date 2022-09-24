<script setup lang="ts">
interface Track {
  title: string
}

const lindaTracks: Track[] = [
  { title: 'Constant Vigilance' },
  { title: 'Restrictions and Ejection' },
  { title: 'Saying Goodbye' },
  { title: 'Wires and Fences' },
]

function formatTrackNumber (i: number): string {
  return (i + 1).toFixed(0).padStart(2, '0')
}
</script>

<template>
  <div class="h-full px-4 max-w-screen-md">
    <p>
      Welcome to some audio guides for Holocaust Centre North.
    </p>

    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>

    <h2 class="mt-10 mb-6 text-2xl">Linda O'Keefe</h2>

    <ul class="text-left max-w-max mx-auto">
      <li v-for="(track, i) in lindaTracks">
        {{ formatTrackNumber(i) }}.
        <RouterLink :to="{ name: 'player' }">{{ track.title }}</RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
</style>
