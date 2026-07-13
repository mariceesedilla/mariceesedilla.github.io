const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const closeButton = document.querySelector('.lightbox-close');
const galleryTriggers = document.querySelectorAll('[data-lightbox-src]');

let lastTrigger = null;

function openLightbox(trigger) {
  lastTrigger = trigger;
  lightboxImage.src = trigger.dataset.lightboxSrc;
  lightboxImage.alt = trigger.dataset.lightboxAlt;
  lightboxCaption.textContent = trigger.dataset.lightboxCaption
    || trigger.closest('figure').querySelector('figcaption').textContent.trim();
  lightbox.showModal();
  document.body.classList.add('lightbox-open');
}

function closeLightbox() {
  lightbox.close();
}

galleryTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => openLightbox(trigger));
});

closeButton.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightbox.addEventListener('close', () => {
  document.body.classList.remove('lightbox-open');
  lightboxImage.src = '';
  if (lastTrigger) lastTrigger.focus();
});
