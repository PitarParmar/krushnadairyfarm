/* Final site JS:
 - mobile menu open/close
 - sticky header class
 - reveal animations
 - hero parallax
 - smooth anchor scroll + scroll-spy active nav highlighting
 - form validation (name & phone) + toast
*/

(() => {
  // Elements
  const header = document.getElementById('siteHeader');
  const mobileButton = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const toast = document.getElementById('toast');

  // Sections for scroll-spy
  const sections = {
    home: document.getElementById('home'),
    products: document.getElementById('products'),
    story: document.getElementById('story'),
    contact: document.getElementById('contact')
  };

  // --- Mobile menu ---
  mobileButton.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden','false');
    mobileButton.setAttribute('aria-expanded','true');
    setTimeout(()=>mobileClose.focus(), 120);
  });

  mobileClose.addEventListener('click', closeMobileMenu);
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMobileMenu();
  });
  mobileLinks.forEach(l => l.addEventListener('click', () => {
    setTimeout(closeMobileMenu, 80);
  }));
  function closeMobileMenu(){
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden','true');
    mobileButton.setAttribute('aria-expanded','false');
    mobileButton.focus();
  }

  // --- Sticky header and hero parallax ---
  function onScroll() {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    // hero parallax
    const heroLayer1 = document.querySelector('.hero-layer.layer-1');
    const heroLayer2 = document.querySelector('.hero-layer.layer-2');
    if (heroLayer1) {
      const s = Math.min(window.scrollY, 260);
      heroLayer1.style.transform = `translateY(${s * 0.12}px) scale(1.01)`;
      if (heroLayer2) heroLayer2.style.transform = `translateY(${s * 0.06 + 20}px) scale(1.02)`;
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // --- Reveal animations (IntersectionObserver) ---
  const revealItems = document.querySelectorAll('.reveal, .product-card, .feature-card, .hero-card, .story-image');
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((el, i) => { el.style.transitionDelay = `${i * 60}ms`; obs.observe(el); });

  // --- Smooth scroll fallback and scroll-spy ---
  function scrollToElement(el) {
    const offset = 78; // header height
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // attach to nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if (href.length > 1 && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          scrollToElement(target);
        }
      }
    });
  });

  // Scroll-spy using IntersectionObserver for section visibility
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      if (entry.isIntersecting) {
        highlightNav(id);
      }
    });
  }, { threshold: 0.45 });

  Object.values(sections).forEach(sec => { if (sec) sectionObserver.observe(sec); });

  function highlightNav(activeId) {
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${activeId}`));
    mobileLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${activeId}`));
  }

  // ensure Home is active by default
  highlightNav('home');

  // --- Form validation (name & phone) + toast ---
  const form = document.getElementById('contactForm');
  const nameField = document.getElementById('name');
  const phoneField = document.getElementById('phone');
  const errorName = document.getElementById('error-name');
  const errorPhone = document.getElementById('error-phone');

  function validateName(){
    const v = nameField.value.trim();
    if (v.length < 2) { errorName.textContent = 'Please enter your name (min 2 characters).'; return false; }
    errorName.textContent = ''; return true;
  }
  function validatePhone(){
    const v = phoneField.value.trim();
    const pat = /^[0-9\s\-\+]{10,15}$/;
    if (!pat.test(v)) { errorPhone.textContent = 'Enter a valid phone number (10+ digits).'; return false; }
    errorPhone.textContent = ''; return true;
  }

  nameField.addEventListener('input', validateName);
  phoneField.addEventListener('input', validatePhone);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const okName = validateName();
    const okPhone = validatePhone();
    if (!okName || !okPhone) {
      showToast('Please fix the errors in the form.');
      return;
    }
    // Stub: in production, send to server here
    form.reset();
    showToast('Thanks! We received your message. We will contact you soon.');
  });

  // --- Toast helper ---
  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'), 3600);
  }

  // Accessibility: close menu with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileMenu.classList.contains('open')) closeMobileMenu();
    }
  });

  // close mobile menu fn for reuse
  function closeMobileMenu(){
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden','true');
    mobileButton.setAttribute('aria-expanded','false');
    mobileButton.focus();
  }

})();
