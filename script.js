/* ===== ANIMALL – SCRIPT.JS ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== PRELOADER ===== */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1800);
  });
  document.body.style.overflow = 'hidden';

  /* ===== PARTICLES ===== */
  const particlesBg = document.getElementById('particles');
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 70 + 20;
    const colors = ['#f97316', '#f59e0b', '#fb923c', '#fbbf24'];
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay:${Math.random() * 20}s;
      animation-duration:${Math.random() * 20 + 15}s;
    `;
    particlesBg.appendChild(p);
  }

  /* ===== NAVBAR SCROLL ===== */
  const navbar     = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  });

  /* ===== HAMBURGER ===== */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ===== ACTIVE NAV LINK ===== */
  const sections   = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    navLinkEls.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });

  /* ===== COUNTER ANIMATION ===== */
  let countersStarted = false;
  function animateCounters() {
    if (countersStarted) return;
    const hero = document.getElementById('home');
    if (hero.getBoundingClientRect().top < window.innerHeight) {
      countersStarted = true;
      document.querySelectorAll('.stat-num').forEach(el => {
        const target = +el.dataset.target;
        let current = 0;
        const step = target / (1800 / 16);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = Math.floor(current).toLocaleString();
        }, 16);
      });
    }
  }
  window.addEventListener('scroll', animateCounters);
  animateCounters();

  /* ===== PRODUCT TABS ===== */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  /* ===== GALLERY LIGHTBOX ===== */
  const lightbox        = document.getElementById('lightbox');
  const lightboxClose   = document.getElementById('lightboxClose');
  const lightboxContent = document.getElementById('lightboxContent');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img || item.classList.contains('gallery-fallback')) return;
      lightboxContent.innerHTML = `<img src="${img.src}" alt="${img.alt}" />`;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ===== SCROLL REVEAL ===== */
  const revealEls = document.querySelectorAll(
    '.product-card, .about-feat, .contact-card, .feature-item, .brand-chip, .gallery-item, .testimonial-card'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* ===== SCROLL TO TOP ===== */
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ===== SMOOTH SCROLL for anchor links ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
      }
    });
  });

  /* ===== CONTACT FORM — Formspree AJAX (no redirect) ===== */
  const contactForm = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('formSubmitBtn');
  const formSuccess = document.getElementById('formSuccess');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> იგზავნება...';
    submitBtn.disabled = true;
    formSuccess.classList.remove('show');

    try {
      const res = await fetch('https://formspree.io/f/mvzvvldg', {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> გაიგზავნა!';
        submitBtn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
        formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          formSuccess.classList.remove('show');
        }, 5000);
      } else {
        throw new Error('server error');
      }
    } catch {
      submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> შეცდომა';
      submitBtn.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
      alert('შეცდომა! გთხოვ სცადე ხელახლა ან დარეკე: 555 974 974');
      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    }
  });

  /* ===== PARALLAX SHAPES ===== */
  const shapes = document.querySelectorAll('.shape');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    shapes.forEach((s, i) => { s.style.transform = `translateY(${sy * (i + 1) * 0.07}px)`; });
  });

  /* ===== TILT on product cards ===== */
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -10;
      card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ===== BRANDS pause on hover ===== */
  const brandsTrack = document.getElementById('brandsTrack');
  if (brandsTrack) {
    brandsTrack.addEventListener('mouseenter', () => brandsTrack.style.animationPlayState = 'paused');
    brandsTrack.addEventListener('mouseleave', () => brandsTrack.style.animationPlayState = 'running');
  }

  /* ===== HERO image: show emoji fallback if image missing ===== */
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    heroImg.addEventListener('error', () => {
      heroImg.parentElement.classList.add('hero-img-fallback');
    });
    // if already broken (cached fail)
    if (!heroImg.complete || heroImg.naturalWidth === 0) {
      heroImg.parentElement.classList.add('hero-img-fallback');
    }
  }

  console.log('%c🐾 Animall Pet Store', 'color:#f97316;font-size:22px;font-weight:bold;');
  console.log('%cYour furry friends deserve the best!', 'color:#f59e0b;font-size:14px;');

});