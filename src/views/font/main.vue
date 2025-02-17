<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>
<template>

    <div class="container">
        <div class="left">
            <div>logo</div>
            <div>
                menu
            </div>
        </div>
        <div class="right">
            <div class="top">
                <div class="opt">
                    <ul>
                        <li>操作1</li>
                        <li>操作2</li>
                        <li>操作3</li>
                    </ul>
                </div>
                <div>
                    <img src="" alt="">
                    用户名
                </div>
            </div>
            <div class="bottom">
               <RouterView></RouterView>
            </div>
        </div>
    </div>
</template>
<style scoped >
.container {
display: flex;
flex-direction: row;

}
.left{
    flex:1
}
.right{
    background-color: red;
    flex:6;
}
.top{
    display: flex;
    flex-direction: row;
    ul{
        display: flex;
        flex-direction: row;
        list-style: none;
    }
    align-items: center;
}
</style>