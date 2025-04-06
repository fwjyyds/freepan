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
      
      // 添加新的监听器
      ipcRenderer.on('download-progress', (event, progressData) => {
        callback(progressData);
      });
      
      // 返回清理函数
      return () => {
        ipcRenderer.removeAllListeners('download-progress');
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

