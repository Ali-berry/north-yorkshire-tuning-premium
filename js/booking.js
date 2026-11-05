const bookingState = { step: 1, serviceId: null, date: null, slot: null };
const totalBookingSteps = 4;

function setupBookingForm() {
  const form = document.getElementById("booking");
  renderServicePicker();
  renderDatePicker();
  renderSlotPicker();

  document.getElementById("booking-next").addEventListener("click", goToNextStep);
  document.getElementById("booking-back").addEventListener("click", () => showBookingStep(bookingState.step - 1));
  document.getElementById("booking-again").addEventListener("click", resetBooking);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    goToNextStep();
  });
  form.addEventListener("input", (event) => {
    if (event.target.name) clearFieldError(event.target.name);
  });
  // number plate hamesha capital mein
  form.elements.reg.addEventListener("input", (event) => {
    event.target.value = event.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, "");
  });
}

function renderServicePicker() {
  const picker = document.getElementById("service-picker");
  picker.innerHTML = services
    .map(
      (service) => `
      <label class="service-option">
        <input type="radio" name="service" value="${service.id}">
        <span class="service-option-body">
          <iconify-icon icon="${service.icon}" aria-hidden="true"></iconify-icon>
          <strong>${service.name}</strong>
          <span class="service-option-price">${service.price === null ? "Ask" : `from ${formatPrice(service.price)}`}</span>
        </span>
      </label>`
    )
    .join("");

  picker.addEventListener("change", (event) => {
    bookingState.serviceId = event.target.value;
    clearFieldError("service");
    updateBookingTotal();
  });
}

function preselectBookingService(serviceId) {
  const option = document.querySelector(`#service-picker input[value="${serviceId}"]`);
  if (!option) return;
  option.checked = true;
  bookingState.serviceId = serviceId;
  clearFieldError("service");
  updateBookingTotal();
}

function upcomingWorkDays(count) {
  const days = [];
  const day = new Date();
  day.setHours(12, 0, 0, 0);
  while (days.length < count) {
    day.setDate(day.getDate() + 1);
    if (day.getDay() !== 0) days.push(new Date(day));
  }
  return days;
}

function renderDatePicker() {
  const picker = document.getElementById("date-picker");
  picker.innerHTML = upcomingWorkDays(12)
    .map((day) => {
      const value = day.toISOString().slice(0, 10);
      const weekday = day.toLocaleDateString("en-GB", { weekday: "short" });
      const dateText = day.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      return `<button class="date-chip" type="button" data-date="${value}" aria-pressed="false"><span>${weekday}</span><strong>${dateText}</strong></button>`;
    })
    .join("");

  picker.addEventListener("click", (event) => {
    const chip = event.target.closest(".date-chip");
    if (!chip) return;
    bookingState.date = chip.dataset.date;
    bookingState.slot = null;
    picker.querySelectorAll(".date-chip").forEach((item) => item.setAttribute("aria-pressed", String(item === chip)));
    renderSlotPicker();
  });
}

// asli availability tuner phone pe confirm karta hai, is liye sirf morning/afternoon/evening
function renderSlotPicker() {
  const picker = document.getElementById("slot-picker");
  if (!bookingState.date) {
    picker.innerHTML = `<p class="muted">Choose a day, then a time of day.</p>`;
    return;
  }
  picker.innerHTML = bookingSlots
    .map((slot) => `<button class="slot-chip" type="button" data-slot="${slot}" aria-pressed="false">${slot}</button>`)
    .join("");
  picker.onclick = (event) => {
    const chip = event.target.closest(".slot-chip");
    if (!chip) return;
    bookingState.slot = chip.dataset.slot;
    clearFieldError("slot");
    picker.querySelectorAll(".slot-chip").forEach((item) => item.setAttribute("aria-pressed", String(item === chip)));
  };
}

function showFieldError(name, message) {
  const error = document.querySelector(`[data-error-for="${name}"]`);
  if (error) error.textContent = message;
  const field = document.querySelector(`#booking [name="${name}"]:not([type="radio"])`);
  if (field) field.setAttribute("aria-invalid", "true");
}

function clearFieldError(name) {
  const error = document.querySelector(`[data-error-for="${name}"]`);
  if (error) error.textContent = "";
  const field = document.querySelector(`#booking [name="${name}"]:not([type="radio"])`);
  if (field) field.removeAttribute("aria-invalid");
}

