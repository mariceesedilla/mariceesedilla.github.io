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

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('[data-project-slider]').forEach((slider) => {
  const card = slider.closest('.project-card, .featured-project');
  const slides = Array.from(slider.querySelectorAll('.project-slide'));
  const dots = Array.from(slider.querySelectorAll('.slider-dots i'));
  const interval = Number.parseInt(slider.dataset.sliderInterval, 10) || 4000;
  let activeIndex = 0;
  let timer = null;
  let pointerPaused = false;
  let focusPaused = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let didSwipe = false;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
      dots[slideIndex]?.classList.toggle('is-active', isActive);
    });
  }

  function stopSlider() {
    window.clearInterval(timer);
    timer = null;
  }

  function startSlider() {
    stopSlider();
    if (reducedMotionQuery.matches || pointerPaused || focusPaused || document.hidden || slides.length < 2) return;
    timer = window.setInterval(() => showSlide(activeIndex + 1), interval);
  }

  card.addEventListener('mouseenter', () => {
    pointerPaused = true;
    stopSlider();
  });

  card.addEventListener('mouseleave', () => {
    pointerPaused = false;
    startSlider();
  });

  card.addEventListener('focusin', () => {
    focusPaused = true;
    stopSlider();
  });

  card.addEventListener('focusout', (event) => {
    if (card.contains(event.relatedTarget)) return;
    focusPaused = false;
    startSlider();
  });

  card.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  card.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    const distanceX = touch.clientX - touchStartX;
    const distanceY = touch.clientY - touchStartY;
    if (Math.abs(distanceX) < 45 || Math.abs(distanceX) <= Math.abs(distanceY)) return;
    didSwipe = true;
    showSlide(activeIndex + (distanceX < 0 ? 1 : -1));
    startSlider();
    window.setTimeout(() => { didSwipe = false; }, 500);
  }, { passive: true });

  card.addEventListener('click', (event) => {
    if (!didSwipe) return;
    event.preventDefault();
    event.stopPropagation();
    didSwipe = false;
  }, true);

  reducedMotionQuery.addEventListener('change', () => {
    if (reducedMotionQuery.matches) {
      showSlide(0);
      stopSlider();
    } else {
      startSlider();
    }
  });

  document.addEventListener('visibilitychange', startSlider);
  showSlide(0);
  startSlider();
});

document.querySelectorAll('[data-tool-marquee]').forEach((marquee) => {
  marquee.querySelectorAll('[data-marquee-row]').forEach((row) => {
    const track = row.querySelector('.tool-marquee-track');
    const group = track?.querySelector('.tool-marquee-group');
    if (!track || !group) return;

    const repeatedGroup = group.cloneNode(true);
    repeatedGroup.setAttribute('aria-hidden', 'true');
    track.append(repeatedGroup);
  });

  marquee.classList.add('is-ready');
});

document.getElementById('current-year').textContent = new Date().getFullYear();
