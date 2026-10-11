// Soleil Comms - Admin Dashboard Logic
import { getStoreData, saveStoreData, resetStoreData } from './store.js';

let currentData = null;

document.addEventListener('DOMContentLoaded', () => {
  initPinGate();
  loadDataAndPopulate();
  initTabs();
  initSaveButtons();
  initServicesManager();
  initSamplesManager();
  initReviewsManager();
  initProofsManager();
  initFaqsManager();
  initBackupManager();
});

// --- PIN Screen ---
function initPinGate() {
  const pinOverlay = document.getElementById('pinOverlay');
  const pinInput = document.getElementById('pinInput');
  const pinBtn = document.getElementById('pinSubmitBtn');

  // Check session storage
  const isUnlocked = sessionStorage.getItem('soleil_admin_unlocked');
  if (!isUnlocked) {
    pinOverlay.style.display = 'flex';
  }

  function attemptUnlock() {
    const val = pinInput.value.trim().toLowerCase();
    // Accept 'soleil', '1234', or blank to keep it convenient
    if (val === 'soleil' || val === '1234' || val === '') {
      sessionStorage.setItem('soleil_admin_unlocked', 'true');
      pinOverlay.style.display = 'none';
      showToast('Welcome back, Soleil! Dashboard unlocked 🌸');
    } else {
      alert('Incorrect PIN. (Default PIN: soleil)');
    }
  }

  if (pinBtn) pinBtn.addEventListener('click', attemptUnlock);
  if (pinInput) {
    pinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') attemptUnlock();
    });
  }
}

// --- Data Loading & Form Population ---
function loadDataAndPopulate() {
  currentData = getStoreData();

  // Status & Brand
  document.getElementById('statusIsOpen').checked = currentData.status.isOpen;
  document.getElementById('statusToggleLabel').textContent = currentData.status.isOpen ? 'COMMISSIONS OPEN' : 'COMMISSIONS CLOSED';
  document.getElementById('statusPillText').value = currentData.status.statusText;
  document.getElementById('statusSlotsRemaining').value = currentData.status.slotsRemaining;
  document.getElementById('statusNoticeText').value = currentData.status.announcement;
  document.getElementById('statusHeadline').value = currentData.status.badgeText;
  document.getElementById('statusHeroDesc').value = currentData.brand.heroDescription;

  // Contact
  document.getElementById('brandEmail').value = currentData.brand.email || '';
  document.getElementById('brandTelegram').value = currentData.brand.telegram || '';
  document.getElementById('brandInstagram').value = currentData.brand.instagram || '';
  document.getElementById('brandTwitter').value = currentData.brand.twitter || '';

  // Multipliers
  const m = currentData.multipliers;
  document.getElementById('multStandard').value = m.speed.standard.mult;
  document.getElementById('multExpress').value = m.speed.express.mult;
  document.getElementById('multRush').value = m.speed.rush.mult;
  document.getElementById('multOvernight').value = m.speed.overnight.mult;

  document.getElementById('multLevelHighSchool').value = m.level.highschool.mult;
  document.getElementById('multLevelCollege').value = m.level.college.mult;
  document.getElementById('multLevelPostgrad').value = m.level.postgrad.mult;

  document.getElementById('addonCitationsPhp').value = m.addons.citationsPhp;
  document.getElementById('addonNotesPhp').value = m.addons.speakerNotesPhp;
  document.getElementById('addonQueuePhp').value = m.addons.rushQueuePhp;

  // Toggle label change
  document.getElementById('statusIsOpen').addEventListener('change', (e) => {
    document.getElementById('statusToggleLabel').textContent = e.target.checked ? 'COMMISSIONS OPEN' : 'COMMISSIONS CLOSED';
  });

  // Render lists
  renderServicesList();
  renderSamplesList();
  renderReviewsList();
  renderProofsList();
  renderFaqsList();
}

