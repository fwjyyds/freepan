<script setup lang="ts">

import type { TreeOption } from 'naive-ui'
import { repeat, sleep } from 'seemly'
import { defineComponent, ref } from 'vue'
import { NIcon, NSpace } from 'naive-ui'
import { h } from 'vue'
import { c, useMessage } from 'naive-ui'
import deepcopy from 'deepcopy'
import type { UploadFileInfo, UploadInst } from 'naive-ui'
import { Buffer } from "buffer";
import * as fs from 'fs-extra'
import { ipcRenderer } from 'electron';

import { provide, inject } from 'vue'
import { defineProps, defineEmits } from 'vue'
import type { Ref, PropType } from 'vue'
import { useprogressData2Store } from '../store/progressData2'
import { onMounted, onUnmounted } from 'vue'



setInterval (()=>{
  console.log(pd2.downloadarray,pd2.downloadedarray,pd2.uploadarray,pd2.uploadedarray,pd2.progressData,pd2.progressData2)
},3000)

// 下载状态
const downloadState = ref({

  fileName: '',
  url: '',
  version: '',
  percentage: 0,
  downloadedSize: '0 KB',
  totalSize: '0 MB',
  speed: '0 KB/s',
  size: 0,
  size2: 0,
  attr: '',
  userid: '-9999',
  path: ''
});

// 下载对话框引用
const downloadModalRef = ref(null);

// 清理函数引用
let cleanupProgressListener: any = null;
let downloaddata: any = ref([])


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


//下载函数
const confirmUpdate = async () => {
  // 重置下载状态

  try {
    let tmparray = []
    for (let i = 0; i < pd2.downloadarray.length; i++) {
      tmparray.push(pd2.downloadarray[i])

    }
    let tmpid = 1;
    for (let i = 0; i < checkedarray.value.length; i++) {
      let tmp = checkedarray.value[i]
      tmp.now=0
      
      while (true) {
        if (tmparray.some(item => item?.id == tmpid)) {
          tmpid++
        }
        else {
          tmp.id = tmpid
          break
        }

      }

      tmparray.push(tmp)
      let tmp8=pd2.downloadfinisharray
      tmp8.push(tmpid)

      pd2.setdownloadfinisharray(tmp8)
    }
 
    pd2.setdownloadarray(tmparray)



    for (let i = 0; i < checkedarray.value.length; i++) {

      downloadState.value = {
        url: 'http://127.0.0.1:3000/download/downloadFile',
        fileName: checkedarray.value[i].title,
        version: '1.0',
        percentage: 0,
        downloadedSize: '0 KB',
        totalSize: '计算中...',
        speed: '68 KB/s',
        size: checkedarray.value[i].size,
        size2: checkedarray.value[i].size2,
        attr: checkedarray.value[i].attr,
        userid: userinfo.value.accout,
        path: getpath() + '/' + checkedarray.value[i].title
      };
      if (!window.electron || !window.electron.downloadUpdate) {
        for (let i = 0; i < checkedarray.value.length; i++) {
          const response = await fetch('/api/download/downloadFile', {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ "userid": userinfo.value.accout, "path": getpath() + '/' + checkedarray.value[i].title, "filename": checkedarray.value[i].title })
          })
          const result = await response.blob()
          // 创建一个URL对象
          const url = window.URL.createObjectURL(result);

          // 创建一个<a>标签来触发下载
          const a = document.createElement('a');
          a.href = url;
          a.download = checkedarray.value[i].title // 设置默认的文件名

          // 将<a>标签添加到DOM中并触发点击事件
          document.body.appendChild(a);
          a.click();

          // 清理
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          // throw new Error('当前并非 Electron 环境，或者下载功能不可用。');


        }

      }
      else {
        // 开始下载
        const result = await window.electron.downloadUpdate({
          url: 'http://127.0.0.1:3000/download/downloadFile',
          filename: checkedarray.value[i].title,
          version: '1.0',
          percentage: 0,
          downloadedSize: '0 KB',
          totalSize: '计算中...',
          speed: '68.3 KB/s',
          size: checkedarray.value[i].size,
          size2: checkedarray.value[i].size2,
          id:checkedarray.value[i].id,
          attr: checkedarray.value[i].attr,
          userid: userinfo.value.accout,
          path: getpath() + '/' + checkedarray.value[i].title
        });
        console.log('下载结果:', result);
        if (result.success) {
          message.success('下载成功: ' + '保存在' + result.filePath);
        } else {
          // 下载失败
          message.error('下载失败: ' + 'error');

        }
      }




    }

  } catch (error) {
    console.error('下载过程出错:', error);
    message.error('下载过程出错: ' + error.message, 'error');

  }
};



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
let data2: any = ref([])
let userinfo: Ref<any> = ref({}), filedata: any, tmp

