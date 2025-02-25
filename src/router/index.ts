import { createRouter, createWebHistory } from 'vue-router'
import login from '../views/login/login.vue'
import main from '../views/font/main.vue'
import download from '../views/font/download.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/main',
      name: 'main',
      component: main,
      children: [
        {
          path: '/main/download',
          name: 'download',
          component: download,
        },{
          path:'/main/chart',
          name:'chart',
          component: () => import('../views/chart/index.vue')
        }
        ,{
          path:'/main/mess',
          name:'mess',
          component: () => import('../views/mess/index.vue')
        }
        ,{
          path:'/main/ai',
          name:'ai',
          component: () => import('../views/ai/index.vue')
        }
        ,{
          path:'/main/me',
          name:'me',
          component: () => import('../views/me/index.vue')
        }  ,{
          path:'/main/settings',
          name:'settings',
          component: () => import('../views/settings/index.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})
 

export default router
