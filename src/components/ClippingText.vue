<template>
  <h3 class="inline-block px-0.5">
    <span class="supports-[backdrop-filter]:supports-[clip-path]:text-transparent">{{ text }}</span>

    <svg aria-hidden="true" class="absolute pointer-events-none">
      <clipPath id="clipping-text">
        <text dominant-baseline="hanging" dy="0.125em">{{ text }}</text>
      </clipPath>
    </svg>
  </h3>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string
}>()
</script>

<style scoped>
h3 {
  clip-path: url(#clipping-text);
}
</style>