getuserinfo().then(async res => {
  userinfo.value = res
  pd2.setuserinfo(res)
  await fetch('/api/upload/filetree', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ "userid": userinfo.value.accout, "path": getpath() })
  }).then(res => res.json()).then(res => {
    tmp = res.data
    filedata = tmp
    data2.value = tmp


  })

})

var showModal1 = ref(false), f1 = ref(null), f2 = ref(null);
var filelist1: Ref<UploadFileInfo[]> = ref([]), filelist2: Ref<UploadFileInfo[]> = ref([]);
//获取第一个
const handleChange1 = (options: { fileList: UploadFileInfo[] }) => {
  filelist1.value = options.fileList
}
//获取第二个
const handleChange2 = (options: { fileList: UploadFileInfo[] }) => {
  filelist2.value = options.fileList
}
// 辅助函数：格式化字节大小
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
let loading: Array<Object> = []
const sendsinglefile = async (bigfile: Object, size: number) => {

  let start = 0;
  let file = bigfile.file
  let end = Math.min(size, file.size)
  let index = 0;
  let chunkarray = []
  let pd2 = useprogressData2Store()
  let tmp1:any


  let tmpid = 1
  let tmp3:any =deepcopy(pd2.uploadarray)

 
  while (true) {
    if (pd2.uploadarray.some(item => item?.id == tmpid)) {
      tmpid++
    }
    else {
      break
    }

  }
  tmp3.push(  {
    attr: file.name.split('.').pop(),
    size: formatBytes(file.size),
    size2: file.size,
    title: file.name,
    id: tmpid,
    now:0
  })

  pd2.setuploadarray(tmp3)

  let total = Math.ceil(file.size / size);
  async function binaryToBase64(data: Blob) {
    return new Promise((resolve, reject) => {
      const reader: any = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(data);
    });
  }
  while (start < file.size) {
    const chunk = file.slice(start, end); // 切片文件
    chunkarray.push(chunk); // 切片文件

    start = end;
    end = Math.min(start + size, file.size);
    index++;
  }
  //每秒发送两个知道发送完毕
  let timestart = 0
  const timer = setInterval(async () => {
    if (timestart >= total) {
      clearInterval(timer)
      console.log('发送完毕')
      return
    }

    const base64data = await binaryToBase64(chunkarray[timestart])

    fetch('/api/upload/ulfile', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        total: total, index: timestart, chunk:
          base64data, filename: file.name, userid: userinfo.value.accout, path: getpath()
      })
    }).then(res => res.json()).then(async res => {

      let pd2 = useprogressData2Store()
      if(!pd2.uploadfinisharray.includes(tmpid)){
pd2.uploadfinisharray.push(tmpid)
      }
 
      pd2.setpd2({
        options: {
          filename: res.filename,
          size2: res.total,
          id:tmpid
        },
        now: res.now,
        speed: formatBytes(chunkSize * 2),
        finisharray:pd2.uploadfinisharray
      })

      let tmp7= deepcopy(pd2.uploadarray)
 
     tmp7.forEach(item => {
      if(item.id ===  tmpid){
        item.now=res.now
        item.total=res.total
      }
     })
 
     pd2.setuploadarray(tmp7)



      if (res.status == 200) {
        pd2.settab1value('u1')
        pd2.setuploadfinisharray(pd2.uploadfinisharray.filter(item => item != tmpid))
       tmp1 = deepcopy(pd2.uploadedarray)
        tmp1.push({
          attr: file.name.split('.').pop(),
          size: formatBytes(file.size),
          size2: file.size,
          title: file.name,
          id:tmpid
        })
        let tmp2 = pd2.uploadarray.filter(item => item.id != tmpid)  

        pd2.setuploadarray(tmp2)
        pd2.setuploadedarray(tmp1)




        console.log('发送成功', {
          speed: formatBytes(chunkSize * 2),
          loading: loading
        })
        message.success(res.message)

        await fetch('/api/upload/filetree', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ "userid": userinfo.value.accout, "path": getpath() })
        }).then(res => res.json()).then(res => {
          tmp = res.data
          filedata = tmp
          data2.value = tmp

          message.success('文件获取成功')
        })
      }
    })


    timestart += 1
    if (timestart >= total) {
      clearInterval(timer)
      console.log('发送完毕')
      return
    }

    const base64data2 = await binaryToBase64(chunkarray[timestart])

    fetch('/api/upload/ulfile', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ total: total, index: timestart, chunk: base64data2, filename: file.name, userid: userinfo.value.accout, path: getpath() })
    }).then(res => res.json()).then(async res => {
      let pd2 = useprogressData2Store()
      if(!pd2.uploadfinisharray.includes(tmpid)){
pd2.uploadfinisharray.push(tmpid)
      }
    


      pd2.setpd2({
        options: {
          filename: res.filename,
          size2: res.total,
          id:tmpid
        },
        now: res.now,
        speed: formatBytes(chunkSize * 2),
        finisharray:pd2.uploadfinisharray
      })
     let tmp7= deepcopy(pd2.uploadarray)
     tmp7.forEach(item => {
      if(item.id ===  tmpid){
        item.now=res.now
        item.total=res.total
      }
     })

     pd2.setuploadarray(tmp7)
      if (res.status == 200) {
        pd2.settab1value('u1')
        pd2.setuploadfinisharray(pd2.uploadfinisharray.filter(item => item != tmpid))
        tmp1 = deepcopy(pd2.uploadedarray)
        tmp1.push({
          attr: file.name.split('.').pop(),
          size: formatBytes(file.size),
          size2: file.size,
          title: file.name,
          id:tmpid
        })
        let tmp2 = pd2.uploadarray.filter(item => item.id != tmpid)

        pd2.setuploadarray(tmp2)
        pd2.setuploadedarray(tmp1)



        console.log('发送成功', {
          speed: formatBytes(chunkSize * 2),
          loading: loading
        })
        message.success(res.message)
        await fetch('/api/upload/filetree', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ "userid": userinfo.value.accout, "path": getpath() })
        }).then(res => res.json()).then(res => {
          tmp = res.data
          filedata = tmp
          data2.value = tmp
          message.success('文件获取成功')

        })

      }
    })
    timestart += 1

  }, 1000)




}
var chunkSize = 2 * 1024 * 1024; // 每个切片的大小，这里设置为2Mb,每秒发送二个，速率就是4Mb/s
const message = useMessage();
const sendfile = async () => {
  console.log(userinfo.value.accout, '=')
 
  if (filelist1.value.length == 0 && filelist2.value.length == 0) {

    console.log('请选择文件')
    message.warning('请选择文件')
    return
  }
  for (let i = 0; i < filelist1.value.length; i++) {
    await sendsinglefile(filelist1.value[i], chunkSize)
  }
  for (let i = 0; i < filelist2.value.length; i++) {
    await sendsinglefile(filelist2.value[i], chunkSize)
  }
  // f1.value?.submit();
  // f2.value?.submit();
};




