<script setup lang="ts">
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { NGradientText,NProgress } from 'naive-ui'
import { defineComponent, ref } from 'vue'
import { h } from 'vue'
interface RowData {
  key: number
  name: string
  age: string
  address: string
}
const getuserinfo = async () => {
  let tmp
  //个人信息
  let key: any = localStorage.getItem('userinfo') || "[]"
  let datetmp = new Date().getTime() - parseInt(key.split('|')[0])
  if (datetmp > 1000 * 3600 * 24) {
    localStorage.removeItem('userinfo')
    localStorage.removeItem(key)
  }
  else {
    let userinfo: any = localStorage.getItem(key) || "[]"
    async function jwkToCryptoKey(jwk: any) {
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
    userinfo = JSON.parse(userinfo)
    // AES-GCM解密函数
    async function decrypt(key: any, encrypted: any) {
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
    return jwkToCryptoKey(userinfo.key).then(async res2 => {

      tmp = await decrypt(res2, userinfo.encrypted)
      tmp = JSON.parse(tmp)
      return tmp
    })
  }

}
let userinfo = ref<any>({})
getuserinfo().then(async res => {
  userinfo.value = res
  getdata()
})


async function getdata()
{
await fetch('/api/download/upload',{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
  userid:userinfo.value.userid
  })
}).then(res=>res.json()).then(res=>{

  data1.value=JSON.parse(res.data[0].array)
  data2.value=JSON.parse(res.data[1].array)

  a.value=a.value.split('(')[0]+'('+data1.value.length+')'
  b.value=b.value.split('(')[0]+'('+data2.value.length+')'
})
}
let data1=ref([]),data2=ref([])
function createColumns(): DataTableColumns<RowData> {
  return [
    {
      type: 'selection',
      disabled(row: RowData) {
        return row.name === 'Edward King 3'
      }
    },
    {
      title: '文件',
      key: 'name'
    },
    {
      title: '大小',
      key: 'size'
    },
    {
      title: '状态',
      key: 'cond'
    }
  ]
}
  



const checkedRowKeysRef = ref<DataTableRowKey[]>([])



const columns = createColumns()
const pagination = {
  pageSize: 5
}
const rowKey = (row: RowData) => row.name
function handleCheck(rowKeys: DataTableRowKey[]) {
  checkedRowKeysRef.value = rowKeys
}
let a =ref('上传中(0)'),b=ref('上传完成(0)')
</script>
<template>
  <n-space vertical class="demo">
    <n-tabs key="barleft" addable type="bar" animated placement="left" class="tabs"> 
    <n-tab-pane :name=a
        :tab=a>
        <n-data-table :columns="columns" :data="data1.value" :pagination="pagination" :row-key="rowKey"
          @update:checked-row-keys="handleCheck" />
      </n-tab-pane>
      <n-tab-pane :name=b :tab=b>
        <n-data-table :columns="columns" :data="data2.value" :pagination="pagination" :row-key="rowKey"
        @update:checked-row-keys="handleCheck" />
      </n-tab-pane>
    </n-tabs>
  </n-space>


</template>
<style scoped>
.demo{

  height:calc(100vh - 221.4px)
}
/* .tabs{
    height:2px !important
} */
:deeo(div .n-card__content){

}
:deep(div .n-tabs) {
  height: calc(100vh - 194.4px) !important;
  overflow: hidden !important;
}
</style>