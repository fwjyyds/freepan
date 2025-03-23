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


var decryptword:any=ref({})
//个人信息
let key:any=localStorage.getItem('userinfo')||"[]"
console.log(key, 'key')
let datetmp=new Date().getTime()-parseInt(key.split('|')[0])
console.log(new Date().getTime(),parseInt(key.split('|')[0]),datetmp, 'datetmp')
if(datetmp>1000*3600*24){
  localStorage.removeItem('userinfo')
  localStorage.removeItem(key)
}
else{

  let userinfo:any=localStorage.getItem(key)||"[]"
async function jwkToCryptoKey(jwk:any) {
    return await crypto.subtle.importKey(
        "jwk", // 导入格式
        jwk,   // JWK对象
        {
            name: "AES-GCM",
            length: 256, // 密钥长度
        },
        true,  // 是否可以导出密钥
        ["encrypt", "decrypt"] // 密钥用法
    );
}
userinfo=JSON.parse(userinfo)
// AES-GCM解密函数
async function decrypt(key:any, encrypted:any) {
    const decoder = new TextDecoder();
    const ivBuffer = Uint8Array.from(atob(encrypted.iv), c => c.charCodeAt(0));
    const encryptedBuffer = Uint8Array.from(atob(encrypted.data), c => c.charCodeAt(0));

    const decryptedData = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: ivBuffer
        },
        key,
        encryptedBuffer
    );

    // 将解密后的ArrayBuffer转换回字符串
    return decoder.decode(decryptedData);
}
 jwkToCryptoKey(userinfo.key).then(async res2 => {
       
             decryptword.value = await decrypt(res2, userinfo.encrypted)
             decryptword.value=JSON.parse(decryptword.value)
            console.log(decryptword.value, '解密后')
        })

}


const message = useMessage()
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
import { useRouter } from 'vue-router';
const router = useRouter();

const logout = () => {
  //删除本地cookie
  //路由跳转
  router.push('/login')


}
const handleSelect = (key: string) => {
  if (key === 'logout') {
    logout()
  }
  else {
    message.info(`You clicked ${key}`)
  }
}
const options = [
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




import type { CSSProperties } from 'vue'
const railStyle = ({
  focused,
  checked
}: {
  focused: boolean
  checked: boolean
}) => {
  const style: CSSProperties = {}
  if (checked) {
    style.background = 'lightgray'

    if (focused) {
      style.boxShadow = '0 0 0 2px #d0305040'
    }
  }
  else {
    style.background = '#000000'
    if (focused) {
      style.boxShadow = '0 0 0 2px #2080f040'
    }
  }
  return style
}

</script>
<template>

  <div class="container">


    <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed"
      show-trigger @collapse="collapsed = true" @expand="collapsed = false">
      <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" />
    </n-layout-sider>


    <n-layout>
      <div class="right " style="height:calc(100% - 63px )">
        <div class="top">
          <div class="opt">
            <div class="search-box">
              <n-input placeholder="搜索" class="search">
                <template #prefix>
                  <n-icon :component="FlashOutline" />
                </template>
              </n-input>
            </div>

            <div class="switch">
              <n-switch class="switch1" :rail-style="railStyle">
                <template #checked>
                  白天
                </template>
                <template #unchecked>
                  午夜
                </template>
              </n-switch>
            </div>

          </div>
          <n-dropdown :options="options" @select="handleSelect">
            <div class="pointer user_info">
              <img src="../../assets/img/a1.jpeg" class="face" alt="">
              <div class="name">{{decryptword["accout"]}}</div>
            </div>
          </n-dropdown>
        </div>
        <div class="bottom h100" >
          <RouterView></RouterView>
        </div>
      </div>
    </n-layout>




  </div>
</template>
<style scoped>
.h100{
  height: 100%;
}
.opt {

  display: flex;
  flex-direction: row;
  width: 400px;
  align-items: center;
  .search-box{
    width:240px;
  }
  :deep(.n-input-wrapper) {

  }

  .switch {
    margin-left: 10px;
  }
}

.switch1 {}

.user_info {
  display: flex;
  flex-direction: row;

}

.pointer {
  cursor: pointer;
}

.name {
  margin-left: 4px;
  margin-right: 6px;
  font-size: 1em;
  max-width: 5em;
  overflow: hidden;
  text-overflow: ellipsis;

  text-align: left;
  display: flex;
  align-items: flex-end;
}

.face {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.search {
  background-color: #F1F3F8;
  border-radius: 29px;

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
  padding: 6px 12px;
  height: 50px;
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