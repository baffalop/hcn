import { createApp } from 'vue'
import { createRouter, createWebHistory, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

import './tailwind.css'
import './styles.css'

import { tracks } from '@/data/tracks'
import { pageTransition } from '@/transitionState'
import App from '@/App.vue'
import Index from '@components/pages/Index.vue'
import Player from '@components/pages/Player.vue'
import NotFound from '@components/pages/NotFound.vue'

const slugRegex = tracks.map(track => track.slug).join('|')

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'index', component: Index },
  {
    path: `/play/:slug(${slugRegex})`,
    name: 'player',
    component: Player,
    props: route => {
      const slug = route.params.slug as string
      const track = tracks.find(track => track.slug === slug)

      if (track == null) {
        throw new Error(`Slug not recognised: ${slug}`)
      }

      return { track }
    },
  },
  { path: '/:pathMatch(.*)*', name: '404', component: NotFound },
]

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(),
  routes,
  async scrollBehavior (to, from) {
    if (to.name === 'index' && isContentPage(from)) {
      await pageTransition()
      return { el: '#menu' }
    }

    return undefined
  }
})
app.use(router)

app.mount('#app')

function isContentPage (route: RouteLocationNormalized): boolean {
  return route.matched.some(r => r.name === 'player')
}
