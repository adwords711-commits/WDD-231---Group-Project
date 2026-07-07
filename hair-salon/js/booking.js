// booking.js — pick or change a service, remember it across pages, take a booking request

const params = new URLSearchParams(window.location.search);

const serviceSelect = document.getElementById("svc");
const lengthSelect  = document.getElementById("len");
const priceInput    = document.getElementById("prc");
const summary       = document.getElementById("booking-summary");
const form          = document.getElementById("booking-form");
const feedback      = document.getElementById("booking-feedback");

let services = [];

// ── Load the same service list the Services page uses, then fill the form ──
async function init() {
  const res = await fetch("./data/services.json");
  services = await res.json();

  services.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.name;
    opt.textContent = s.name;
    serviceSelect.appendChild(opt);
  });

  // Fresh click from Services (URL) wins; saved draft is the fallback
  const draft = loadDraft();
  serviceSelect.value = params.get("service") || draft?.service || "";
  lengthSelect.value  = params.get("length")  || draft?.length  || "";
  if (draft) {
    document.getElementById("cust-name").value  = draft.name  || "";
    document.getElementById("cust-email").value = draft.email || "";
  }

  updateSummary();
  saveDraft();   // capture a fresh arrival from Services into storage
}

// ── Price is looked up live from the data whenever a choice changes ──
function updateSummary() {
  const s = services.find(s => s.name === serviceSelect.value);
  const price = s ? (s.price[lengthSelect.value] || 0) : 0;
  priceInput.value = price || "";

  if (serviceSelect.value && lengthSelect.value) {
    summary.textContent =
      `You're booking: ${serviceSelect.value} — ${lengthSelect.value} hair — $${price}`;
  } else {
    summary.textContent = "Choose a service and hair length to see the price.";
  }
}

// ── Local storage: one draft object holds the whole booking ──
function saveDraft() {
  localStorage.setItem("bookingDraft", JSON.stringify({
    service: serviceSelect.value,
    length:  lengthSelect.value,
    name:    document.getElementById("cust-name").value,
    email:   document.getElementById("cust-email").value
  }));
}

function loadDraft() {
  return JSON.parse(localStorage.getItem("bookingDraft") || "null");
}

// One listener covers every field: dropdowns and text inputs both fire "input"
form.addEventListener("input", () => { updateSummary(); saveDraft(); });

// ── flatpickr: calendar limited to salon hours ──
// ponytail: hours live in the picker UI, so no validation needed at submit
flatpickr("#appt-date", {
  enableTime: true,
  minDate: "today",
  minTime: "09:00",
  maxTime: "18:00",
  minuteIncrement: 30,
  dateFormat: "Y-m-d H:i",
  disable: [ d => d.getDay() === 0 ]   // grey out Sundays
});

// ── Submit ──
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("cust-name").value;
  const when = document.getElementById("appt-date").value;
  feedback.textContent = `Thanks ${name}! ${serviceSelect.value} requested for ${when}.`;
  localStorage.removeItem("bookingDraft"); // booked → draft no longer needed
  form.reset();
  updateSummary();
});

init();