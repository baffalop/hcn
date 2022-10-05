<template>
  <FadeTransition mode="out-in" :in="300" :out="150">
    <slot />
  </FadeTransition>
</template>

<script setup lang="ts">
import FadeTransition from '@components/FadeTransition.vue'
</script>

<style scoped>
</style>
