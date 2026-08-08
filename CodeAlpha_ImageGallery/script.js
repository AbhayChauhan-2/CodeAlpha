const photos = [
  {
    title: "Mountain Escape",
    category: "nature",
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Forest Morning",
    category: "nature",
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Ocean Horizon",
    category: "nature",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "City Lights",
    category: "city",
    src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Urban Streets",
    category: "city",
    src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Night Architecture",
    category: "city",
    src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Desert Journey",
    category: "travel",
    src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Road Trip",
    category: "travel",
    src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Coastal Adventure",
    category: "travel",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85"
  }
];

const gallery = document.getElementById("gallery");
const filters = document.getElementById("filters");
const count = document.getElementById("count");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const counter = document.getElementById("counter");

let currentFilter = "all";
let visiblePhotos = [];
let currentIndex = 0;

function getVisiblePhotos() {
  return currentFilter === "all"
    ? photos
    : photos.filter(photo => photo.category === currentFilter);
}

function renderGallery() {
  visiblePhotos = getVisiblePhotos();
  count.textContent = `${visiblePhotos.length} ${visiblePhotos.length === 1 ? "image" : "images"}`;

  gallery.innerHTML = visiblePhotos.map((photo, index) => `
    <article class="card" data-index="${index}" tabindex="0" role="button"
      aria-label="Open ${photo.title}">
      <img src="${photo.src}" alt="${photo.title}" loading="lazy">
      <div class="card-info">
        <h2>${photo.title}</h2>
        <p>${photo.category}</p>
      </div>
    </article>
  `).join("");
}

function openLightbox(index) {
  if (!visiblePhotos.length) return;

  currentIndex = (index + visiblePhotos.length) % visiblePhotos.length;
  const photo = visiblePhotos[currentIndex];

  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.title;
  lightboxTitle.textContent = photo.title;
  lightboxCategory.textContent = photo.category;
  counter.textContent = `${currentIndex + 1} / ${visiblePhotos.length}`;

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function move(step) {
  openLightbox(currentIndex + step);
}

filters.addEventListener("click", (event) => {
  const button = event.target.closest(".filter");
  if (!button) return;

  document.querySelectorAll(".filter").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");

  currentFilter = button.dataset.filter;
  renderGallery();
});

gallery.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (card) openLightbox(Number(card.dataset.index));
});

gallery.addEventListener("keydown", (event) => {
  const card = event.target.closest(".card");
  if (!card) return;

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openLightbox(Number(card.dataset.index));
  }
});

document.getElementById("close").addEventListener("click", closeLightbox);
document.getElementById("prev").addEventListener("click", () => move(-1));
document.getElementById("next").addEventListener("click", () => move(1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") move(-1);
  if (event.key === "ArrowRight") move(1);
});

renderGallery();
