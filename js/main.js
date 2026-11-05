gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lenis = null;

// gain estimator ki choice aur dyno chart ka frame
const gainState = { fuel: "diesel", stage: "stage1", bhp: 150 };
const DYNO = { left: 34, right: 392, top: 12, bottom: 196, maxRpm: 6000 };
// visit timeline: kaunsa step chal raha hai, aur poori visit kitne minute ki
const visitState = { index: 0, timer: null, inView: false };
const VISIT_TOTAL = 120;

fillShopDetails();
renderPromises();
renderServiceCards();
renderVisitReel();
setupGainEstimator();
renderMethods();
renderWorkSteps();
setupSymptomPicker();
setupTownCheck();
renderReviews();
renderFaqList();
setupBookingForm();
setupMobileMenu();
setupThemeToggle();
setupHeaderOnScroll();
setupBookButtons();
tuckChatNearBooking();
setupLazyVideos();
readLinkParams();

startPage();

async function startPage() {
  if (prefersReducedMotion) {
    hideLoader();
    return;
  }
  setupSmoothScroll();
  await preloadStoryFrames(updateLoader);
  hideLoader();
  setupFrameStory();
  playHeroEntrance();
  setupSplitTitles();
  setupSectionReveals();
  setupStepRail();
  setupImageParallax();
  setupVisitScroll();
  ScrollTrigger.refresh();
}

function updateLoader(progress) {
  document.getElementById("loader-percent").textContent = Math.round(progress * 100);
  document.getElementById("loader-fill").style.transform = `scaleX(${progress})`;
}

function hideLoader() {
  const loader = document.getElementById("loader");
  if (prefersReducedMotion) {
    loader.remove();
    return;
  }
  gsap.to(loader, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "power4.inOut", onComplete: () => loader.remove() });
}

function playHeroEntrance() {
  gsap.timeline({ delay: 0.4 })
    .from(".hero-title .line > span", { yPercent: 110, duration: 1, stagger: 0.1, ease: "power4.out" })
    .from(".hero-tag, .caption-1 .lead, .caption-1 .cta-row", { opacity: 0, y: 20, duration: 0.7, stagger: 0.08, ease: "power3.out" }, "-=0.6")
    .from(".hud, .story-steps li, .scroll-hint", { opacity: 0, x: 12, duration: 0.5, stagger: 0.05 }, "-=0.5");
}

function setupSmoothScroll() {
  lenis = new Lenis({ duration: 1.1 });
  // ScrollTrigger ko Lenis wali scroll position chahiye, warna pin late lagta hai
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToSection(target) {
  if (lenis) lenis.scrollTo(target, { offset: target.id === "top" ? 0 : -72 });
  else target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
}

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || link.getAttribute("href") === "#" || link.hasAttribute("data-book-service")) return;
  const target = document.querySelector(link.getAttribute("href"));
  if (!target) return;
  event.preventDefault();
  closeMobileMenu();
  scrollToSection(target);
});

// headings ke words neeche se upar aate hain
function setupSplitTitles() {
  document.querySelectorAll(".split-title").forEach((title) => {
    title.setAttribute("aria-label", title.textContent);
    title.innerHTML = title.textContent
      .split(" ")
      .map((word) => `<span class="word" aria-hidden="true"><span>${word}</span></span>`)
      .join(" ");
    gsap.from(title.querySelectorAll(".word > span"), {
      yPercent: 115,
      duration: 0.9,
      stagger: 0.04,
      ease: "power4.out",
      scrollTrigger: { trigger: title, start: "top 86%", once: true },
    });
  });
}

function setupSectionReveals() {
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 90%",
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: "power4.out" }),
  });
}

function setupStepRail() {
  gsap.fromTo("#step-rail-fill", { scaleX: 0 }, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { trigger: ".step-track", start: "top 75%", end: "bottom 55%", scrub: true },
  });
  document.querySelectorAll(".step-item").forEach((step, index) => {
    ScrollTrigger.create({
      trigger: ".step-track",
      start: `top+=${index * 60} 70%`,
      onEnter: () => step.classList.add("is-lit"),
      onLeaveBack: () => step.classList.remove("is-lit"),
    });
  });
}