// --- Tab Switching ---
function initTabs() {
  const tabBtns = document.querySelectorAll('.sidebar-btn[data-tab]');
  const panes = document.querySelectorAll('.admin-tab-pane');
  const heading = document.getElementById('pageHeading');

  const titles = {
    tabStatus: 'Commission Status & Announcements',
    tabServices: 'Services & Pricing Management',
    tabCalculator: 'Calculator Multipliers & Surcharges',
    tabSamples: 'Portfolio Samples Management',
    tabReviews: 'Student Reviews & Testimonials',
    tabProofs: 'Proof of Payment & Client Receipts',
    tabFaqs: 'FAQs & Policies Management',
    tabBackup: 'Backup, Export & Factory Reset'
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetId)?.classList.add('active');
      if (heading && titles[targetId]) {
        heading.textContent = titles[targetId];
      }
    });
  });
}

// --- Save Action ---
function initSaveButtons() {
  const saveAction = () => {
    collectFormValues();
    const success = saveStoreData(currentData);
    if (success) {
      showToast('All changes saved! Live site updated in real-time ♡');
    } else {
      alert('Error saving data. Please check browser storage settings.');
    }
  };

  document.getElementById('topSaveBtn')?.addEventListener('click', saveAction);
  document.getElementById('sidebarSaveBtn')?.addEventListener('click', saveAction);
}

function collectFormValues() {
  // Status
  currentData.status.isOpen = document.getElementById('statusIsOpen').checked;
  currentData.status.statusText = document.getElementById('statusPillText').value;
  currentData.status.slotsRemaining = document.getElementById('statusSlotsRemaining').value;
  currentData.status.announcement = document.getElementById('statusNoticeText').value;
  currentData.status.badgeText = document.getElementById('statusHeadline').value;
  currentData.brand.heroDescription = document.getElementById('statusHeroDesc').value;

  // Contact
  currentData.brand.email = document.getElementById('brandEmail').value;
  currentData.brand.telegram = document.getElementById('brandTelegram').value;
  currentData.brand.instagram = document.getElementById('brandInstagram').value;
  currentData.brand.twitter = document.getElementById('brandTwitter').value;

  // Multipliers
  currentData.multipliers.speed.standard.mult = parseFloat(document.getElementById('multStandard').value) || 1.0;
  currentData.multipliers.speed.express.mult = parseFloat(document.getElementById('multExpress').value) || 1.35;
  currentData.multipliers.speed.rush.mult = parseFloat(document.getElementById('multRush').value) || 1.70;
  currentData.multipliers.speed.overnight.mult = parseFloat(document.getElementById('multOvernight').value) || 2.10;

  currentData.multipliers.level.highschool.mult = parseFloat(document.getElementById('multLevelHighSchool').value) || 0.90;
  currentData.multipliers.level.college.mult = parseFloat(document.getElementById('multLevelCollege').value) || 1.0;
  currentData.multipliers.level.postgrad.mult = parseFloat(document.getElementById('multLevelPostgrad').value) || 1.40;

  currentData.multipliers.addons.citationsPhp = parseInt(document.getElementById('addonCitationsPhp').value) || 120;
  currentData.multipliers.addons.speakerNotesPhp = parseInt(document.getElementById('addonNotesPhp').value) || 40;
  currentData.multipliers.addons.rushQueuePhp = parseInt(document.getElementById('addonQueuePhp').value) || 200;
}

// --- Services CRUD ---
function renderServicesList() {
  const container = document.getElementById('servicesListContainer');
  if (!container) return;

  container.innerHTML = currentData.services.map((s, idx) => `
    <div class="admin-item-row" data-id="${s.id}">
      <div class="item-info-col">
        <h5>${s.icon || '📄'} ${s.name} <strong style="color: var(--admin-primary); margin-left: 8px;">₱${s.pricePhp} / ${s.unit}</strong></h5>
        <span>${s.category.toUpperCase()} • ${s.turnaround} • ${s.popularBadge ? `[${s.popularBadge}]` : ''}</span>
      </div>
      <div class="item-actions-col">
        <button class="btn btn-secondary btn-sm edit-service-btn" data-index="${idx}">✏️ Edit</button>
        <button class="btn btn-danger btn-sm delete-service-btn" data-index="${idx}">🗑️</button>
      </div>
    </div>
  `).join('');

  // Attach handlers
  container.querySelectorAll('.edit-service-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.dataset.index);
      openServiceEditModal(currentData.services[idx], idx);
    });
  });

  container.querySelectorAll('.delete-service-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.dataset.index);
      if (confirm(`Delete "${currentData.services[idx].name}"?`)) {
        currentData.services.splice(idx, 1);
        saveStoreData(currentData);
        renderServicesList();
        showToast('Service deleted.');
      }
    });
  });
}

