<template>
  <FadeTransition
    mode="out-in"
    in="duration-700"
    out="duration-300"
  >
    <slot />
  </FadeTransition>
</template>

<script setup lang="ts">
import FadeTransition from '@components/FadeTransition.vue'
</script>

<style scoped>
</style>
