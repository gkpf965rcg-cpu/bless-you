import { speakBlessYou, warmUpVoices } from "./speech/speaking.js";

warmUpVoices();

function blessNow(event) {
  event.preventDefault();
  speakBlessYou();
}

document.querySelectorAll("[data-bless]").forEach((el) => {
  el.addEventListener("click", blessNow);
});
