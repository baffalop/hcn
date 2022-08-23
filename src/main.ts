import { createApp } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import './tailwind.css'
import './styles.css'
import App from '@/App.vue'
import Player from '@components/Player.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Player }
]

const app = createApp(App)
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
app.use(router)

app.mount('#app')
