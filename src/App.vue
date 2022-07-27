<script setup lang="ts">
import { ref } from 'vue'

import Timeline from './components/Timeline.vue'

const time = ref(0)
</script>

<template>
  <div class="flex items-center gap-4">
    <Timeline :resolution="25" v-model="time" />
    <span>{{ time }}</span>
  </div>
</template>

<style scoped>
</style>