function initServicesManager() {
  const modal = document.getElementById('editServiceModal');
  const addBtn = document.getElementById('addNewServiceBtn');
  const saveBtn = document.getElementById('saveServiceModalBtn');
  const cancelBtns = modal.querySelectorAll('.modal-cancel-btn');

  let editingIndex = -1;

  window.openServiceEditModal = (service, index = -1) => {
    editingIndex = index;
    document.getElementById('serviceModalTitle').textContent = index >= 0 ? 'Edit Academic Service' : 'Add New Service';
    document.getElementById('modalServiceId').value = service?.id || `srv_${Date.now()}`;
    document.getElementById('modalServiceName').value = service?.name || '';
    document.getElementById('modalServiceIcon').value = service?.icon || '📖';
    document.getElementById('modalServiceCategory').value = service?.category || 'writing';
    document.getElementById('modalServicePrice').value = service?.pricePhp || 250;
    document.getElementById('modalServiceUnit').value = service?.unit || 'page';
    document.getElementById('modalServiceDesc').value = service?.desc || '';
    document.getElementById('modalServiceFormats').value = service?.formatStyles || '';
    document.getElementById('modalServiceTurnaround').value = service?.turnaround || '';
    document.getElementById('modalServiceBadge').value = service?.popularBadge || '';

    modal.classList.add('open');
  };

  addBtn?.addEventListener('click', () => {
    openServiceEditModal(null, -1);
  });

  cancelBtns.forEach(b => b.addEventListener('click', () => modal.classList.remove('open')));

  saveBtn?.addEventListener('click', () => {
    const sData = {
      id: document.getElementById('modalServiceId').value,
      name: document.getElementById('modalServiceName').value,
      icon: document.getElementById('modalServiceIcon').value || '📖',
      category: document.getElementById('modalServiceCategory').value,
      pricePhp: parseInt(document.getElementById('modalServicePrice').value) || 200,
      unit: document.getElementById('modalServiceUnit').value || 'page',
      desc: document.getElementById('modalServiceDesc').value,
      formatStyles: document.getElementById('modalServiceFormats').value,
      turnaround: document.getElementById('modalServiceTurnaround').value,
      popularBadge: document.getElementById('modalServiceBadge').value,
      minQty: 1,
      defaultQty: 3
    };

    if (!sData.name) {
      alert('Please enter a service name.');
      return;
    }

    if (editingIndex >= 0) {
      currentData.services[editingIndex] = { ...currentData.services[editingIndex], ...sData };
    } else {
      currentData.services.push(sData);
    }

    saveStoreData(currentData);
    renderServicesList();
    modal.classList.remove('open');
    showToast('Service saved successfully ♡');
  });
}

// --- Portfolio Samples Manager ---
function renderSamplesList() {
  const container = document.getElementById('samplesListContainer');
  if (!container) return;

  container.innerHTML = currentData.samples.map((s, idx) => `
    <div class="admin-item-row">
      <div class="item-info-col">
        <h5>${s.title}</h5>
        <span>${s.tag} • ${s.grade}</span>
      </div>
      <div class="item-actions-col">
        <button class="btn btn-danger btn-sm" onclick="window.deleteSample(${idx})">🗑️</button>
      </div>
    </div>
  `).join('');

  window.deleteSample = (idx) => {
    if (confirm('Delete this portfolio sample?')) {
      currentData.samples.splice(idx, 1);
      saveStoreData(currentData);
      renderSamplesList();
      showToast('Sample deleted.');
    }
  };
}

