// Soleil Comms - Interactive Web Portfolio Application (Dynamic Data Enabled)
import { getStoreData } from './store.js';

let store = getStoreData();

// App State
const appState = {
  currency: 'PHP', // 'PHP' or 'USD'
  fxRate: 0.018,   // 1 PHP ~ 0.018 USD
  soundEnabled: true
};

document.addEventListener('DOMContentLoaded', () => {
  renderDynamicContent();
  initMobileNav();
  initCurrencyToggle();
  initServicesFilter();
  initModalHandling();
  initSamplePreviews();
  initAudioFeedback();

  // Listen for real-time changes from Admin tab
  window.addEventListener('soleil-store-updated', (e) => {
    store = e.detail;
    renderDynamicContent();
    showToast('Website content updated in real-time ♡');
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'soleil_comms_data') {
      store = getStoreData();
      renderDynamicContent();
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

  // 4. Update Booking Modal Service Options
  populateBookingModalServices();

  // 5. Render Reviews & Payment Proofs
  renderReviewsSection();
  renderProofsCarousel();

  // 6. Render Portfolio Samples Grid
  renderSamplesGrid();

  // 7. Render Proof of Transaction Carousel
  renderTransactionsCarousel();

  // 8. Update all social links from store (real-time from admin)
  updateSocialLinks();
}

// --- Update Social Links from Store ---
function updateSocialLinks() {
  const b = store.brand;
  if (!b) return;

  const setLink = (id, href, isEmail = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.href = isEmail ? `mailto:${href}` : (href || '#');
  };

  // Footer icons
  setLink('footerSocialInstagram', b.instagram);
  setLink('footerSocialTwitter', b.twitter);
  setLink('footerSocialTelegram', b.telegram);
  setLink('footerSocialFacebook', b.facebook);
  setLink('footerSocialEmail', b.email, true);

  // Contact section DM buttons
  setLink('contactSocialInstagram', b.instagram);
  setLink('contactSocialTwitter', b.twitter);
  setLink('contactSocialTelegram', b.telegram);
  setLink('contactSocialFacebook', b.facebook);
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

// --- Populate Booking Modal Dropdown ---
function populateBookingModalServices() {
  const modalSelect = document.getElementById('modalServiceType');
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

  // Click-to-preview proof lightbox modal
  track.querySelectorAll('.proof-img-wrap, .inspect-proof-btn').forEach(el => {
    el.onclick = (e) => {
      const pid = e.currentTarget.dataset.proofId;
      const proof = store.proofs.find(p => p.id === pid);
      if (proof) {
        showProofLightbox(proof);
      }
    };
  });
}

// --- Render Portfolio Samples Grid ---
function renderSamplesGrid() {
  const grid = document.getElementById('samplesGrid');
  if (!grid || !store.samples) return;

  if (store.samples.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px 0;">No portfolio samples uploaded yet.</p>';
    return;
  }

  grid.innerHTML = store.samples.map(s => `
    <div class="sample-card open-preview-btn" data-sample-id="${s.id}" style="cursor: pointer;">
      <div class="sample-media-wrap">
        <img src="${s.img}" alt="${s.title}" class="sample-img" loading="lazy">
        <span class="sample-badge">${s.tag}</span>
      </div>
      <div class="sample-body">
        <div class="sample-meta">
          <span>${s.meta || s.tag}</span> • <span>${s.grade || 'Verified'}</span>
        </div>
        <h4 class="sample-title">${s.title}</h4>
        <p class="sample-desc">${s.description}</p>
        <button class="btn btn-secondary btn-sm" style="margin-top: auto;">🔍 Inspect Sample Details</button>
      </div>
    </div>
  `).join('');
}

// --- Render Proofs of Transaction (Client Chats) Carousel ---
function renderTransactionsCarousel() {
  const track = document.getElementById('txSliderTrack');
  const dotsRow = document.getElementById('txDotsRow');
  const prevBtn = document.getElementById('txPrevBtn');
  const nextBtn = document.getElementById('txNextBtn');

  if (!track || !store.transactions || store.transactions.length === 0) return;

  track.innerHTML = store.transactions.map((t, idx) => `
    <div class="proof-card" data-index="${idx}">
      <div class="proof-img-wrap" data-tx-id="${t.id}">
        <img src="${t.img}" alt="${t.title}" class="proof-img" loading="lazy">
        <span class="proof-amount-badge">${t.status || 'Verified Chat'}</span>
        <span class="proof-verified-pill">💬 ${t.tag || 'Client Feedback'}</span>
      </div>
      <div class="proof-content">
        <h4 class="proof-title">${t.title}</h4>
        <p class="proof-caption">${t.caption}</p>
        <button class="btn btn-secondary btn-sm inspect-tx-btn" data-tx-id="${t.id}" style="margin-top: auto;">
          🔍 View Conversation
        </button>
      </div>
    </div>
  `).join('');

  // Render Dots
  if (dotsRow) {
    dotsRow.innerHTML = store.transactions.map((_, idx) => `
      <div class="carousel-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></div>
    `).join('');

    dotsRow.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.onclick = () => {
        const idx = parseInt(dot.dataset.index);
        const cards = track.querySelectorAll('.proof-card');
        if (cards[idx]) {
          cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          updateTxDot(idx);
        }
      };
    });
  }

  function updateTxDot(activeIndex) {
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
    updateTxDot(activeIdx);
  };

  // Click-to-preview transaction lightbox modal
  track.querySelectorAll('.proof-img-wrap, .inspect-tx-btn').forEach(el => {
    el.onclick = (e) => {
      const tid = e.currentTarget.dataset.txId;
      const tx = store.transactions.find(t => t.id === tid);
      if (tx) {
        showTransactionLightbox(tx);
      }
    };
  });
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

// --- Modals ---
function initModalHandling() {
  const orderModal = document.getElementById('orderModal');
  const previewModal = document.getElementById('previewModal');
  const proofLightbox = document.getElementById('proofLightboxModal');
  const txLightbox = document.getElementById('txLightboxModal');
  const termsModal = document.getElementById('termsModal');
  const closeBtns = document.querySelectorAll('.modal-close-btn');

  document.querySelectorAll('.open-order-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
      openBookingModal();
    });
  });

  document.querySelectorAll('.open-terms-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openTermsModal();
    });
  });

  closeBtns.forEach(btn => btn.addEventListener('click', closeAllModals));
  document.getElementById('closeTermsBtn')?.addEventListener('click', closeAllModals);

  // Lightbox close buttons
  document.getElementById('proofLightboxClose')?.addEventListener('click', closeAllModals);
  document.getElementById('txLightboxClose')?.addEventListener('click', closeAllModals);

  [orderModal, previewModal, proofLightbox, txLightbox, termsModal].forEach(modal => {
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

function openTermsModal() {
  const termsModal = document.getElementById('termsModal');
  if (termsModal) {
    termsModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    playCuteSound(500);
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
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.open-preview-btn');
    if (card && card.dataset.sampleId) {
      const sampleId = card.dataset.sampleId;
      const sample = store.samples?.find(s => s.id === sampleId) || store.samples?.[0];
      if (sample) showPreviewModal(sample);
    }
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

// --- Proof of Payment Lightbox ---
function showProofLightbox(proof) {
  const modal = document.getElementById('proofLightboxModal');
  if (!modal) return;

  document.getElementById('proofLightboxImg').src = proof.img;
  document.getElementById('proofLightboxAmount').textContent = proof.amount || 'Verified ✓';
  document.getElementById('proofLightboxTag').textContent = `✓ ${proof.tag || 'Verified Transaction'}`;
  document.getElementById('proofLightboxTitle').textContent = proof.title;
  document.getElementById('proofLightboxCaption').textContent = proof.caption;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  playCuteSound(520);

  // Re-attach order modal buttons inside lightbox (they may dynamically appear)
  modal.querySelectorAll('.open-order-modal').forEach(btn => {
    btn.onclick = () => {
      closeAllModals();
      setTimeout(() => openBookingModal(), 100);
    };
  });
}

// --- Proof of Transaction Lightbox ---
function showTransactionLightbox(tx) {
  const modal = document.getElementById('txLightboxModal');
  if (!modal) return;

  document.getElementById('txLightboxImg').src = tx.img;
  document.getElementById('txLightboxStatus').textContent = tx.status || 'Verified Chat ✓';
  document.getElementById('txLightboxTag').textContent = `✓ ${tx.tag || 'Verified Client Conversation'}`;
  document.getElementById('txLightboxTitle').textContent = tx.title;
  document.getElementById('txLightboxCaption').textContent = tx.caption;
  document.getElementById('txLightboxService').textContent = tx.service || 'Academic Writing & Research';

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  playCuteSound(530);

  modal.querySelectorAll('.open-order-modal').forEach(btn => {
    btn.onclick = () => {
      closeAllModals();
      setTimeout(() => openBookingModal(), 100);
    };
  });
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
function initAudioFeedback() {}

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
