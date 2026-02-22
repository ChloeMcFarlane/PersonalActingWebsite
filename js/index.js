// ========================================
// SCROLL REVEAL
// ========================================
(function initScrollReveal() {
  const els = document.querySelectorAll('.scroll-reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('revealed'));
      return;
  }

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => entry.target.classList.add('revealed'), delay);
          observer.unobserve(entry.target);
      });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();


// ========================================
// LAZY IMAGE LOADER  (matches Jordan Berke's LazyImageLoader class)
// ========================================
class LazyImageLoader {
  constructor() {
      this.imageObserver = null;
      this.init();
  }

  init() {
      if ('IntersectionObserver' in window) {
          this.imageObserver = new IntersectionObserver((entries, observer) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      this.loadImage(entry.target);
                      observer.unobserve(entry.target);
                  }
              });
          }, { rootMargin: '50px', threshold: 0.01 });
          this.observeImages();
      } else {
          this.loadAllImages();
      }
  }

  observeImages() {
      document.querySelectorAll('.lazy-image').forEach(img => {
          this.imageObserver.observe(img);
      });
  }

  loadImage(img) {
      const src = img.getAttribute('data-src');
      if (!src) return;
      const temp = new Image();
      temp.onload = () => {
          img.src = src;
          img.classList.add('loaded');
          img.removeAttribute('data-src');
      };
      temp.onerror = () => {
          img.classList.add('loaded', 'error');
      };
      temp.src = src;
  }

  loadAllImages() {
      document.querySelectorAll('.lazy-image').forEach(img => this.loadImage(img));
  }
}


// ========================================
// SCROLL NAVIGATION  (matches Jordan Berke's ScrollNavigation class)
// ========================================
class ScrollNavigation {
  constructor(containerId, leftBtnId, rightBtnId) {
      this.container = document.getElementById(containerId);
      this.leftBtn   = document.getElementById(leftBtnId);
      this.rightBtn  = document.getElementById(rightBtnId);
      if (this.container && this.leftBtn && this.rightBtn) {
          this.init();
      }
  }

  init() {
      this.scrollAmount = 440;

      this.leftBtn.addEventListener('click',  () => this.scroll('left'));
      this.rightBtn.addEventListener('click', () => this.scroll('right'));
      this.container.addEventListener('scroll', () => this.updateButtonVisibility(), { passive: true });
      window.addEventListener('resize', () => this.updateButtonVisibility());
      this.updateButtonVisibility();

      // Touch swipe
      let touchStartX = 0;
      this.container.addEventListener('touchstart', e => {
          touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      this.container.addEventListener('touchend', e => {
          const diff = touchStartX - e.changedTouches[0].screenX;
          if (Math.abs(diff) > 50) {
              this.scroll(diff > 0 ? 'right' : 'left');
          }
      }, { passive: true });
  }

  scroll(direction) {
      const target = direction === 'left'
          ? this.container.scrollLeft - this.scrollAmount
          : this.container.scrollLeft + this.scrollAmount;
      this.container.scrollTo({ left: target, behavior: 'smooth' });
  }

  updateButtonVisibility() {
      const { scrollLeft, scrollWidth, clientWidth } = this.container;
      this.leftBtn.classList.toggle('hidden',  scrollLeft <= 0);
      this.rightBtn.classList.toggle('hidden', scrollLeft + clientWidth >= scrollWidth - 1);
  }
}


// ========================================
// TESTIMONIAL CAROUSEL  — sliding, fixed height, zero layout shift
// ========================================
(function initTestimonials() {
  const cards   = Array.from(document.querySelectorAll('.testimonial-card'));
  const dots    = Array.from(document.querySelectorAll('.t-dot'));
  const btnPrev = document.getElementById('tPrev');
  const btnNext = document.getElementById('tNext');

  if (!cards.length || !btnPrev) return;

  let current   = 0;
  let animating = false;
  const total   = cards.length;

  /*
    Slide mechanism:
    ─────────────────
    Cards are absolutely stacked inside a fixed-height overflow:hidden wrapper.
    Active card → translateX(0), opacity 1
    All others  → translateX(100%), opacity 0  (parked off to the right)

    On NEXT: outgoing slides LEFT (-100%), incoming arrives from RIGHT (+100% → 0)
    On PREV: outgoing slides RIGHT (+100%), incoming arrives from LEFT (-100% → 0)

    Only transform + opacity change — wrapper height is fixed in CSS,
    so there is ZERO layout shift, zero resize.
  */
  function goTo(next, direction) {
      if (animating || next === current) return;
      animating = true;

      const outCard = cards[current];
      const inCard  = cards[next];
      const inStart = direction === 'next' ? '100%' : '-100%';
      const outEnd  = direction === 'next' ? '-100%' : '100%';

      // Park incoming card at start with no transition
      inCard.style.transition = 'none';
      inCard.style.transform  = `translateX(${inStart})`;
      inCard.style.opacity    = '0';
      inCard.classList.add('active');

      // Force reflow so browser registers starting position before transition fires
      void inCard.offsetWidth;

      // Animate both cards
      const ease = 'transform 380ms ease, opacity 380ms ease';
      outCard.style.transition = ease;
      inCard.style.transition  = ease;

      outCard.style.transform = `translateX(${outEnd})`;
      outCard.style.opacity   = '0';
      inCard.style.transform  = 'translateX(0)';
      inCard.style.opacity    = '1';

      // Update dots
      dots[current].classList.remove('active');
      dots[next].classList.add('active');

      setTimeout(() => {
          outCard.classList.remove('active');
          outCard.style.transition = 'none';
          outCard.style.transform  = 'translateX(100%)'; // park it back off-right
          current   = next;
          animating = false;
      }, 390);
  }

  btnNext.addEventListener('click', () => goTo((current + 1) % total, 'next'));
  btnPrev.addEventListener('click', () => goTo((current - 1 + total) % total, 'prev'));

  dots.forEach(dot => {
      dot.addEventListener('click', () => {
          const idx = parseInt(dot.dataset.index);
          if (idx !== current) goTo(idx, idx > current ? 'next' : 'prev');
      });
  });
})();


// ========================================
// NAV HAMBURGER
// ========================================
(function initNav() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      toggle.classList.toggle('active');
  });

  document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
          menu.classList.remove('active');
          toggle.classList.remove('active');
      }
  });
})();


// ========================================
// HEADSHOT SCROLL REVEAL  (about section image)
// ========================================
(function initHeadshotReveal() {
  const headshot = document.querySelector('.headshot');
  if (!headshot || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('revealed');
      });
  }, { threshold: 0.3 });

  observer.observe(headshot);
})();


// ========================================
// INIT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const lazyLoader = new LazyImageLoader();
  const scrollNav  = new ScrollNavigation('scrollContainer', 'scrollLeft', 'scrollRight');

  // Preload first two images immediately for faster perceived load
  const firstImgs = document.querySelectorAll('.lazy-image');
  if (firstImgs[0]) lazyLoader.loadImage(firstImgs[0]);
  if (firstImgs[1]) lazyLoader.loadImage(firstImgs[1]);
});