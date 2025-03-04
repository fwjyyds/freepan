<script setup lang="ts">
import { ref } from 'vue'
const dvalue = ref('C://download')
</script>
<template>
    <div class="wd">
        <div>传输</div>
        <div class="content">
            <div class="title">
                下载
            </div>
            <div class="desc">
                <n-input v-model:value="dvalue" type="text" placeholder="基本的 Input" />


            </div>
        </div>
        <div class="content">
            <div class="title">
                自动备份
            </div>
            <div class="desc">
                <div class="title">
         开启自动备份
            </div>
            <div class="desc">
                <n-checkbox size="medium" label="开启自动备份" />

            </div>
            <div class="title">
                自动备份链接
            </div>
            <div class="desc">
                <n-input v-model:value="dvalue" type="text" placeholder="基本的 Input" />


            </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.wd {
    padding: 10px;
}
</style>