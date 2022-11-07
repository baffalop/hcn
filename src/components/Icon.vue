<template>
  <svg :viewBox="viewbox">
    <use :href="`${src}#icon`"></use>
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  viewbox?: `${number} ${number} ${number} ${number}`
}>(), {
  viewbox: '0 0 350 350'
})
</script>

<style scoped>
</style>
