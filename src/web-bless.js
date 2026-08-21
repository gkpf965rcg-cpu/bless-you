import { speakBlessYou, warmUpVoices } from "./speech/speaking.js";
import { startRemarks } from "./web-remarks.js";

warmUpVoices();
startRemarks();

function blessNow(event) {
  event.preventDefault();
  speakBlessYou();
}

document.querySelectorAll("[data-bless]").forEach((el) => {
  el.addEventListener("click", blessNow);
});

document.querySelectorAll("#back").forEach((el) => {
  el.addEventListener("click", (event) => {
    if (window.history.length > 1) {
      event.preventDefault();
      window.history.back();
    }
  });
});
