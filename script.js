const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const navigationLinks = document.querySelectorAll('.primary-nav a');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('.sr-only').textContent = 'Open navigation menu';
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.querySelector('.sr-only').textContent = isOpen ? 'Open navigation menu' : 'Close navigation menu';
  navigation.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

navigationLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
    menuButton.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) closeMenu();
});

// Show an intentional placeholder if a portfolio image has not been added yet.
document.querySelectorAll('img[data-fallback-target]').forEach((image) => {
  const showFallback = () => {
    image.classList.add('is-missing');
    const fallback = document.getElementById(image.dataset.fallbackTarget);
    if (fallback) fallback.removeAttribute('aria-hidden');
  };

  image.addEventListener('error', showFallback);
  if (image.complete && image.naturalWidth === 0) showFallback();
});

const observedSections = document.querySelectorAll('header[id], main section[id]');
const activeLinkObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigationLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-30% 0px -60%', threshold: 0 });

observedSections.forEach((section) => activeLinkObserver.observe(section));

document.getElementById('current-year').textContent = new Date().getFullYear();
