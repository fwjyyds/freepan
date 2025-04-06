
const { app, BrowserWindow, ipcMain  }= require ('electron')
const path = require('path');
const { fileURLToPath } = require('url');
const { dirname } = require('path');
const { checkUpdate } = require('./update');

console.log(__dirname,'======================== ',path);
const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
  
    //   将此脚本(preload)附加到渲染器流程
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true, //开启true这一步很重要,目的是为了vue文件中可以引入node和electron相关的API
      contextIsolation: false, // 可以使用require方法
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

// 处理下载文件的请求
// ipcMain.handle('download-file', async (event, args) => {
//   const { userid, path, outputPath } = args;

//   const response = await fetch('/api/download/downloadFile', {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ userid, path })
//   });

//   const writer = fs.createWriteStream(outputPath);
//   response.body.pipe(writer);

//   return new Promise((resolve, reject) => {
//     writer.on('finish', resolve);
//     writer.on('error', reject);
//   });
// });