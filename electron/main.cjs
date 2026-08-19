const { app, BrowserWindow, Tray, nativeImage, ipcMain, shell, Menu, dialog, session } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { execFile } = require("child_process");

let mainWindow = null;
let tray = null;
let isQuitting = false;

const APP_HTML = path.join(__dirname, "..", "website", "app", "index.html");
const MIC_EXPLAIN_DETAIL =
  "It listens on this device so it can hear a sneeze and say bless you. Audio is never recorded, stored, or uploaded.";

function iconPath(name) {
  return path.join(__dirname, "..", "website", "app", "icons", name);
}

function isLocalUrl(value) {
  try {
    const url = new URL(value);
    return ["file:", "blob:", "data:", "devtools:", "about:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function hardenSession(sess) {
  sess.setPermissionRequestHandler((_contents, permission, callback) => {
    callback(permission === "media");
  });
  sess.setPermissionCheckHandler((_contents, permission) => permission === "media" || permission === "audioCapture");
  sess.webRequest.onBeforeRequest((details, callback) => {
    callback({ cancel: !isLocalUrl(details.url) });
  });
}

function createWindow() {
  const linux = process.platform === "linux";
  mainWindow = new BrowserWindow({
    width: 280,
    height: 470,
    show: linux,
    frame: false,
    resizable: false,
    skipTaskbar: !linux,
    fullscreenable: false,
    transparent: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      spellcheck: false
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(APP_HTML);

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!isLocalUrl(url)) event.preventDefault();
  });

  mainWindow.on("blur", () => {
    if (process.platform !== "linux") {
      mainWindow.hide();
    }
  });

  mainWindow.on("close", (event) => {
    if (!isQuitting && process.platform !== "linux") {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function positionWindow() {
  if (!tray || !mainWindow) return;
  const trayBounds = tray.getBounds();
  const winBounds = mainWindow.getBounds();
  let x = Math.round(trayBounds.x + trayBounds.width / 2 - winBounds.width / 2);
  let y;
  if (process.platform === "win32") {
    y = Math.round(trayBounds.y - winBounds.height - 8);
  } else if (process.platform === "darwin") {
    y = Math.round(trayBounds.y + trayBounds.height + 4);
  } else {
    y = trayBounds.y < 120
      ? Math.round(trayBounds.y + trayBounds.height + 4)
      : Math.round(trayBounds.y - winBounds.height - 8);
  }
  const { screen } = require("electron");
  const display = screen.getDisplayNearestPoint({ x, y });
  const area = display.workArea;
  x = Math.min(Math.max(x, area.x + 8), area.x + area.width - winBounds.width - 8);
  y = Math.min(Math.max(y, area.y + 8), area.y + area.height - winBounds.height - 8);
  mainWindow.setPosition(x, y);
}

function toggleWindow() {
  if (!mainWindow) return;
  if (mainWindow.isVisible()) {
    mainWindow.hide();
    return;
  }
  positionWindow();
  mainWindow.show();
  mainWindow.focus();
}

function createTray() {
  const file = process.platform === "darwin" ? "trayTemplate.png" : "tray.png";
  let image = nativeImage.createFromPath(iconPath(file));
  if (image.isEmpty()) {
    image = nativeImage.createFromPath(iconPath("tray.png"));
  }
  if (process.platform === "darwin") {
    image.setTemplateImage(true);
  }
  tray = new Tray(image);
  tray.setToolTip("Bless You");
  tray.on("click", toggleWindow);
  tray.on("right-click", () => {
    const menu = Menu.buildFromTemplate([
      { label: "Open Bless You", click: () => { positionWindow(); mainWindow?.show(); } },
      { label: "Quit", click: () => { isQuitting = true; app.quit(); } }
    ]);
    tray.popUpContextMenu(menu);
  });
}

function linuxAutostartPath() {
  return path.join(os.homedir(), ".config", "autostart", "bless-you.desktop");
}

function linuxExecCommand() {
  if (app.isPackaged) {
    return `"${process.execPath}"`;
  }
  return `"${process.execPath}" "${app.getAppPath()}"`;
}

function getAutoStart() {
  if (process.platform === "linux") {
    return fs.existsSync(linuxAutostartPath());
  }
  return app.getLoginItemSettings().openAtLogin;
}

function setAutoStart(enabled) {
  try {
    if (process.platform === "linux") {
      const desktop = linuxAutostartPath();
      if (!enabled) {
        if (fs.existsSync(desktop)) fs.unlinkSync(desktop);
        return true;
      }
      fs.mkdirSync(path.dirname(desktop), { recursive: true });
      fs.writeFileSync(
        desktop,
        `[Desktop Entry]
Type=Application
Name=Bless You
Exec=${linuxExecCommand()}
X-GNOME-Autostart-enabled=true
`
      );
      return true;
    }
    app.setLoginItemSettings({ openAtLogin: enabled, path: process.execPath });
    return getAutoStart() === enabled || process.platform === "darwin";
  } catch {
    return false;
  }
}

function openMicSettings() {
  if (process.platform === "darwin") {
    return shell.openExternal("x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone");
  }
  if (process.platform === "win32") {
    return shell.openExternal("ms-settings:privacy-microphone");
  }
  const candidates = [
    ["gnome-control-center", ["privacy"]],
    ["gnome-control-center", ["sound"]],
    ["unity-control-center", ["sound"]],
    ["xdg-open", ["settings://"]]
  ];
  const tryNext = (index) => {
    if (index >= candidates.length) return Promise.resolve(false);
    const [cmd, args] = candidates[index];
    return new Promise((resolve) => {
      execFile(cmd, args, (error) => {
        if (error) tryNext(index + 1).then(resolve);
        else resolve(true);
      });
    });
  };
  return tryNext(0);
}

function speakLinux(text) {
  const candidates = [
    ["spd-say", [text]],
    ["espeak-ng", [text]],
    ["espeak", [text]]
  ];
  const tryNext = (index) => {
    if (index >= candidates.length) return Promise.resolve(false);
    const [cmd, args] = candidates[index];
    return new Promise((resolve) => {
      execFile(cmd, args, (error) => {
        if (error) tryNext(index + 1).then(resolve);
        else resolve(true);
      });
    });
  };
  return tryNext(0);
}

async function explainMicrophone() {
  const result = await dialog.showMessageBox(mainWindow ?? undefined, {
    type: "info",
    buttons: ["Continue", "Not Now"],
    defaultId: 0,
    cancelId: 1,
    message: "Bless You needs the microphone",
    detail: MIC_EXPLAIN_DETAIL
  });
  return result.response === 0;
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      positionWindow();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    hardenSession(session.defaultSession);
    if (process.platform === "darwin" && app.dock) {
      app.dock.hide();
    }
    createWindow();
    createTray();

    ipcMain.handle("autostart:get", () => getAutoStart());
    ipcMain.handle("autostart:set", (_event, enabled) => setAutoStart(Boolean(enabled)));
    ipcMain.handle("mic-settings:open", () => openMicSettings());
    ipcMain.handle("mic:explain", () => explainMicrophone());
    ipcMain.handle("app:quit", () => {
      isQuitting = true;
      app.quit();
    });
    ipcMain.handle("speak", (_event, text) => {
      if (process.platform === "linux") return speakLinux(String(text || "Bless you."));
      return false;
    });
  });
}

app.on("web-contents-created", (_event, contents) => {
  contents.setWindowOpenHandler(() => ({ action: "deny" }));
  contents.on("will-navigate", (event, url) => {
    if (!isLocalUrl(url)) event.preventDefault();
  });
});

app.on("before-quit", () => {
  isQuitting = true;
});

app.on("window-all-closed", () => {
  if (isQuitting) app.quit();
});
