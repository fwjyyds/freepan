import { defineStore } from 'pinia'

import { ref } from 'vue'

export const useprogressData2Store = defineStore('progressData2', {
    state: () => {
        return {
            progressData: ref({}),
            progressData2: ref({}), downloadarray: ref([]), downloadedarray: ref([]), uploadarray: ref([]), uploadedarray: ref([]),
            uploadfinisharray: ref([]),downloadfinisharray: ref([]),
            tab1value: ref('u1'),tab2value:ref('u1'),userinfo:ref({})
        };
    },
    getters: {
        // getarray4(state) {
        //     return state.progressData2.value;
        // },

    },
    actions: {
        getupload(){
            fetch('/api/download/upload', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userid: this.userinfo.userid || 0,
                    })
                }
            ).then(response => response.json())
           .then(res => {
    
               this.setuploadarray(JSON.parse(res.data[0].array));
               this.setuploadedarray(JSON.parse(res.data[1].array));
            })
           
        }
        ,
        getdowonload(){
            fetch('/api/download/download', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userid: this.userinfo.userid || 0,
                    })
                }
            ).then(response => response.json())
           .then(res => {
    
               this.setdownloadarray(JSON.parse(res.data[0].array));
               this.setdownloadedarray(JSON.parse(res.data[1].array));
            })

        },
        setuserinfo(userinfo: any) {   
this.userinfo = userinfo;
         },
        setdownloadfinisharray(array: any) {
            this.downloadfinisharray = array;
        },
        settab1value(value: any) {  
            this.tab1value = value;
        },
        settab2value(value: any) { 
            this.tab2value = value;
         },
        setpd2(array4: any) {
            this.progressData2 = array4;
        },
        setpd(array: any) {
            this.progressData = array;
        },
        setdownloadarray(array: any) {
            this.downloadarray = array;
            fetch('/api/download/updatedownload', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userid: this.userinfo.userid || 0,
                        s1:{array:this.downloadarray},
                        s2:{array:this.downloadedarray}
                    })
                }
            )
        },
        setdownloadedarray(array: any) {
            this.downloadedarray = array;
            fetch('/api/download/updatedownload', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userid: this.userinfo.userid || 0,
                        s1:{array:this.downloadarray},
                        s2:{array:this.downloadedarray}
                    })
                }
            )
        },
        setuploadarray(array: any) {
            this.uploadarray = array;
            fetch('/api/download/updateupload', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userid: this.userinfo.userid || 0,
                        s1:{array:this.uploadarray},
                        s2:{array:this.uploadedarray}
                    })
                }
            )
        
        },
        setuploadedarray(array: any) {
            this.uploadedarray = array;
            fetch('/api/download/updateupload', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userid: this.userinfo.userid || 0,
                        s1:{array:this.uploadarray},
                        s2:{array:this.uploadedarray}
                    })
                }
            )
        },
        setuploadfinisharray(array: any) {
            this.uploadfinisharray = array;
        }

    }
})