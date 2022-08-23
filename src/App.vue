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

  <router-view />
</template>

<style scoped>
</style>
