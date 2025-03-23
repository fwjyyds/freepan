<script setup lang="ts">
import { ref } from 'vue';
import { useMessage } from 'naive-ui'
import { useNotification } from 'naive-ui'
import { useRouter } from 'vue-router'
import * as CryptoJS from 'crypto-js';
const router = useRouter()
const message = useMessage()
const notification = useNotification()
var showModal1 = ref(false), codeurl = ref<string>('/api/user/create'), vinput = ref(''), username = ref(''), password = ref('')
const resetcodeurl = () => codeurl.value = codeurl.value + '?' + Math.random()// AES-GCM加密函数
async function encrypt(key:any, data:any, iv:any) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const encryptedData = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encodedData
    );

    // 将ArrayBuffer转换为Base64字符串以便存储或传输
    return {
        iv: btoa(String.fromCharCode(...new Uint8Array(iv))),
        data: btoa(String.fromCharCode(...new Uint8Array(encryptedData)))
    };
}

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

// 生成AES密钥的函数
async function generateKey() {
    return await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}
// 导出AES密钥为JWK格式的函数
async function exportKey(key) {
    return await crypto.subtle.exportKey('jwk', key);
}
async function jwkToCryptoKey(jwk) {
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


import { Buffer } from 'buffer';
import cookieSignature from 'cookie-signature';


const login = () => {
    fetch('/api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // 设置请求头，告知服务器请求体是JSON格式
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value,
            code: vinput.value
        })
    }).then(res => res.json()).then(async res => {

    



        if (res.data.status === 200) {
            showModal1.value = false
            notification['success']({
                content: '完成' + res.data.status,
                meta: res.data.message,
                duration: 2000,
                keepAliveOnHover: true
            })
            //个人信息cookie存储
            const key=new Date().getTime().toString()+'|userinfo'
            localStorage.setItem(key, JSON.stringify(res.data.info))
            const key2='userinfo'
            localStorage.setItem(key2, key)
            await jwkToCryptoKey(res.data.info.key).then(async res2 => {
            console.log(res, res2, '====', res.data.info, '6666', '8888', res.data.info.encrypted)
            const decryptword = await decrypt(res2, res.data.info.encrypted)
            console.log(decryptword, '解密后')
        })
        //路由跳转
            router.push('/main')
        } else {
            notification['error']({
                content: '错误' + res.data.status,
                meta: res.data.message,
                duration: 2000,
                keepAliveOnHover: true
            })


        }
    })
}


</script>

