import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import {
    // create naive ui
    create,
    // component
    NButton,
    NModal
  } from 'naive-ui'

  
  const naive = create({
    components: [NButton,NModal]
  })
  


const app = createApp(App)

app.use(createPinia())
app.use(router)
  app.use(naive)
app.mount('#app')
