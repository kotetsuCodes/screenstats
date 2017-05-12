const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;
const path = require('path')
const url = require('url')
const fs = require('fs');
let getIP = require('external-ip')();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;

    let windowWidth = Math.ceil(width * 0.1);
    let windowHeight = Math.ceil(height * 0.125);

    let xCoord = width - windowWidth;
    let yCoord = height - windowHeight;

    // Create the browser window.
    win = new BrowserWindow({width: windowWidth, height: windowHeight, x: xCoord, y: yCoord, frame: false, transparent: true})
    //win.setIgnoreMouseEvents(true);
    win.setAlwaysOnTop(true);
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    //win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();

    win.webContents.on('did-finish-load', () => {
        "use strict";
        getIPAddress();
    });
});

function getIPAddress() {
    "use strict";
    console.log('blah test');
    getIP((err, ip) => {
        console.log('get IP was called');
        if(err) {
            console.log('we got an error');
            win.webContents.send('publicIPSent', `IP: Could not get IP`);
        } else {
            console.log('we got an ip');
            win.webContents.send('publicIPSent', `IP: ${ip}`);
        }
    });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})
