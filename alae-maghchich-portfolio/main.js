/**
 * main.js
 * Portfolio interactivity: typing animation, scroll reveals,
 * infinite skill strip, project modals, custom cursor
 */

/* ═══════════════════════════════════════════════════════════════════
   TYPING ANIMATION
═══════════════════════════════════════════════════════════════════ */

const TypingEffect = (() => {
  const lines = [
    "I craft immersive digital experiences.",
    "I turn ideas into interactive realities.",
    "I build worlds — one pixel at a time."
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let el;

  function tick() {
    const current = lines[lineIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 2000);
        return;
      }
      setTimeout(tick, 55);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 28);
    }
  }

  function init() {
    el = document.getElementById('typing-text');
    if (el) setTimeout(tick, 1000);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════════════════════ */
const ScrollReveal = (() => {
  function init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
  return { init };
})();


/* ═══════════════════════════════════════════════════════════════════
   INFINITE SKILL STRIP
═══════════════════════════════════════════════════════════════════ */
const SkillStrip = (() => {
  function init() {
    const track = document.querySelector('.skills-track');
    if (!track) return;

    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.parentNode.appendChild(clone);
  }
  return { init };
})();


/* ═══════════════════════════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════════════════════════ */
const CustomCursor = (() => {
  let cursor, follower;
  let mx = -100, my = -100;
  let fx = -100, fy = -100;

  function init() {
    cursor   = document.getElementById('cursor-dot');
    follower = document.getElementById('cursor-ring');
    if (!cursor || !follower) return;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    });

    document.querySelectorAll('a, button, .project-card, .skill-item').forEach(el => {
      el.addEventListener('mouseenter', () => follower.classList.add('expanded'));
      el.addEventListener('mouseleave', () => follower.classList.remove('expanded'));
    });

    animateFollower();
  }

  function animateFollower() {
    fx += (mx - fx) * 0.1;
    fy += (my - fy) * 0.1;
    follower.style.transform = `translate(${fx - 18}px, ${fy - 18}px)`;
    requestAnimationFrame(animateFollower);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════════
   NAV ACTIVE STATE
═══════════════════════════════════════════════════════════════════ */
const NavHighlight = (() => {
  function init() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const nav = document.getElementById('main-nav');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          const match = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
          if (match) match.classList.add('active');
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));

    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }
  return { init };
})();


