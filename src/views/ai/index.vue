<script setup lang="ts">
import { ref } from 'vue';
const infovalue = ref(994);
</script>
<template>
    <div class="row h100 " style="overflow: hidden;">
        <div class="column flex1 rightborder h100">
            <div class="row">
                <div class="btn_s1 rightborder2 pointer">
                    <svg class="icon1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 24 24">
                        <path
                            d="M22 9V7h-2v2h-2v2h2v2h2v-2h2V9zM8 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H2v-.99C2.2 16.29 5.3 15 8 15s5.8 1.29 6 2v1zM12.51 4.05C13.43 5.11 14 6.49 14 8s-.57 2.89-1.49 3.95C14.47 11.7 16 10.04 16 8s-1.53-3.7-3.49-3.95zm4.02 9.78C17.42 14.66 18 15.7 18 17v3h2v-3c0-1.45-1.59-2.51-3.47-3.17z"
                            fill="currentColor"></path>
                    </svg>
              新建会话
                </div>
                <div class="btn_s1 pointer">
                    <svg class="icon1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 24 24">
                        <path
                            d="M22 9V7h-2v2h-2v2h2v2h2v-2h2V9zM8 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H2v-.99C2.2 16.29 5.3 15 8 15s5.8 1.29 6 2v1zM12.51 4.05C13.43 5.11 14 6.49 14 8s-.57 2.89-1.49 3.95C14.47 11.7 16 10.04 16 8s-1.53-3.7-3.49-3.95zm4.02 9.78C17.42 14.66 18 15.7 18 17v3h2v-3c0-1.45-1.59-2.51-3.47-3.17z"
                            fill="currentColor"></path>
                    </svg>
                    创建群组
                </div>
            </div>
            <div class="column">
                <ul>
                    <li class="messli pointer" v-for="item in 10">
                        <img src="../../assets/img/a1.jpeg" class="face" alt="">
                        <div class="row side" style="width:100%">
                            <div class="column">
                                <div>十万个为啥，</div>
                           
                            </div>
                            <div class="column" style="width:70px;">
                                <div>昨天 07:65</div>
                          
                            </div>
                        </div>
                    </li>

                </ul>
            </div>
        </div>
        <div class="column flex3" style="background-color: #F7F9FC;">
            <div
                style="border-bottom:1px solid #f0f0f0;height:44px;display: flex;align-items: center;padding: 10px;font-weight:700;font-family: '微软雅黑', sans-serif;font-size: 16px;">
                DeepSeek</div>
            <div class="messbox">聊天消息</div>
            <div class="txarea column" style="text-align: right;color:lightgrey;">
                <textarea style="height:100px;border:0px;resize: none;outline: none;font-size: 14px;color:#333333;"
                    name="" id="">

            </textarea>
                按下enter键发送,controll+enter换行
            </div>
        </div>
    </div>
</template>
<style scoped>
.side {
    justify-content: space-between;
}

.messbox {
    height: 100%;

    margin: 0 2.5%;

    overflow-x: hidden;
    overflow-y: scroll;
}

.messbox::-webkit-scrollbar {
    display: none;
}

.txarea {
    width: 95%;
    margin: 0 2.5%;
    box-sizing: border-box;
    background-color: red;
    padding: 18px;
    background-color: #fff;
    margin-bottom: 20px;
}

.messli {
    padding: 10px;

    display: flex;
    flex-direction: row;
}

.face {
    width: 48px;
    height: 48px;
    border-radius: 50%;
}

.rightborder2 {
    border-right: 1px solid #f0f0f0;
}

.icon1 {
    width: 20px;
    margin-right: 10px;
}

.btn_s1 {
    color: #06AFFF;
    display: flex;
    align-items: center;

    width: 50%;
    box-sizing: border-box;
    padding: 0px 10px;
    justify-content: center;
    margin: 14px 0px;
}

.btn_s1:hover {
    color: #1993CD
}

.pointer {
    cursor: pointer;
}

ul {
    outline: none;
    margin: 0;
    list-style: none;
    padding: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    height: calc(100vh - 110px);

}

.h100 {
    height: 100%;
}

.rightborder {
    border-right: 1px solid #F0F0F0;
}

.flex2 {
    display: flex;
    flex: 2;
}

.flex3 {
    display: flex;
    flex: 3;
}

.flex1 {
    display: flex;
    flex: 1;
}

.column {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
    flex-direction: row;
}
</style>