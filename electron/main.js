
const { app, BrowserWindow, ipcMain  }= require ('electron')
const path = require('path');
const { fileURLToPath } = require('url');
const { dirname } = require('path');
const { checkUpdate } = require('./update');
const fs =require('fs-extra')
const https = require('https');
const http = require('http');
const os = require('os');
console.log(__dirname,'======================== ',path);
const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
  
    //   将此脚本(preload)附加到渲染器流程
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true, //开启true这一步很重要,目的是为了vue文件中可以引入node和electron相关的API
      contextIsolation: true, // 可以使用require方法
      enableRemoteModule: true, // 可以使用remote方法
      },
      icon: './logo.ico', // 设置窗口图标
    })
  
  
  //也开页面
    win.loadURL('http://localhost:4173')

   checkUpdate(win, ipcMain);
   //控制台
    win.webContents.openDevTools()
   
  }
  app.whenReady().then(() => {
     createWindow()
      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
  })
 
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

// 处理下载请求
ipcMain.handle('download-update', async (event, options) => {
  try {
    const { url, filename, version } = options;
    console.log('开始下载更新:', url, filename, version);
    if (!url || !filename) {
      return { success: false, error: '下载地址或文件名无效' };
    }
    
    // 准备下载路径，要下载到哪个目录下,userHomeDir系统的默认主目录
    // const userHomeDir = os.homedir();
    const downloadDir = "C://download"
    
    // 确保目录存在
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }
    
    // 确定下载文件路径
    let filePath;
    if (process.platform === "win32") {
      filePath = path.join(downloadDir, filename);
    } else {
      filePath = path.join(downloadDir, filename);
    }
    
    // 开始下载文件
    const result = await downloadFileWithProgress(event, url, filePath);
    return result;
  } catch (error) {
    console.error('下载失败:', error);
    return { success: false, error: error.message };
  }
});



// 实现带进度的下载函数
async function downloadFileWithProgress(event, url, filePath) {
  return new Promise(async (resolve, reject) => {
    // 根据URL选择协议
  
    
    console.log('文件将下载到:', filePath,'对于',url);
   const response =  fetch('http://127.0.0.1:3000/download/downloadFile',{
      method: 'POST',
    }).then(response => response.body)
    .then(body => {
      console.log('开始下载',body);
      const reader = body.getReader();
      let receivedLength = 0; // 已接收的数据长度
      let chunks = []; // 存储接收到的流数据块
  
      function read() {
        return reader.read().then(async ({ done, value }) => {
          if (done) {
            // 流已结束
            console.log('下载完成');
            const blob = new Blob(chunks);
            const buffer = Buffer.from(await blob.arrayBuffer());
            fs.writeFile(filePath, buffer, error => {
              if (error) {
                console.error('写入文件失败:', error);
                reject({ success: false, error: error.message });
              } else {
                console.log('文件已保存到:', filePath);
                resolve({ success: true, filePath });
              }
            });
            chunks = [];
            return;
          }
  
          chunks.push(value);
          receivedLength += value.length;
  
          // 计算和显示进度
          console.log(`进度: ${(receivedLength/1024 ).toFixed(2)}kb`);//1Mb
  
          // 限制传输速度，这里假设延迟为1000ms
          return new Promise(resolve => setTimeout(resolve, 1000)).then(read);
        });
      }
  
      return read();
    })
    .catch(error => console.error(error));

  
})}

// 辅助函数：格式化字节大小
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
