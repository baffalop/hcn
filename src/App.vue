<script setup lang="ts">
import { ref } from 'vue'

import Timeline from './components/Timeline.vue'

const time = ref(0)
</script>

<template>
  <div class="flex items-center gap-4">
    <Timeline v-model="time" :resolution="26" :max="200" />
    <span class="w-8">{{ time.toFixed(1) }}</span>
  </div>
</template>

<style scoped>
</style>
