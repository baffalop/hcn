<template>
  <div class="min-h-full w-full">
    <header class="h-[62vh]">
      <h1 class="text-5xl font-light italic text-stone-900 sticky top-0 pt-20 mb-10">
        Encountering Survival
      </h1>

      <img
        src="/img/toms-knife.jpeg"
        alt="A hand holding a silverware knife"
        class="fixed w-full mx-auto px-10 h-[65vh] object-contain object-top"
        :style="{ opacity: `${titleImageOpacity}%` }"
      >
    </header>

    <img
      src="/img/blobs.png"
      class="fixed top-32 object-cover w-full max-w-screen-xl h-[calc(100vh-8rem)] left-0 right-0 mx-auto object-[top_0_right_23%]"
      :style="{
        filter: `brightness(${blobsBrightness})`,
        opacity: `${(blobsBrightness - 0.6) * 100 + 70}%`,
      }"
    >

    <div class="intro mt-6 px-6 mx-auto max-w-screen-md relative text-left text-justify space-y-6">
      <p>Dear Listener,</p>

      <p>
        Collecting, preserving, caring for and sharing the stories from the community of Holocaust Centre North, is a primary objective of what Holocaust Centre North does. Yet, every day we are aware of so much that cannot be cared for or be preserved for posterity, either because it was lost, destroyed, stolen or left behind. Or because of it being immaterial, and as such defies archival practices.
      </p>

      <p>
        Our Encountering Survival audio guides were always imagined as an attempt to give space to what is loudest in its material absence: the memory of a grandparents’ smell; the long journey of a single, remaining family heirloom; those phrases which encapsulate a lifetime of mourning.
        Artists Linda O Keeffe and Louise K Wilson have worked alongside each other for this commission, focusing on ‘voices’ and ‘objects’ and respectively. Across 10 tracks, their work mediates object histories and explores the textures of loss, trauma and childhood memories.
        But most important, they have also created an intimate record which bears witness to the act of remembering itself.
      </p>

      <p>
        Encountering Survival is the audio guide created for an archive which honours a community of Holocaust survivors that built new lives in the North of England.
        It gives insight into the decades of their remembering and celebrates the full and meaningful lives they survived to live.
      </p>

      <p>
        Take a moment. And when you are ready, let us take you along.
        We invite you to listen with us, as they remember: The whys, the hows and the nevertheless of their survival.
      </p>

      <p>Please scroll down and select a track by clicking on a title.</p>
    </div>

    <div
      ref="menu"
      v-intersect="{
        observerOptions: { threshold: 0.5 },
        onChange: onMenuIntersect
      }"
      class="mt-32 py-12 px-6 w-full min-h-screen flex flex-col items-center justify-center relative"
    >
      <ul class="w-full space-y-8 flex flex-col items-center">
        <li v-for="(track, i) in tracks" :style="{ marginLeft: `${itemMargin(i)}%` }">
          <TrackLink :track="track" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { tracks } from '@/data/tracks'
import { setBackground } from '@/composable/body'
import { vIntersect } from '@/directive/intersect'
import TrackLink from '@components/TrackLink.vue'

setBackground({ class: 'bg-primary-brick' })

const OPACITY_SCROLL_SCALE = 280
const BRIGHTNESS_SCROLL_SCALE = 320

const scrollY = ref(0)
const titleImageOpacity = computed(
  () => Math.max(0, OPACITY_SCROLL_SCALE - scrollY.value) * 100 / OPACITY_SCROLL_SCALE
)
const blobsBrightness = computed(
  () => Math.max(0, BRIGHTNESS_SCROLL_SCALE - scrollY.value) / (BRIGHTNESS_SCROLL_SCALE * 3) + 0.6
)

const menu = ref<HTMLElement>()

const router = useRouter()

onMounted(() => {
  window.addEventListener('scroll', onScroll)

  if (router.currentRoute.value.name === 'menu') {
    menu.value?.scrollIntoView()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function onScroll (): void {
  scrollY.value = window.scrollY
}

function onMenuIntersect (isIntersecting: boolean): void {
  router.replace({ name: isIntersecting ? 'menu' : 'index' })
}

function itemMargin (index: number): number {
  return Math.sin(index * 0.8) * -30
}
</script>

<style scoped>
</style>
