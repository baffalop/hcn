<template>
  <div class="h-full mx-auto">
    <RouterLink
      :to="{ name: 'index' }"
      title="Back"
      class="absolute text-gray-100 left-12 top-12 w-10"
    >
      <Icon src="/icon/play-simple.svg" class="transform -scale-100" />
    </RouterLink>

    <RouterView v-slot="{ Component }">
      <PageTransition>
        <component :key="route.params.slug" :is="Component" />
      </PageTransition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

import PageTransition from '@components/PageTransition.vue'
import Icon from '@components/Icon.vue'

const route = useRoute()
</script>

<style scoped>
</style>
