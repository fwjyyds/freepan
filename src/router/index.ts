import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import login from '../views/login/login.vue'
import main from '../views/font/main.vue'
import download from '../views/font/download.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: main,
      children: [
        {
          path: '/',
          name: 'download',
          component: download,
        }
  ]
}]
})

export default router
