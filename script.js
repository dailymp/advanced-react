/* ============================================
   YURI LA DIFERENCIA - Landing Page Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Mobile nav toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  // --- Scroll reveal animations ---
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = getComputedStyle(entry.target).getPropertyValue('--delay') || '0s';
        const ms = parseFloat(delay) * 1000;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, ms);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Animated stat counters ---
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        animateCount(el, 0, target, 1500);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => countObserver.observe(el));

  function animateCount(el, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (end - start) * eased);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // --- Play button interaction (visual only) ---
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.music-card');
      const waves = card.querySelectorAll('.sound-wave span');

      // Toggle active state
      const isPlaying = btn.classList.contains('playing');

      // Reset all other play buttons
      document.querySelectorAll('.play-btn.playing').forEach(other => {
        if (other !== btn) {
          other.classList.remove('playing');
          other.querySelector('.play-icon').textContent = '\u25B6';
          other.closest('.music-card').querySelectorAll('.sound-wave span').forEach(s => {
            s.style.animationPlayState = 'paused';
          });
        }
      });

      if (isPlaying) {
        btn.classList.remove('playing');
        btn.querySelector('.play-icon').textContent = '\u25B6';
        waves.forEach(s => { s.style.animationPlayState = 'paused'; });
      } else {
        btn.classList.add('playing');
        btn.querySelector('.play-icon').textContent = '\u23F8';
        waves.forEach(s => { s.style.animationPlayState = 'running'; });
      }
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.style.color = 'var(--gold)';
        } else {
          link.style.color = '';
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
});
