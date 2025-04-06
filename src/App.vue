<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {NMessageProvider} from 'naive-ui'
import { NNotificationProvider } from 'naive-ui';
function createWs() {
    const ws = new WebSocket('ws://localhost:3002')
    ws.addEventListener('open', (event) => {
      console.log('ws 连接成功', event)
      ws.send(
        JSON.stringify({
          event: 'events',
          data: '测试ws 发送数据 hello',
        })
      )
    })

    ws.addEventListener('message', (event) => {
      const data = event.data
      console.log('ws message data==================================', data)
    })
    ws.addEventListener('error', (event) => {
      console.log('ws 连接失败', event)
    })
  }
  createWs()
  // 适当时机关闭ws
  // ws.close()

</script>

<template>
  <div>
    <n-message-provider>
      <n-notification-provider>
    <RouterView /></n-notification-provider>
  </n-message-provider>
  </div>
 
</template>

<style scoped>
div{
  width:100%;
  height:100%;
}
</style>
