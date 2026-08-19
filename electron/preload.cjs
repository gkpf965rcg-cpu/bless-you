const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("blessyou", {
  isElectron: true,
  platform: process.platform,
  getAutoStart: () => ipcRenderer.invoke("autostart:get"),
  setAutoStart: (enabled) => ipcRenderer.invoke("autostart:set", enabled),
  openMicSettings: () => ipcRenderer.invoke("mic-settings:open"),
  explainMicrophone: () => ipcRenderer.invoke("mic:explain"),
  quit: () => ipcRenderer.invoke("app:quit"),
  speak: (text) => ipcRenderer.invoke("speak", text)
});