/* ═══════════════════════════════════════════════════════════════════
   PROJECT MODAL
═══════════════════════════════════════════════════════════════════ */
const ProjectModal = (() => {
  const projects = [
    {
      id: 1,
      title: "solicode blog design",
      description: "A real-time messaging platform with end-to-end encryption and cosmic UI.",
      full: "SoliCode is a Tangier-based digital solidarity center dedicated to empowering local talent. We provide intensive technical training and professional coaching to help youth integrate into the modern job market. By partnering with global industry leaders, we turn passion for technology into sustainable career paths.",
      tech: ["FIGMA"],
      preview: "linear-gradient(135deg, #0d1f5c, #3a0f6e)",
      image: "img/Capture d’écran 2026-04-28 152247.png",
      links: { live: "https://www.figma.com/site/dl3mzgfZZExppTnHh0eqRc/Untitled?node-id=1-1549&t=ka0hrTEyyY3ZMOm1-0", github: "#" }
    },
    {
      id: 2,
      title: "Dynamic Product Catalog",
      description: "A responsive e-commerce storefront featuring real-time API integration, smart filtering, and a sleek dark-mode UI for modern retail.",
      full: "A responsive e-commerce storefront featuring real-time API integration, smart filtering, and a sleek dark-mode UI for modern retail.",
      tech: ["HTML", "CSS", "JAVA SCRIPT"],
      preview: "linear-gradient(135deg, #0f4a6e, #0a2a3e)",
      image: "img/catalog.png",
      links: { live: "mini-project-api/cataloge de produit via api", github: "https://github.com/alaemaghchich/mini-project-api/tree/f09622489eba07830cb598f90df39b8c6041a85b/cataloge%20de%20produit%20via%20api" }
    },
    {
      id: 3,
      title: "The Cursed Library",
      description: "A haunted digital archive of forbidden knowledge, featuring a Grimdark UI and spectral tracking for artifacts that shouldn't exist.",
      full: "Grimoire is a conceptual inventory management system designed with a dark, occult aesthetic. Moving away from traditional e-commerce, this interface is built for collectors of the supernatural, RPG players, or fans of Gothic horror who need a place to catalog their cursed digital assets.",
      tech: ["Figma", "CSS", "JavaScript", "HTML5"],
      preview: "linear-gradient(135deg, #2a0a3e, #6e0f3a)",
      image: "img/library.png",
      links: { live: "library/index.html", github: "https://github.com/alaemaghchich/library.git" }
    },
    {
      id: 4,
      title: "Recipes List crud",
      description: "Productivity & habit tracker with offline-first PWA architecture.",
      full: "VoidTrack is a minimalist productivity app that works entirely offline. Built as a PWA, it syncs when online and uses IndexedDB for local persistence. Dark-only interface designed to reduce eye strain during deep work sessions.",
      tech: ["PHP", "MYSQL", "CSS3", "HTML5", "BOOTSTRAP"],
      preview: "linear-gradient(135deg, #001a0a, #0a3020)",
      image: "img/crud.png",
      links: { live: "#", github: "https://github.com/alaemaghchich/php/tree/0beed1fabe48f2cca8187d5c7bfbd247af78c2cf/pdo/V2/realisation_V2" }
    },
    {
      id: 5,
      title: "meteo app",
      description: "A minimalist, real-time weather application featuring a sleek glassmorphism design and dynamic background synchronization.",
      full: "Meteo is a modern weather tracking interface that blends functional data with high-end UI aesthetics. Built with a focus on transparency and clarity, the app provides users with instant atmospheric insights through a beautiful Glassmorphism card overlay that sits naturally atop an immersive, nature-inspired environment.",
      tech: ["HTML", "CSS3", "JavaScript", "API"],
      preview: "linear-gradient(135deg, #1a0a00, #3a2000)",
      image: "img/meteo.png",
      links: { live: "mini-project-api/prototype meteo", github: "https://github.com/alaemaghchich/mini-project-api/tree/f09622489eba07830cb598f90df39b8c6041a85b/prototype%20meteo" }
    },
    {
      id: 6,
      title: "Consultations List",
      description: "A sleek, full-stack management interface designed for healthcare providers to track patient vitals, manage consultation lists, and receive real-time diagnostic alerts based on clinical data.",
      full: "Consultations List is a dynamic web application built to streamline the patient intake process. It focuses on data accuracy and immediate clinical feedback, allowing medical staff to monitor health metrics through a clean, intuitive UI.",
      tech: ["PHP"],
      preview: "linear-gradient(135deg, #000820, #0d1f5c)",
      image: "img/ConsultationsList.png",
      links: { live: "#", github: "https://github.com/alaemaghchich/php/tree/0beed1fabe48f2cca8187d5c7bfbd247af78c2cf/Bases%20et%20logique%20PHP/prototype%20%26%20realissation/rezalisation%202" }
    }
  ];

  let overlay, modal;

  function open(id) {
    const p = projects.find(x => x.id === id);
    if (!p) return;

    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('visible'), 10);

    const previewEl = modal.querySelector('.modal-preview');
    const previewImg = modal.querySelector('.modal-preview-image');

    previewEl.style.background = p.preview;
    previewImg.src = p.image || '';
    previewImg.alt = `${p.title} screenshot`;
    previewImg.style.display = p.image ? 'block' : 'none';

    modal.querySelector('.modal-title').textContent = p.title;
    modal.querySelector('.modal-desc').textContent = p.full;
    modal.querySelector('.modal-tech').innerHTML =
      p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
    modal.querySelector('.modal-live').href   = p.links.live;
    modal.querySelector('.modal-github').href = p.links.github;
  }

  function close() {
    overlay.classList.remove('visible');
    setTimeout(() => { overlay.style.display = 'none'; }, 350);
  }

  function init() {
    overlay = document.getElementById('modal-overlay');
    modal   = document.getElementById('project-modal');

    document.querySelectorAll('.project-card').forEach(card => {
      const project = projects.find(x => x.id === +card.dataset.id);
      const img = card.querySelector('.project-preview-img');
      const preview = card.querySelector('.project-preview');

      if (project) {
        if (img) {
          img.src = project.image;
          img.alt = `${project.title} preview`;
        }
        if (preview) {
          preview.style.background = project.preview;
        }
      }

      card.addEventListener('click', () => open(+card.dataset.id));
    });

    overlay.addEventListener('click', e => {
      if (e.target === overlay) close();
    });

    document.getElementById('modal-close').addEventListener('click', close);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════════════════════════════ */
const MobileMenu = (() => {
  function init() {
    const toggle    = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    toggle?.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      toggle.classList.toggle('active');
    });

    mobileNav?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }
  return { init };
})();


