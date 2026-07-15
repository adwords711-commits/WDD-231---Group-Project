// booking.js — pick or change a service, remember it across pages, take a booking request

const params = new URLSearchParams(window.location.search);

const serviceSelect    = document.getElementById("svc");
const lengthSelect     = document.getElementById("len");
const priceInput       = document.getElementById("prc");
const summary          = document.getElementById("booking-summary");
const form             = document.getElementById("booking-form");
const feedback         = document.getElementById("booking-feedback");
const appointmentsList = document.getElementById("appointments-list");

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

// ── Local storage, key 1: the half-finished form (draft) ──
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

// ── Local storage, key 2: the confirmed bookings (a list) ──
function loadAppointments() {
  return JSON.parse(localStorage.getItem("appointments") || "[]");
}

function saveAppointments(list) {
  localStorage.setItem("appointments", JSON.stringify(list));
}

// ── Fill the appointments card, dropping past-due ones ──
function renderAppointments() {
  // keep only future ones; the "T" makes the date parse the same in every browser
  const upcoming = loadAppointments().filter(
    a => new Date(a.datetime.replace(" ", "T")) > new Date()
  );
  saveAppointments(upcoming);   // past-due ones are now gone from storage too

  if (upcoming.length === 0) {
    appointmentsList.innerHTML = "<p>No upcoming appointments.</p>";
    return;
  }

  // "2026-07-15 10:30" is zero-padded, so alphabetical order IS date order
  upcoming.sort((a, b) => a.datetime.localeCompare(b.datetime));

  appointmentsList.innerHTML = upcoming.map(a => `
    <p>
      <strong>${a.service}</strong> — ${a.length} hair — $${a.price}<br>
      ${a.datetime}<br>
      <button class="btn remove-appt" data-id="${a.id}" type="button">Remove</button>
    </p>
  `).join("");
}

// One listener on the container handles every Remove button, even ones created later
appointmentsList.addEventListener("click", (e) => {
  if (!e.target.classList.contains("remove-appt")) return;
  const id = Number(e.target.dataset.id);
  saveAppointments(loadAppointments().filter(a => a.id !== id));
  renderAppointments();
});

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

// ── Toast: a small self-removing notification ──
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ── Submit ──
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const when = document.getElementById("appt-date").value;
  // flatpickr sets the field readonly, and browsers skip `required` on
  // readonly fields — so we enforce it here instead
  if (!when) {
    feedback.textContent = "Please pick a date and time for your appointment.";
    return;
  }

  // confirmed → add it to the saved list
  const appointments = loadAppointments();
  appointments.push({
    id: Date.now(),               // ms since 1970 — a free unique ID
    service: serviceSelect.value,
    length: lengthSelect.value,
    price: priceInput.value,
    datetime: when
  });
  saveAppointments(appointments);

  const name = document.getElementById("cust-name").value;
  showToast(`Thanks ${name}! ${serviceSelect.value} requested for ${when}.`);
  localStorage.removeItem("bookingDraft"); // draft's job is done
  form.reset();
  updateSummary();
  renderAppointments();
});

init();
renderAppointments();