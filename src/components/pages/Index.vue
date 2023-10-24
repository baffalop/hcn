<template>
  <div class="min-h-full w-full">
    <header class="h-[calc(78vh-14rem)]">
      <a
        href="https://hcn.org.uk/collections/artistic-responses/"
        title="Holocaust Centre North home page"
        class="fixed z-20 top-6 right-6 lg:top-10 lg:right-10 h-14 opacity-[var(--fade)]"
        :style="{ '--fade': `${logoOpacity}%` }"
        :class="{ 'hidden': logoOpacity === 0 }"
      >
        <img src="/logo/hcn.svg" alt="Holocaust Centre North logo" class="h-full">
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
        opacity: `${(blobsBrightness - 0.6) * 100 + 75}%`,
      }"
    >

    <div class="intro mt-6 px-6 mx-auto max-w-screen-md relative text-left text-justify space-y-6">
      <p>Dear Listener,</p>

      <p>
        Collecting, preserving, caring for and sharing the stories from
        the northern community of Holocaust survivors and their
        families is Holocaust Centre North’s primary objective. Yet,
        every day we are aware of so much that cannot be preserved for
        posterity, either because it was lost, destroyed, stolen, left
        behind; or because of it being immaterial, and as such, defies
        archival practices.
      </p>

      <p>
        Our <em>Encountering Survival</em> audio guide gives space to
        what is loudest in its material absence: the scent of a grandparent’s
        home, tobacco, sweets and an old jacket; the long
        journey of a single, remaining family heirloom; those phrases
        which encapsulate a lifetime of mourning.
        Artists Linda O Keeffe and Louise K Wilson have worked
        alongside each other for this commission, focusing on ‘voices’
        and ‘objects’ respectively. Across 10 tracks, their work mediates
        the histories of treasured objects, and the textures of loss,
        trauma and childhood memories. They have created an
        intimate record that bears witness to the act of remembering.
      </p>

      <p>
        <em>Encountering Survival</em> honours a community of Holocaust
        survivors and refugees who built new lives in the North of
        England. It offers insight into their memories of lives lived, and
        testimony on experiences and objects forever lost. This audio
        guide is a tribute to the Holocaust Survivors’ Friendship Association,
        the organisation the survivors helped build with a community of care
        at its heart.
      </p>

      <p>
        So, take a moment, and when you are ready, let us take you
        along. We invite you to listen with us as they remember.
        The whys, the how, and the nevertheless of their survival.
      </p>

      <p>
        The tracks have been curated to allow themes or notes to carry through
        between both artists’ work. But please do not feel limited to
        this and move freely through the audio experience.
      </p>
    </div>

    <Icon
      ref="arrowEl"
      src="/icon/arrow-back-straight.svg"
      class="arrow w-16 transform -rotate-90 mx-auto mt-14 mb-6"
      :class="arrowVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'"
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWindowScroll, useIntersectionObserver } from '@vueuse/core'

import { tracks } from '@/data/tracks'
import { setTheme } from '@/composable/theme'
import { vIntersect } from '@/directive/intersect'
import TrackLink from '@components/TrackLink.vue'
import Icon from '@components/Icon.vue'

setTheme('#a55b50') // primary-brick

const OPACITY_SCROLL_SCALE = 280
const BRIGHTNESS_SCROLL_SCALE = 320
const LOGO_SCROLL_SCALE = 90
const LOGO_SCROLL_OFFSET = 190

const { y: scrollY } = useWindowScroll()

const titleImageOpacity = computed(
  () => Math.max(0, OPACITY_SCROLL_SCALE - scrollY.value) * 100 / OPACITY_SCROLL_SCALE
)
const logoOpacity = computed(
  () => Math.max(0, LOGO_SCROLL_OFFSET - scrollY.value) * 100 / LOGO_SCROLL_SCALE
)
const blobsBrightness = computed(
  () => Math.max(0, BRIGHTNESS_SCROLL_SCALE - scrollY.value) / (BRIGHTNESS_SCROLL_SCALE * 3) + 0.55
)

const menu = ref<HTMLElement>()

const router = useRouter()

const arrowEl = ref<HTMLDivElement>()
const arrowVisible = ref(false)
const { stop } = useIntersectionObserver(arrowEl, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    arrowVisible.value = true
    stop()
  }
}, { threshold: 1 })

onMounted(() => {
  if (router.currentRoute.value.name === 'menu') {
    menu.value?.scrollIntoView()
  }
})

function onMenuIntersect (isIntersecting: boolean): void {
  router.replace({ name: isIntersecting ? 'menu' : 'index' })
}

function itemMargin (index: number): number {
  return Math.sin(index * 0.8) * -30
}
</script>

<style scoped>
.arrow {
  transition: opacity 500ms ease-in 500ms, transform 1s ease-out 500ms;
}
</style>
