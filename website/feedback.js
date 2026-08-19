const form = document.getElementById("feedback-form");
const status = document.getElementById("status");
const submit = document.getElementById("submit");

function showStatus(text, isError) {
  status.hidden = false;
  status.textContent = text;
  status.classList.toggle("error", Boolean(isError));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = String(document.getElementById("message").value || "").trim();
  const email = String(document.getElementById("email").value || "").trim();
  const company = String(document.getElementById("company").value || "");

  if (!message) {
    showStatus("Please write a short message.", true);
    return;
  }

  submit.disabled = true;
  showStatus("Sending…", false);
  try {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, email, company })
    });
    if (!response.ok) {
      showStatus("Could not send feedback.", true);
      return;
    }
    form.hidden = true;
    showStatus("Thanks!", false);
  } catch {
    showStatus("Could not send feedback.", true);
  } finally {
    submit.disabled = false;
  }
});
