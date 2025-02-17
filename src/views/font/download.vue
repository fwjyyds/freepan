<script setup lang="ts">
import { ref } from "vue";
import Download1 from "./donwload1.vue";
import Download2 from "./donwload2.vue";

var showModal1 = ref(true),f1=ref(null),f2=ref(null);
const sendfile = () => {
f1.value?.submit();
f2.value?.submit();
};
const dlfile = async () => {  
await fetch("/api/upload/dlfile?filename=123.txt", {
  method: "GET",
  headers: {}
}).then(res=>{
  console.log(res,'====')
})
};
</script>
<template>
  <!-- 弹窗 -->
  <n-modal
    v-model:show="showModal1"
    title="传输文件"
    preset="card"
    draggable
    class="loginmodal"
    :style="{ width: '400px' }"
  >
    <!--   :style="{ width: '800px',color:'#000000' }"  -->
    <div class="vertify">
      <div class="des">点击上传文件</div>
      <div>
        <n-upload ref="f1"
        name="file"
           action="/api/upload/ulfile"
        :default-upload="false"   :max="5"
         :headers="{
            'naive-info': 'hello!',
          }"
          :data="{        
            'naive-data': 'cool! naive!',
          }"
        >
          <n-button>上传文件</n-button>
        </n-upload>
      </div>
      <div class="des">或者,你可以把文件拖拽到此处拖拽上传文件夹。</div>
      <div>
        <n-upload ref="f2"
        action="/api/upload/ulfile"
        
          multiple
          directory-dnd
          :default-upload="false"  :max="5"
        >
          <n-upload-dragger>
            <div style="margin-bottom: 12px">
                <svg xmlns="http://www.w3.org/2000/svg" class="ulsvg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4.6 4.4 0 0 1 0-9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1"></path><path d="M9 15l3-3l3 3"></path><path d="M12 12v9"></path></g></svg>
            </div>
            <n-text style="font-size: 16px">
              点击或者拖动文件到该区域来上传
            </n-text>
            <n-p depth="3" style="margin: 8px 0 0 0">
              请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
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
        <n-button
          @click="showModal1 = !showModal1"
          type="primary"
          size="small"
          style="margin-left: 16px"
        >
          上传
        </n-button>
        <n-button type="primary" size="small" style="margin-left: 16px" @click="dlfile">
          下载
        </n-button>
        <n-button type="primary" size="small" style="margin-left: 16px">
          上传
        </n-button>
        <n-button type="primary" size="small" style="margin-left: 16px">
          上传
        </n-button>
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
.des{
    font-size: 14px;
    color: #666;
}
</style>