function initSamplesManager() {
  document.getElementById('addNewSampleBtn')?.addEventListener('click', () => {
    const title = prompt('Enter sample title:');
    if (!title) return;
    const tag = prompt('Enter category tag (e.g. Research Paper / Slide Deck):', 'Academic Writing');
    const grade = prompt('Enter grade / award label:', 'Grade: 98/100 (A+)');

    currentData.samples.push({
      id: `sample_${Date.now()}`,
      title,
      tag: tag || 'Sample Work',
      img: 'assets/paper_mockup.jpg',
      meta: 'Academic Delivery',
      description: 'Custom academic requirement completed with distinction.',
      grade: grade || 'Grade: 98/100',
      deliverables: 'Complete DOCX, Turnitin Verification Scan'
    });

    saveStoreData(currentData);
    renderSamplesList();
    showToast('New sample work added ♡');
  });
}

// --- Reviews Manager ---
function renderReviewsList() {
  const container = document.getElementById('reviewsListContainer');
  if (!container) return;

  container.innerHTML = currentData.testimonials.map((t, idx) => `
    <div class="admin-item-row">
      <div class="item-info-col">
        <h5>${'★'.repeat(t.stars)} ${t.author} (${t.subtitle})</h5>
        <span style="display: block; max-width: 500px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          "${t.quote}"
        </span>
      </div>
      <div class="item-actions-col">
        <button class="btn btn-danger btn-sm" onclick="window.deleteReview(${idx})">🗑️</button>
      </div>
    </div>
  `).join('');

  window.deleteReview = (idx) => {
    if (confirm('Delete this review?')) {
      currentData.testimonials.splice(idx, 1);
      saveStoreData(currentData);
      renderReviewsList();
      showToast('Review removed.');
    }
  };
}

function initReviewsManager() {
  document.getElementById('addNewReviewBtn')?.addEventListener('click', () => {
    const author = prompt('Student Client Name / Alias:');
    if (!author) return;
    const subtitle = prompt('Course / Major / Order Type:', '3rd Year College');
    const quote = prompt('Review quote:');
    if (!quote) return;

    currentData.testimonials.push({
      id: `rev_${Date.now()}`,
      author,
      subtitle: subtitle || 'Student Client',
      initials: author.slice(0, 2).toUpperCase(),
      stars: 5,
      quote
    });

    saveStoreData(currentData);
    renderReviewsList();
    showToast('New review added ♡');
  });
}

// --- Proof of Payment Manager ---
let uploadedProofBase64 = '';

function renderProofsList() {
  const container = document.getElementById('proofsListContainer');
  if (!container || !currentData.proofs) return;

  container.innerHTML = currentData.proofs.map((p, idx) => `
    <div class="admin-item-row" style="align-items: center;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <img src="${p.img}" alt="${p.title}" style="width: 54px; height: 54px; border-radius: 8px; object-fit: cover; border: 1.5px solid var(--admin-border);">
        <div class="item-info-col">
          <h5>${p.title} <span style="color: var(--admin-primary); font-weight: 800; margin-left: 8px;">${p.amount}</span></h5>
          <span>${p.tag} • "${p.caption}"</span>
        </div>
      </div>
      <div class="item-actions-col">
        <button class="btn btn-danger btn-sm" onclick="window.deleteProof(${idx})">🗑️ Delete</button>
      </div>
    </div>
  `).join('');

  window.deleteProof = (idx) => {
    if (confirm('Delete this proof of payment slip?')) {
      currentData.proofs.splice(idx, 1);
      saveStoreData(currentData);
      renderProofsList();
      showToast('Proof of payment deleted.');
    }
  };
}

