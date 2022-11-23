<template>
  <div class="min-h-full w-full pb-14">
    <header class="h-[calc(115vh-32rem)]">
      <a href="" class="fixed z-20 top-6 right-6 lg:top-10 lg:right-10 h-14">
        <img
          src="/logo/hcn.svg"
          alt="Holocaust Centre North logo"
          class="h-full opacity-[var(--fade)] lg:opacity-100"
          :style="{ '--fade': `${logoOpacity}%` }"
        >
      </a>

      <div class="sticky top-20 py-6 mt-20 lg:py-8 lg:top-12 lg:mt-12">
        <h1 class="text-5xl font-light italic text-stone-900">
          Encountering Survival
        </h1>
      </div>

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
        Collecting, preserving, caring for and sharing the stories from the community of Holocaust Centre North, is a primary objective of what Holocaust Centre North does.
        Yet, every day we are aware of so much that cannot be cared for or be preserved for posterity, either because it was lost, destroyed, stolen or left behind.
        Or because of it being immaterial, and as such defies archival practices.
      </p>

      <p>
        Our <em>Encountering Survival</em> audio guides were always imagined as an attempt to give space to what is loudest in its material absence: the memory of a grandparents’ smell; the long journey of a single, remaining family heirloom; those phrases which encapsulate a lifetime of mourning.
        Artists Linda O Keeffe and Louise K Wilson have worked alongside each other for this commission, focusing on ‘voices’ and ‘objects’ and respectively. Across 10 tracks, their work mediates object histories and explores the textures of loss, trauma and childhood memories.
        But most important, they have also created an intimate record which bears witness to the act of remembering itself.
      </p>

      <p>
        <em>Encountering Survival</em> is the audio guide created for an archive which honours a community of Holocaust survivors that built new lives in the North of England.
        It gives insight into the decades of their remembering and celebrates the full and meaningful lives they survived to live.
      </p>

      <p>
        Take a moment. And when you are ready, let us take you along.
        We invite you to listen with us, as they remember: The whys, the hows and the nevertheless of their survival.
      </p>
    </div>

    <Icon
      src="/icon/arrow-back-straight.svg"
      class="w-16 transform -rotate-90 mx-auto mt-14 mb-6 visible-transition"
      :class="arrowVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'"
      v-intersect="{
        observerOptions: { threshold: 1 },
        onChange: onArrowVisible,
        disposeWhen: true,
      }"
    />

    <div
      ref="menu"
      v-intersect="{
        observerOptions: { threshold: 0.5 },
        onChange: onMenuIntersect
      }"
      class="py-12 px-6 w-full min-h-screen flex flex-col items-center justify-center relative"
    >
      <ul class="w-full space-y-8 flex flex-col items-center">
        <li v-for="(track, i) in tracks" :style="{ marginLeft: `${itemMargin(i)}%` }">
          <TrackLink :track="track" />
        </li>
      </ul>
    </div>

    <div
      class="relative space-x-6 mt-6 transform visible-transition"
      :class="logosVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'"
      v-intersect="{
        observerOptions: { threshold: 0.5 },
        onChange: onLogosVisible,
        disposeWhen: true,
      }"
      :style="{ '--delay': '200ms' }"
    >
      <img src="/logo/heritage-fund.svg" alt="Heritage Fund logo" class="inline h-10">
      <img src="/logo/iwm.svg" alt="Heritage Fund logo" class="inline h-10">
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { tracks } from '@/data/tracks'
import { setTheme } from '@/composable/theme'
import { vIntersect } from '@/directive/intersect'
import TrackLink from '@components/TrackLink.vue'
import Icon from '@components/Icon.vue'

setTheme('#a55b50') // primary-brick

const OPACITY_SCROLL_SCALE = 280
const BRIGHTNESS_SCROLL_SCALE = 320
const LOGO_SCROLL_SCALE = 90
const LOGO_SCROLL_OFFSET = 250

const scrollY = ref(0)
const titleImageOpacity = computed(
  () => Math.max(0, OPACITY_SCROLL_SCALE - scrollY.value) * 100 / OPACITY_SCROLL_SCALE
)
const logoOpacity = computed(
  () => Math.max(0, LOGO_SCROLL_OFFSET - scrollY.value) * 100 / LOGO_SCROLL_SCALE
)
const blobsBrightness = computed(
  () => Math.max(0, BRIGHTNESS_SCROLL_SCALE - scrollY.value) / (BRIGHTNESS_SCROLL_SCALE * 3) + 0.6
)

const menu = ref<HTMLElement>()

const router = useRouter()

const arrowVisible = ref(false)
async function onArrowVisible (visible: boolean): Promise<void> {
  if (visible) {
    await nextTick()
    arrowVisible.value = true
  }
}

const logosVisible = ref(false)
async function onLogosVisible (visible: boolean): Promise<void> {
  if (visible) {
    await nextTick()
    logosVisible.value = true
  }
}

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
.visible-transition {
  --delay: 500ms;
  transition: opacity 500ms ease-in var(--delay), transform 1s ease-out var(--delay);
}
</style>
