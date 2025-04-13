  // client/electron/preload.js
  const { contextBridge, ipcRenderer } = require('electron');

  // 安全地暴露主进程功能给渲染进程
  contextBridge.exposeInMainWorld('electron', {
    // 下载文件API
    downloadUpdate: (options) => {
      return ipcRenderer.invoke('download-update', options);
    },
    
    // 下载进度事件监听器
    onDownloadProgress: (callback) => {
      // 移除可能存在的旧监听器
      ipcRenderer.removeAllListeners('download-progress');
      
      // 添加新的监听器，electron -> renderer
      ipcRenderer.on('download-progress', (event, progressData) => {
        callback(progressData);
      });
      
      // 返回清理函数
      return () => {
        ipcRenderer.removeAllListeners('download-progress');
      };
    },

 // 上载文件API
 uploadUpdate: (options) => {
  return ipcRenderer.invoke('upload-update', options);
},

// 下载进度事件监听器
onUploadProgress: (callback) => {
  // 移除可能存在的旧监听器
  ipcRenderer.removeAllListeners('upload-progress');
  
  // 添加新的监听器，electron -> renderer
  ipcRenderer.on('upload-progress', (event, progressData) => {
    callback(progressData);
  });
  
  // 返回清理函数
  return () => {
    ipcRenderer.removeAllListeners('upload-progress');
  };
}
    



  });
  
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
  })

