<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {NMessageProvider} from 'naive-ui'
import { NNotificationProvider } from 'naive-ui';
</script>

<template>
  <div>
    <n-message-provider>
      <n-notification-provider>
    <RouterView /></n-notification-provider>
  </n-message-provider>
  </div>
 
</template>

<style scoped>
div{
  width:100%;
  height:100%;
}
</style>
