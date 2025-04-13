<script setup lang="ts">
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { NGradientText,NProgress } from 'naive-ui'
import { defineComponent, ref } from 'vue'
import { h } from 'vue'

import type { PropType, Ref } from 'vue'
import { watch } from 'vue'
import { useprogressData2Store } from '../store/progressData2';
import { onMounted, onUnmounted } from 'vue'

let cleanupProgressListener: any = null;
import deepcopy from 'deepcopy';
const pd2=   useprogressData2Store()
// 组件挂载时设置进度监听器
onMounted(() => {
  pd2.getupload()
  //获取上传路径
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

    //放到数据库
  }

});

// 组件卸载时清理监听器
onUnmounted(() => {
  if (cleanupProgressListener) {
    cleanupProgressListener();

  }
})


let a =ref('上传中(0)'),b=ref('上传完成(0)')
let tmp=ref([])
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         


// 辅助函数：格式化字节大小
function formatBytes(bytes:Number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
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
    if(localStorage.getItem('userinfo')){
      localStorage.removeItem(localStorage.getItem('userinfo'))
    }

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
  // getdata()
})


function createColumns(): DataTableColumns<RowData> {
  return [
    
    {
      type: 'selection',
      disabled(row: RowData) {
        return row.name === 'Edward King 3'
      }
    },
    {
      title: '序号',
      key: 'id'
    },
    
    {
      title: '文件',
      key: 'title'
    },
    {
      title: '大小',
      key: 'size'
    },
    {
      title: '状态',
      key: 'cond',
      render(row:any) {
      
        return (pd2.uploadfinisharray.includes(row.id))?(
pd2.progressData2.options.id==row.id? h(
          NProgress,
          {
           type:"line" ,
           percentage: (pd2.progressData2.now/pd2.progressData2.options.size2).toFixed(3) *100  ,
            onClick: () => {}
          }, 
          { default: () => pd2.progressData2.speed  }
        ): h(
          NProgress,
          {
           type:"line" ,
           percentage: (row.now/row.total).toFixed(3) *100  ,
            onClick: () => {}
          }, 
          { default: () => pd2.progressData2.speed  }
        )

        )  :'等待下载'
      }
    }
  ]
}
  
function createColumns2(): DataTableColumns<RowData> {
  return [
    {
      type: 'selection',
      disabled(row: RowData) {
        return row.name === 'Edward King 3'
      }
    },
    {
      title: '文件',
      key: 'title'
    },
    {
      title: '大小',
      key: 'size'
    },
    {
      title: '状态',
      key: '已上传',
      render(row: RowData) {
        return '已上传'
       }
    }
  ]
}
  const columns2 = createColumns2()


const checkedRowKeysRef = ref<DataTableRowKey[]>([])



const columns = createColumns()
const pagination = {
  pageSize: 5
}
const rowKey = (row: RowData) => row.name
function handleCheck(rowKeys: DataTableRowKey[]) {
  checkedRowKeysRef.value = rowKeys
}

</script>
<template>
  <n-space vertical class="demo">
    <n-tabs key="barleft" addable type="bar" animated placement="left" class="tabs"       v-model:value="pd2.tab1value"> 
    <n-tab-pane name="u1" 
        :tab="'上传中('+pd2.uploadarray.length + ')'">
        <n-data-table :columns="columns" :data="pd2.uploadarray" :pagination="pagination" :row-key="rowKey"
          @update:checked-row-keys="handleCheck" />
      </n-tab-pane>
      <n-tab-pane name="u2" :tab="'上传完成('+pd2.uploadedarray.length + ')'">
        <n-data-table :columns="columns2" :data="pd2.uploadedarray" :pagination="pagination" :row-key="rowKey"
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