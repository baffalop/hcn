<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

import PageTransition from '@components/PageTransition.vue'

const route = useRoute()
const isOnIndexPage = computed(() => route.name === 'index')
</script>

<template>
  <PageTransition>
    <RouterLink
      v-if="!isOnIndexPage"
      :to="{ name: 'index' }"
      title="Back"
      class="absolute left-12 top-12 w-10 invert"
    >
      <img alt="Back" src="/icon/play-simple.svg" class="transform -scale-100">
    </RouterLink>
  </PageTransition>

  <RouterView v-slot="{ Component }">
    <PageTransition>
      <component :is="Component" />
    </PageTransition>
  </RouterView>
</template>

<style scoped>
</style>
