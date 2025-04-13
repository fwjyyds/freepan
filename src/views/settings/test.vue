<script setup lang="ts">

import { onMounted, onUnmounted, watch } from 'vue'
import { useprogressData2Store } from '../store/progressData2';

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
        console.log(tmp6, '============================')


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
</script>
<template>
<div class="wd">
    <div>检查更新</div>
    <div class="content">
    <div class="title">
检查
    </div>
    <div class="desc">
当前版本v0.1.0
<n-button type="info">
      检查更新
    </n-button>
<div>
    最新更新内容
</div>
    
    </div>
    </div>
</div>
</template>
<style scoped>
.wd{
    padding:10px;
}
</style>