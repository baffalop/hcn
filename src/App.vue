<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, TransitionProps } from 'vue'

const route = useRoute()
const isOnIndexPage = computed(() => route.name === 'index')

const inDuration = 300
const outDuration = 150

const transitionParams: TransitionProps = {
  enterFromClass: 'opacity-0',
  enterToClass: 'opacity-100',
  enterActiveClass: `transition-opacity duration-${inDuration}`,
  leaveFromClass: 'opacity-100',
  leaveToClass: 'opacity-0',
  leaveActiveClass: `transition-opacity duration-${outDuration}`,
}
</script>

<template>
  <transition
    v-bind="transitionParams"
    :enter-active-class="`${transitionParams.enterActiveClass} delay-${outDuration}`"
  >
    <RouterLink
      v-if="!isOnIndexPage"
      :to="{ name: 'index' }"
      title="Back"
      class="absolute left-12 top-12 w-10 invert"
    >
      <img alt="Back" src="/icon/play-simple.svg" class="transform -scale-100">
    </RouterLink>
  </transition>

  <RouterView v-slot="{ Component }">
    <transition mode="out-in" v-bind="transitionParams">
      <component :is="Component" />
    </transition>
  </RouterView>
</template>

<style scoped>
</style>