function setupImageParallax() {
  [".method-figure video", ".final-bg"].forEach((selector) => {
    gsap.fromTo(selector, { scale: 1.15, yPercent: -5 }, {
      scale: 1.02,
      yPercent: 5,
      ease: "none",
      scrollTrigger: { trigger: selector, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
}

// dark default hai; light chunne pe yaad rakhte hain (storage band ho to bhi site chalti rahe)
function setupThemeToggle() {
  const button = document.getElementById("theme-toggle");
  const paint = () => {
    const isLight = document.documentElement.dataset.theme === "light";
    button.querySelector("iconify-icon").setAttribute("icon", isLight ? "ph:moon-duotone" : "ph:sun-duotone");
    button.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  };
  button.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("nyt-theme", next); } catch (error) {}
    paint();
  });
  paint();
}

function setupHeaderOnScroll() {
  const header = document.getElementById("site-header");
  const updateHeader = () => header.classList.toggle("is-solid", window.scrollY > 40);
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
}

function setupMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.querySelector("iconify-icon").setAttribute("icon", isOpen ? "ph:list-bold" : "ph:x-bold");
    document.body.classList.toggle("menu-open", !isOpen);
  });
}

function closeMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  toggle.setAttribute("aria-expanded", "false");
  toggle.querySelector("iconify-icon").setAttribute("icon", "ph:list-bold");
  document.body.classList.remove("menu-open");
}

function setupBookButtons() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-book-service]");
    if (!button) return;
    event.preventDefault();
    preselectBookingService(button.dataset.bookService);
    scrollToSection(document.getElementById("book"));
  });
}

// booking ke buttons pe chat button na chadhe
function tuckChatNearBooking() {
  const chat = document.getElementById("chat");
  new IntersectionObserver(([entry]) => {
    chat.classList.toggle("is-tucked", entry.isIntersecting);
  }, { rootMargin: "0px 0px -40px 0px" }).observe(document.getElementById("booking-nav"));
}

function fillShopDetails() {
  document.querySelectorAll('[data-shop="phone-link"]').forEach((link) => {
    link.href = `tel:${shopInfo.phoneLink}`;
  });
  document.querySelectorAll('[data-shop="whatsapp-link"]').forEach((link) => {
    link.href = `https://wa.me/${shopInfo.whatsapp}`;
    link.target = "_blank";
    link.rel = "noopener";
  });
  document.querySelectorAll('[data-shop="email"]').forEach((link) => {
    link.href = `mailto:${shopInfo.email}`;
  });
  document.getElementById("footer-services").innerHTML = services
    .map((service) => `<li><a href="#book" data-book-service="${service.id}">${service.name}</a></li>`)
    .join("");
  document.getElementById("footer-areas").innerHTML = serviceAreas
    .map((town) => `<li><a href="areas/${townSlug(town)}.html">${town}</a></li>`)
    .join("");
  document.getElementById("social-list").innerHTML = shopInfo.socials
    .map((item) => `<li><a href="${item.url}" target="_blank" rel="noopener" aria-label="${item.label}"><iconify-icon icon="${item.icon}" aria-hidden="true"></iconify-icon></a></li>`)
    .join("");
  document.getElementById("year").textContent = new Date().getFullYear();
}

function renderPromises() {
  document.getElementById("promise-row").innerHTML = shopPromises
    .map(
      (promise) => `
      <div class="promise" data-reveal>
        <iconify-icon icon="${promise.icon}" aria-hidden="true"></iconify-icon>
        <div><strong>${promise.title}</strong><span>${promise.text}</span></div>
      </div>`
    )
    .join("");
}

/* ---------- services ---------- */

function servicePageUrl(service) {
  return `services/${service.slug}.html`;
}

