<script setup lang="ts">
import FadeTransition from '@components/FadeTransition.vue'
</script>

<template>
  <FadeTransition mode="out-in" :in="300" :out="150">
    <slot />
  </FadeTransition>
</template>

<style scoped>
</style>
