// PQuant 2026 / Takeoff Website Script
let currentLang = 'fi';

/* ==========================================================================
   Configuration — Beta Request Notifications
   ========================================================================== */

// The beta form POSTs the email to the takeoff-license-api backend (Vercel),
// which stores it in Supabase and notifies the owner. No secrets live in this
// public file. apiBase is the Vercel production URL (verified via /api/health).
const BETA_CONFIG = {
  apiBase: 'https://project-qax4f.vercel.app'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initCookies();
  initLatestReleaseDownload();
  initMobileMenu();
});

/* ==========================================================================
   Mobile Menu Navigation
   ========================================================================== */

function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });

    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   GitHub Releases Fetcher (Dynamic Download Link)
   ========================================================================== */

function initLatestReleaseDownload() {
  const repo = 'Tompula86/takeoff-releases';
  const defaultFallbackUrl = `https://github.com/${repo}/releases`;
  
  // Collect all target download links robustly
  const downloadLinks = [];
  const heroBtn = document.getElementById('hero-download-btn');
  if (heroBtn) downloadLinks.push(heroBtn);
  
  const successBtns = document.querySelectorAll('.download-box a');
  successBtns.forEach(btn => downloadLinks.push(btn));
  
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.includes('ptakeoff.com/download') || (href.includes('github.com/') && href.includes('/releases'))) {
      if (!downloadLinks.includes(link)) {
        downloadLinks.push(link);
      }
    }
  });
  
  // Set fallback url first in case API fetch fails or is blocked by CORS
  downloadLinks.forEach(link => {
    link.href = defaultFallbackUrl;
  });
  
  fetch(`https://api.github.com/repos/${repo}/releases/latest`)
    .then(res => {
      if (!res.ok) throw new Error('GitHub API response not OK');
      return res.json();
    })
    .then(data => {
      if (data && data.assets && data.assets.length > 0) {
        // Find the .exe installer first, then .msi, or fallback to any asset
        const setupExe = data.assets.find(asset => asset.name.toLowerCase().endsWith('.exe'));
        const setupMsi = data.assets.find(asset => asset.name.toLowerCase().endsWith('.msi'));
        const activeAsset = setupExe || setupMsi || data.assets[0];
        
        const downloadUrl = activeAsset.browser_download_url;
        if (downloadUrl) {
          window.latestVersionTag = data.tag_name;
          downloadLinks.forEach(link => {
            link.href = downloadUrl;
            
            // Display the version tag on the hero download button
            if (link.id === 'hero-download-btn') {
              const originalText = currentLang === 'fi' ? 'Lataa ilmainen 30 päivän kokeilu' : 'Download free 30-day trial';
              const versionInfo = ` (${data.tag_name})`;
              link.innerText = `${originalText}${versionInfo}`;
            }
          });
          console.log(`Latest release asset loaded: ${downloadUrl}`);
        }
      }
    })
    .catch(err => {
      console.warn('Could not fetch latest release asset via GitHub API, using fallback: ', err);
      // Fallback is already set
    });
}


/* ==========================================================================
   Language Localization Engine
   ========================================================================== */

function initLanguage() {
  // 1. Check if user has a saved preference
  const savedLang = localStorage.getItem('takeoff_lang');
  
  if (savedLang && (savedLang === 'fi' || savedLang === 'en')) {
    currentLang = savedLang;
  } else {
    // 2. Auto-detect browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith('fi')) {
      currentLang = 'fi';
    } else {
      currentLang = 'en';
    }
  }
  
  // 3. Redirect to the correct language-specific page if needed
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1);
  
  if (currentLang === 'en') {
    if (filename === 'ohjeet.html') {
      window.location.href = 'docs.html';
      return;
    }
    if (filename === 'tietosuoja.html') {
      window.location.href = 'privacy.html';
      return;
    }
    if (filename === 'ehdot.html') {
      window.location.href = 'terms.html';
      return;
    }
    if (filename === 'evasteet.html') {
      window.location.href = 'cookies.html';
      return;
    }
  } else if (currentLang === 'fi') {
    if (filename === 'docs.html') {
      window.location.href = 'ohjeet.html';
      return;
    }
    if (filename === 'privacy.html') {
      window.location.href = 'tietosuoja.html';
      return;
    }
    if (filename === 'terms.html') {
      window.location.href = 'ehdot.html';
      return;
    }
    if (filename === 'cookies.html') {
      window.location.href = 'evasteet.html';
      return;
    }
  }
  
  setLanguage(currentLang);
}

function changeLanguage(lang) {
  if (lang !== 'fi' && lang !== 'en') return;
  currentLang = lang;
  localStorage.setItem('takeoff_lang', lang);
  
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1);
  
  if (lang === 'en') {
    if (filename === 'ohjeet.html') {
      window.location.href = 'docs.html';
      return;
    }
    if (filename === 'tietosuoja.html') {
      window.location.href = 'privacy.html';
      return;
    }
    if (filename === 'ehdot.html') {
      window.location.href = 'terms.html';
      return;
    }
    if (filename === 'evasteet.html') {
      window.location.href = 'cookies.html';
      return;
    }
  } else if (lang === 'fi') {
    if (filename === 'docs.html') {
      window.location.href = 'ohjeet.html';
      return;
    }
    if (filename === 'privacy.html') {
      window.location.href = 'tietosuoja.html';
      return;
    }
    if (filename === 'terms.html') {
      window.location.href = 'ehdot.html';
      return;
    }
    if (filename === 'cookies.html') {
      window.location.href = 'evasteet.html';
      return;
    }
  }
  
  setLanguage(lang);
}

