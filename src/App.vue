<template>
  <RouterView v-slot="{ Component }">
    <PageTransition>
      <component :key="route.params?.slug ?? route.name" :is="Component" />
    </PageTransition>
  </RouterView>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

import PageTransition from '@components/PageTransition.vue'

const route = useRoute()
</script>

<style scoped>
</style>
