<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isOnIndexPage = computed(() => route.name === 'index')
</script>

<template>
  <RouterLink
    v-if="!isOnIndexPage"
    :to="{ name: 'index' }"
    class="fixed left-20 top-20"
  >Home</RouterLink>

  <RouterView v-slot="{ Component }">
    <transition
      mode="out-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      enter-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      leave-active-class="transition-opacity duration-150"
    >
      <component :is="Component" />
    </transition>
  </RouterView>
</template>

<style scoped>
</style>