const defaultExpandedKeys = ref(['40', '41'])
const columns = [
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
    title: '类型',
    key: 'attr'
  }, {
    title: '修改时间',
    key: 'mtime'
  }
]
const pagination = {
  pageSize: 3
}
const rowKey = (row: RowData) => row.title
const shang = () => {
  const data = goBackToParent()
  if (data) {
    currentpath.value = removeLastSegment(currentpath.value)
    data2.value = data

  }
  else {
    message.info('已经是顶级目录')
  }
}
let stack: Object[] = []; // 用于保存访问路径的栈

// 切换到下一级节点
function goToChild(data: Object) {
  stack.push(data); // 将当前节点压入栈
}

// 返回上一级节点
function goBackToParent() {
  if (stack.length > 0) {
    return stack.pop(); // 从栈中弹出节点，切换到上一级节点
  } else {
    return false
  }
}
function getpath() {

  let tmp = currentpath.value.split(' / ').filter((item, index) => index != 0).join('/')
  return tmp
}
function removeLastSegment(path: string) {
  // 使用 split 方法将字符串按 '/' 分割成数组
  let parts = path.split('/');

  // 检查数组的最后一项是否为空字符串（例如处理末尾有 '/' 的情况）
  if (parts[parts.length - 1] === '') {
    parts.pop(); // 移除末尾的空字符串
  }

  // 移除最后一个元素
  parts.pop();

  // 使用 join 方法将数组重新组合成字符串
  // 如果原字符串是以 '/' 开头的，我们需要在返回的结果前加上 '/'
  return parts.length > 0 && path.startsWith('/') ? '/' + parts.join('/') : parts.join('/');
}
let ssk: any[] = []
const rowProps = (row: any) => {
  return {
    style: 'cursor: pointer;',
    onClick: async () => {

      if (row.childrens) {


        if (checkedarray.value != ssk) {
          ssk = checkedarray.value
          return
        }
        else {
          currentpath.value += ' / ' + row.title
          goToChild(data2.value)
          data2.value = row.childrens
        }




      }
      else {
        message.info(row.title)
      }
    }
  }
}
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { format } from 'path'
import { use } from 'echarts/types/src/extension.js'
let checkedarray: any = ref([])
async function handleCheck(rowKeys: DataTableRowKey[], meta: any) {

  checkedarray.value = meta


}
const deletefile = async () => {

  for (let i = 0; i < checkedarray.value.length; i++) {
    fetch('/api/upload/deletefile', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "userid": userinfo.value.accout, "path": getpath() + '/' + checkedarray.value[i].title })
    }).then(res => res.json()).then(async res => {
      if (res.status == 200) {
        message.success('删除成功')
        await fetch('/api/upload/filetree', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ "userid": userinfo.value.accout, "path": getpath() })
        }).then(res => res.json()).then(res => {
          tmp = res.data
          filedata = tmp
          data2.value = tmp

        })
      }
    })
  }
  console.log('删除文件')
}
let currentpath = ref('我的文件')





