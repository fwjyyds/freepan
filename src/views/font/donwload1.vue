<script setup lang="ts">
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { defineComponent, ref } from 'vue'

interface RowData {
  key: number
  name: string
  age: string
  address: string
}

function createColumns(): DataTableColumns<RowData> {
  return [
    {
      type: 'selection',
      disabled(row: RowData) {
        return row.name === 'Edward King 3'
      }
    },
    {
      title: '文件',
      key: 'name'
    },
    {
      title: '大小',
      key: 'size'
    },
    {
      title: '状态',
      key: 'cond'
    }
  ]
}

const data = [{
  name: '文件1',
  size: '100KB',
  cond: '上传中'
}, {
  name: '文件2',
  size: '200KB',
  cond: '上传中'
}, {
  name: '文件3',
  size: '300KB',
  cond: '上传中'
}, {
  name: '文件4',
  size: '400KB',
  cond: '上传中'
}, {
  name: '文件5',
  size: '500KB',
  cond: '上传中'
}, {
  name: '文件6',
  size: '600KB',
}


]


const checkedRowKeysRef = ref<DataTableRowKey[]>([])



const columns = createColumns()
const pagination = {
  pageSize: 5
}
const rowKey = (row: RowData) => row.name
function handleCheck(rowKeys: DataTableRowKey[]) {
  checkedRowKeysRef.value = rowKeys
}

</script>
<template>
  <n-space vertical>
    <n-tabs key="barleft" addable type="bar" animated placement="left" class="tabs"> 
    <n-tab-pane name="上传中(0)"
        tab="上传中(0)">
        <n-data-table :columns="columns" :data="data" :pagination="pagination" :row-key="rowKey"
          @update:checked-row-keys="handleCheck" />
      </n-tab-pane>
      <n-tab-pane name="上传完成(0)" tab="上传完成(0)">
        <n-data-table :columns="columns" :data="data" :pagination="pagination" :row-key="rowKey"
        @update:checked-row-keys="handleCheck" />
      </n-tab-pane>
    </n-tabs>
  </n-space>


</template>
<style scoped>
/* .tabs{
    height:2px !important
} */

:deep(div .n-tabs) {
  height: calc(100vh - 194.4px) !important;
  overflow: hidden !important;
}
</style>