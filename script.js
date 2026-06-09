const segments = Array.from(document.querySelectorAll(".segment"));
const cards = Array.from(document.querySelectorAll(".resource-card"));

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

window.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