function setLanguage(lang) {
  // Update HTML lang attribute
  document.documentElement.lang = lang;
  
  // Update language buttons active state
  const btnFi = document.getElementById('lang-btn-fi');
  const btnEn = document.getElementById('lang-btn-en');
  if (btnFi && btnEn) {
    if (lang === 'fi') {
      btnFi.classList.add('active');
      btnEn.classList.remove('active');
    } else {
      btnEn.classList.add('active');
      btnFi.classList.remove('active');
    }
  }

  // Update translatable elements
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (window.translations[lang] && window.translations[lang][key]) {
      let content = window.translations[lang][key];
      if (el.id === 'hero-download-btn' && window.latestVersionTag) {
        const originalText = lang === 'fi' ? 'Lataa ilmainen 30 päivän kokeilu' : 'Download free 30-day trial';
        content = `${originalText} (${window.latestVersionTag})`;
      }
      el.innerHTML = content;
    }
  });

  // Update translatable placeholders
  const inputs = document.querySelectorAll('[data-i18n-placeholder]');
  inputs.forEach(input => {
    const key = input.getAttribute('data-i18n-placeholder');
    if (window.translations[lang] && window.translations[lang][key]) {
      input.placeholder = window.translations[lang][key];
    }
  });

  // Dynamically update legal pages and documentation hrefs depending on language
  const privacyLink = document.getElementById('privacy-link');
  const termsLink = document.getElementById('terms-link');
  const cookiesLink = document.getElementById('cookies-link');
  const navDocsLink = document.getElementById('nav-docs-link');
  const footerDocsLink = document.getElementById('footer-docs-link');
  
  if (privacyLink) {
    privacyLink.href = lang === 'fi' ? 'tietosuoja.html' : 'privacy.html';
  }
  if (termsLink) {
    termsLink.href = lang === 'fi' ? 'ehdot.html' : 'terms.html';
  }
  if (cookiesLink) {
    cookiesLink.href = lang === 'fi' ? 'evasteet.html' : 'cookies.html';
  }
  if (navDocsLink) {
    navDocsLink.href = lang === 'fi' ? 'ohjeet.html' : 'docs.html';
  }
  if (footerDocsLink) {
    footerDocsLink.href = lang === 'fi' ? 'ohjeet.html' : 'docs.html';
  }

  // Update browser window title
  document.title = lang === 'fi' 
    ? 'Takeoff — Määrälaskenta ja kustannusarviot ilman kuukausimaksuja' 
    : 'Takeoff — Quantity Takeoff and Estimating without monthly fees';
}

/* ==========================================================================
   GDPR Cookie Consent Banner
   ========================================================================== */

function initCookies() {
  const cookieConsent = localStorage.getItem('takeoff_cookies');
  const banner = document.getElementById('cookie-consent-banner');
  
  if (!cookieConsent && banner) {
    // Show banner after a tiny delay for smoother loading feel
    setTimeout(() => {
      banner.style.display = 'block';
    }, 1000);
  }
}

function acceptAllCookies() {
  const consent = {
    essential: true,
    analytics: true
  };
  localStorage.setItem('takeoff_cookies', JSON.stringify(consent));
  hideCookieBanner();
  loadAnalytics();
}

function rejectAllCookies() {
  const consent = {
    essential: true,
    analytics: false
  };
  localStorage.setItem('takeoff_cookies', JSON.stringify(consent));
  hideCookieBanner();
}

function toggleCookieSettingsPanel() {
  const panel = document.getElementById('cookie-settings-panel');
  if (panel) {
    const isDisplayed = window.getComputedStyle(panel).display !== 'none';
    panel.style.display = isDisplayed ? 'none' : 'block';
  }
}

function saveCustomCookies() {
  const analyticsChecked = document.getElementById('cookie-opt-analytics').checked;
  const consent = {
    essential: true,
    analytics: analyticsChecked
  };
  localStorage.setItem('takeoff_cookies', JSON.stringify(consent));
  hideCookieBanner();
  if (analyticsChecked) {
    loadAnalytics();
  }
}

function hideCookieBanner() {
  const banner = document.getElementById('cookie-consent-banner');
  if (banner) {
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(50px)';
    banner.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      banner.style.display = 'none';
      banner.style.opacity = '';
      banner.style.transform = '';
      banner.style.transition = '';
    }, 300);
  }
}

