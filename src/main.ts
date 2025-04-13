import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import naive from 'naive-ui'




const app = createApp(App)
const pinia = createPinia()
app.use(createPinia())
app.use(router)
  app.use(naive)
  app.use(pinia)
app.mount('#app')


