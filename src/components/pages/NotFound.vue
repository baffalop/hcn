<template>
  <div class="h-full flex flex-col gap-4 items-center justify-center">
    <h1 class="text-7xl">404</h1>
    <h4 class="text-2xl">Page not found</h4>
  </div>
</template>

<script setup lang="ts">
import { setBackground } from '@/composable/body'

setBackground({ class: 'bg-stone-600' })
</script>

<style scoped>
</style>
