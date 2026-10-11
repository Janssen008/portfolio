// Soleil Comms - Interactive Web Portfolio Application (Dynamic Data Enabled)
import { getStoreData } from './store.js';

let store = getStoreData();

// App State
const appState = {
  currency: 'PHP', // 'PHP' or 'USD'
  fxRate: 0.018,   // 1 PHP ~ 0.018 USD
  soundEnabled: true,
  currentEstimate: null
};

document.addEventListener('DOMContentLoaded', () => {
  renderDynamicContent();
  initMobileNav();
  initCurrencyToggle();
  initCalculator();
  initServicesFilter();
  initFaqAccordion();
  initModalHandling();
  initSamplePreviews();
  initAudioFeedback();

  // Listen for real-time changes from Admin tab
  window.addEventListener('soleil-store-updated', (e) => {
    store = e.detail;
    renderDynamicContent();
    calculateQuote();
    showToast('Website content updated in real-time ♡');
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'soleil_comms_data') {
      store = getStoreData();
      renderDynamicContent();
      calculateQuote();
    }
  });
});

// --- Dynamic Content Rendering from Store ---
function renderDynamicContent() {
  store = getStoreData();

  // 1. Status & Notice Bar
  const noticeBar = document.getElementById('noticeBar');
  if (noticeBar && store.status.announcement) {
    noticeBar.innerHTML = `<span class="sparkle">✨</span><span>${store.status.announcement}</span><span class="sparkle">🌸</span>`;
  }

  const statusPills = document.querySelectorAll('.status-pill');
  statusPills.forEach(pill => {
    if (store.status.isOpen) {
      pill.style.background = '#e8f9e9';
      pill.style.borderColor = '#95d5b2';
      pill.style.color = '#1b4332';
      pill.innerHTML = `<span class="status-dot"></span><span>${store.status.statusText || 'SLOTS OPEN'}</span>`;
    } else {
      pill.style.background = '#ffebee';
      pill.style.borderColor = '#ffcdd2';
      pill.style.color = '#c62828';
      pill.innerHTML = `<span class="status-dot" style="background: #e53935;"></span><span>CLOSED / WAITLIST</span>`;
    }
  });

  // 2. Hero Content
  const heroBadge = document.querySelector('.hero-badge-tag');
  if (heroBadge && store.brand.heroTag) {
    heroBadge.innerHTML = `<span>🌸</span> ${store.brand.heroTag}`;
  }

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && store.status.badgeText) {
    heroTitle.innerHTML = `${store.status.badgeText.replace('♡', '')} <br><span class="highlight-text">♡</span>`;
  }

  const heroDesc = document.querySelector('.hero-description');
  if (heroDesc && store.brand.heroDescription) {
    heroDesc.textContent = store.brand.heroDescription;
  }

  // 3. Render Services Grid
  renderServicesGrid();

  // 4. Update Calculator Service Options
  populateCalculatorServices();

  // 5. Render Reviews & Payment Proofs
  renderReviewsSection();
  renderProofsCarousel();

  // 6. Render FAQs
  renderFaqsSection();
}

// --- Render Services Grid ---
function renderServicesGrid() {
  const grid = document.getElementById('servicesGrid');
  if (!grid || !store.services) return;

  grid.innerHTML = store.services.map(s => `
    <div class="service-card" data-category="${s.category}">
      <div class="service-header">
        <div class="service-icon">${s.icon || '📖'}</div>
        ${s.popularBadge ? `<span class="service-popular-badge">${s.popularBadge}</span>` : ''}
      </div>
      <h3 class="service-title">${s.name}</h3>
      <p class="service-desc">${s.desc}</p>
      <div class="service-specs">
        ${s.formatStyles ? `
        <div class="spec-row">
          <span class="spec-label">Format Styles:</span>
          <span class="spec-val">${s.formatStyles}</span>
        </div>` : ''}
        ${s.turnaround ? `
        <div class="spec-row">
          <span class="spec-label">Turnaround:</span>
          <span class="spec-val">${s.turnaround}</span>
        </div>` : ''}
        ${s.included ? `
        <div class="spec-row">
          <span class="spec-label">Included:</span>
          <span class="spec-val">${s.included}</span>
        </div>` : ''}
      </div>
      <div class="service-footer">
        <div class="service-price-tag">
          <span class="price-prefix">Starting at</span>
          <span class="price-amount" data-base-php="${s.pricePhp}">${formatMoney(s.pricePhp)} / ${s.unit}</span>
        </div>
        <button class="btn btn-secondary btn-sm btn-service-inquire" data-service-key="${s.id}">Book This ♡</button>
      </div>
    </div>
  `).join('');

  // Re-attach book buttons
  grid.querySelectorAll('.btn-service-inquire').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const sKey = e.currentTarget.dataset.serviceKey;
      openBookingModal(sKey);
    });
  });
}

