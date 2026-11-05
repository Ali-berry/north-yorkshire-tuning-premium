// area aur service pages ke liye halka script (homepage wala scroll story yahan nahi)
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// chatbot "booking form" maange to homepage ke form pe le jao
function scrollToSection(target) {
  if (target) target.scrollIntoView({ behavior: "smooth" });
  else window.location.href = "../index.html#book";
}

(function setupSubpage() {
  const toggle = document.getElementById("menu-toggle");
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.querySelector("iconify-icon").setAttribute("icon", isOpen ? "ph:list-bold" : "ph:x-bold");
    document.body.classList.toggle("menu-open", !isOpen);
  });

  const themeButton = document.getElementById("theme-toggle");
  const paint = () => {
    const isLight = document.documentElement.dataset.theme === "light";
    themeButton.querySelector("iconify-icon").setAttribute("icon", isLight ? "ph:moon-duotone" : "ph:sun-duotone");
  };
  themeButton.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("nyt-theme", next); } catch (error) {}
    paint();
  });
  paint();

  // FAQ: ek waqt mein ek
  document.querySelectorAll(".faq-list").forEach((list) => {
    list.addEventListener("toggle", (event) => {
      if (!event.target.open) return;
      list.querySelectorAll("details[open]").forEach((item) => { if (item !== event.target) item.open = false; });
    }, true);
  });

  if (prefersReducedMotion) return;
  const watcher = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.preload = "auto";
        const playing = target.play();
        if (playing) playing.catch(() => {});
      } else target.pause();
    });
  }, { rootMargin: "200px 0px" });
  document.querySelectorAll("video[data-lazy-video]").forEach((video) => watcher.observe(video));
})();
