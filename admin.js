// Soleil Comms - Admin Dashboard Logic
import { getStoreData, saveStoreData, resetStoreData, syncStoreWithServer } from './store.js';

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
  initContactInfoManager();
  initBackupManager();

  // Cross-device sync: push existing local changes to server so mobile devices receive them,
  // or pull server data if newer
  syncStoreWithServer((serverData) => {
    currentData = serverData;
    loadDataAndPopulate();
  });
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
  if (document.getElementById('brandInstagram')) document.getElementById('brandInstagram').value = currentData.brand.instagram || '';
  if (document.getElementById('brandFacebook')) document.getElementById('brandFacebook').value = currentData.brand.facebook || '';

  // Toggle label change
  document.getElementById('statusIsOpen').addEventListener('change', (e) => {
    document.getElementById('statusToggleLabel').textContent = e.target.checked ? 'COMMISSIONS OPEN' : 'COMMISSIONS CLOSED';
  });

  // Render lists
  renderServicesList();
  renderSamplesList();
  renderReviewsList();
  renderProofsList();
}

// --- Tab Switching ---
function initTabs() {
  const tabBtns = document.querySelectorAll('.sidebar-btn[data-tab]');
  const panes = document.querySelectorAll('.admin-tab-pane');
  const heading = document.getElementById('pageHeading');

  const titles = {
    tabStatus: 'Commission Status & Announcements',
    tabServices: 'Services & Pricing Management',
    tabSamples: 'Portfolio Samples Management',
    tabReviews: 'Student Reviews & Testimonials',
    tabProofs: 'Proof of Payment & Client Receipts',
    tabContact: 'Contact & Social DM Handles',
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
  currentData.brand.instagram = document.getElementById('brandInstagram')?.value || '';
  currentData.brand.facebook = document.getElementById('brandFacebook')?.value || '';
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

  if (currentData.samples.length === 0) {
    container.innerHTML = '<p style="text-align:center; color: var(--admin-text-muted); padding: 20px 0;">No portfolio samples yet. Upload your first work above!</p>';
    return;
  }

  container.innerHTML = currentData.samples.map((s, idx) => `
    <div class="admin-item-row" style="align-items: center;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <img src="${s.img}" alt="${s.title}" style="width: 64px; height: 64px; border-radius: 8px; object-fit: cover; border: 1.5px solid var(--admin-border); flex-shrink: 0;">
        <div class="item-info-col">
          <h5>${s.title}</h5>
          <span>${s.tag} • ${s.grade}</span>
        </div>
      </div>
      <div class="item-actions-col">
        <button class="btn btn-danger btn-sm" onclick="window.deleteSample(${idx})">🗑️ Delete</button>
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
  let uploadedSampleBase64 = '';

  const fileInput = document.getElementById('sampleFileInput');
  const previewBox = document.getElementById('sampleUploadPreview');
  const previewImg = document.getElementById('samplePreviewImg');
  const form = document.getElementById('uploadSampleForm');

  // Handle image file selection with canvas compression
  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let w = img.width, h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
          else { w = Math.round((w * maxDim) / h); h = maxDim; }
        }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        uploadedSampleBase64 = canvas.toDataURL('image/jpeg', 0.88);

        if (previewImg && previewBox) {
          previewImg.src = uploadedSampleBase64;
          previewBox.style.display = 'block';
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Handle form submit
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!uploadedSampleBase64) {
      alert('Please select an image file of your work first.');
      return;
    }

    const title = document.getElementById('sampleNewTitle').value.trim();
    const tag = document.getElementById('sampleNewTag').value.trim();
    const grade = document.getElementById('sampleNewGrade').value.trim();
    const deliverables = document.getElementById('sampleNewDeliverables').value.trim();
    const desc = document.getElementById('sampleNewDesc').value.trim();

    if (!title || !tag) {
      alert('Please enter at least the work title and category tag.');
      return;
    }

    const newSample = {
      id: `sample_${Date.now()}`,
      title,
      tag,
      img: uploadedSampleBase64,
      meta: tag,
      description: desc || 'Custom academic requirement completed with distinction.',
      grade: grade || 'Grade: Received',
      deliverables: deliverables || 'Complete deliverables provided to client'
    };

    if (!currentData.samples) currentData.samples = [];
    currentData.samples.unshift(newSample); // Add to the top

    saveStoreData(currentData);
    renderSamplesList();

    // Reset form
    form.reset();
    uploadedSampleBase64 = '';
    if (previewBox) previewBox.style.display = 'none';

    showToast('Sample work uploaded & added to portfolio! 📂');
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

// --- Contact Info Manager ---
function initContactInfoManager() {
  renderContactPreview();
  syncContactFormFields();

  // Open quick-edit modal
  document.getElementById('openContactModalBtn')?.addEventListener('click', () => {
    syncModalFromData();
    document.getElementById('contactInfoModal').classList.add('active');
  });

  // Save from modal
  document.getElementById('saveContactModalBtn')?.addEventListener('click', () => {
    currentData.brand.instagram = document.getElementById('modalContactInstagram').value.trim();
    currentData.brand.facebook  = document.getElementById('modalContactFacebook').value.trim();
    saveStoreData(currentData);
    syncContactFormFields();
    renderContactPreview();
    document.getElementById('contactInfoModal').classList.remove('active');
    showToast('Contact info updated! Live site refreshed ♡');
  });

  // Save from inline form button
  document.getElementById('saveContactBtn')?.addEventListener('click', () => {
    currentData.brand.instagram = document.getElementById('contactInstagram').value.trim();
    currentData.brand.facebook  = document.getElementById('contactFacebook').value.trim();
    saveStoreData(currentData);
    syncContactFormFields();
    renderContactPreview();
    showToast('Contact info saved! ♡');
  });

  // Close modal on overlay click or cancel btn
  const modal = document.getElementById('contactInfoModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
    modal.querySelectorAll('.modal-cancel-btn').forEach(btn => {
      btn.addEventListener('click', () => modal.classList.remove('active'));
    });
  }
}

function syncContactFormFields() {
  const b = currentData.brand;
  const el = (id) => document.getElementById(id);
  if (el('contactInstagram')) el('contactInstagram').value = b.instagram || '';
  if (el('contactFacebook'))  el('contactFacebook').value  = b.facebook || '';
  if (el('brandInstagram'))   el('brandInstagram').value   = b.instagram || '';
  if (el('brandFacebook'))    el('brandFacebook').value    = b.facebook || '';
}

function syncModalFromData() {
  const b = currentData.brand;
  if (document.getElementById('modalContactInstagram')) {
    document.getElementById('modalContactInstagram').value = b.instagram || '';
  }
  if (document.getElementById('modalContactFacebook')) {
    document.getElementById('modalContactFacebook').value = b.facebook || '';
  }
}

function renderContactPreview() {
  const container = document.getElementById('contactInfoPreview');
  if (!container) return;
  const b = currentData.brand;
  const items = [
    { icon: '📸', label: 'Instagram', value: b.instagram || '—', href: b.instagram || null },
    { icon: '📘', label: 'Facebook', value: b.facebook || '—', href: b.facebook || null },
  ];
  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; margin-bottom: 4px;">
      ${items.map(item => `
        <div style="background: var(--admin-surface); border: 1px solid var(--admin-border); border-radius: 12px; padding: 16px 18px; display: flex; align-items: flex-start; gap: 12px;">
          <div style="font-size: 1.4rem; flex-shrink: 0; margin-top: 2px;">${item.icon}</div>
          <div style="min-width: 0;">
            <div style="font-size: 0.75rem; color: var(--admin-text-muted); margin-bottom: 3px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">${item.label}</div>
            ${item.href
              ? `<a href="${item.href}" target="_blank" style="font-size: 0.88rem; color: var(--admin-primary); word-break: break-all; font-weight: 500;">${item.value}</a>`
              : `<span style="font-size: 0.88rem; color: var(--admin-text); word-break: break-all;">${item.value}</span>`
            }
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
