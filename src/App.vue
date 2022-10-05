<template>
  <RouterView v-slot="{ Component }">
    <PageTransition>
      <component :is="Component" />
    </PageTransition>
  </RouterView>
</template>

<script setup lang="ts">
import PageTransition from '@components/PageTransition.vue'
</script>

<style scoped>
</style>
