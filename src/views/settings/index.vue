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