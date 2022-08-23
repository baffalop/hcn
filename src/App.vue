<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isOnIndexPage = computed(() => route.name === 'index')
</script>

<template>
  <router-link
    v-if="!isOnIndexPage"
    :to="{ name: 'index' }"
    class="fixed left-20 top-20 text-primary-blue"
  >Home</router-link>

  <router-view v-slot="{ Component }">
    <transition
      mode="out-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      enter-active-class="transition-opacity duration-75"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      leave-active-class="transition-opacity duration-75"
    >
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style scoped>
</style>
