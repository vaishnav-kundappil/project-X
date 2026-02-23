/**
 * Nexus IT Solutions - Main JavaScript
 * Handles: sticky nav, mobile menu, smooth scroll, scroll animations,
 * FAQ accordion, testimonial slider, animated counters, form UI.
 */

(function () {
  'use strict';

  // ---------- DOM refs ----------
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const contactForm = document.getElementById('contact-form');
  const newsletterForm = document.getElementById('newsletter-form');

  /**
   * Sticky header: add/remove 'scrolled' class on scroll
   */
  function initStickyHeader() {
    if (!header) return;
    function onScroll() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /**
   * Mobile menu toggle
   */
  function initMobileMenu() {
    if (!navToggle || !navMenu) return;
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /**
   * Smooth scroll for anchor links (same page)
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /**
   * Fade-in on scroll: add .visible when element enters viewport
   */
  function initScrollAnimations() {
    const fadeEls = document.querySelectorAll('.fade-in');
    if (!fadeEls.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /**
   * FAQ accordion: one open at a time, toggle on question click
   */
  function initFaqAccordion() {
    const items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    items.forEach(function (item) {
      const question = item.querySelector('.faq__question');
      const answer = item.querySelector('.faq__answer');
      if (!question || !answer) return;

      question.addEventListener('click', function () {
        const isOpen = item.classList.contains('active');
        items.forEach(function (other) {
          other.classList.remove('active');
          const q = other.querySelector('.faq__question');
          const a = other.querySelector('.faq__answer');
          if (q) q.setAttribute('aria-expanded', 'false');
          if (a) a.style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /**
   * Testimonial slider: rotate slides, update dots and prev/next
   */
  function initTestimonialSlider() {
    const track = document.querySelector('.testimonial-slider__track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.testimonial-slider__dots');
    const btnPrev = document.querySelector('.testimonial-slider__btn--prev');
    const btnNext = document.querySelector('.testimonial-slider__btn--next');

    if (!track || !slides.length) return;

    let currentIndex = 0;
    const total = slides.length;

    function showSlide(index) {
      currentIndex = (index + total) % total;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('testimonial-slide--active', i === currentIndex);
      });
      const dots = document.querySelectorAll('.testimonial-slider__dot');
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    if (dotsContainer) {
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'testimonial-slider__dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        dot.addEventListener('click', function () {
          showSlide(i);
        });
        dotsContainer.appendChild(dot);
      }
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', function () {
        showSlide(currentIndex - 1);
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', function () {
        showSlide(currentIndex + 1);
      });
    }

    showSlide(0);
  }

  /**
   * Animated counters: count up when element is in view
   */
  function initCounters() {
    const counters = document.querySelectorAll('.counter[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffixEl = el.querySelector('.counter__suffix');
          const suffix = suffixEl ? suffixEl.textContent : '';
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;

          function update() {
            current += step;
            if (current >= target) {
              current = target;
              const valueEl = el.querySelector('.counter__value');
              if (valueEl) valueEl.textContent = Math.round(current);
              return;
            }
            const valueEl = el.querySelector('.counter__value');
            if (valueEl) valueEl.textContent = Math.round(current);
            requestAnimationFrame(update);
          }
          update();
          observer.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.2 }
    );

    counters.forEach(function (c) {
      observer.observe(c);
    });
  }

  /**
   * Contact form: prevent submit, show success message (no backend)
   */
  function initContactForm() {
    if (!contactForm) return;
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');
      let valid = true;
      [name, email, message].forEach(function (field) {
        if (field && field.hasAttribute('required') && !field.value.trim()) {
          valid = false;
          field.style.borderColor = '#c53030';
        } else if (field) {
          field.style.borderColor = '';
        }
      });
      if (!valid) return;
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn ? btn.textContent : 'Send';
      if (btn) btn.textContent = 'Sending...';
      setTimeout(function () {
        if (btn) btn.textContent = 'Message Sent!';
        contactForm.reset();
        setTimeout(function () {
          if (btn) btn.textContent = originalText;
        }, 3000);
      }, 600);
    });
  }

  /**
   * Newsletter form: prevent submit, show feedback
   */
  function initNewsletterForm() {
    if (!newsletterForm) return;
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const btn = newsletterForm.querySelector('button[type="submit"]');
      if (!input || !btn) return;
      const originalText = btn.textContent;
      btn.textContent = 'Subscribed!';
      input.value = '';
      setTimeout(function () {
        btn.textContent = originalText;
      }, 2500);
    });
  }

  /**
   * Footer year
   */
  function setFooterYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ---------- Init on DOM ready ----------
  function init() {
    initStickyHeader();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initFaqAccordion();
    initTestimonialSlider();
    initCounters();
    initContactForm();
    initNewsletterForm();
    setFooterYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