function initProofsManager() {
  const fileInput = document.getElementById('proofFileInput');
  const previewBox = document.getElementById('proofUploadPreview');
  const previewImg = document.getElementById('proofPreviewImg');
  const form = document.getElementById('uploadProofForm');

  // Handle Image File Selection with Canvas compression
  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress to reasonable dimensions for smooth localStorage saving
        const canvas = document.createElement('canvas');
        const maxDim = 1000;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        uploadedProofBase64 = canvas.toDataURL('image/jpeg', 0.85);

        if (previewImg && previewBox) {
          previewImg.src = uploadedProofBase64;
          previewBox.style.display = 'block';
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Handle Form Submit
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!uploadedProofBase64) {
      alert('Please select an image file first (screenshot of transaction slip).');
      return;
    }

    const title = document.getElementById('proofNewTitle').value.trim();
    const amount = document.getElementById('proofNewAmount').value.trim();
    const tag = document.getElementById('proofNewTag').value.trim();
    const caption = document.getElementById('proofNewCaption').value.trim();

    const newProof = {
      id: `proof_${Date.now()}`,
      title: title || 'Verified Client Payment',
      amount: amount || 'Verified',
      tag: tag || 'Verified Transaction',
      caption: caption || 'Student Commission Settlement',
      img: uploadedProofBase64
    };

    if (!currentData.proofs) currentData.proofs = [];
    currentData.proofs.unshift(newProof); // Add to beginning of slider

    saveStoreData(currentData);
    renderProofsList();

    // Reset Form
    form.reset();
    uploadedProofBase64 = '';
    if (previewBox) previewBox.style.display = 'none';

    showToast('Proof of payment uploaded & added to website slider! 🌸');
  });
}

// --- FAQs Manager ---
function renderFaqsList() {
  const container = document.getElementById('faqsListContainer');
  if (!container) return;

  container.innerHTML = currentData.faqs.map((f, idx) => `
    <div class="admin-item-row">
      <div class="item-info-col">
        <h5>${f.question}</h5>
        <span style="display: block; max-width: 500px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${f.answer}
        </span>
      </div>
      <div class="item-actions-col">
        <button class="btn btn-danger btn-sm" onclick="window.deleteFaq(${idx})">🗑️</button>
      </div>
    </div>
  `).join('');

  window.deleteFaq = (idx) => {
    if (confirm('Delete this FAQ item?')) {
      currentData.faqs.splice(idx, 1);
      saveStoreData(currentData);
      renderFaqsList();
      showToast('FAQ deleted.');
    }
  };
}

function initFaqsManager() {
  document.getElementById('addNewFaqBtn')?.addEventListener('click', () => {
    const question = prompt('FAQ Question:');
    if (!question) return;
    const answer = prompt('FAQ Answer:');
    if (!answer) return;

    currentData.faqs.push({
      id: `faq_${Date.now()}`,
      question,
      answer
    });

    saveStoreData(currentData);
    renderFaqsList();
    showToast('FAQ item added ♡');
  });
}

// --- Backup & Restore ---
function initBackupManager() {
  const exportBtn = document.getElementById('exportJsonBtn');
  const importBtn = document.getElementById('importJsonBtn');
  const resetBtn = document.getElementById('resetDefaultsBtn');
  const importText = document.getElementById('importJsonTextarea');

  exportBtn?.addEventListener('click', () => {
    collectFormValues();
    const jsonStr = JSON.stringify(currentData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soleil_comms_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON downloaded! 📥');
  });

  importBtn?.addEventListener('click', () => {
    try {
      const raw = importText.value.trim();
      if (!raw) {
        alert('Please paste JSON data first.');
        return;
      }
      const parsed = JSON.parse(raw);
      currentData = parsed;
      saveStoreData(parsed);
      loadDataAndPopulate();
      showToast('Data restored from JSON backup! 🌸');
    } catch (err) {
      alert('Invalid JSON format: ' + err.message);
    }
  });

  resetBtn?.addEventListener('click', () => {
    if (confirm('Are you sure you want to restore original factory defaults? All custom changes will be reset.')) {
      currentData = resetStoreData();
      loadDataAndPopulate();
      showToast('Reset to default Soleil Comms theme! 🔄');
    }
  });
}

// --- Toast Feedback ---
let adminToastTimer;
function showToast(msg) {
  const toast = document.getElementById('adminToast');
  if (!toast) return;

  toast.innerHTML = `<span>✨</span> ${msg}`;
  toast.classList.add('show');
  clearTimeout(adminToastTimer);
  adminToastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