function validateBookingStep(step) {
  const form = document.getElementById("booking");
  const problems = [];
  const value = (name) => form.elements[name].value.trim();

  if (step === 1) {
    const reg = value("reg").replace(/\s/g, "");
    if (!/^[A-Z0-9]{2,7}$/.test(reg)) problems.push(["reg", "Add your registration, e.g. YX68 PLT."]);
    if (!value("make")) problems.push(["make", "Add the make and model."]);
  }
  if (step === 2 && !bookingState.serviceId) problems.push(["service", "Pick what you need."]);
  if (step === 3) {
    if (!value("town")) problems.push(["town", "Which town or village?"]);
    if (!bookingState.date || !bookingState.slot) problems.push(["slot", "Choose a day and a time of day."]);
  }
  if (step === 4) {
    if (!value("name")) problems.push(["name", "Add your name."]);
    if (value("phone").replace(/\D/g, "").length < 10) problems.push(["phone", "Add a mobile number we can call or text."]);
    const email = value("email");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problems.push(["email", "That email doesn't look right."]);
  }

  problems.forEach(([name, message]) => showFieldError(name, message));
  if (problems.length) {
    const first = form.querySelector(`[name="${problems[0][0]}"]:not([type="radio"])`) || form.querySelector(`.booking-step[data-step="${step}"] legend`);
    if (first && first.focus) first.focus({ preventScroll: false });
  }
  return problems.length === 0;
}

function goToNextStep() {
  if (!validateBookingStep(bookingState.step)) return;
  if (bookingState.step === totalBookingSteps) {
    finishBooking();
    return;
  }
  showBookingStep(bookingState.step + 1);
}

function showBookingStep(step) {
  bookingState.step = step;
  document.querySelectorAll(".booking-step").forEach((panel) => {
    const isActive = Number(panel.dataset.step) === step;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
  document.querySelectorAll(".booking-progress li").forEach((item, index) => {
    item.classList.toggle("is-current", index + 1 === step);
    item.classList.toggle("is-done", index + 1 < step);
  });

  document.getElementById("booking-back").hidden = step === 1;
  const next = document.getElementById("booking-next");
  next.firstChild.textContent = step === totalBookingSteps ? "Send request " : "Continue ";
  if (step === totalBookingSteps) renderBookingSummary();
  updateBookingTotal();

  const panel = document.querySelector(`.booking-step[data-step="${step}"]`);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.fromTo(panel, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" });
  }
}

function updateBookingTotal() {
  const service = findServiceById(bookingState.serviceId);
  const reg = document.getElementById("reg").value.trim();
  const parts = [];
  if (reg) parts.push(`<strong>${escapeText(reg)}</strong>`);
  if (service) parts.push(`${service.name}${service.price === null ? "" : ` · from ${formatPrice(service.price)}`}`);
  document.getElementById("booking-total").innerHTML = parts.join(" · ");
}

function readableBookingDate() {
  return new Date(`${bookingState.date}T12:00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

function renderBookingSummary() {
  const form = document.getElementById("booking");
  const service = findServiceById(bookingState.serviceId);
  document.getElementById("booking-summary").innerHTML = `
    <h4>Check your request</h4>
    <dl>
      <dt>Car</dt><dd>${escapeText(form.elements.reg.value)} · ${escapeText(form.elements.make.value)} (${form.elements.fuel.value})</dd>
      <dt>Service</dt><dd>${service.name}${service.price === null ? "" : `, from ${formatPrice(service.price)}`}</dd>
      <dt>Where</dt><dd>${escapeText(form.elements.town.value)} · ${form.elements.spot.value}</dd>
      <dt>When</dt><dd>${readableBookingDate()}, ${bookingState.slot.toLowerCase()}</dd>
    </dl>`;
}

function escapeText(text) {
  const holder = document.createElement("span");
  holder.textContent = text;
  return holder.innerHTML;
}

function finishBooking() {
  const form = document.getElementById("booking");
  const firstName = form.elements.name.value.trim().split(" ")[0];
  const reference = `NYT-${Math.floor(1000 + Math.random() * 9000)}`;

  // Demo: asli site pe yahan request WhatsApp / email / Google Sheet ko jayegi
  document.querySelectorAll(".booking-step, .booking-progress, #booking-nav").forEach((item) => { item.hidden = true; });
  document.getElementById("booking-done-text").textContent =
    `Thanks ${firstName}. We'll check ${form.elements.reg.value.trim()} and come back with the method and a fixed price before booking you in for ${readableBookingDate()}.`;
  document.getElementById("booking-ref").textContent = reference;
  const done = document.getElementById("booking-done");
  done.hidden = false;
  done.focus();
}

function resetBooking() {
  const form = document.getElementById("booking");
  form.reset();
  Object.assign(bookingState, { step: 1, serviceId: null, date: null, slot: null });
  document.getElementById("booking-done").hidden = true;
  document.querySelectorAll(".booking-progress, #booking-nav").forEach((item) => { item.hidden = false; });
  document.querySelectorAll(".date-chip").forEach((item) => item.setAttribute("aria-pressed", "false"));
  renderSlotPicker();
  showBookingStep(1);
}
