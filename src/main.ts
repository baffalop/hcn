import { createApp } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import './tailwind.css'
import './styles.css'

import { tracks } from '@/data/tracks'
import App from '@/App.vue'
import Index from '@components/pages/Index.vue'
import Player from '@components/pages/Player.vue'
import NotFound from '@components/pages/NotFound.vue'

const slugRegex = tracks.map(track => track.slug).join('|')

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'index', component: Index },
  { path: `/play/:slug(${slugRegex})`, name: 'player', component: Player },
  { path: '/:pathMatch(.*)*', name: '404', component: NotFound },
]

const app = createApp(App)
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
app.use(router)

app.mount('#app')
