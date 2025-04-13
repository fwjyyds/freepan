<script setup lang="ts">


import { RouterView } from 'vue-router';
import { useMessage, type MenuOption } from 'naive-ui'
import type { Component } from 'vue'
import { FlashOutline } from '@vicons/ionicons5'
import {
  BookOutline as BookIcon,
  CloudDownloadOutline as CDI,
  BarChartOutline as BCI,
  ChatbubbleEllipsesOutline as CEI,
  PrismOutline as PI,
  SettingsOutline as SI,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon,
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
  PersonCircleOutline as UserIcon
} from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import { defineComponent, h, ref } from 'vue'
import { RouterLink } from 'vue-router'
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: 'info'
        }
      },
      { default: () => '消息' }
    ),
    key: 'ks1',
    icon: renderIcon(BookIcon)
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: 'send'
        }
      },
      { default: () => '传输' }
    ),
    key: 'ks2',
    icon: renderIcon(CDI)
    ,
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: 'about'
        }
      },
      { default: () => '关于' }
    ),
    key: 'ks3',
    icon: renderIcon(BCI)
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: 'test'
        }
      },
      { default: () => '检查更新' }
    ),
    key: 'ks4',
    icon: renderIcon(CEI)
  }
]

    const   collapsed= ref(false)

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
    <div class="row">
    <div class="">   
        <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed"
      show-trigger @collapse="collapsed = true" @expand="collapsed = false">
      <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" />
    </n-layout-sider>
</div>
    <div class="flex4">
        <router-view></router-view>
    </div></div>
</template>
<style scoped>
.row{
    display: flex;
    flex-direction: row;
}
.flex1{
    flex: 1;
}
.flex4{
    flex: 4;
}
</style>