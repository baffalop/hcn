<template>
  <Transition
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    :enter-active-class="`transition-opacity duration-${props.in}`"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    :leave-active-class="`transition-opacity duration-${props.out}`"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  in: number
  out: number
}>()
</script>

<style scoped>
</style>
