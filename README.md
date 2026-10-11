# Soleil Comms ♡ Responsive Academic Portfolio

A client-visiting responsive portfolio and commission booking website for **Soleil Comms**, crafted to match the cozy anime study desk pastel pink aesthetic.

## ✨ Features

- **Cozy Pastel Aesthetic**: Built with soft blush tones (`#ff5c8a`, `#fff5f7`), cute badge ribbons, custom typography (`Comfortaa` & `Nunito`), and cute stationery details directly matching the official banner.
- **Official Banner Showcase**: Displays the high-resolution Soleil Comms artwork banner with click-to-expand lightbox preview.
- **7 Core Academic Services**:
  1. Research Papers & Theses
  2. Research Searching & Literature Matrices
  3. Editing & Proofreading
  4. Essays & Reflection Papers
  5. PowerPoint Presentations & Pitch Decks
  6. Reports & Case Studies
  7. Overnight Rush & Custom Academic Tasks
- **Interactive Rate Estimator & Quote Calculator**:
  - Live calculations by quantity/pages/slides, academic level, and turnaround speed (Standard, Express, Super Rush 24h, Overnight <12h).
  - Currency switcher (₱ PHP / $ USD).
  - One-click **"Copy Formatted DM"** generates an order template ready to paste into Instagram, Twitter/X, Telegram, Messenger, or Email.
- **Portfolio & Sample Showcase**:
  - Research paper mockups with APA 7th details & 0% Turnitin AI verification.
  - Presentation slide deck preview with speaker notes & infographic layout.
  - Interactive **Before & After Editing Comparison** showing raw student drafts vs. polished academic submissions.
- **Step-by-Step Commission Guide**: 4-step workflow explaining requirements, quotation, progress drafts, and 3-day free revision warranty.
- **Testimonials & Reviews**: Authentic student feedback from college and senior high school clients.
- **FAQ Accordion & Terms of Service**: Details on payment channels (GCash, Maya, Bank Transfer, PayPal), rush policies, privacy protection, and plagiarism guarantees.
- **Direct Booking Modal & Floating Action Button**: Seamless inquiry modal accessible from any section.
- **👑 Owner Admin Dashboard (`/admin.html`)**:
  - Live availability toggle (`COMMISSIONS OPEN` vs `CLOSED / WAITLIST`).
  - Top announcement notice editor.
  - Full CRUD editor for all 7 academic services, pricing (in ₱ PHP), units, turnaround times, and badges.
  - Rate calculator multiplier adjustments (Standard, Express, Super Rush, Overnight) and add-on fees.
  - Add, edit, or delete portfolio samples, client reviews, and FAQs.
  - One-click JSON backup export & restore, with factory reset support.
  - Real-time reactive sync: Changes saved in Admin immediately update the live public site without needing a server restart!

## 🚀 Running Locally

The portfolio is built with vanilla HTML5, CSS3, and JavaScript — no build steps or heavy dependencies required.

To run locally with any static server:
```bash
# Using Node / npx serve (currently running on port 3000):
npx serve -l 3000 .

# Or open index.html directly in any web browser!
```

## 📁 File Structure

```
portfolio/
├── index.html          # Main responsive webpage
├── styles.css          # Vanilla CSS styling & responsive media queries
├── app.js              # Interactive pricing calculator, modals & animations
├── README.md           # Documentation
└── assets/
    ├── soleil_banner.png   # Official artwork banner
    ├── avatar.jpg          # Soleil Comms mascot avatar
    ├── paper_mockup.jpg    # Sample research paper showcase
    └── ppt_mockup.jpg      # Sample presentation deck showcase
```