function openCookieSettings(e) {
  e.preventDefault();
  const banner = document.getElementById('cookie-consent-banner');
  const panel = document.getElementById('cookie-settings-panel');
  
  if (banner) {
    banner.style.display = 'block';
    if (panel) {
      panel.style.display = 'block';
    }
    
    // Load current values
    const currentSettings = localStorage.getItem('takeoff_cookies');
    if (currentSettings) {
      try {
        const parsed = JSON.parse(currentSettings);
        const analyticsCheckbox = document.getElementById('cookie-opt-analytics');
        if (analyticsCheckbox) {
          analyticsCheckbox.checked = !!parsed.analytics;
        }
      } catch (err) {
        console.error("Error parsing cookies local storage", err);
      }
    }
  }
}

function loadAnalytics() {
  // Simple simulation of third-party scripts loading (Google Analytics, etc.)
  console.log("Analytics cookies accepted. Initializing tracking script...");
}

/* ==========================================================================
   FAQ Accordions
   ========================================================================== */

function toggleFaq(button) {
  const item = button.parentNode;
  const answer = item.querySelector('.faq-answer');
  const isActive = item.classList.contains('active');

  // Close all other FAQ items for a accordion-only behavior
  const allItems = document.querySelectorAll('.faq-item');
  allItems.forEach(otherItem => {
    if (otherItem !== item) {
      otherItem.classList.remove('active');
      const otherAnswer = otherItem.querySelector('.faq-answer');
      if (otherAnswer) {
        otherAnswer.style.maxHeight = null;
      }
    }
  });

  // Toggle clicked item
  if (isActive) {
    item.classList.remove('active');
    answer.style.maxHeight = null;
  } else {
    item.classList.add('active');
    answer.style.maxHeight = answer.scrollHeight + "px";
  }
}

/* ==========================================================================
   Beta Key Request Form Handler
   ========================================================================== */

async function handleBetaForm(event) {
  event.preventDefault();

  const emailInput = document.getElementById('beta-email');
  const messageBox = document.getElementById('beta-msg');
  const submitBtn = document.getElementById('order-beta-btn');
  const honeypot = document.getElementById('beta-company');
  const email = emailInput.value.trim().toLowerCase();

  if (!email) return;

  // Simple client-side validation; the server validates again.
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  messageBox.className = 'beta-message';

  if (!isEmailValid) {
    messageBox.classList.add('error');
    messageBox.innerHTML = window.translations[currentLang]["pricing.beta.validation.error"];
    return;
  }

  submitBtn.disabled = true;

  try {
    const response = await fetch(`${BETA_CONFIG.apiBase}/api/request-beta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        language: currentLang,
        source: 'takeoff-website-beta-form',
        company: honeypot ? honeypot.value : '' // honeypot — must stay empty
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    messageBox.classList.add('success');
    messageBox.innerHTML = window.translations[currentLang]["pricing.beta.validation.success"];
    emailInput.disabled = true;
  } catch (err) {
    console.error('Beta request failed:', err);
    submitBtn.disabled = false;
    messageBox.classList.add('error');
    messageBox.innerHTML = window.translations[currentLang]["pricing.beta.validation.networkError"];
  }
}

/* ==========================================================================
   Stripe Payment Simulation (currently disabled — no license sales)
   ========================================================================== */

function openStripeCheckout() {
  // Currently disabled — no licenses for sale yet
  alert(currentLang === 'fi' 
    ? 'Lisenssien myynti ei ole vielä käynnissä. Voit ladata kokeilun heti tai pyytää beta-avaimen pidempää käyttöä varten.'
    : 'License sales are not active yet. You can download the trial now or request a beta key for longer access.');
}

function closeStripeCheckout() {
  const modal = document.getElementById('stripe-checkout-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function executePayment() {
  const emailInput = document.getElementById('stripe-email');
  const email = emailInput.value.trim();
  
  // Simple email syntax verification before checkout success
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert(currentLang === 'fi' ? 'Syötä toimiva sähköpostiosoite.' : 'Please enter a valid email address.');
    emailInput.focus();
    return;
  }
  
  // Disable button while processing
  const payBtn = document.getElementById('stripe-submit-pay-btn');
  const cancelBtn = document.getElementById('stripe-cancel-pay-btn');
  payBtn.disabled = true;
  cancelBtn.disabled = true;
  payBtn.innerHTML = currentLang === 'fi' ? 'Käsitellään maksua...' : 'Processing payment...';
  
  // Simulate processing time
  setTimeout(() => {
    // Re-enable buttons
    payBtn.disabled = false;
    cancelBtn.disabled = false;
    payBtn.innerHTML = window.translations[currentLang]["modal.payment.btn.pay"];
    
    // Switch to success card
    const formBox = document.getElementById('payment-form-box');
    const successBox = document.getElementById('payment-success-box');
    
    if (formBox && successBox) {
      formBox.style.display = 'none';
      successBox.style.display = 'block';
      
      // Generate mock license key
      const licenseKey = generateLicenseKey();
      document.getElementById('generated-license-key').innerText = licenseKey;
    }
  }, 1500);
}

function generateLicenseKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let segments = [];
  for (let s = 0; s < 3; s++) {
    let segment = '';
    for (let c = 0; c < 4; c++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(segment);
  }
  return `PTKO-${segments.join('-')}`;
}
