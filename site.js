// Shared interactions for the static FI/EN pTakeoff pages.
const API_BASE = 'https://project-qax4f.vercel.app';
const language = document.documentElement.lang === 'en' ? 'en' : 'fi';
const tr = (fi, en) => language === 'fi' ? fi : en;

const menuButton = document.querySelector('.menu-button');
const mobileNav = document.getElementById('mobile-nav');
if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', tr(open ? 'Avaa valikko' : 'Sulje valikko', open ? 'Open menu' : 'Close menu'));
    mobileNav.hidden = open;
  });
  mobileNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      mobileNav.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !mobileNav.hidden) {
      mobileNav.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', tr('Avaa valikko', 'Open menu'));
      menuButton.focus();
    }
  });
}

function result(element, kind, message) {
  element.className = 'form-result ' + kind;
  element.textContent = message;
}

async function postForm(path, body) {
  const response = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  const data = await response.json();
  if (!data.success) throw new Error('API response was not successful');
  return data;
}

const betaForm = document.getElementById('beta-form');
if (betaForm) {
  const requestedProduct = new URLSearchParams(window.location.search).get('product');
  if (['pquant', 'pfield', 'psite'].includes(requestedProduct)) {
    document.getElementById('beta-product').value = requestedProduct;
  }
  betaForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const output = document.getElementById('beta-result');
    const button = betaForm.querySelector('button[type="submit"]');
    const product = document.getElementById('beta-product').value;
    const input = document.getElementById('beta-email');
    const email = input.value.trim().toLowerCase();
    const company = document.getElementById('beta-company').value;
    result(output, '', '');
    input.removeAttribute('aria-invalid');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.setAttribute('aria-invalid', 'true');
      result(output, 'error', tr('Syötä toimiva sähköpostiosoite.', 'Enter a valid email address.'));
      input.focus();
      return;
    }
    // pQuant keeps the existing beta registry and notification route.
    // The other products go through the existing contact route, which
    // notifies the owner for each accepted message.
    button.disabled = true;
    try {
      if (product === 'pquant') {
        const response = await postForm('/api/request-beta', {
          email, language, source: 'takeoff-website-beta-form', company
        });
        result(output, 'success', response.alreadySignedUp
          ? tr('Osoite on jo beta-rekisterissä. Uutta ilmoitusta ei lähetetty.', 'This address is already in the beta registry. No new notification was sent.')
          : tr('Beta-pyyntö tallennettu. Kiitos!', 'Beta request saved. Thank you!'));
      } else {
        await postForm('/api/contact', {
          type: 'question',
          message: product === 'pfield' ? 'PField beta access request' : 'PSite testing interest',
          replyTo: email,
          language,
          source: 'ptakeoff-product-beta-form',
          page: window.location.href,
          userAgent: navigator.userAgent,
          company
        });
        result(output, 'success', tr('Pyyntö lähetetty. Kiitos!', 'Request sent. Thank you!'));
      }
      betaForm.reset();
    } catch (error) {
      console.error('Beta request failed:', error);
      result(output, 'error', tr('Pyyntöä ei voitu lähettää. Yritä hetken kuluttua uudelleen.', 'The request could not be sent. Please try again shortly.'));
    } finally {
      button.disabled = false;
    }
  });
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const typeInput = document.getElementById('contact-type');
  const replyInput = document.getElementById('contact-reply');
  const requirement = document.getElementById('reply-requirement');
  function updateRequirement() {
    const required = typeInput.value !== 'bug';
    replyInput.required = required;
    replyInput.setAttribute('aria-required', String(required));
    requirement.textContent = required
      ? tr('(pakollinen)', '(required)')
      : tr('(valinnainen virheraportissa)', '(optional for bug reports)');
  }
  typeInput.addEventListener('change', updateRequirement);
  updateRequirement();
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const output = document.getElementById('contact-result');
    const button = contactForm.querySelector('button[type="submit"]');
    const product = document.getElementById('contact-product').value;
    const replyTo = replyInput.value.trim();
    const messageInput = document.getElementById('contact-message');
    const message = messageInput.value.trim();
    const company = document.getElementById('contact-company').value;
    result(output, '', '');
    replyInput.removeAttribute('aria-invalid');
    messageInput.removeAttribute('aria-invalid');
    if (!message) {
      messageInput.setAttribute('aria-invalid', 'true');
      result(output, 'error', tr('Kirjoita viesti.', 'Write a message.'));
      messageInput.focus();
      return;
    }
    if (replyInput.required && !replyTo) {
      replyInput.setAttribute('aria-invalid', 'true');
      result(output, 'error', tr('Lisää yhteystieto, jotta voimme vastata.', 'Add contact details so we can reply.'));
      replyInput.focus();
      return;
    }
    button.disabled = true;
    try {
      await postForm('/api/contact', {
        type: typeInput.value,
        message: '[' + product + '] ' + message,
        replyTo,
        language,
        source: 'takeoff-website-contact-form',
        page: window.location.href,
        userAgent: navigator.userAgent,
        company
      });
      result(output, 'success', tr('Viesti lähetetty. Kiitos!', 'Message sent. Thank you!'));
      contactForm.reset();
      updateRequirement();
    } catch (error) {
      console.error('Contact request failed:', error);
      result(output, 'error', tr('Viestiä ei voitu lähettää. Yritä hetken kuluttua uudelleen.', 'The message could not be sent. Please try again shortly.'));
    } finally {
      button.disabled = false;
    }
  });
}
