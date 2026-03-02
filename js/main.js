/* ============================================
   WARUNG KOPI SUNAGO - main.js
   Handles: cursor, nav, scroll, menu filter, gallery
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* === CURSOR === */
  const cursor    = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  if (cursor && cursorRing) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.transform     = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
      setTimeout(() => {
        cursorRing.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
      }, 80);
    });

    const hoverTargets = document.querySelectorAll('a, button, .menu-card, .gallery-item, .testi-card, .filter-btn');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('expand'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('expand'));
    });
  }

  /* === NAVBAR SCROLL === */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
    // Scroll top button
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }
  });

  /* === SCROLL TO TOP === */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* === MOBILE MENU === */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* === MENU FILTER === */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards  = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      menuCards.forEach(card => {
        const match = cat === 'semua' || card.dataset.cat === cat;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  /* === SCROLL REVEAL === */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* === GALLERY LIGHTBOX (simple) === */
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const label = item.querySelector('.gallery-overlay span')?.textContent || 'Gallery';
      const emoji = item.querySelector('.gal-emoji')?.textContent || '☕';
      showToast(`${emoji} ${label}`);
    });
  });

  /* === TOAST NOTIFICATION === */
  window.showToast = function(message, duration = 2500) {
    let toast = document.querySelector('.sunago-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'sunago-toast';
      toast.style.cssText = `
        position: fixed; bottom: 5rem; left: 50%; transform: translateX(-50%) translateY(20px);
        background: linear-gradient(135deg, #5c3317, #2c1a0e);
        border: 1px solid rgba(212,168,83,0.3);
        color: #f5ede0; padding: 0.7rem 1.5rem;
        font-family: 'Syne', sans-serif; font-size: 0.8rem;
        border-radius: 50px; z-index: 9999;
        box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        transition: all 0.3s; opacity: 0;
        white-space: nowrap;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, duration);
  };

  /* === ACTIVE NAV LINK ON SCROLL === */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.opacity = link.getAttribute('href') === `#${entry.target.id}` ? '1' : '0.7';
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.style.color = 'var(--gold)';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => sectionObserver.observe(s));

});
