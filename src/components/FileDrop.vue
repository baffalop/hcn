<template>
  <div
    class="drop max-h-max"
    :class="{ 'ring-4 ring-inset ring-primary-pink-300': draggingOver }"
    @dragenter.prevent.stop="onDragEnter"
    @dragleave.stop="onDragLeave"
    @dragover.prevent
    @drop.prevent.stop="onDrop"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const emit = defineEmits<{
  (e: 'drop', file: File): void
}>()

// because of stupid bubbling behaviour of dragenter and dragleave,
// we have to count how many enters vs. leaves we've seen to know if it's *actually* being dragged over
const dragEnteredLevel = ref(0)
const draggingOver = computed<boolean>(() => dragEnteredLevel.value > 0)

function onDragEnter (e: DragEvent): void {
  dragEnteredLevel.value++
}

function onDragLeave (): void {
  dragEnteredLevel.value--
}

function onDrop (e: DragEvent): void {
  dragEnteredLevel.value = 0

  const file = extractFile(e)
  if (file === null) {
    console.log('Drop event: no file dropped')
    return
  }

  emit('drop', file)
}

function extractFile (e: DragEvent): File|null {
  return e.dataTransfer?.files[0] ?? null
}

</script>

<style scoped>
</style>
