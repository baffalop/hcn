<template>
  <svg viewBox="0 0 350 350">
    <use :href="`${src}#icon`"></use>
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string
}>()
</script>

<style scoped>
</style>
