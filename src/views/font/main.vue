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


const message =useMessage()
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
import { useRouter } from 'vue-router';
const router = useRouter();

const logout=()=>{
//删除本地cookie
//路由跳转
router.push('/login')


}
const handleSelect = (key: string) => {
  if(key === 'logout'){
logout()
  }
  else{
    message.info(`You clicked ${key}`)
  }
}
const options= [
        {
          label: '用户资料',
          key: 'profile',
          icon: renderIcon(UserIcon)
        },
        {
          label: '编辑用户资料',
          key: 'editProfile',
          icon: renderIcon(EditIcon)
        },
        {
          label: '退出登录',
          key: 'logout',
          icon: renderIcon(LogoutIcon)
        }
      ]
const collapsed = ref(false)
const menuOptions: MenuOption[] = [
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: 'me'
        }
      },
      { default: () => '首页' }
    ),
    key: 'k1',
    icon: renderIcon(BookIcon)
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: 'download'
        }
      },
      { default: () => '传输' }
    ),
    key: 'k2',
    icon: renderIcon(CDI)
    ,
    // children: [
    //     {
    //         type: 'group',
    //         label: '人物',
    //         key: 'people',
    //         children: [
    //             {
    //                 label: '叙事者',
    //                 key: 'narrator',
    //                 icon: renderIcon(PersonIcon)
    //             },
    //             {
    //                 label: '羊男',
    //                 key: 'sheep-man',
    //                 icon: renderIcon(PersonIcon)
    //             }
    //         ]
    //     },
    //     {
    //         label: '饮品',
    //         key: 'beverage',
    //         icon: renderIcon(WineIcon),
    //         children: [
    //             {
    //                 label: '威士忌',
    //                 key: 'whisky'
    //             }
    //         ]
    //     },
    //     {
    //         label: '食物',
    //         key: 'food',
    //         children: [
    //             {
    //                 label: '三明治',
    //                 key: 'sandwich'
    //             }
    //         ]
    //     },
    //     {
    //         label: '过去增多，未来减少',
    //         key: 'the-past-increases-the-future-recedes'
    //     }
    // ]
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: 'chart'
        }
      },
      { default: () => '资源面板' }
    ),
    key: 'k3',
    icon: renderIcon(BCI)
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: 'mess'
        }
      },
      { default: () => '消息' }
    ),
    key: 'k4',
    icon: renderIcon(CEI)
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: 'ai'
        }
      },
      { default: () => 'AI' }
    ),
    key: 'k5',
    icon: renderIcon(PI)
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: 'settings'
        }
      },
      { default: () => '设置' }
    ),
    key: 'k6',
    icon: renderIcon(SI)
  },
]
</script>
<template>

  <div class="container">


    <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed"
      show-trigger @collapse="collapsed = true" @expand="collapsed = false">
      <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" />
    </n-layout-sider>


    <n-layout>
      <div class="right">
        <div class="top">
          <div class="opt">
            <n-input placeholder="搜索" class="search">
              <template #prefix>
                <n-icon :component="FlashOutline" />
              </template>
            </n-input>
          </div>
          <n-dropdown :options="options" @select="handleSelect">
          <div class="pointer user_info">
            <img src="../../assets/img/a1.jpeg" class="face" alt="">
            <div class="name">asdasdasdasdasdsdasdasdasdsa</div>
          </div>
        </n-dropdown>
        </div>
        <div class="bottom">
          <RouterView></RouterView>
        </div>
      </div>
    </n-layout>




  </div>
</template>
<style scoped>
.user_info{
  display: flex;
  flex-direction: row;

}
.pointer{
  cursor: pointer;
}
.name{
  margin-left: 4px;
  margin-right:6px;
  font-size: 1em;
  max-width: 5em;
  overflow: hidden;
  text-overflow: ellipsis;  

  text-align: left;
  display: flex;
  align-items: flex-end;
}
.face{
  width:36px;
  height:36px;
  border-radius:50%;
}
.search{
  background-color: #F1F3F8;
  border-radius:29px;
  
}
.container {
  display: flex;
  flex-direction: row;

}

.left {
  flex: 1
}

.right {
  
  flex: 6;

}

.top {
  display: flex;
  flex-direction: row;
  padding:6px;
  height:50px;
  justify-content: space-between;
  ul {
    display: flex;
    flex-direction: row;
    list-style: none;
  }
box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  align-items: center;
}
</style>