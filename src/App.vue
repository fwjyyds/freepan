<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {NMessageProvider} from 'naive-ui'
import { NNotificationProvider } from 'naive-ui';
import { ref } from 'vue'
import { onMounted, onUnmounted } from 'vue'
import { useprogressData2Store } from './views/store/progressData2';
let cleanupProgressListener: any = null;
import deepcopy from 'deepcopy';
const pd2=   useprogressData2Store()
// 组件挂载时设置进度监听器
onMounted(() => {
  if (window.electron && window.electron.onDownloadProgress) {
    cleanupProgressListener = window.electron.onDownloadProgress((progressData: any) => {
      // 更新下载状态

      //后续用序号代替
      if (progressData.now >= progressData.options.size2) {
        //进位
        pd2.settab2value('u1')
        console.log(pd2.downloadfinisharray, 8888888888888, progressData.options.id)
        let tmp6 = pd2.downloadfinisharray.filter(item => item !== progressData.options.id)
        console.log(tmp6, '-------------------------------------')
        pd2.setdownloadfinisharray(tmp6)



        let tmp4 = deepcopy(pd2.downloadedarray)
        let tmp5 = pd2.downloadarray.filter(item => item.id === progressData.options.id)
        for (let i = 0; i < tmp5.length; i++) {
          tmp4.push(tmp5[i])
        }

        pd2.setdownloadedarray(tmp4)
        pd2.setdownloadarray(pd2.downloadarray.filter(item => item.id != progressData.options.id))
      }
      else {

      }
      console.log(progressData, '\\\\\\\\\\\\\\\\\\\\\\\\')
      let tmp9=deepcopy(pd2.downloadarray)
      tmp9.forEach(item=>{
        if(item.id==progressData.options.id){
          item.now=progressData.now
        }
      })
pd2.setdownloadarray(tmp9)
      pd2.setpd(progressData)



    });
  }

});

// 组件卸载时清理监听器
onUnmounted(() => {
  if (cleanupProgressListener) {
    cleanupProgressListener();

  }
})
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
    <RouterView/></n-notification-provider>
  </n-message-provider>
  </div>
 
</template>

<style scoped>
div{
  width:100%;
  height:100%;
}
</style>
