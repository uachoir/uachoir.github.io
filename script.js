const dialog = document.querySelector(".pdf-dialog");
const frame = dialog?.querySelector("iframe");
const dialogTitle = document.querySelector("#pdf-title");
const downloadCurrent = document.querySelector(".download-current");
const scoreTrack = document.querySelector(".score-track");
const carouselPrev = document.querySelector(".carousel-prev");
const carouselNext = document.querySelector(".carousel-next");
const revealItems = document.querySelectorAll(
  "main > section, .score-card, .section-card, .news-list article, .site-footer > *"
);

const scrollScores = (direction) => {
  if (!scoreTrack) return;

  const card = scoreTrack.querySelector(".score-card");
  const step = card ? card.getBoundingClientRect().width + 16 : 280;
  scoreTrack.scrollBy({ left: direction * step, behavior: "smooth" });
};

carouselPrev?.addEventListener("click", () => scrollScores(-1));
carouselNext?.addEventListener("click", () => scrollScores(1));

if ("IntersectionObserver" in window) {
  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll(".view-score").forEach((button) => {
  button.addEventListener("click", () => {
    const pdf = button.dataset.pdf;
    const title = button.dataset.title || "Перегляд партитури";

    frame.src = pdf;
    dialogTitle.textContent = title;
    downloadCurrent.href = pdf;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      window.open(pdf, "_blank", "noopener");
    }
  });
});

document.querySelector(".close-dialog")?.addEventListener("click", () => {
  dialog.close();
  frame.src = "";
});

dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
    frame.src = "";
  }
});
