// const {
//   app,
//   BrowserWindow,
//   globalShortcut,
//   webContents,
//   Notification,
//   screen,
//   remote,
// } = require("electron");
// const nativeImage = require("electron").nativeImage;
// const path = require("path");

// var image = nativeImage.createFromPath(__dirname + "/icons/icon_512@1x.png");
// image.setTemplateImage(true);

// const ipc = require("electron").ipcMain;
// // In the main process:
// const { ipcMain } = require("electron");

// ipcMain.handle("perform-action", (e) => {
//   // ... do something on behalf of the renderer ...
//   console.log("FOUND IT");
// });

// //app.on('ready', createWindow)
// let win = null;
// app.whenReady().then(() => {
//   // Create the browser window.
//   win = new BrowserWindow({
//     width: 350,
//     height: 600,
//     minHeight: 250,
//     minWidth: 200,
//     titleBarStyle: "hiddenInset",
//     webPreferences: { nodeIntegration: true, enableRemoteModule: true },
//     icon: image,
//   });
//   win.setMenuBarVisibility(false);
//   const { width, height } = screen.getPrimaryDisplay().workAreaSize;
//   win.setPosition(width - 350, 0);
//   // and load the index.html of the app.
//   win.loadURL("https://knockknockchat-a47de.web.app/", { userAgent: "Chrome" });

//   //add hotkey
//   globalShortcut.register("CommandOrControl+Shift+K", () => {
//     console.log("hotkey pressed");
//     //console.log(webContents)
//     win.webContents.send("message", "Hello second window!");
//   });
//   process.setMaxListeners(0);
// });

// // Quit when all windows are closed.
// app.on('window-all-closed', () => {
//   // On macOS it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', () => {
//   // On macOS it's common to re-create a window in the
//   // app when the dock icon is clicked and there are no
//   // other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });

const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile("index.html");
  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  //check for updates
  mainWindow.once("ready-to-show", () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("app_version", (event) => {
  event.sender.send("app_version", { version: app.getVersion() });
});

//listen for update available
autoUpdater.on("update-available", () => {
  mainWindow.webContents.send("update_available");
});

//listen for update downloaded
autoUpdater.on("update-downloaded", () => {
  mainWindow.webContents.send("update_downloaded");
});

//install new version if user selects restart
ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