const createfolder = async () => {

  if (foldername.value != '') {
    let names = data2.value.map((item: any) => item.title)
    if (names.includes(foldername.value)) {
      message.warning('文件夹名字重复')
      return
    }
    await fetch('/api/upload/createfolder', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "userid": userinfo.value.accout, "path": getpath() + '/' + foldername.value })
    }).then(res => res.json()).then(async res => {
      if (res.status == 200) {
        message.success('创建成功')
        foldername.value = ''
        await fetch('/api/upload/filetree', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ "userid": userinfo.value.accout, "path": getpath() })
        }).then(res => res.json()).then(res => {
          tmp = res.data
          filedata = tmp
          data2.value = tmp


        })

      }
      else {
        message.error(res.message)
      }
    })
  }
  else {
    message.warning('请输入文件夹名字')
  }
}
let showModal2 = ref(false), foldername = ref('')

const downloadfile = async () => {
  console.log('下载文件', checkedarray.value)
  const response = await fetch('/api/download/downloadFile', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ "userid": userinfo.value.accout, "path": '2.jpg' })
  })
  const result = await response.blob()
  // 创建一个URL对象
  const url = window.URL.createObjectURL(result);

  // 创建一个<a>标签来触发下载
  const a = document.createElement('a');
  a.href = url;
  a.download = '2.jpg'; // 设置默认的文件名

  // 将<a>标签添加到DOM中并触发点击事件
  document.body.appendChild(a);
  a.click();

  // 清理
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
</script>
<template>


  <!-- 新建文件弹窗 -->
  <n-modal v-model:show="showModal2" title="新建文件夹" preset="card" draggable class="loginmodal"
    :style="{ width: '400px' }">
    <n-space vertical>
      <n-input v-model:value="foldername" type="text" placeholder="文件夹名字" />
      <n-button type="primary" @click="createfolder">确定</n-button>

    </n-space>
  </n-modal>
  <!-- 弹窗 -->
  <n-modal v-model:show="showModal1" title="传输文件" preset="card" draggable class="loginmodal"
    :style="{ width: '400px' }">
    <!--   :style="{ width: '800px',color:'#000000' }"  -->
    <div class="vertify">
      <div class="des">点击上传文件</div>
      <div>
        <n-upload @change="handleChange1" :max="5">
          <n-button>上传文件</n-button>
        </n-upload>
      </div>
      <div class="des">或者,你可以把文件拖拽到此处拖拽上传文件夹。</div>
      <div>
        <n-upload ref="f2" @change="handleChange2" multiple directory-dnd :default-upload="false" :max="5">
          <n-upload-dragger>
            <div style="margin-bottom: 12px">
              <svg xmlns="http://www.w3.org/2000/svg" class="ulsvg" xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7 18a4.6 4.4 0 0 1 0-9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1"></path>
                  <path d="M9 15l3-3l3 3"></path>
                  <path d="M12 12v9"></path>
                </g>
              </svg>
            </div>
            <n-text style="font-size: 16px">
              点击或者拖动文件到该区域来上传
            </n-text>
            <n-p depth="3" style="margin: 8px 0 0 0">
              请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码(最多5个)
            </n-p>
          </n-upload-dragger>
        </n-upload>
      </div>
    </div>
    <div class="btn2">
      <n-button type="tertiary" @click="showModal1 = !showModal1">
        取消
      </n-button>
      <n-button type="info" @click="sendfile"> 确定 </n-button>
    </div>
  </n-modal>
  <div class="me">
    <div class="topcontainer">
      <n-breadcrumb class="breadcrumb">
        <n-breadcrumb-item>首页</n-breadcrumb-item>
        <n-breadcrumb-item>{{ currentpath }} </n-breadcrumb-item>
        <n-button style="color:#2080F0" type="3124" @click="shang">返回上一级</n-button>
      </n-breadcrumb>
      <div class="btns">
        <n-button type="primary" @click="showModal1 = true">
          上传
        </n-button>
        <n-button type="primary" @click="confirmUpdate">
          下载
        </n-button>
        <n-button type="info" @click="showModal2 = true">
          新建文件夹
        </n-button>
        <n-button type="success" @click="deletefile">
          删除
        </n-button>
      </div>
    </div>

    <n-divider />
    <div>
      <n-data-table :columns="columns" :data="data2" :pagination="pagination" :row-key="rowKey" :row-props="rowProps"
        @update:checked-row-keys="handleCheck" />
    </div>
  </div>
</template>
<style scoped>
.filetree {
  list-style: none;
  background-color: red;
}

.btns {
  button {
    margin-left: 5px;
  }
}

.topcontainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  background-color: #fff;

}

.breadcrumb {}

.me {

  padding: 24px;
}

.btn2 {
  display: flex;
  justify-content: right;

  button {
    margin: 0px 5px;
  }
}

.ulsvg {
  width: 72px;
  height: 72px;

}

.des {
  font-size: 14px;
  color: #666;
}
</style>