/* ═══════════════════════════════════════════════════════════════════
   GLOWING ORB INTERACTION (Hero element)
═══════════════════════════════════════════════════════════════════ */
const GlowOrb = (() => {
  function init() {
    const orb = document.querySelector('.hero-orb');
    if (!orb) return;

    document.addEventListener('mousemove', e => {
      const rx = (e.clientY / window.innerHeight - 0.5) * 20;
      const ry = (e.clientX / window.innerWidth  - 0.5) * 20;
      orb.style.transform = `rotateX(${-rx}deg) rotateY(${ry}deg) scale(1)`;
    });
  }
  return { init };
})();


/* ═══════════════════════════════════════════════════════════════════
   CONTACT FORM HANDLER
   ✔ FIX 1 — كل المتغيرات داخل init() بدل برا
   ✔ FIX 2 — fetch يرسل لـ '/' (Netlify) مع URLSearchParams
   ✔ FIX 3 — Content-Type صحيح لـ Netlify Forms
═══════════════════════════════════════════════════════════════════ */
const ContactForm = (() => {

  const fieldRules = {
    name: {
      validate: (val) => val.trim().length >= 2,
      error: 'Name must be at least 2 characters'
    },
    email: {
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      error: 'Please enter a valid email'
    },
    subject: {
      validate: (val) => val.trim().length >= 5,
      error: 'Subject must be at least 5 characters'
    },
    message: {
      validate: (val) => val.trim().length >= 10,
      error: 'Message must be at least 10 characters'
    }
  };

  function validateField(fieldName) {
    const field   = document.getElementById(fieldName);
    const errorEl = document.getElementById(`${fieldName}-error`);
    if (!field || !errorEl) return true;

    const isValid = fieldRules[fieldName].validate(field.value);
    errorEl.textContent = isValid ? '' : fieldRules[fieldName].error;
    return isValid;
  }

  function validateForm() {
    return Object.keys(fieldRules).every(f => validateField(f));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    // ✔ FIX: grab elements here, inside the function, after DOM is ready
    const form       = document.getElementById('contact-form');
    const submitBtn  = document.getElementById('submit-btn');
    const successMsg = document.getElementById('success-message');

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending...';

    // ✔ FIX: URLSearchParams for Netlify + correct Content-Type
    fetch('/', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams(new FormData(form)).toString()
    })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');

      form.reset();
      successMsg.style.color   = '';
      successMsg.textContent   = "✓ Message sent successfully! I'll get back to you soon.";
      successMsg.classList.add('show');
      submitBtn.disabled       = false;
      submitBtn.textContent    = 'Send Message';

      setTimeout(() => {
        successMsg.classList.remove('show');
        successMsg.textContent = '';
      }, 5000);
    })
    .catch(err => {
      console.error('Form error:', err);
      submitBtn.disabled       = false;
      submitBtn.textContent    = 'Send Message';
      successMsg.style.color   = '#ff5af0';
      successMsg.textContent   = '✗ Something went wrong. Please try again.';
      successMsg.classList.add('show');
    });
  }

  function init() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Real-time validation
    Object.keys(fieldRules).forEach(fieldName => {
      const field = document.getElementById(fieldName);
      if (!field) return;

      field.addEventListener('blur', () => validateField(fieldName));
      field.addEventListener('input', () => {
        const errorEl = document.getElementById(`${fieldName}-error`);
        if (errorEl && errorEl.textContent) validateField(fieldName);
      });
    });

    form.addEventListener('submit', handleSubmit);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  ThreeScene.init();
  TypingEffect.init();
  ScrollReveal.init();
  SkillStrip.init();
  CustomCursor.init();
  NavHighlight.init();
  ProjectModal.init();
  MobileMenu.init();
  GlowOrb.init();
  ContactForm.init();

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});