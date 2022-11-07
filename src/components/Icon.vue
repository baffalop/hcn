<template>
  <svg :viewBox="viewBox">
    <use :href="`${src}#icon`"></use>
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  viewBox?: `${number} ${number} ${number} ${number}`
}>(), {
  viewBox: '0 0 350 350'
})
</script>

<style scoped>
</style>
