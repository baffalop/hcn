<template>
  <Transition
    appear
    mode="out-in"
    enter-from-class="opacity-0 translate-y-10"
    enter-to-class="opacity-100 translate-y-0"
    enter-active-class="duration-700 transition-all ease-in-out"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-10"
    leave-active-class="duration-500 ease-in-out transform"
  >
      <div
        v-if="message"
        :key="message"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -mt-2
          rounded-full py-0.5 px-3 backdrop-filter backdrop-brightness-70 -backdrop-hue-rotate-30"
      >
        {{ message }}
      </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineExpose({
  show,
  dismiss,
})

const TIMEOUT_MS = 3000

const message = ref<string|null>(null)

function show (newMessage: string): void {
  message.value = newMessage
  window.setTimeout(() => {
    message.value = null
  }, TIMEOUT_MS)
}

function dismiss (): void {
  message.value = null
}
</script>

<style scoped>
</style>
