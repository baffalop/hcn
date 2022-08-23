import { createApp } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import './tailwind.css'
import './styles.css'
import App from '@/App.vue'
import Index from '@components/pages/Index.vue'
import Player from '@components/pages/Player.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'index', component: Index },
  { path: '/player', name: 'player', component: Player },
]

const app = createApp(App)
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
app.use(router)

app.mount('#app')
