<template>
  <FadeTransition
    mode="out-in"
    in="duration-700"
    out="duration-300"
    @before-leave="transitionOut"
    @enter="transitionIn"
  >
    <slot />
  </FadeTransition>
</template>

<script setup lang="ts">
import FadeTransition from '@components/FadeTransition.vue'
import { transitionOut, transitionIn } from '@/transitionState'
</script>

<style scoped>
</style>
