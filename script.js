function getHeaderOffset() {
  return document.querySelector(".site-header")?.getBoundingClientRect().height || 76;
}

let scheduleCurrentNavUpdate = () => {};

function restoreHashPosition(hash = window.location.hash) {
  if (!hash) return;

  const target = document.querySelector(hash);
  if (!target) return;

  const scrollToTarget = () => {
    const headerOffset = getHeaderOffset();
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    const previousBehavior = document.documentElement.style.scrollBehavior;

    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "auto" });
    document.documentElement.style.scrollBehavior = previousBehavior;
    scheduleCurrentNavUpdate();
  };

  requestAnimationFrame(scrollToTarget);
  window.setTimeout(scrollToTarget, 160);
}

window.addEventListener("DOMContentLoaded", () => {
  const segments = Array.from(document.querySelectorAll(".segment"));
  const cards = Array.from(document.querySelectorAll(".resource-card"));
  const hashLinks = Array.from(document.querySelectorAll("a[href^='#']"));
  const navLinks = Array.from(document.querySelectorAll(".main-nav a[href^='#']"));
  const navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  let navTicking = false;

  function applyFilter(filter) {
    for (const segment of segments) {
      segment.classList.toggle("is-active", segment.dataset.filter === filter);
    }

    for (const card of cards) {
      const audiences = card.dataset.audience.split(" ");
      card.classList.toggle("is-hidden", filter !== "all" && !audiences.includes(filter));
    }
  }

  for (const segment of segments) {
    segment.addEventListener("click", () => applyFilter(segment.dataset.filter));
  }

  for (const link of hashLinks) {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      if (window.location.hash !== hash) {
        history.pushState(null, "", hash);
      }
      restoreHashPosition(hash);
    });
  }

  function updateCurrentNav() {
    if (navSections.length === 0) return;

    const documentHeight = document.documentElement.scrollHeight;
    const activeLine = window.scrollY + getHeaderOffset() + window.innerHeight * 0.44;
    const isAtPageEnd = window.scrollY + window.innerHeight >= documentHeight - 3;
    let currentSection = navSections[0];

    for (const section of navSections) {
      if (section.offsetTop <= activeLine) {
        currentSection = section;
      }
    }

    if (isAtPageEnd) {
      currentSection = navSections[navSections.length - 1];
    }

    for (const link of navLinks) {
      link.classList.toggle("is-current", link.getAttribute("href") === `#${currentSection.id}`);
    }
  }

  scheduleCurrentNavUpdate = () => {
    if (navTicking) return;
    navTicking = true;

    requestAnimationFrame(() => {
      updateCurrentNav();
      navTicking = false;
    });
  };

  window.addEventListener("scroll", scheduleCurrentNavUpdate, { passive: true });
  window.addEventListener("resize", scheduleCurrentNavUpdate);
  window.addEventListener("hashchange", scheduleCurrentNavUpdate);
  updateCurrentNav();

  if (window.lucide) {
    window.lucide.createIcons();
  }

  restoreHashPosition();
});

window.addEventListener("hashchange", restoreHashPosition);
