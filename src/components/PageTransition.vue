<template>
  <FadeTransition
    mode="out-in"
    :in="300"
    :out="150"
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
