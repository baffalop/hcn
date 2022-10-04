<script setup lang="ts">
import PageTransition from '@components/PageTransition.vue'
</script>

<template>
  <div class="w-full h-full flex flex-col place-items-center mx-auto">
    <RouterLink
      :to="{ name: 'index' }"
      title="Back"
      class="absolute left-12 top-12 w-10 invert"
    >
      <img alt="Back" src="/icon/play-simple.svg" class="transform -scale-100">
    </RouterLink>

    <RouterView v-slot="{ Component }">
      <PageTransition>
        <component :is="Component" />
      </PageTransition>
    </RouterView>
  </div>
</template>

<style scoped>
</style>
