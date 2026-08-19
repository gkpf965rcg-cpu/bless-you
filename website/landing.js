fetch("./downloads/latest.json")
  .then((response) => (response.ok ? response.json() : null))
  .then((info) => {
    if (!info?.sha256) return;
    const checksum = document.getElementById("checksum");
    checksum.hidden = false;
    checksum.textContent = `v${info.version} · SHA-256 ${info.sha256}`;
  })
  .catch(() => {});