// --- Populate Calculator Select ---
function populateCalculatorServices() {
  const select = document.getElementById('calcServiceSelect');
  const modalSelect = document.getElementById('modalServiceType');

  if (select && store.services) {
    const prevVal = select.value;
    select.innerHTML = store.services.map(s => `
      <option value="${s.id}">${s.icon || '📖'} ${s.name} (from ${formatMoney(s.pricePhp)}/${s.unit})</option>
    `).join('');
    if (prevVal && store.services.some(s => s.id === prevVal)) {
      select.value = prevVal;
    }
  }

  if (modalSelect && store.services) {
    modalSelect.innerHTML = store.services.map(s => `
      <option value="${s.id}">${s.name}</option>
    `).join('');
  }
}

// --- Render Reviews Section ---
function renderReviewsSection() {
  const container = document.querySelector('.reviews-grid');
  if (!container || !store.testimonials) return;

  container.innerHTML = store.testimonials.map(t => `
    <div class="review-card">
      <div>
        <div class="review-stars">${'★'.repeat(t.stars || 5)}</div>
        <p class="review-quote">"${t.quote}"</p>
      </div>
      <div class="review-author-row">
        <div class="author-avatar-initials">${t.initials || t.author.slice(0, 2).toUpperCase()}</div>
        <div class="author-info">
          <h5>${t.author}</h5>
          <span>${t.subtitle}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// --- Render Proofs of Payment Carousel ---
function renderProofsCarousel() {
  const track = document.getElementById('proofsSliderTrack');
  const dotsRow = document.getElementById('proofDotsRow');
  const prevBtn = document.getElementById('proofPrevBtn');
  const nextBtn = document.getElementById('proofNextBtn');

  if (!track || !store.proofs || store.proofs.length === 0) return;

  track.innerHTML = store.proofs.map((p, idx) => `
    <div class="proof-card" data-index="${idx}">
      <div class="proof-img-wrap" data-proof-id="${p.id}">
        <img src="${p.img}" alt="${p.title}" class="proof-img" loading="lazy">
        <span class="proof-amount-badge">${p.amount || 'Verified'}</span>
        <span class="proof-verified-pill">✓ ${p.tag || 'Official Receipt'}</span>
      </div>
      <div class="proof-content">
        <h4 class="proof-title">${p.title}</h4>
        <p class="proof-caption">${p.caption}</p>
        <button class="btn btn-secondary btn-sm inspect-proof-btn" data-proof-id="${p.id}" style="margin-top: auto;">
          🔍 View Full Receipt
        </button>
      </div>
    </div>
  `).join('');

  // Render Dots
  if (dotsRow) {
    dotsRow.innerHTML = store.proofs.map((_, idx) => `
      <div class="carousel-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></div>
    `).join('');

    dotsRow.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.onclick = () => {
        const idx = parseInt(dot.dataset.index);
        const cards = track.querySelectorAll('.proof-card');
        if (cards[idx]) {
          cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          updateActiveDot(idx);
        }
      };
    });
  }

  function updateActiveDot(activeIndex) {
    if (!dotsRow) return;
    dotsRow.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  }

  // Prev / Next button listeners
  if (prevBtn) {
    prevBtn.onclick = () => {
      track.scrollBy({ left: -320, behavior: 'smooth' });
    };
  }
  if (nextBtn) {
    nextBtn.onclick = () => {
      track.scrollBy({ left: 320, behavior: 'smooth' });
    };
  }

  // Scroll spy to update dots
  track.onscroll = () => {
    const cardWidth = track.querySelector('.proof-card')?.offsetWidth || 300;
    const activeIdx = Math.round(track.scrollLeft / cardWidth);
    updateActiveDot(activeIdx);
  };

  // Click-to-preview lightbox modal
  track.querySelectorAll('.proof-img-wrap, .inspect-proof-btn').forEach(el => {
    el.onclick = (e) => {
      const pid = e.currentTarget.dataset.proofId;
      const proof = store.proofs.find(p => p.id === pid);
      if (proof) {
        showPreviewModal({
          title: proof.title,
          tag: proof.tag || 'Proof of Payment',
          img: proof.img,
          description: proof.caption,
          grade: `Transaction Amount: ${proof.amount || 'Verified'}`,
          deliverables: 'Client Confidentiality Verified • Anonymized Receipt'
        });
      }
    };
  });
}

// --- Render FAQs Section ---
function renderFaqsSection() {
  const container = document.querySelector('.faq-accordion');
  if (!container || !store.faqs) return;

  container.innerHTML = store.faqs.map((f, idx) => `
    <div class="faq-item ${idx === 0 ? 'active' : ''}">
      <button class="faq-trigger">
        <span>${f.question}</span>
        <span class="faq-icon-arrow">▾</span>
      </button>
      <div class="faq-content">
        ${f.answer}
      </div>
    </div>
  `).join('');

  initFaqAccordion();
}

// --- Mobile Navigation ---
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.innerHTML = '☰';
      });
    });
  }
}

// --- Currency Toggle ---
function initCurrencyToggle() {
  const currencyBtns = document.querySelectorAll('.currency-toggle-btn');
  currencyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selected = e.target.dataset.currency;
      if (selected && selected !== appState.currency) {
        appState.currency = selected;
        currencyBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        calculateQuote();
        updateDisplayPrices();
        showToast(`Currency updated to ${selected} ♡`);
      }
    });
  });
}

function formatMoney(amountPhp) {
  if (appState.currency === 'USD') {
    const usd = amountPhp * appState.fxRate;
    return `$${usd.toFixed(2)}`;
  }
  return `₱${Math.round(amountPhp).toLocaleString()}`;
}

function updateDisplayPrices() {
  document.querySelectorAll('[data-base-php]').forEach(el => {
    const phpVal = parseFloat(el.dataset.basePhp);
    if (!isNaN(phpVal)) {
      el.textContent = `${formatMoney(phpVal)} / ${el.textContent.split('/')[1]?.trim() || 'item'}`;
    }
  });
}

// --- Interactive Price Calculator ---
function initCalculator() {
  const serviceSelect = document.getElementById('calcServiceSelect');
  const qtyMinus = document.getElementById('calcQtyMinus');
  const qtyPlus = document.getElementById('calcQtyPlus');
  const qtyInput = document.getElementById('calcQtyValue');
  const qtyUnitLabel = document.getElementById('calcQtyUnit');
  const levelSelect = document.getElementById('calcLevelSelect');
  const speedRadios = document.querySelectorAll('input[name="calcSpeed"]');
  const addonChecks = document.querySelectorAll('.calc-addon-check');
  const copyQuoteBtn = document.getElementById('copyQuoteBtn');
  const bookWithQuoteBtn = document.getElementById('bookWithQuoteBtn');

  if (!serviceSelect || !qtyInput) return;

  function updateQtyUnit() {
    const sKey = serviceSelect.value;
    const sData = (store.services && store.services.find(s => s.id === sKey)) || store.services[0];
    if (qtyUnitLabel && sData) {
      qtyUnitLabel.textContent = (sData.unit || 'unit') + '(s)';
    }
  }

  serviceSelect.addEventListener('change', () => {
    const sKey = serviceSelect.value;
    const sData = store.services.find(s => s.id === sKey);
    if (sData) {
      qtyInput.value = sData.defaultQty || 3;
      updateQtyUnit();
      calculateQuote();
    }
  });

  qtyMinus?.addEventListener('click', () => {
    const current = parseInt(qtyInput.value) || 1;
    const sData = store.services.find(s => s.id === serviceSelect.value) || store.services[0];
    if (current > (sData?.minQty || 1)) {
      qtyInput.value = current - 1;
      calculateQuote();
      playCuteSound(380);
    }
  });

  qtyPlus?.addEventListener('click', () => {
    const current = parseInt(qtyInput.value) || 1;
    qtyInput.value = current + 1;
    calculateQuote();
    playCuteSound(440);
  });

  qtyInput.addEventListener('input', calculateQuote);
  levelSelect?.addEventListener('change', calculateQuote);

  speedRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.speed-option-card').forEach(card => card.classList.remove('selected'));
      radio.closest('.speed-option-card')?.classList.add('selected');
      calculateQuote();
      playCuteSound(520);
    });
  });

  addonChecks.forEach(check => {
    check.addEventListener('change', () => {
      calculateQuote();
      playCuteSound(480);
    });
  });

  copyQuoteBtn?.addEventListener('click', () => {
    const quoteText = generateQuoteMessage();
    navigator.clipboard.writeText(quoteText).then(() => {
      showToast('Quote copied to clipboard! Paste it into your DM ♡');
      playCuteSound(650);
    }).catch(() => fallbackCopyText(quoteText));
  });

  bookWithQuoteBtn?.addEventListener('click', openBookingModalWithPrefill);

  updateQtyUnit();
  calculateQuote();
}

function calculateQuote() {
  const serviceKey = document.getElementById('calcServiceSelect')?.value || (store.services[0]?.id || 'research');
  const qty = parseInt(document.getElementById('calcQtyValue')?.value) || 3;
  const levelKey = document.getElementById('calcLevelSelect')?.value || 'college';
  const speedKey = document.querySelector('input[name="calcSpeed"]:checked')?.value || 'standard';

  const sData = store.services?.find(s => s.id === serviceKey) || store.services[0];
  if (!sData) return;

  const mults = store.multipliers;
  const levelData = mults.level[levelKey] || mults.level.college;
  const speedData = mults.speed[speedKey] || mults.speed.standard;

  let baseSubtotal = (sData.pricePhp || 250) * qty;
  let levelSubtotal = baseSubtotal * (levelData.mult || 1.0);
  let finalSubtotal = levelSubtotal * (speedData.mult || 1.0);

  // Addons from store
  let addonsTotal = 0;
  const citationCheck = document.getElementById('addonCitations')?.checked;
  const notesCheck = document.getElementById('addonNotes')?.checked;
  const rushQueueCheck = document.getElementById('addonRushQueue')?.checked;

  if (citationCheck) addonsTotal += (mults.addons.citationsPhp || 120);
  if (notesCheck) addonsTotal += (serviceKey === 'presentation' ? (qty * (mults.addons.speakerNotesPhp || 40)) : 100);
  if (rushQueueCheck) addonsTotal += (mults.addons.rushQueuePhp || 200);

  const grandTotalPhp = finalSubtotal + addonsTotal;

  // Update displays
  const totalDisplay = document.getElementById('calcGrandTotal');
  const breakdownService = document.getElementById('breakdownService');
  const breakdownSpeed = document.getElementById('breakdownSpeed');
  const breakdownLevel = document.getElementById('breakdownLevel');
  const breakdownAddons = document.getElementById('breakdownAddons');

  if (totalDisplay) totalDisplay.textContent = formatMoney(grandTotalPhp);
  if (breakdownService) breakdownService.textContent = `${sData.name} (${qty} ${sData.unit}${qty > 1 ? 's' : ''}) - ${formatMoney(baseSubtotal)}`;
  if (breakdownSpeed) breakdownSpeed.textContent = `${speedData.label} (${speedData.mult}x)`;
  if (breakdownLevel) breakdownLevel.textContent = `${levelData.label} (${levelData.mult}x)`;
  if (breakdownAddons) breakdownAddons.textContent = addonsTotal > 0 ? `+${formatMoney(addonsTotal)}` : 'Included Free / None';

  appState.currentEstimate = {
    service: sData.name,
    qty: `${qty} ${sData.unit}${qty > 1 ? 's' : ''}`,
    speed: speedData.label,
    level: levelData.label,
    addons: addonsTotal > 0,
    total: formatMoney(grandTotalPhp),
    totalPhp: grandTotalPhp
  };
}

function generateQuoteMessage() {
  const est = appState.currentEstimate;
  if (!est) return 'Hello Soleil Comms! I would like to inquire about academic commission rates.';

  return `🌸 Soleil Comms Commission Inquiry 🌸
• Service: ${est.service}
• Quantity/Pages: ${est.qty}
• Academic Level: ${est.level}
• Target Deadline: ${est.speed}
• Estimated Total: ~${est.total}
• Status: Ready to book! Could you please confirm slot availability? Thank you! ♡`;
}

// --- Services Filtering ---
function initServicesFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.service-card').forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
      playCuteSound(400);
    });
  });
}

// --- FAQ Accordion ---
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;
    trigger.onclick = () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
        playCuteSound(360);
      }
    };
  });
}

// --- Modals ---
function initModalHandling() {
  const orderModal = document.getElementById('orderModal');
  const previewModal = document.getElementById('previewModal');
  const closeBtns = document.querySelectorAll('.modal-close-btn');

  document.querySelectorAll('.open-order-modal').forEach(btn => {
    btn.addEventListener('click', () => openBookingModal());
  });

  closeBtns.forEach(btn => btn.addEventListener('click', closeAllModals));

  [orderModal, previewModal].forEach(modal => {
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeAllModals();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  document.getElementById('copyDmBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const dmText = compileOrderFormText();
    navigator.clipboard.writeText(dmText).then(() => {
      showToast('Formatted DM copied! Paste it in your chat with Soleil ♡');
      playCuteSound(600);
    }).catch(() => fallbackCopyText(dmText));
  });

  document.getElementById('commissionInquiryForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const dmText = compileOrderFormText();
    const mailUrl = `mailto:${store.brand?.email || 'soleilcomms@gmail.com'}?subject=Soleil%20Comms%20Inquiry&body=${encodeURIComponent(dmText)}`;
    window.open(mailUrl, '_blank');
    showToast('Opening email client! You can also paste copied DM to Twitter/IG ♡');
  });
}

function openBookingModal(preselectedServiceKey) {
  const orderModal = document.getElementById('orderModal');
  if (orderModal) {
    if (preselectedServiceKey) {
      const select = document.getElementById('modalServiceType');
      if (select) select.value = preselectedServiceKey;
    }
    orderModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    playCuteSound(480);
  }
}

function openBookingModalWithPrefill() {
  openBookingModal();
  const notesField = document.getElementById('modalOrderNotes');
  if (notesField && appState.currentEstimate) {
    const est = appState.currentEstimate;
    notesField.value = `[Calculator Estimate]: ${est.service} | ${est.qty} | Urgency: ${est.speed} | Est: ${est.total}`;
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.remove('open'));
  document.body.style.overflow = '';
}

function compileOrderFormText() {
  const name = document.getElementById('modalClientName')?.value || 'Student Client';
  const handle = document.getElementById('modalSocialHandle')?.value || 'N/A';
  const service = document.getElementById('modalServiceType')?.selectedOptions[0]?.text || 'Academic Writing';
  const deadline = document.getElementById('modalDeadlineDate')?.value || 'TBD (Flexible)';
  const urgency = document.getElementById('modalIsRush')?.checked ? '⚡ RUSH ORDER' : '🌸 Standard Delivery';
  const topic = document.getElementById('modalTopicTopic')?.value || 'Academic Requirements';
  const notes = document.getElementById('modalOrderNotes')?.value || 'Standard guidelines';

  return `🌸 SOLEIL COMMS - ORDER INQUIRY 🌸
• Client Name: ${name}
• Contact Handle: ${handle}
• Service Needed: ${service}
• Urgency Status: ${urgency}
• Target Deadline: ${deadline}
• Subject / Topic: ${topic}
• Special Instructions: ${notes}

Looking forward to hearing from you! ♡`;
}

// --- Sample Previews ---
function initSamplePreviews() {
  document.querySelectorAll('.open-preview-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const sampleId = e.currentTarget.dataset.sampleId;
      const sample = store.samples?.find(s => s.id === sampleId) || store.samples[0];
      if (sample) showPreviewModal(sample);
    });
  });
}

function showPreviewModal(data) {
  const modal = document.getElementById('previewModal');
  if (!modal) return;

  document.getElementById('previewModalTitle').textContent = data.title;
  document.getElementById('previewModalTag').textContent = data.tag;
  document.getElementById('previewModalImg').src = data.img;
  document.getElementById('previewModalDesc').textContent = data.description;
  document.getElementById('previewModalGrade').textContent = data.grade;
  document.getElementById('previewModalDeliverables').textContent = data.deliverables;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  playCuteSound(550);
}

// --- Toast Feedback ---
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toastMsg');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3200);
}

function fallbackCopyText(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showToast('Copied to clipboard! ♡');
}

// --- Sound Synthesizer ---
let audioCtx = null;
function initAudioFeedback() {
  // Silent fallback
}

function playCuteSound(freq = 440) {
  if (!appState.soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.19);
  } catch (err) {}
}
