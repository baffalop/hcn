<script setup lang="ts">
import { ref } from 'vue'

import Media from '@components/Media.vue'
import Timeline from '@components/Timeline.vue'

const playing = ref(false)
const duration = ref(1)
const time = ref(0)
</script>

<template>
  <div class="flex items-center gap-4 w-3/4 max-w-lg">
    <button class="text-lg cursor-pointer w-6" @click="playing = !playing">
      <template v-if="playing">❚❚</template>
      <template v-else>▶</template>
    </button>

    <Timeline
      v-model:time="time"
      :resolution="34"
      :duration="duration"
      :playing="playing"
      class="flex-grow"
    />

    <Media
      type="video"
      src="/example-aous.mp4"
      preload="auto"
      playsinline
      class="fixed inset-0 -z-10 w-screen h-screen object-cover"
      v-model:time="time"
      v-model:playing="playing"
      @update:duration="duration = $event"
    />
  </div>
</template>

<style scoped>
video {
  filter: invert(0.9) sepia(1) saturate(1.5) hue-rotate(180deg);
}
</style>
