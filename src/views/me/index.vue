<script setup lang="ts">

import type { TreeOption } from 'naive-ui'
import { repeat, sleep } from 'seemly'
import { defineComponent, ref, type Ref } from 'vue'
import { NIcon, NSpace } from 'naive-ui'
import { h } from 'vue'
import { c, useMessage } from 'naive-ui'
import deepcopy from 'deepcopy'
import type { UploadFileInfo, UploadInst } from 'naive-ui'
import { Buffer } from "buffer";
import * as fs from 'fs-extra'
import { ipcRenderer } from 'electron';
import { onMounted, onUnmounted } from 'vue'
// 下载状态
const downloadState = ref({
  visible: false,
  fileName: '',
  url: '',
  version: '',
  percentage: 0,
  downloadedSize: '0 KB',
  totalSize: '0 MB',
  speed: '0 KB/s'
});

// 下载对话框引用
const downloadModalRef = ref(null);

// 清理函数引用
let cleanupProgressListener:any = null;

// 组件挂载时设置进度监听器
onMounted(() => {
  if (window.electron && window.electron.onDownloadProgress) {
    cleanupProgressListener = window.electron.onDownloadProgress((progressData:any) => {
      // 更新下载状态
      downloadState.value.percentage = progressData.percent;
      downloadState.value.downloadedSize = progressData.formattedDownloaded;
      downloadState.value.totalSize = progressData.formattedTotal;
      downloadState.value.speed = progressData.speed;
      
      console.log(`下载进度: ${progressData.percent}%, 速度: ${progressData.speed}`);
    });
  }
});

// 组件卸载时清理监听器
onUnmounted(() => {
  if (cleanupProgressListener) {
    cleanupProgressListener();
  }
});
// 初始化 updateConfirm 为一个响应式对象
const updateConfirm = ref({
  visible: false,
  url: 'http://127.0.0.1:3000/download/downloadFile',
  filename:'555.jpg',
  version: '1.1',
});

// 确认更新开始下载
const confirmUpdate = async () => {
  // 隐藏确认对话框
  updateConfirm.value.visible = false;
  
  // 重置下载状态
  downloadState.value = {
    visible: true,
    fileName:'777.jpg',
    url: updateConfirm.value.url,
    version: updateConfirm.value.version,
    percentage: 0,
    downloadedSize: '0 KB',
    totalSize: '计算中...',
    speed: '0 KB/s'
  };
  
  // 显示下载对话框
  if (downloadModalRef.value) {
    downloadModalRef.value.startDownload();
  }
  
  try {
    if (!window.electron || !window.electron.downloadUpdate) {
      window.electron.ipcRenderer.send('message', 'Hello from Renderer');
      console.error('下载功能不可用2',window);
      throw new Error('下载功能不可用');
    }
    
    // 开始下载
    const result = await window.electron.downloadUpdate({
      url: updateConfirm.value.url,
      filename: downloadState.value.fileName,
      version: updateConfirm.value.version
    });
    
    console.log('下载结果:', result);
    
    if (result.success) {
      // 下载成功，完成下载动画
      if (downloadModalRef.value) {
        downloadModalRef.value.completeDownload();
      }
    } else {
      // 下载失败
      message.error('下载失败: ' + (result.error || '未知错误'), 'error');
      downloadState.value.visible = false;
    }
  } catch (error) {
    console.error('下载过程出错:', error);
    message.error('下载过程出错: ' + error.message, 'error');
    downloadState.value.visible = false;
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

const sendsinglefile = async (bigfile: Object, size: number) => {
  let start = 0;
  let file = bigfile.file
  let end = Math.min(size, file.size)
  let index = 0;
  let chunkarray = []
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
    console.log('一次', chunkarray[timestart], timestart, total)
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

      if (res.status == 200) {
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

      if (res.status == 200) {
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
const message = useMessage();
const sendfile = async () => {
  console.log(userinfo.value.accout, '=')
  const chunkSize = 2 * 1024 * 1024; // 每个切片的大小，这里设置为1000kb,每秒发送二个，速率就是200kb/s
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
const dlfile = async () => {
  await fetch("/api/upload/dlfile?filename=123.txt", {
    method: "GET",
    headers: {}
  }).then(res => {
    console.log(res, '====')
  })
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
  pageSize: 10
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
let ssk=0
const rowProps = (row: any) => {
  return {
    style: 'cursor: pointer;',
    onClick: async () => {
      //  console.log(';0000000000000000',row.c)
      if (row.childrens) {

   
        currentpath.value += ' / ' + row.title
        goToChild(data2.value)
        data2.value = row.childrens
 
      

      }
      else {
        message.info(row.title)
      }
    }
  }
}
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
let checkedarray:any=ref([])
async function handleCheck(rowKeys: DataTableRowKey[]) {

  checkedarray.value = rowKeys
  

}
const deletefile= async () => {

for(let i=0;i<checkedarray.value.length;i++){
  fetch('/api/upload/deletefile', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ "userid": userinfo.value.accout, "path": getpath() + '/' + checkedarray.value[i] })
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
}}) }
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
  console.log('下载文件',checkedarray.value)
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
        <n-button type="primary" @click="confirmUpdate" >
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
      <n-data-table :columns="columns" :data="data2" :pagination="pagination"
        :row-key="rowKey" :row-props="rowProps"   @update:checked-row-keys="handleCheck"/>
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