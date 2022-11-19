<template>
  <Transition
    appear
    enter-from-class="opacity-0 translate-y-10"
    enter-to-class="opacity-100 translate-y-0"
    enter-active-class="duration-500 transition-all ease-in-out"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-10"
    leave-active-class="duration-300 ease-in-out transform"
  >
      <div
        v-if="currentMessage"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -mt-2
          rounded-full py-0.5 px-3 backdrop-filter backdrop-brightness-70 -backdrop-hue-rotate-30"
      >
        {{ currentMessage }}
      </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineExpose({
  show,
  dismiss,
})

type Timing = 'short' | 'long'

const TIMEOUT_SHORT_MS = 1000
const TIMEOUT_LONG_MS = 3000

const currentMessage = ref<string|null>(null)
const timeout = ref<number|null>(null)

function show (message: string, timing: Timing): void {
  currentMessage.value = message
  startTimeout(timing)
}

function dismiss (): void {
  currentMessage.value = null
}

function startTimeout (timing: Timing): void {
  if (timeout.value !== null) {
    window.clearTimeout(timeout.value)
  }

  timeout.value = window.setTimeout(() => {
    currentMessage.value = null
  }, timing === 'short' ? TIMEOUT_SHORT_MS : TIMEOUT_LONG_MS)
}
</script>

<style scoped>
</style>
