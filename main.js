/* ═══════════════════════════════════════════
   SMY ESTATE — main.js
   ═══════════════════════════════════════════ */

// ── LOAD HEADER & FOOTER PARTIALS ──
async function loadPartial(id, file) {
    try {
      const res  = await fetch(file);
      const html = await res.text();
      document.getElementById(id).innerHTML = html;
    } catch (e) {
      console.warn('Partial konnte nicht geladen werden:', file);
    }
  }
  
  async function init() {
    await loadPartial('header-placeholder', 'header.html');
    await loadPartial('footer-placeholder', 'footer.html');
    initBurger();
    initModal();
    initSlider();
    initSmoothScroll();
  }
  
  // ── BURGER MENU ──
  function initBurger() {
    const burger    = document.getElementById('burger');
    const mobileNav = document.getElementById('mobileNav');
    if (!burger || !mobileNav) return;
  
    burger.addEventListener('click', toggleMenu);
  
    document.querySelectorAll('.mobile-nav a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  
    function toggleMenu() {
      const isOpen = mobileNav.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  
    function closeMenu() {
      mobileNav.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }
  
    window.closeMenu = closeMenu;
  }
  
  // ── MODAL ──
  function initModal() {
    document.addEventListener('click', (e) => {
      const overlay = document.getElementById('overlay');
      if (overlay && e.target === overlay) closeOverlay();
    });
  
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeOverlay();
        if (window.closeMenu) window.closeMenu();
      }
    });
  }
  
  function openModal() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.classList.add('on');
      document.body.style.overflow = 'hidden';
    }
  }
  
  function closeOverlay() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.classList.remove('on');
      document.body.style.overflow = '';
    }
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn  = form.querySelector('.fsubmit');
    btn.textContent = 'Wird gesendet...';
    btn.disabled = true;
  
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        btn.textContent = '✓ Anfrage gesendet!';
        setTimeout(() => { closeOverlay(); form.reset(); btn.textContent = 'Jetzt kostenlosen Termin anfragen'; btn.disabled = false; }, 2000);
      } else {
        btn.textContent = 'Fehler – bitte erneut versuchen';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Fehler – bitte erneut versuchen';
      btn.disabled = false;
    }
  }
  
  window.openModal    = openModal;
  window.closeOverlay = closeOverlay;
  window.handleSubmit = handleSubmit;
  
  // ── SLIDER ──
  function initSlider() {
    let autoSlide = 1;
    let slideTimer = setInterval(() => {
      autoSlide = autoSlide >= 4 ? 1 : autoSlide + 1;
      switchSlide(autoSlide);
    }, 3500);
  
    document.querySelectorAll('.mitem').forEach(item => {
      item.addEventListener('click', () => clearInterval(slideTimer));
    });
  }
  
  function switchSlide(n) {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.mitem').forEach(m => m.classList.remove('active'));
    const slide = document.getElementById('slide' + n);
    const item  = document.querySelector('[data-slide="' + n + '"]');
    if (slide) slide.classList.add('active');
    if (item)  item.classList.add('active');
  }
  
  window.switchSlide = switchSlide;
  
  // ── SMOOTH SCROLL ──
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 66;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  }
  
  // ── START ──
  document.addEventListener('DOMContentLoaded', init);