<template>
    <div class="bg">
        <!-- 弹窗 -->
        <n-modal v-model:show="showModal1" title="验证码验证" preset="card" draggable class="loginmodal"
            :style="{ width: '400px' }">
            <!--   :style="{ width: '800px',color:'#000000' }"  -->
            <div class="vertify">
                <input type="text" v-model="vinput" placeholder="请输入验证码">
                <img v-if="showModal1" :src="codeurl" @click="resetcodeurl" alt="">
            </div>
            <div class="btn2">
                <n-button type="tertiary" @click="showModal1 = !showModal1">
                    取消
                </n-button>
                <n-button type="info" @click="login">
                    确定
                </n-button>
            </div>
        </n-modal>
        <!-- 内容 -->
        <div class="container">
            <div class="inner">
                <div class="title">
                    登录
                </div>
                <div class="account">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 1024 1024">
                            <path
                                d="M858.5 763.6a374 374 0 0 0-80.6-119.5a375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1c-.4.2-.8.3-1.2.5c-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8c2-77.2 33-149.5 87.8-204.3c56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"
                                fill="#fff"></path>
                        </svg>
                        用户名
                    </div>
                    <div><input v-model="username" placeholder="username" type="text"></div>
                </div>
                <div class="password">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 24 24">
                            <g fill="transparent" stroke="#fff" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                                <circle cx="12" cy="16" r="1"></circle>
                                <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                            </g>
                        </svg>
                        密码
                    </div>
                    <div><input v-model="password" placeholder="password" type="password"></div>
                </div>
                <div class="opt">
                    <a href="#">忘记密码</a>
                </div>
                <div class="btn" @click="showModal1 = !showModal1">
                    <button>登录</button>

                </div>
                <div class="santitle">第三方登录</div>
                <div class="sans">
                    <ul>
                        <li> <a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 1024 1024">
                                    <path
                                        d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112C331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3c-34 109.5-23 154.8-14.6 155.8c18 2.2 70.1-82.4 70.1-82.4c0 49 25.2 112.9 79.8 159c-26.4 8.1-85.7 29.9-71.6 53.8c11.4 19.3 196.2 12.3 249.5 6.3c53.3 6 238.1 13 249.5-6.3c14.1-23.8-45.3-45.7-71.6-53.8c54.6-46.2 79.8-110.1 79.8-159c0 0 52.1 84.6 70.1 82.4c8.5-1.1 19.5-46.4-14.5-155.8z"
                                        fill="currentColor"></path>
                                </svg>

                            </a>
                        </li>
                        <li><a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 576 512">
                                    <path
                                        d="M385.2 167.6c6.4 0 12.6.3 18.8 1.1C387.4 90.3 303.3 32 207.7 32C100.5 32 13 104.8 13 197.4c0 53.4 29.3 97.5 77.9 131.6l-19.3 58.6l68-34.1c24.4 4.8 43.8 9.7 68.2 9.7c6.2 0 12.1-.3 18.3-.8c-4-12.9-6.2-26.6-6.2-40.8c-.1-84.9 72.9-154 165.3-154zm-104.5-52.9c14.5 0 24.2 9.7 24.2 24.4c0 14.5-9.7 24.2-24.2 24.2c-14.8 0-29.3-9.7-29.3-24.2c.1-14.7 14.6-24.4 29.3-24.4zm-136.4 48.6c-14.5 0-29.3-9.7-29.3-24.2c0-14.8 14.8-24.4 29.3-24.4c14.8 0 24.4 9.7 24.4 24.4c0 14.6-9.6 24.2-24.4 24.2zM563 319.4c0-77.9-77.9-141.3-165.4-141.3c-92.7 0-165.4 63.4-165.4 141.3S305 460.7 397.6 460.7c19.3 0 38.9-5.1 58.6-9.9l53.4 29.3l-14.8-48.6C534 402.1 563 363.2 563 319.4zm-219.1-24.5c-9.7 0-19.3-9.7-19.3-19.6c0-9.7 9.7-19.3 19.3-19.3c14.8 0 24.4 9.7 24.4 19.3c0 10-9.7 19.6-24.4 19.6zm107.1 0c-9.7 0-19.3-9.7-19.3-19.6c0-9.7 9.7-19.3 19.3-19.3c14.5 0 24.4 9.7 24.4 19.3c.1 10-9.9 19.6-24.4 19.6z"
                                        fill="currentColor"></path>
                                </svg>
                            </a>
                        </li>
                        <li><a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 496 512">
                                    <path
                                        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6c-3.3.3-5.6-1.3-5.6-3.6c0-2 2.3-3.6 5.2-3.6c3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9c2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9c.3 2 2.9 3.3 5.9 2.6c2.9-.7 4.9-2.6 4.6-4.6c-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2c12.8 2.3 17.3-5.6 17.3-12.1c0-6.2-.3-40.4-.3-61.4c0 0-70 15-84.7-29.8c0 0-11.4-29.1-27.8-36.6c0 0-22.9-15.7 1.6-15.4c0 0 24.9 2 38.6 25.8c21.9 38.6 58.6 27.5 72.9 20.9c2.3-16 8.8-27.1 16-33.7c-55.9-6.2-112.3-14.3-112.3-110.5c0-27.5 7.6-41.3 23.6-58.9c-2.6-6.5-11.1-33.3 2.6-67.9c20.9-6.5 69 27 69 27c20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27c13.7 34.7 5.2 61.4 2.6 67.9c16 17.7 25.8 31.5 25.8 58.9c0 96.5-58.9 104.2-114.8 110.5c9.2 7.9 17 22.9 17 46.4c0 33.7-.3 75.4-.3 83.6c0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252C496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2c1.6 1.6 3.9 2.3 5.2 1c1.3-1 1-3.3-.7-5.2c-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9c1.6 1 3.6.7 4.3-.7c.7-1.3-.3-2.9-2.3-3.9c-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2c2.3 2.3 5.2 2.6 6.5 1c1.3-1.3.7-4.3-1.3-6.2c-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9c1.6 2.3 4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2c-1.4-2.3-4-3.3-5.6-2z"
                                        fill="currentColor"></path>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
div,
a,
.btn button {
    color: #fff
}

.vertify {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    justify-content: center;
}

.vertify input {
    height: 36px;
    border: 1px lightgrey solid;
}

.vertify img {
    height: 40px;
    width: 100px;
    cursor: pointer;
}

.loginmodal {
    div {
        color: #000000
    }

    input {
        outline: none;
    }

    width:800px;
    height:auto;

}

.btn {
    width: 350px;
    display: flex;
    justify-content: center;
    transition: 0.3s ease;

    button {
        width: 200px;
        height: 40px;
        border-radius: 20px;
        border: 0px;
        cursor: pointer;
        font-size: 16px;

        background: linear-gradient(to right, #c57ad2 0%, #ee719d 100%);
    }
}

.btn:hover {
    transform: scale(1.03);
}

.bg {
    background: linear-gradient(to bottom, #192743 0%, #cb6587 50%, #f0dfae 100%);
    width: 100%;
    height: 100%;
    display: grid;
    /* 添加Grid布局 */
    justify-content: center;
    /* 水平居中 */
    align-content: center;
    /* 垂直居中 */
}

.container {
    width: 500px;
    height: 350px;

    background: rgba(0, 0, 0, 0.35);
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.55);
    border-radius: 10px;
    padding: 15px;
}

.title {
    font-size: 35px;
    color: #fff;
    text-align: center;
    font-weight: 100;
    font-family: 'Microsoft YaHei';
}

svg {
    width: 16px;
    height: 16px;

}

.account input,
.password input {
    background: transparent;
    outline: none;
    border: 0;
    border-bottom: 1px solid #fff;
    width: 350px;
    height: 30px;
    font-size: 16px;
    color: #fff;
}

ul {
    list-style: none;
    display: flex;
    flex-direction: row;
    padding: 0px;
    justify-content: center;

    li svg {
        width: 24px;
        height: 24px;
        margin: 0px 10px;
        cursor: pointer;
    }

}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.account,
.password {
    width: 350px;
    margin-top: 10px;

    div {
        display: flex;
        align-items: center;
    }

    .opt {
        background-color: red;
        width: 350px;
        height: 10px;
    }

}

.santitle {
    text-align: center;
    margin-top: 10px;
}

.btn2 {

    display: flex;
    justify-content: right;

    button {
        margin: 0px 5px
    }
}
</style>