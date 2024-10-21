const { app, BrowserWindow } = require('electron')
const path = require('node:path')

const querystring = require('querystring');
const request = require('request');


app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            autoRefresh: true,
            contextIsolation: false,
            // 设置以支持 ES6 模块
            experimentalFeatures: true,
        }
    })

    win.loadFile('index.html')
    win.webContents.openDevTools()


}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

