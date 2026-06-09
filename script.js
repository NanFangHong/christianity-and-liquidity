function restoreHashPosition() {
  if (!window.location.hash) return;

  const target = document.querySelector(window.location.hash);
  if (!target) return;

  const scrollToTarget = () => {
    const header = document.querySelector(".site-header");
    const headerOffset = header?.getBoundingClientRect().height || 76;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    const previousBehavior = document.documentElement.style.scrollBehavior;

    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "auto" });
    document.documentElement.style.scrollBehavior = previousBehavior;
  };

  requestAnimationFrame(scrollToTarget);
  window.setTimeout(scrollToTarget, 160);
}

window.addEventListener("DOMContentLoaded", () => {
  const segments = Array.from(document.querySelectorAll(".segment"));
  const cards = Array.from(document.querySelectorAll(".resource-card"));
  const navLinks = Array.from(document.querySelectorAll(".main-nav a[href^='#']"));
  const navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

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

  if ("IntersectionObserver" in window && navSections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        for (const link of navLinks) {
          link.classList.toggle("is-current", link.getAttribute("href") === `#${visible.target.id}`);
        }
      },
      { rootMargin: "-34% 0px -52% 0px", threshold: [0, 0.2, 0.45] }
    );

    for (const section of navSections) {
      observer.observe(section);
    }
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }

  restoreHashPosition();
});

window.addEventListener("hashchange", restoreHashPosition);
