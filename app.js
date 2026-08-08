const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const loader = $(".page-loader");
const nav = $(".site-nav");
const menuToggle = $(".menu-toggle");

window.addEventListener("load", () => {
  window.setTimeout(() => loader?.classList.add("is-hidden"), 0);
});

function syncNav() {
  nav?.classList.toggle("is-scrolled", window.scrollY > 30);
}

syncNav();
window.addEventListener("scroll", syncNav, { passive: true });

menuToggle?.addEventListener("click", () => {
  const next = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(next));
  document.body.classList.toggle("menu-open", next);
});

$$('.nav-links a, a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });

$$('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
  revealObserver.observe(element);
});

const trackedSections = ['about', 'services', 'programs', 'pricing', 'testimonials', 'faq'];
const navSectionObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  $$('.nav-links a').forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`));
}, { rootMargin: '-30% 0px -55% 0px', threshold: [0, .1, .5] });
trackedSections.forEach((id) => {
  const section = document.getElementById(id);
  if (section) navSectionObserver.observe(section);
});

const serviceCards = $$('.service-card');
const serviceObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      serviceCards.forEach((card) => card.classList.toggle('is-active', card === entry.target));
    }
  });
}, { rootMargin: '-37% 0px -42% 0px', threshold: 0 });
serviceCards.forEach((card) => serviceObserver.observe(card));

const processCards = $$('.process-card');
const processObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      processCards.forEach((card) => card.classList.toggle('is-bright', card === entry.target));
    }
  });
}, { rootMargin: '-35% 0px -40% 0px', threshold: 0 });
processCards.forEach((card) => processObserver.observe(card));

$$('.billing-toggle button').forEach((button) => {
  button.addEventListener('click', () => {
    const period = button.dataset.period;
    $$('.billing-toggle button').forEach((item) => item.classList.toggle('active', item === button));
    $$('.price [data-monthly]').forEach((element) => {
      element.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-8px)' }], { duration: 150, fill: 'forwards' }).finished.then(() => {
        element.textContent = element.dataset[period];
        element.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220, fill: 'forwards' });
      });
    });
  });
});

const testimonials = $$('.testimonial-card');
let currentTestimonial = 0;
let testimonialTimer;

function showTestimonial(index) {
  currentTestimonial = (index + testimonials.length) % testimonials.length;
  testimonials.forEach((card, cardIndex) => card.classList.toggle('is-current', cardIndex === currentTestimonial));
  $$('.testimonial-dots button').forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === currentTestimonial));
}

function restartTestimonials() {
  window.clearInterval(testimonialTimer);
  testimonialTimer = window.setInterval(() => showTestimonial(currentTestimonial + 1), 6500);
}

$$('.carousel-controls button').forEach((button) => {
  button.addEventListener('click', () => {
    showTestimonial(currentTestimonial + Number(button.dataset.direction));
    restartTestimonials();
  });
});
$$('.testimonial-dots button').forEach((button) => {
  button.addEventListener('click', () => {
    showTestimonial(Number(button.dataset.slide));
    restartTestimonials();
  });
});
restartTestimonials();

$$('.accordion article').forEach((item) => {
  const button = $('button', item);
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', () => {
    const opening = !item.classList.contains('open');
    $$('.accordion article').forEach((other) => {
      other.classList.remove('open');
      $('button', other).setAttribute('aria-expanded', 'false');
    });
    item.classList.toggle('open', opening);
    button.setAttribute('aria-expanded', String(opening));
  });
});

const contactForm = $('.contact-form');
if (contactForm instanceof HTMLFormElement) contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const submit = $('button[type="submit"]', contactForm);
  const success = $('.form-success', contactForm);
  submit.querySelector('span').textContent = 'MESSAGE SENT';
  submit.querySelector('i').textContent = '✓';
  success.classList.add('show');
  contactForm.reset();
});

const modal = $('.video-modal');
const closeModal = () => {
  modal?.classList.remove('is-open');
  modal?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};
$$('.video-trigger').forEach((button) => button.addEventListener('click', () => {
  modal?.classList.add('is-open');
  modal?.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}));
$('.video-modal > button')?.addEventListener('click', closeModal);
$('.video-modal a')?.addEventListener('click', closeModal);
modal?.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
