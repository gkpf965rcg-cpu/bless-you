export function getRuntime() {
  const api = window.blessyou;
  if (api?.isElectron) {
    return { shell: "electron", os: api.platform };
  }

  const ua = navigator.userAgent || "";
  const platform = navigator.userAgentData?.platform || navigator.platform || "";

  if (/Android/i.test(ua)) return { shell: "web", os: "android" };
  if (/CrOS/.test(ua)) return { shell: "web", os: "chromeos" };
  if (/Win/i.test(platform) || /Windows/i.test(ua)) return { shell: "web", os: "win32" };
  if ((/Mac/i.test(platform) || /Mac OS X/.test(ua)) && !/iPhone|iPad|iPod/.test(ua)) {
    return { shell: "web", os: "darwin" };
  }
  if (/Linux/i.test(platform) || /Linux/i.test(ua)) return { shell: "web", os: "linux" };
  return { shell: "web", os: "unknown" };
}

export function supportsAutoStart() {
  return Boolean(window.blessyou?.isElectron);
}

export function supportsNativeQuit() {
  return Boolean(window.blessyou?.isElectron);
}

export function deviceNoun(os = getRuntime().os) {
  if (os === "darwin") return "Mac";
  if (os === "win32") return "PC";
  if (os === "chromeos") return "Chromebook";
  return "device";
}

export function microphoneHelp(os = getRuntime().os) {
  if (os === "darwin") {
    return "Allow the microphone in System Settings so Bless You can hear a sneeze.";
  }
  if (os === "win32") {
    return "Allow the microphone in Windows Settings so Bless You can hear a sneeze.";
  }
  if (os === "linux") {
    return "Allow the microphone in your system sound settings so Bless You can hear a sneeze.";
  }
  if (os === "android" || os === "chromeos") {
    return "Allow the microphone when asked, and keep this screen open so Bless You can keep listening.";
  }
  return "Allow the microphone when your browser asks so Bless You can hear a sneeze.";
}

export function microphoneButtonLabel(os = getRuntime().os) {
  if (os === "darwin") return "Open Microphone Settings";
  if (os === "win32") return "Open Microphone Settings";
  if (os === "linux") return "Open Sound Settings";
  return "How to allow the microphone";
}

export async function openMicrophoneSettings() {
  if (window.blessyou?.openMicSettings) {
    return window.blessyou.openMicSettings();
  }
  return false;
}

export function applyRuntimeClass() {
  const { shell, os } = getRuntime();
  document.body.classList.add(shell === "electron" ? "shell" : "web");
  document.body.dataset.os = os;
  document.body.dataset.shell = shell;
}