function renderServiceCards() {
  const priceText = (service) => (service.price === null ? "Price on request" : `From ${formatPrice(service.price)}`);

  document.getElementById("feature-grid").innerHTML = services
    .filter((service) => service.featured)
    .map(
      (service, index) => `
      <article class="feature-card glass" data-reveal>
        <div class="feature-media">
          <video data-lazy-video src="${service.media}" poster="${service.poster}" muted loop playsinline preload="none" aria-hidden="true"></video>
        </div>
        <div class="feature-body">
          <p class="feature-kicker">${service.group}</p>
          <h3>${service.name}</h3>
          <p>${service.text}</p>
          <div class="service-foot">
            <span class="service-price ${service.price === null ? "is-ask" : ""}"><strong>${priceText(service)}</strong></span>
            <span class="feature-links">
              <a class="service-more" href="${servicePageUrl(service)}">Details</a>
              <a class="service-book" href="#book" data-book-service="${service.id}">Book<iconify-icon icon="ph:arrow-right-bold" aria-hidden="true"></iconify-icon></a>
            </span>
          </div>
        </div>
      </article>`
    )
    .join("");

  document.getElementById("service-grid").innerHTML = services
    .filter((service) => !service.featured)
    .map(
      (service) => `
      <article class="service-card glass" data-reveal>
        <span class="service-icon"><iconify-icon icon="${service.icon}" aria-hidden="true"></iconify-icon></span>
        <div>
          <h3>${service.name}</h3>
          <p>${service.text}</p>
        </div>
        <a class="service-book" href="#book" data-book-service="${service.id}" aria-label="Book ${service.name}">${service.price === null ? "Ask" : formatPrice(service.price)}<iconify-icon icon="ph:arrow-right-bold" aria-hidden="true"></iconify-icon></a>
      </article>`
    )
    .join("");

  // card pe mouse ke peeche neeli roshni
  document.querySelectorAll(".feature-grid, .service-grid").forEach((grid) => {
    grid.addEventListener("pointermove", (event) => {
      const card = event.target.closest(".glass");
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - box.left}px`);
      card.style.setProperty("--my", `${event.clientY - box.top}px`);
    });
  });
}

/* ---------- inside a visit: timeline graph ---------- */

function renderVisitReel() {
  const axis = document.getElementById("visit-axis");
  for (let minute = 0; minute <= VISIT_TOTAL; minute += 15) {
    axis.insertAdjacentHTML("beforeend", `<span style="left:${(minute / VISIT_TOTAL) * 100}%">${minute}<small>min</small></span>`);
  }
  document.getElementById("visit-points").innerHTML = visitSteps
    .map(
      (step, index) => `
      <button class="visit-point" type="button" role="tab" data-index="${index}" style="left:${(step.minute / VISIT_TOTAL) * 100}%" aria-selected="false">
        <i aria-hidden="true"></i><span>${step.title}</span>
      </button>`
    )
    .join("");
  document.getElementById("visit-points").addEventListener("click", (event) => {
    const point = event.target.closest(".visit-point");
    if (!point) return;
    showVisitStep(Number(point.dataset.index));
    restartVisitTimer();
  });
  showVisitStep(0, false);
}

function showVisitStep(index, animate = true) {
  const step = visitSteps[index];
  visitState.index = index;
  const video = document.getElementById("visit-video");
  const swap = () => {
    video.poster = `assets/video/${step.video}.jpg`;
    video.src = `assets/video/${step.video}.mp4`;
    if (visitState.inView) {
      const playing = video.play();
      if (playing) playing.catch(() => {});
    }
  };
  document.getElementById("visit-time").textContent = `${step.minute} min`;
  document.getElementById("visit-title").textContent = step.title;
  document.getElementById("visit-text").textContent = step.text;
  document.getElementById("visit-line-fill").style.transform = `scaleX(${step.minute / VISIT_TOTAL || 0.01})`;
  document.querySelectorAll(".visit-point").forEach((point, i) => {
    point.setAttribute("aria-selected", String(i === index));
    point.classList.toggle("is-done", i < index);
  });
  if (!animate || prefersReducedMotion) {
    swap();
    return;
  }
  gsap.timeline()
    .to(".visit-screen video", { opacity: 0, duration: 0.25 })
    .add(swap)
    .to(".visit-screen video", { opacity: 1, duration: 0.4 })
    .fromTo(".visit-readout > *", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 }, "<");
}

// screen pe ho to har 5 second baad agla step
function restartVisitTimer() {
  clearInterval(visitState.timer);
  if (prefersReducedMotion) return;
  visitState.timer = setInterval(() => {
    if (visitState.inView) showVisitStep((visitState.index + 1) % visitSteps.length);
  }, 5000);
}

function setupVisitScroll() {
  new IntersectionObserver(([entry]) => {
    visitState.inView = entry.isIntersecting;
    const video = document.getElementById("visit-video");
    if (entry.isIntersecting) {
      const playing = video.play();
      if (playing) playing.catch(() => {});
    } else video.pause();
  }, { threshold: 0.35 }).observe(document.querySelector(".visit-panel"));
  restartVisitTimer();
}

/* ---------- testimonials: do rows, ulti directions ---------- */

function renderReviews() {
  const card = (review) => `
    <article class="t-card">
      <header>
        <span class="t-avatar" aria-hidden="true">${review.name.charAt(0)}</span>
        <span><strong>${review.name}<iconify-icon icon="ph:seal-check-fill" aria-label="Verified customer"></iconify-icon></strong><small>${review.car} · ${review.service}</small></span>
      </header>
      <p>${review.text}</p>
    </article>`;
  const half = Math.ceil(sampleReviews.length / 2);
  const rows = [sampleReviews.slice(0, half), sampleReviews.slice(half)];
  document.querySelectorAll(".testimonial-row").forEach((row, index) => {
    const cards = rows[index].map(card).join("");
    // do copies taake loop mein jagah khaali na dikhe
    row.innerHTML = `<div class="t-track">${cards}${cards}</div>`;
  });
}

// videos sirf screen pe aane par chalti hain, taake page halka rahe
function setupLazyVideos() {
  const videos = document.querySelectorAll("video[data-lazy-video]");
  if (prefersReducedMotion) return;
  const watcher = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        if (target.preload === "none") target.preload = "auto";
        const playing = target.play();
        if (playing) playing.catch(() => {});
      } else {
        target.pause();
      }
    });
  }, { rootMargin: "200px 0px" });
  videos.forEach((video) => watcher.observe(video));
}

/* ---------- gain estimator (dyno chart) ---------- */

function setupGainEstimator() {
  const chart = document.getElementById("dyno-chart");
  chart.insertAdjacentHTML("afterbegin", `
    <defs><linearGradient id="dyno-gradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5fd0ff" stop-opacity="0.55"/><stop offset="100%" stop-color="#2f8cff" stop-opacity="0"/>
    </linearGradient></defs>`);
  drawDynoGrid();

  const pick = (groupId, key) => {
    document.getElementById(groupId).addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      document.querySelectorAll(`#${groupId} button`).forEach((item) => item.setAttribute("aria-checked", String(item === button)));
      gainState[key] = button.dataset[key];
      updateGains(true);
    });
  };
  pick("fuel-toggle", "fuel");
  pick("stage-toggle", "stage");

  const range = document.getElementById("bhp-range");
  range.addEventListener("input", () => {
    gainState.bhp = Number(range.value);
    updateGains(false);
  });
  updateGains(false);

  if (!prefersReducedMotion) {
    // chart pehli baar dikhe to tuned line baayein se daayein khinchti hai
    ScrollTrigger.create({
      trigger: chart,
      start: "top 80%",
      once: true,
      onEnter: () => {
        const tuned = document.getElementById("dyno-tuned");
        const length = tuned.getTotalLength();
        gsap.fromTo(tuned, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", onComplete: () => tuned.removeAttribute("style") });
        gsap.from("#dyno-tuned-area", { opacity: 0, duration: 1.2, delay: 0.6 });
      },
    });
  }
}

function drawDynoGrid() {
  let lines = "";
  for (let rpm = 1000; rpm <= 6000; rpm += 1000) {
    const x = DYNO.left + ((rpm - 1000) / 5000) * (DYNO.right - DYNO.left);
    lines += `<line x1="${x}" y1="${DYNO.top}" x2="${x}" y2="${DYNO.bottom}"/><text x="${x}" y="212" text-anchor="middle">${rpm / 1000}k</text>`;
  }
  for (let i = 0; i <= 4; i++) {
    const y = DYNO.top + (i / 4) * (DYNO.bottom - DYNO.top);
    lines += `<line x1="${DYNO.left}" y1="${y}" x2="${DYNO.right}" y2="${y}"/>`;
  }
  document.getElementById("dyno-grid").innerHTML = lines;
}

// ek seedha-saada power curve: neeche rpm pe kam, peak ke baad thoda girta hai
function powerCurve(peak, peakRpm, maxValue) {
  const points = [];
  for (let rpm = 1000; rpm <= 6000; rpm += 125) {
    const t = rpm / peakRpm;
    const shape = rpm <= peakRpm ? Math.sin((Math.PI / 2) * Math.min(1, t)) ** 1.4 : 1 - 0.22 * ((rpm - peakRpm) / (DYNO.maxRpm - peakRpm)) ** 1.3;
    const value = peak * Math.max(0.12, shape);
    const x = DYNO.left + ((rpm - 1000) / 5000) * (DYNO.right - DYNO.left);
    const y = DYNO.bottom - (value / maxValue) * (DYNO.bottom - DYNO.top);
    points.push([x, y]);
  }
  return points;
}

function toPath(points) {
  return points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

function updateGains(animate) {
  const profile = gainProfiles[gainState.fuel][gainState.stage];
  const bhp = gainState.bhp;
  const low = Math.round(bhp * profile.power[0]);
  const high = Math.round(bhp * profile.power[1]);
  const mid = bhp * (1 + (profile.power[0] + profile.power[1]) / 2);
  const peakRpm = gainState.fuel === "diesel" ? 3800 : 5300;

  const range = document.getElementById("bhp-range");
  range.style.setProperty("--fill", `${((bhp - range.min) / (range.max - range.min)) * 100}%`);
  document.getElementById("bhp-value").textContent = bhp;
  document.getElementById("gain-power").textContent = `+${low}–${high}`;
  document.getElementById("gain-total").textContent = `${bhp + low}–${bhp + high}`;
  document.getElementById("gain-torque").textContent = `+${Math.round(profile.torque[0] * 100)}–${Math.round(profile.torque[1] * 100)}`;

  const maxValue = mid * 1.12;
  const stock = powerCurve(bhp, peakRpm, maxValue);
  const tuned = powerCurve(mid, peakRpm - 300, maxValue);
  const area = `${toPath(tuned)} L${DYNO.right},${DYNO.bottom} L${DYNO.left},${DYNO.bottom} Z`;

  const set = () => {
    document.getElementById("dyno-stock").setAttribute("d", toPath(stock));
    document.getElementById("dyno-tuned").setAttribute("d", toPath(tuned));
    document.getElementById("dyno-tuned-area").setAttribute("d", area);
  };
  set();
  if (animate && !prefersReducedMotion) {
    gsap.fromTo(".dyno-stats strong", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power3.out" });
    gsap.fromTo("#dyno-tuned, #dyno-tuned-area", { scaleY: 0.9, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.5, ease: "back.out(2)" });
  }
}

function renderMethods() {
  document.getElementById("method-list").innerHTML = tuningMethods
    .map(
      (method) => `
      <li class="method-item" data-reveal>
        <iconify-icon icon="${method.icon}" aria-hidden="true"></iconify-icon>
        <div><h3>${method.title}</h3><p>${method.text}</p></div>
      </li>`
    )
    .join("");
}

function renderWorkSteps() {
  document.getElementById("step-track").insertAdjacentHTML(
    "beforeend",
    workSteps
      .map(
        (step, index) => `
        <li class="step-item" data-reveal>
          <span class="step-icon"><iconify-icon icon="${step.icon}" aria-hidden="true"></iconify-icon></span>
          <span class="step-count">STEP 0${index + 1}</span>
          <h3>${step.title}</h3>
          <p>${step.text}</p>
        </li>`
      )
      .join("")
  );
}

/* ---------- symptom picker ---------- */

function setupSymptomPicker() {
  const list = document.getElementById("symptom-list");
  list.innerHTML = carProblems
    .map(
      (problem) => `
      <button class="symptom-option" type="button" data-problem="${problem.id}" aria-pressed="false">
        <span>${problem.label}</span>
        <iconify-icon icon="ph:arrow-right-bold" aria-hidden="true"></iconify-icon>
      </button>`
    )
    .join("");
  list.addEventListener("click", (event) => {
    const option = event.target.closest(".symptom-option");
    if (option) showSymptom(option.dataset.problem);
  });
  showSymptom(carProblems[0].id, false);
}

function showSymptom(problemId, animate = true) {
  const problem = carProblems.find((item) => item.id === problemId);
  const service = findServiceById(problem.service);
  document.querySelectorAll(".symptom-option").forEach((option) => option.setAttribute("aria-pressed", String(option.dataset.problem === problemId)));
  document.getElementById("symptom-label").textContent = problem.label;
  document.getElementById("symptom-fix").textContent = problem.fix;
  document.getElementById("symptom-service").textContent = service.name;
  document.getElementById("symptom-price").textContent = service.price === null ? "On request" : formatPrice(service.price);
  document.getElementById("symptom-book").dataset.bookService = service.id;
  if (animate && !prefersReducedMotion) {
    gsap.fromTo(".symptom-body > *", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power3.out" });
  }
}

/* ---------- town check ---------- */

function normaliseTown(text) {
  return text.toLowerCase().replace(/[^a-z]/g, "");
}

function findTown(text) {
  const wanted = normaliseTown(text);
  if (wanted.length < 3) return null;
  return serviceAreas.find((town) => normaliseTown(town) === wanted) || serviceAreas.find((town) => normaliseTown(town).startsWith(wanted));
}

function setupTownCheck() {
  const bigTowns = ["York", "Leeds", "Harrogate", "Selby", "Wetherby"];
  document.getElementById("town-cloud").innerHTML = serviceAreas
    .map((town) => `<li data-town="${town}" class="${bigTowns.includes(town) ? "is-big" : ""}" data-reveal><a href="areas/${townSlug(town)}.html">${town}</a></li>`)
    .join("");
  document.getElementById("town-options").innerHTML = serviceAreas.map((town) => `<option value="${town}">`).join("");

  const form = document.getElementById("town-form");
  const input = document.getElementById("town-input");
  const result = document.getElementById("town-result");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    const town = findTown(text);
    document.querySelectorAll("#town-cloud li").forEach((item) => item.classList.toggle("is-match", item.dataset.town === town));
    result.className = "town-result";
    if (!text) {
      result.textContent = "Type your town or village.";
    } else if (town) {
      result.innerHTML = `<iconify-icon icon="ph:check-circle-duotone" aria-hidden="true"></iconify-icon>Yes, we cover ${town}. <a href="#book">Get a price</a> · <a href="areas/${townSlug(town)}.html">${town} page</a>`;
      result.classList.add("is-yes");
      document.getElementById("town").value = town;
    } else {
      result.innerHTML = `<iconify-icon icon="ph:map-pin-duotone" aria-hidden="true"></iconify-icon>${escapeText(text)} isn't on our list yet, but we travel. <a href="https://wa.me/${shopInfo.whatsapp}" target="_blank" rel="noopener">WhatsApp us</a> to check.`;
      result.classList.add("is-no");
    }
    if (!prefersReducedMotion) gsap.fromTo(result, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 });
  });
}

function renderFaqList() {
  const list = document.querySelector(".faq-list");
  list.innerHTML = shopFaqs
    .map(
      (item) => `
      <details class="faq-item" data-reveal>
        <summary><span>${item.q}</span><span class="faq-icon"><iconify-icon icon="ph:plus-bold" aria-hidden="true"></iconify-icon></span></summary>
        <div class="faq-answer"><p>${item.a}</p></div>
      </details>`
    )
    .join("");

  // ek waqt mein ek hi sawal khula rahe
  list.addEventListener("toggle", (event) => {
    if (!event.target.open) return;
    list.querySelectorAll("details[open]").forEach((item) => { if (item !== event.target) item.open = false; });
  }, true);
}

// area / service page se aaye: ?service=dpf ya ?town=selby
function readLinkParams() {
  const params = new URLSearchParams(window.location.search);
  const serviceId = params.get("service");
  if (serviceId) preselectBookingService(serviceId);
  const townSlugParam = params.get("town");
  const town = townSlugParam && serviceAreas.find((item) => townSlug(item) === townSlugParam);
  if (town) document.getElementById("town").value = town;
}
