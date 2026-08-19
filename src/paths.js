/** Directory of the running app page (`/app/`), including Electron file URLs. */
export function appDirectoryUrl() {
  const url = new URL(window.location.href);
  url.hash = "";
  url.search = "";
  let path = url.pathname || "/";
  if (!path.endsWith("/")) {
    const last = path.split("/").pop() || "";
    if (last.includes(".")) {
      path = path.slice(0, path.lastIndexOf("/") + 1);
    } else {
      path += "/";
    }
  }
  url.pathname = path;
  return url;
}
