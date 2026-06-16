document.getElementById('year').textContent = new Date().getFullYear();

const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => navLinks.classList.remove('open'))
);

const revealEls = document.querySelectorAll(
  '.service-card, .sol-card, .valor-card, .mv-card, .wallet-card, .wallet-text, .contacto-form'
);
revealEls.forEach((el) => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));

const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = form.nombre.value.trim();
  const email = form.email.value.trim();
  if (!nombre || !email) {
    formMsg.style.color = '#EF4444';
    formMsg.textContent = 'Por favor completa tu nombre y correo.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formMsg.style.color = '#EF4444';
    formMsg.textContent = 'Ingresa un correo válido.';
    return;
  }
  formMsg.style.color = '#10B981';
  formMsg.textContent = '¡Gracias! Un asesor te contactará pronto.';
  form.reset();
});
