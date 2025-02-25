<script setup lang="ts">

import type { TreeOption } from 'naive-ui'
import { repeat } from 'seemly'
import { defineComponent, ref } from 'vue'

function createData(level = 4, baseKey = ''): TreeOption[] | undefined {
  if (!level)
    return undefined
  return repeat(6 - level, undefined).map((_, index) => {
    const key = `${baseKey}${level}${index}`
    return {
      label: createLabel(level),
      key,
      children: createData(level - 1, key)
    }
  })
}

function createLabel(level: number): string {
  if (level === 4)
    return '道生一'
  if (level === 3)
    return '一生二'
  if (level === 2)
    return '二生三'
  if (level === 1)
    return '三生万物'
  return ''
}


  
     const data= createData()
     const  defaultExpandedKeys= ref(['40', '41'])
    

</script>
<template>
<div class="me">
  <div class="topcontainer">
    <n-breadcrumb class="breadcrumb">
        <n-breadcrumb-item>首页</n-breadcrumb-item>
        <n-breadcrumb-item>我的文件</n-breadcrumb-item>
      </n-breadcrumb>
      <div class="btns">
        <n-button type="primary">
上传
    </n-button>
    <n-button type="info">
     新建文件夹
    </n-button>
    <n-button type="success">
    删除
    </n-button>
      </div>
  </div>
 
      <n-divider />
    <n-tree
    block-line
    :data="data"
    :default-expanded-keys="defaultExpandedKeys"
    expand-on-click
    checkable
  />
</div>
</template>
<style scoped>
.btns{
  button{
    margin-left: 5px;
  }
}
.topcontainer{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.breadcrumb{

}
.me{

    padding:24px;
}
</style>