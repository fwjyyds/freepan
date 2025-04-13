import { defineStore } from 'pinia'

import { ref } from 'vue'
// 第一个参数是应用程序中 store 的唯一 id
export const usedownloadStore = defineStore('download', {
    state: () => {
        return {
    array4:ref([[1],[],[],[]])
        };
      },
      getters: {
        getarray4(state) {
          return state.array4;
        },
       
    },
    actions: {
        setName(array4:any) {
          this.array4.value = array4;
        },
    
    }
})