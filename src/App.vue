<template>
  <RouterView v-slot="{ Component }">
    <PageTransition>
      <component :is="Component" :key="route.params?.slug ?? route.name" @update:color="color = $event" />
    </PageTransition>
  </RouterView>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import PageTransition from '@components/PageTransition.vue'

const route = useRoute()

const baseColor = 'theme(color.stone.900)'
const color = ref<string>(baseColor)

function setBackground (color: string): void {
  document.body.style.backgroundColor = color
}
</script>

<style scoped>
</style>
