<script setup lang="ts">
</script>
<template>
 <n-space vertical>
    <n-tabs
      key="barleft"
      addable
      type="bar"
      animated
      placement="left"
      class="tabs"
    >
     
      <n-tab-pane name="下载中(8)" tab="下载中(8)">
       中(8)
      </n-tab-pane>
      <n-tab-pane name="下载完成(0)" tab="下载完成(0)">
        完成(0)
      </n-tab-pane>
    </n-tabs>
  </n-space>


</template>
<style scoped >
/* .tabs{
    height:2px !important
} */

:deep(div .n-tabs ){
height: calc(100vh - 194.4px) !important;
overflow: hidden !important;
}
</style>