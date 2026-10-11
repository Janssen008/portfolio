// Soleil Comms - Central Data Store & Persistence Manager

const DEFAULT_STORE_DATA = {
  // 1. Commission Status & Announcements
  status: {
    isOpen: true,
    statusText: 'SLOTS OPEN',
    badgeText: 'ACADEMIC COMMS ARE OPEN! ♡',
    announcement: '✨ COMMISSIONS ARE OPEN! Accepting Rush & Non-Rush Slots for Upcoming Deadlines & Finals! 🌸',
    slotsRemaining: '4 / 5 Slots Available'
  },

  // 2. Branding & Contact
  brand: {
    title: 'Soleil Comms',
    tagline: 'Academic Commissions Studio',
    heroTag: '🌸 Better Grades • Brighter Future • Less Academic Stress',
    heroDescription: "Struggling with tight deadlines, complex research papers, or demanding assignments? Soleil Comms provides high-caliber, confidential, and student-friendly academic assistance crafted strictly to your syllabus and professor's rubric.",
    email: 'soleilcomms@gmail.com',
    instagram: 'https://instagram.com',
    twitter: 'https://x.com',
    telegram: 'https://t.me',
    phone: 'Available on DMs 24/7'
  },

  // 3. Services & Base Rates (in PHP)
  services: [
    {
      id: 'research',
      name: 'Research Papers & Theses',
      icon: '📖',
      category: 'writing',
      desc: 'Comprehensive academic research assistance from title defense to methodology, literature reviews, results analysis, and conclusions.',
      formatStyles: 'APA 7th, MLA, Chicago, IEEE',
      turnaround: 'Standard (4-7 days) | Rush (24-48h)',
      included: 'Plagiarism Scan + Turnitin Report',
      pricePhp: 350,
      unit: 'page',
      minQty: 2,
      defaultQty: 5,
      popularBadge: 'Most Popular'
    },
    {
      id: 'searching',
      name: 'Research Searching & Synthesis',
      icon: '🔍',
      category: 'writing',
      desc: "Can't find peer-reviewed papers? We source verified journals, PubMed, JSTOR, Scopus & ScienceDirect sources complete with synthesis matrices.",
      formatStyles: 'Summary Matrix + PDF copies + DOIs',
      turnaround: '1 - 3 Days (Rush available)',
      included: 'Peer-Reviewed & Published 2019-2026',
      pricePhp: 150,
      unit: 'source',
      minQty: 3,
      defaultQty: 5,
      popularBadge: ''
    },
    {
      id: 'editing',
      name: 'Editing & Proofreading',
      icon: '✏️',
      category: 'editing',
      desc: 'Transform your rough drafts into polished academic submissions. Includes syntax polishing, grammar, cohesion, flow, and AI score mitigation.',
      formatStyles: 'Track Changes DOCX + Clean Final',
      turnaround: 'Same-Day / 24h Express Available',
      included: 'Grammar, Vocabulary & Flow Checks',
      pricePhp: 120,
      unit: 'page',
      minQty: 2,
      defaultQty: 4,
      popularBadge: 'High Demand'
    },
    {
      id: 'essay',
      name: 'Essays & Reflection Papers',
      icon: '📝',
      category: 'writing',
      desc: 'Argumentative, narrative, descriptive, expository, and personal reflection essays written thoughtfully following your prompt.',
      formatStyles: '100% Handcrafted from Scratch',
      turnaround: '24h to 3 days',
      included: 'Senior High School & University Levels',
      pricePhp: 250,
      unit: 'page',
      minQty: 1,
      defaultQty: 3,
      popularBadge: ''
    },
    {
      id: 'presentation',
      name: 'PowerPoint & Pitch Decks',
      icon: '💻',
      category: 'slides',
      desc: 'Aesthetic, cleanly designed slide decks with infographics, concise bullet points, charts, and accompanying speaker notes for confident reporting.',
      formatStyles: 'PPTX, Canva Link & PDF',
      turnaround: '24h - 3 days',
      included: 'Custom Infographics + Speaker Notes',
      pricePhp: 150,
      unit: 'slide',
      minQty: 4,
      defaultQty: 10,
      popularBadge: 'Visuals'
    },
    {
      id: 'report',
      name: 'Reports & Case Studies',
      icon: '📋',
      category: 'writing',
      desc: 'In-depth business case analyses, laboratory reports, article critiques, SWOT matrices, and subject-specific chapter reviews.',
      formatStyles: 'Data-driven analysis & synthesis',
      turnaround: '2 - 4 Days (Rush available)',
      included: 'Free minor adjustments',
      pricePhp: 280,
      unit: 'page',
      minQty: 2,
      defaultQty: 4,
      popularBadge: ''
    },
    {
      id: 'custom',
      name: 'Overnight Rush & Custom Tasks',
      icon: '⚡',
      category: 'writing',
      desc: 'Have a submission due in 12 hours? Emergency commissions given top queue priority with real-time status communication.',
      formatStyles: 'Active messaging & draft updates',
      turnaround: 'As fast as 6 to 12 Hours',
      included: 'Subject to current daily queue',
      pricePhp: 450,
      unit: 'task',
      minQty: 1,
      defaultQty: 1,
      popularBadge: 'Priority'
    }
  ],

  // 4. Rate Multipliers & Add-ons
  multipliers: {
    speed: {
      standard: { label: 'Standard (4-7 Days)', mult: 1.0 },
      express: { label: 'Express (48 Hours)', mult: 1.35 },
      rush: { label: 'Super Rush (24 Hours)', mult: 1.70 },
      overnight: { label: 'Overnight Emergency (<12 Hours)', mult: 2.10 }
    },
    level: {
      highschool: { label: 'High School / Senior High', mult: 0.90 },
      college: { label: 'College / Undergraduate', mult: 1.0 },
      postgrad: { label: 'Post-Graduate / Masters', mult: 1.40 }
    },
    addons: {
      citationsPhp: 120,
      speakerNotesPhp: 40,
      rushQueuePhp: 200
    }
  },

  // 5. Portfolio Samples
  samples: [
    {
      id: 'sample-research',
      title: 'Digital Learning Adaptability Literature Synthesis',
      tag: 'Academic Research Paper',
      img: 'assets/paper_mockup.jpg',
      meta: 'APA 7th Edition • Grade: 98/100',
      description: 'A comprehensive 15-page literature synthesis exploring digital educational disparity during remote transitions. Followed strict APA 7th edition formatting with 28 peer-reviewed citations from Elsevier and Springer.',
      grade: 'Grade Received: 98/100 (A+)',
      deliverables: 'Complete DOCX, Annotated Bibliography, Turnitin 0% AI similarity report, Full Source PDFs'
    },
    {
      id: 'sample-ppt',
      title: 'Quarterly Growth & Strategic Vision Deck',
      tag: 'PowerPoint & Presentation',
      img: 'assets/ppt_mockup.jpg',
      meta: '14 Custom Slides • Rush: 24h Turnaround',
      description: 'An aesthetic 14-slide executive presentation prepared on an emergency 24-hour rush. Incorporated custom infographics, pastel color branding, clean data charts, and fully written speaker cue notes for each slide.',
      grade: 'Outcome: Unanimous Best Presentation Award',
      deliverables: 'Editable PPTX, Canva Pro Share Link, PDF Slide Handout, Speaker Notes'
    },
    {
      id: 'sample-banner',
      title: 'Soleil Comms Official Banner Art & Services Overview',
      tag: 'Brand Art & Master Service Index',
      img: 'assets/soleil_banner.png',
      meta: 'Soleil Comms Official • Open for Bookings',
      description: 'The complete official Soleil Comms branding banner featuring current open commission announcements, rates policy, and service offerings for rush & non-rush clients.',
      grade: 'Verified Authentic Studio Banner',
      deliverables: 'High-Resolution Visual Assets'
    }
  ],

  // 6. Testimonials
  testimonials: [
    {
      id: 'rev-1',
      author: 'Bea L.',
      subtitle: '3rd Year Nursing Major • Rush Order',
      initials: 'BL',
      stars: 5,
      quote: 'Literally saved my semester! I had 3 papers due in the same week and ordered a rush research paper. Soleil delivered 8 hours before the deadline and I got a 97 from our strict professor. Super kind and accommodating!'
    },
    {
      id: 'rev-2',
      author: 'Miguel R.',
      subtitle: 'Business Administration • Presentation Deck',
      initials: 'MR',
      stars: 5,
      quote: 'The PowerPoint slides were gorgeous! Everyone in class asked what template I used because it looked like a professional studio made it. The speaker notes made presenting effortless.'
    },
    {
      id: 'rev-3',
      author: 'Kathryn J.',
      subtitle: 'Psychology Major • Literature Synthesis',
      initials: 'KJ',
      stars: 5,
      quote: '100% legit 0% AI detection on Turnitin! Soleil sourced actual Scopus indexed articles from 2023-2025. Affordable rates and genuine care for students. Will definitely be my go-to for thesis.'
    }
  ],

  // 7. FAQs
  faqs: [
    {
      id: 'faq-1',
      question: '⚡ How fast can you complete a Rush Commission?',
      answer: 'Depending on slot capacity, rush commissions can be delivered within 12 to 24 hours, and emergency overnight orders within 6 to 12 hours. Rush slots carry a small priority multiplier to compensate for immediate queue dedication.'
    },
    {
      id: 'faq-2',
      question: '💳 What payment methods are accepted?',
      answer: 'We accept GCash, Maya, BPI / BDO Online Bank Transfer, and PayPal (for international student clients). We operate on a standard 50% reservation downpayment and 50% balance upon final review.'
    },
    {
      id: 'faq-3',
      question: '🔄 Are revisions free of charge?',
      answer: 'Yes! We provide free minor revisions within 3 days (72 hours) after delivery to address professor feedback or stylistic adjustments. Major additions outside the original prompt instructions will be billed fairly.'
    },
    {
      id: 'faq-4',
      question: '🔒 How do you protect client privacy & confidentiality?',
      answer: 'Your anonymity is our utmost priority. All personal information, student identification numbers, and school headers are scrubbed. Your files and identity are never shared, published, or repurposed.'
    },
    {
      id: 'faq-5',
      question: '🤖 How do you ensure Plagiarism & AI-Free work?',
      answer: 'All papers are manually researched and drafted from scratch. Before every submission, we run comprehensive scans using premium plagiarism checkers and Turnitin AI detection algorithms. A complimentary verification PDF is provided upon request.'
    }
  ],

  // 8. Proof of Payment Receipts
  proofs: [
    {
      id: 'proof-1',
      title: 'Digital Wallet Downpayment Confirmation',
      caption: '50% Slot Reservation - Thesis Literature Synthesis',
      amount: '₱1,450.00',
      tag: 'Verified Transaction • GCash / Maya',
      img: 'assets/proof_1.jpg'
    },
    {
      id: 'proof-2',
      title: 'Direct Bank Transfer to Soleil Comms',
      caption: 'Final Balance Settle - 24h Rush Presentation Deck',
      amount: '₱2,250.00',
      tag: 'Verified Transaction • Bank Transfer',
      img: 'assets/proof_2.jpg'
    }
  ]
};

const STORAGE_KEY = 'soleil_comms_data';

export function getStoreData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STORE_DATA,
      ...parsed,
      proofs: (parsed.proofs && parsed.proofs.length > 0) ? parsed.proofs : DEFAULT_STORE_DATA.proofs
    };
  } catch (err) {
    console.warn('Error reading from localStorage, using default data:', err);
    return JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
  }
}

export function saveStoreData(newData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    // Dispatch an event for reactive updates in other tabs/windows
    window.dispatchEvent(new CustomEvent('soleil-store-updated', { detail: newData }));
    return true;
  } catch (err) {
    console.error('Failed saving data to localStorage:', err);
    return false;
  }
}

export function resetStoreData() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('soleil-store-updated', { detail: DEFAULT_STORE_DATA }));
  return JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
}
