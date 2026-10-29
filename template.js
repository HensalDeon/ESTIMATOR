// Default quotation template. Every new quote starts from this.
window.createDefaultQuote = function () {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  return {
    from: {
      name: 'Hensal Deon',
      tagline: 'Freelance Web Developer',
      email: 'hensaldeon777@gmail.com',
      phone: '+91 9961874527',
      website: '',
    },
    client: {
      name: 'Client Name',
      company: 'Client Company',
      email: '',
      phone: '',
    },
    meta: {
      title: 'Website Design & Development Proposal',
      subtitle: 'A custom 5-page WordPress website: design, development and launch',
      number: `Q-${iso.replace(/-/g, '')}-01`,
      date: iso,
      validDays: 14,
      currency: 'CAD',
      symbol: '$',
      accent: '#b08d57',
      showValues: true,
    },

    intro:
      "Thank you for the opportunity to propose your new website. You're looking for a premium, elegant online presence: a site that shows luxury craftsmanship at first glance, builds trust, and turns visitors into enquiries.\n\n" +
      "I'll design and build a fully custom 5-page WordPress website (Home, About, two Service pages and Contact). It will be fast, mobile-first, search-engine ready and easy for you to update yourself. " +
      "You'll see and approve the complete design before development starts, so there are no surprises. Development begins only after you've signed off on the design and the scope.",
    overviewNote:
      'Design inspiration: rivedilluxuryfinishes.ca. Your website will be an original, custom design with the same premium, high-end look and feel, tailored to your brand.',

    highlights: [
      { value: '5', label: 'Custom pages' },
      { value: '100%', label: 'Mobile responsive' },
      { value: '90+', label: 'PageSpeed target' },
      { value: '~4 wks', label: 'Design to launch' },
      { value: '30 days', label: 'Free support' },
    ],

    pages: [
      { name: 'Home', desc: 'Striking hero with a clear call to action, services highlight, about teaser, featured work showcase, video testimonials and an enquiry banner.' },
      { name: 'About', desc: 'Your story, craftsmanship and values, why clients choose you, credentials and a trust-building call to action.' },
      { name: 'Service Page 1', desc: 'Service overview, key benefits, process, image showcase, FAQs and a dedicated enquiry call to action.' },
      { name: 'Service Page 2', desc: 'Same conversion-focused structure, with content, imagery and SEO tailored to the second service.' },
      { name: 'Contact', desc: 'Spam-protected enquiry form, click-to-call, email, Google Map, business hours and social links.' },
    ],

    groups: [
      {
        title: 'Discovery & Strategy',
        value: 80,
        items: [
          'Kick-off call to understand your business, audience and goals',
          'Review of your reference website and 2–3 local competitors',
          'Sitemap and page-by-page content structure',
          'Conversion plan: calls to action placed to maximise enquiries',
        ],
      },
      {
        title: 'Custom UI/UX Design (Figma)',
        value: 350,
        items: [
          'Bespoke premium design inspired by your reference, never a template',
          'High-fidelity designs of all 5 pages for desktop and mobile',
          'Brand-aligned colour palette, typography and style guide',
          'Clickable prototype to experience the site before it is built',
          '2 rounds of design revisions included',
          'Final design sign-off and scope confirmation before development',
        ],
      },
      {
        title: 'WordPress Development',
        value: 650,
        items: [
          'Pixel-perfect build of the approved design on the latest WordPress',
          '5 fully responsive pages: Home, About, 2 Services, Contact',
          'Mobile-first, tested on phones, tablets, laptops and large screens',
          'Cross-browser tested in Chrome, Safari, Firefox and Edge',
          'Subtle scroll animations and premium hover interactions',
          'Video testimonials with lightweight, lazy-loaded embeds',
          'Contact form with spam protection and instant email alerts',
          'Click-to-call, click-to-email, Google Map and social links',
          'Easy content editing: update text and images without a developer',
        ],
      },
      {
        title: 'Performance & Speed Optimisation',
        value: 180,
        items: [
          'Targeting a 90+ Google PageSpeed score',
          'Core Web Vitals optimised (LCP, CLS, INP)',
          'Images converted to next-gen WebP/AVIF and compressed',
          'Lazy loading for images, videos and maps',
          'CSS/JS minification, critical CSS and removal of unused code',
          'Server-level page and browser caching (LiteSpeed Cache)',
          'Font optimisation and preloading of key assets',
        ],
      },
      {
        title: 'Technical SEO Foundation',
        value: 200,
        items: [
          'Rank Math SEO setup with an optimised configuration',
          'Custom meta titles and descriptions for every page',
          'Semantic HTML with a correct heading hierarchy',
          'Local Business schema markup (JSON-LD) for rich results',
          'XML sitemap, robots.txt and canonical URLs',
          'Open Graph social share previews',
          'SEO-friendly URLs and image alt text',
          'Google Search Console and Analytics 4 setup, plus sitemap submission',
          'Google Business Profile linking guidance for local ranking',
        ],
      },
      {
        title: 'Security & Reliability',
        value: 100,
        items: [
          'SSL (HTTPS) setup with forced secure redirects',
          'Security hardening, firewall and login protection',
          'Built-in spam protection on all forms (honeypot anti-spam)',
          'Automated backup configuration',
          'Only essential, well-maintained plugins: lean and secure',
        ],
      },
      {
        title: 'Deployment & Launch',
        value: 120,
        items: [
          'Guided setup of Hostinger hosting and domain on your own accounts',
          'Full deployment to your Hostinger server',
          'Domain connection, DNS and SSL configuration',
          'Pre-launch QA checklist: links, forms, speed, mobile, SEO',
          'Business email DNS records guidance (if required)',
        ],
      },
      {
        title: 'Training, Handover & Support',
        value: 120,
        items: [
          'Recorded 1-on-1 training session on managing your website',
          'Step-by-step guide for editing your pages',
          'Full admin access and ownership handed over to you',
          '30 days of free post-launch support and bug fixes',
        ],
      },
      {
        title: 'Bonus Extras (Complimentary)',
        value: 90,
        items: [
          'Custom branded 404 page',
          'Privacy Policy page (template)',
          'Cookie consent banner',
          'Favicon and app icons',
          'Accessibility best practices (WCAG 2.1 basics)',
        ],
      },
    ],

    tech: [
      'WordPress 6.x (latest)',
      'PHP 8.3+',
      'Gutenberg Block Editor',
      'Lightweight performance theme',
      'Figma design & prototype',
      'WebP / AVIF images',
      'Hostinger hosting',
      'LiteSpeed Cache',
      'Rank Math SEO',
      'Schema.org JSON-LD',
      'Google Analytics 4',
      'Google Search Console',
      'Honeypot anti-spam',
      'SSL / HTTPS',
    ],

    pricing: {
      packagePrice: 675,
      discountLabel: 'Small Business Launch Pricing',
      priceSub: 'One-time fee: design, development & launch',
      note:
        'Hosting and domain are not included in this package. They will be purchased on your own accounts, so you keep full ownership and control of billing. I will guide you through the setup and handle the complete deployment for you.',
    },

    payment: [
      { label: 'Deposit', percent: 20, trigger: 'On acceptance. Design work begins.' },
      { label: 'Design approval', percent: 30, trigger: 'On design sign-off. Development begins.' },
      { label: 'Launch', percent: 50, trigger: 'Before go-live and handover.' },
    ],

    timeline: [
      { phase: 'Discovery & Kick-off', duration: 'Days 1–2', desc: 'Kick-off call, content checklist, sitemap and page structure.', milestone: false },
      { phase: 'UI/UX Design', duration: 'Days 3–7', desc: 'Desktop and mobile designs of all 5 pages in Figma, with a clickable prototype.', milestone: false },
      { phase: 'Review & Design Approval', duration: 'Days 8–10', desc: 'Your feedback, 2 revision rounds, then final design approval and scope confirmation.', milestone: true },
      { phase: 'Development', duration: 'Days 11–20', desc: 'WordPress build, responsive layouts, forms, animations and content entry.', milestone: false },
      { phase: 'Optimisation & QA', duration: 'Days 21–23', desc: 'Speed, SEO and security setup, cross-device testing and your final review.', milestone: false },
      { phase: 'Deployment & Launch', duration: 'Days 24–25', desc: 'Go live on Hostinger with domain and SSL, then connect Search Console and Analytics.', milestone: true },
      { phase: 'Post-launch Support', duration: '30 days', desc: 'Bug fixes, training session and full handover.', milestone: false },
    ],

    thirdParty: [
      { item: 'Domain name (.ca / .com)', estimate: 'approx. CAD $5–30 / year', note: 'Registered in your name' },
      { item: 'Hostinger WordPress hosting', estimate: 'approx. CAD $4–5 / month', note: 'Fast, reliable hosting where your site will be deployed' },
      { item: 'Business email (optional)', estimate: 'approx. CAD $8–10 / user / month', note: 'e.g. Google Workspace' },
      { item: 'Premium plugins / stock photos', estimate: 'Only if requested', note: 'Not required for the standard build' },
    ],

    addons: [
      { title: 'Additional page', price: 75, unit: '/ page', desc: 'Extra service or landing page in the same design system' },
      { title: 'Gallery / Portfolio page', price: 90, unit: '', desc: 'Filterable project gallery with lightbox' },
      { title: 'French language version', price: 250, unit: '', desc: 'Bilingual EN/FR website for Canadian audiences' },
      { title: 'Blog setup', price: 80, unit: '', desc: 'SEO-ready blog listing and article template' },
      { title: 'Copywriting', price: 40, unit: '/ page', desc: 'SEO-friendly page content written for you' },
      { title: 'Logo / brand refresh', price: 150, unit: '', desc: 'Modern logo refresh with brand colours and fonts' },
      { title: 'Website care plan', price: 35, unit: '/ month', desc: 'Updates, backups, security monitoring and small edits' },
    ],

    clientProvides: [
      'Logo, preferably vector (SVG, AI or PDF)',
      'Page text (I will polish formatting and structure)',
      'High-quality photos and videos of your work',
      'Client testimonials (text or video)',
      'Access to hosting and domain accounts once created',
      'Feedback within 2 business days at each review stage',
    ],

    exclusions: [
      'Domain registration and renewals',
      'Hosting fees and business email subscriptions',
      'Premium plugin/theme licences or stock images (if requested)',
      'E-commerce / online shop functionality',
      'Professional copywriting, photography or video production',
      'Pages or features beyond the confirmed scope',
      'Ongoing maintenance after the 30-day support period',
    ],

    terms: [
      'This quotation is valid until the date shown above.',
      'Design includes 2 rounds of revisions. Additional revisions are billed at CAD $30/hour.',
      'Scope is confirmed at design approval. New pages or features requested after approval will be quoted separately.',
      'Timelines depend on receiving content and feedback on time. Delays may move the launch date.',
      'The deposit is non-refundable once design work has started.',
      'Full ownership of the website and design files transfers to you on final payment.',
      'All prices are in Canadian Dollars (CAD).',
      'I may showcase the completed project in my portfolio unless you ask me not to.',
    ],

    acceptance:
      'To proceed, please sign below or reply in writing to accept. Design work starts once the deposit is received.',
  };
};
