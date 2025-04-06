<script setup lang="ts">
import { ref } from "vue";
import Download1 from "./donwload1.vue";
import Download2 from "./donwload2.vue";
import type { Ref } from 'vue';
import type { UploadFileInfo, UploadInst } from 'naive-ui'
import { Buffer } from "buffer";
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
  let total=Math.ceil(file.size/size);
async function binaryToBase64(data:Blob) {
  return new Promise((resolve, reject) => {
    const reader:any= new FileReader();
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
  let timestart=0
  const timer = setInterval(async() => {
if(timestart>=total){
  clearInterval(timer)
  console.log('发送完毕')
  return
}
console.log('一次',chunkarray[timestart],timestart,total)
const base64data=await binaryToBase64(chunkarray[timestart])

 fetch('/api/upload/ulfile', {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({ total:total,index:timestart,chunk:
      base64data ,filename:file.name ,userid:'fwj',path:'/movie/nezha'})
 })
  

  timestart+=1
  if(timestart>=total){
  clearInterval(timer)
  console.log('发送完毕')
  return
}

const base64data2=await binaryToBase64(chunkarray[timestart])

   fetch('/api/upload/ulfile', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ total:total,index:timestart,chunk:base64data2 ,filename:file.name,userid:'fwj',path:'/movie/nezha'})
  })
  timestart+=1

  },1000)  


  

}
const sendfile = async () => {
 
  const chunkSize = 100 * 1024; // 每个切片的大小，这里设置为100kb,每秒发送二个，速率就是200kb/s
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
</script>
<template>
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
  <n-card title="传输" style="margin-bottom: 16px">
    <n-tabs type="line" animated>
      <n-tab-pane name="oasis" tab="上传">
        <Download1></Download1>
      </n-tab-pane>
      <n-tab-pane name="the beatles" tab="下载">
        <Download2></Download2>
      </n-tab-pane>
      <template #suffix>
       
      </template>
    </n-tabs>
  </n-card>
</template>
<style scoped>
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
