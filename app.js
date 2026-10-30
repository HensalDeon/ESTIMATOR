(function () {
  'use strict';

  const STORE_KEY = 'estimator.quotes.v1';
  const CURRENT_KEY = 'estimator.current.v1';

  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) =>
    String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const uid = () => 'q' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const sum = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0);

  // ---------- Editor schema ----------
  // kind: object (fixed fields) | list (repeatable rows) | text (single textarea) | lines (one item per line)
  const SCHEMA = [
    { id: 'meta', title: 'Quote details', kind: 'object', fields: [
      { k: 'title', l: 'Title' },
      { k: 'subtitle', l: 'Subtitle' },
      { k: 'number', l: 'Quote number', half: true },
      { k: 'date', l: 'Issue date', t: 'date', half: true },
      { k: 'validDays', l: 'Valid for (days)', t: 'number', half: true },
      { k: 'accent', l: 'Accent colour', t: 'color', half: true },
      { k: 'currency', l: 'Currency code', half: true },
      { k: 'symbol', l: 'Currency symbol', half: true },
      { k: 'showValues', l: 'Show item values & savings', t: 'checkbox' },
    ] },
    { id: 'from', title: 'Your details', kind: 'object', fields: [
      { k: 'name', l: 'Business / your name' },
      { k: 'tagline', l: 'Tagline' },
      { k: 'email', l: 'Email', half: true },
      { k: 'phone', l: 'Phone', half: true },
      { k: 'website', l: 'Website' },
    ] },
    { id: 'client', title: 'Client', kind: 'object', fields: [
      { k: 'name', l: 'Contact name', half: true },
      { k: 'company', l: 'Company', half: true },
      { k: 'email', l: 'Email', half: true },
      { k: 'phone', l: 'Phone', half: true },
    ] },
    { id: 'intro', title: 'Project overview', kind: 'text', rows: 9, hint: 'Blank line = new paragraph' },
    { id: 'overviewNote', title: 'Overview callout', kind: 'text', rows: 3 },
    { id: 'highlights', title: 'Highlight stats', kind: 'list', noun: 'stat', blank: { value: '', label: '' }, fields: [
      { k: 'value', l: 'Value', half: true },
      { k: 'label', l: 'Label', half: true },
    ] },
    { id: 'pages', title: 'Pages & scope', kind: 'list', noun: 'page', blank: { name: 'New page', desc: '' }, fields: [
      { k: 'name', l: 'Page name' },
      { k: 'desc', l: 'Sections / description', t: 'textarea' },
    ] },
    { id: 'groups', title: "What's included", kind: 'list', noun: 'deliverable group', blank: { title: 'New group', value: 0, items: [] }, fields: [
      { k: 'title', l: 'Group title' },
      { k: 'value', l: 'Standard value', t: 'number' },
      { k: 'items', l: 'Deliverables (one per line)', t: 'lines', rows: 6 },
    ] },
    { id: 'tech', title: 'Technology stack', kind: 'lines', rows: 8 },
    { id: 'pricing', title: 'Pricing', kind: 'object', fields: [
      { k: 'packagePrice', l: 'Package price', t: 'number', half: true },
      { k: 'discountLabel', l: 'Discount label', half: true },
      { k: 'priceSub', l: 'Price sub-line' },
      { k: 'note', l: 'Pricing note', t: 'textarea', rows: 4 },
    ] },
    { id: 'payment', title: 'Payment schedule', kind: 'list', noun: 'milestone', blank: { label: 'Milestone', percent: 0, trigger: '' }, fields: [
      { k: 'label', l: 'Milestone', half: true },
      { k: 'percent', l: 'Percent', t: 'number', half: true },
      { k: 'trigger', l: 'When' },
    ] },
    { id: 'timeline', title: 'Process & timeline', kind: 'list', noun: 'phase', blank: { phase: 'New phase', duration: '', desc: '', milestone: false }, fields: [
      { k: 'phase', l: 'Phase', half: true },
      { k: 'duration', l: 'Duration', half: true },
      { k: 'desc', l: 'Description', t: 'textarea', rows: 2 },
      { k: 'milestone', l: 'Highlight as milestone', t: 'checkbox' },
    ] },
    { id: 'thirdParty', title: 'Third-party costs', kind: 'list', noun: 'cost', blank: { item: '', estimate: '', note: '' }, fields: [
      { k: 'item', l: 'Item' },
      { k: 'estimate', l: 'Estimate', half: true },
      { k: 'note', l: 'Note', half: true },
    ] },
    { id: 'addons', title: 'Optional add-ons', kind: 'list', noun: 'add-on', blank: { title: '', price: 0, unit: '', desc: '' }, fields: [
      { k: 'title', l: 'Add-on' },
      { k: 'price', l: 'Price', t: 'number', half: true },
      { k: 'unit', l: 'Unit (e.g. / page)', half: true },
      { k: 'desc', l: 'Description' },
    ] },
    { id: 'clientProvides', title: 'What I need from client', kind: 'lines', rows: 6 },
    { id: 'exclusions', title: 'Not included', kind: 'lines', rows: 7 },
    { id: 'terms', title: 'Terms & conditions', kind: 'lines', rows: 9 },
    { id: 'acceptance', title: 'Acceptance text', kind: 'text', rows: 3 },
  ];

  let quotes = {};
  let state = null;
  const openSections = new Set(['meta', 'client']);

  // ---------- Storage ----------
  function readStore() {
    try {
      quotes = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {};
      return localStorage.getItem(CURRENT_KEY);
    } catch (e) {
      quotes = {};
      return null;
    }
  }

  let saveTimer;
  function persist() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(quotes));
        localStorage.setItem(CURRENT_KEY, state.id);
        flash('Saved');
      } catch (e) {
        flash('Not saved: export JSON to keep a copy');
      }
      renderQuoteList();
    }, 300);
  }

  let flashTimer;
  function flash(msg) {
    const el = $('#status');
    el.textContent = msg;
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => (el.textContent = ''), 1600);
  }

  function useQuote(q) {
    state = Object.assign(window.createDefaultQuote(), q);
    quotes[state.id] = state;
    renderAll();
    persist();
  }

  function newQuote() {
    const q = window.createDefaultQuote();
    q.id = uid();
    useQuote(q);
  }

  // ---------- Paths ----------
  function setPath(path, val) {
    const keys = path.split('.');
    let o = state;
    for (let i = 0; i < keys.length - 1; i++) {
      if (o[keys[i]] == null) o[keys[i]] = {};
      o = o[keys[i]];
    }
    o[keys[keys.length - 1]] = val;
  }

  function readVal(el) {
    switch (el.dataset.t) {
      case 'checkbox': return el.checked;
      case 'number': return el.value === '' ? 0 : Number(el.value);
      case 'lines': return el.value.split('\n').map((s) => s.trim()).filter(Boolean);
      default: return el.value;
    }
  }

  // ---------- Editor ----------
  function field(path, f, val, first) {
    const t = f.t || 'text';
    const attrs = `data-path="${path}" data-t="${t}"${first ? ' data-first' : ''}`;
    let input;
    if (t === 'checkbox') {
      return `<label class="ed-check"><input type="checkbox" ${attrs}${val ? ' checked' : ''}> ${esc(f.l)}</label>`;
    }
    if (t === 'textarea' || t === 'lines') {
      const v = t === 'lines' ? (val || []).join('\n') : val ?? '';
      input = `<textarea ${attrs} rows="${f.rows || (t === 'lines' ? 5 : 3)}">${esc(v)}</textarea>`;
    } else {
      input = `<input type="${t}" ${attrs} value="${esc(val ?? '')}"${t === 'number' ? ' step="any"' : ''}>`;
    }
    return `<label class="ed-field${f.half ? ' half' : ''}">${f.l ? `<span>${esc(f.l)}</span>` : ''}${input}</label>`;
  }

  function itemTitle(sec, item, i) {
    return `${i + 1}. ${item[sec.fields[0].k] || 'Untitled'}`;
  }

  function sectionBody(sec) {
    if (sec.kind === 'object') {
      return sec.fields.map((f) => field(`${sec.id}.${f.k}`, f, (state[sec.id] || {})[f.k])).join('');
    }
    if (sec.kind === 'text') return field(sec.id, { l: sec.hint || '', t: 'textarea', rows: sec.rows }, state[sec.id]);
    if (sec.kind === 'lines') return field(sec.id, { l: 'One item per line', t: 'lines', rows: sec.rows }, state[sec.id]);

    const list = state[sec.id] || [];
    const op = (name, i, label, title) =>
      `<button type="button" data-op="${name}" data-list="${sec.id}" data-i="${i}" title="${title}">${label}</button>`;
    return (
      list
        .map(
          (item, i) => `<div class="ed-item">
            <div class="ed-item-head"><span class="ed-item-title">${esc(itemTitle(sec, item, i))}</span>
              <span class="ed-item-ops">${op('up', i, '↑', 'Move up')}${op('down', i, '↓', 'Move down')}${op('del', i, '✕', 'Remove')}</span></div>
            ${sec.fields.map((f, fi) => field(`${sec.id}.${i}.${f.k}`, f, item[f.k], fi === 0)).join('')}
          </div>`
        )
        .join('') + `<button type="button" class="ed-add" data-op="add" data-list="${sec.id}">+ Add ${esc(sec.noun || 'item')}</button>`
    );
  }

  function renderEditor() {
    const root = $('#editor');
    root.innerHTML = SCHEMA.map(
      (sec) => `<details class="ed-sec" data-sec="${sec.id}"${openSections.has(sec.id) ? ' open' : ''}>
        <summary><span>${esc(sec.title)}</span><em class="ed-note" data-note="${sec.id}"></em></summary>
        <div class="ed-body">${sectionBody(sec)}</div>
      </details>`
    ).join('');
    renderNotes();
  }

  function renderNotes() {
    const set = (id, text, warn) => {
      const el = $(`[data-note="${id}"]`);
      if (!el) return;
      el.textContent = text;
      el.classList.toggle('warn', !!warn);
    };
    const pct = sum(state.payment.map((p) => p.percent));
    set('payment', `${pct}%${pct !== 100 ? ' ≠ 100%' : ''}`, pct !== 100);
    set('groups', `Value ${money(sum(state.groups.map((g) => g.value)))}`);
    set('pricing', money(state.pricing.packagePrice));
    set('pages', `${state.pages.length} pages`);
  }

  function listOp(op, key, i) {
    const list = (state[key] = state[key] || []);
    const sec = SCHEMA.find((s) => s.id === key);
    if (op === 'add') list.push(clone(sec.blank));
    else if (op === 'del') list.splice(i, 1);
    else if (op === 'up' && i > 0) [list[i - 1], list[i]] = [list[i], list[i - 1]];
    else if (op === 'down' && i < list.length - 1) [list[i + 1], list[i]] = [list[i], list[i + 1]];
    openSections.add(key);
    renderEditor();
    changed();
  }

  function changed() {
    renderPreview();
    renderNotes();
    persist();
  }

  // ---------- Formatting ----------
  function money(n) {
    const m = state.meta;
    const v = Number(n) || 0;
    const num = v.toLocaleString('en-CA', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
    return `${m.currency || ''} ${m.symbol || ''}${num}`.trim();
  }

  function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return isNaN(d) ? iso : d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function addDays(iso, days) {
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return '';
    d.setDate(d.getDate() + (Number(days) || 0));
    const pad = (x) => String(x).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  const paras = (text) =>
    String(text || '')
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p>${esc(p)}</p>`)
      .join('');

  const ul = (items, cls = 'd-checks') =>
    items && items.length ? `<ul class="${cls}">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '';

  // Printed page footer via @page margin boxes; these also replace the browser's URL/date headers.
  function renderPageFooter(q) {
    let el = document.getElementById('page-style');
    if (!el) {
      el = document.createElement('style');
      el.id = 'page-style';
      document.head.appendChild(el);
    }
    const css = (s) => `"${String(s ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ')}"`;
    const left = [q.from.name, q.meta.number && `Quotation ${q.meta.number}`].filter(Boolean).join('  ·  ');
    const box = 'font-family: Inter, sans-serif; font-size: 8pt; color: #8a8378;';
    el.textContent = `@page {
      @top-left { content: ""; } @top-center { content: ""; } @top-right { content: ""; }
      @bottom-center { content: ""; }
      @bottom-left { content: ${css(left)}; ${box} padding-left: 48px; }
      @bottom-right { content: "Page " counter(page) " of " counter(pages); ${box} padding-right: 48px; }
    }`;
  }

  // ---------- Preview ----------
  function renderPreview() {
    const q = state;
    const m = q.meta;
    document.documentElement.style.setProperty('--accent', m.accent || '#b08d57');
    renderPageFooter(q);

    const total = sum(q.groups.map((g) => g.value));
    const price = Number(q.pricing.packagePrice) || 0;
    const savings = Math.max(0, total - price);
    const showValues = m.showValues && total > price;

    let n = 0;
    const sec = (title, body, cls = '') =>
      body ? `<section class="d-sec ${cls}"><h2><span class="d-num">${String(++n).padStart(2, '0')}</span>${esc(title)}</h2>${body}</section>` : '';

    const lines = (...xs) => xs.filter(Boolean).map((x) => `<em>${esc(x)}</em>`).join('');

    const cover = `
      <header class="d-cover">
        <div class="d-cover-top">
          <div><div class="d-brand">${esc(q.from.name)}</div><div class="d-tag">${esc(q.from.tagline)}</div></div>
          <div class="d-qmeta"><span>Quotation</span><strong>${esc(m.number)}</strong></div>
        </div>
        <h1>${esc(m.title)}</h1>
        <p class="d-sub">${esc(m.subtitle)}</p>
        <div class="d-cover-grid">
          <div><span>Prepared for</span><strong>${esc(q.client.company || q.client.name)}</strong>${lines(q.client.company && q.client.name, q.client.email, q.client.phone)}</div>
          <div><span>Prepared by</span><strong>${esc(q.from.name)}</strong>${lines(q.from.email, q.from.phone, q.from.website)}</div>
          <div><span>Issued</span><strong>${esc(fmtDate(m.date))}</strong><span>Valid until</span><strong>${esc(fmtDate(addDays(m.date, m.validDays)))}</strong></div>
        </div>
      </header>
      ${q.highlights.length ? `<div class="d-highlights">${q.highlights.map((h) => `<div class="d-hl"><strong>${esc(h.value)}</strong><span>${esc(h.label)}</span></div>`).join('')}</div>` : ''}`;

    const overview = paras(q.intro) + (q.overviewNote ? `<p class="d-callout">${esc(q.overviewNote)}</p>` : '');

    const pages = q.pages.length
      ? `<div class="d-pages">${q.pages.map((p, i) => `<div class="d-page"><div class="d-page-n">${i + 1}</div><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p></div>`).join('')}</div>`
      : '';

    const groups = q.groups.length
      ? `<div class="d-groups">${q.groups
          .map(
            (g) => `<div class="d-group">
              <div class="d-group-head"><h3>${esc(g.title)}</h3>
                <span class="d-inc">Included</span>${showValues && g.value ? `<span class="d-val">Valued at ${esc(money(g.value))}</span>` : ''}</div>
              ${ul(g.items)}
            </div>`
          )
          .join('')}</div>`
      : '';

    const tech = q.tech.length ? `<div class="d-chips">${q.tech.map((t) => `<span class="d-chip">${esc(t)}</span>`).join('')}</div>` : '';

    const breakdown = showValues
      ? `<table class="d-table">
          <thead><tr><th>Deliverable</th><th class="r">Standard value</th></tr></thead>
          <tbody>${q.groups.map((g) => `<tr><td>${esc(g.title)}</td><td class="r">${esc(money(g.value))}</td></tr>`).join('')}</tbody>
          <tfoot>
            <tr><td>Total value</td><td class="r">${esc(money(total))}</td></tr>
            <tr class="d-disc"><td>${esc(q.pricing.discountLabel || 'Discount')}</td><td class="r">− ${esc(money(savings))}</td></tr>
          </tfoot>
        </table>`
      : '';
    const investment = `
      <div class="d-invest${showValues ? '' : ' solo'}">
        ${breakdown}
        <div class="d-price-box">
          <div class="d-price-label">Your investment</div>
          <div class="d-price">${esc(money(price))}</div>
          <div class="d-price-sub">${esc(q.pricing.priceSub)}</div>
          ${showValues ? `<div class="d-save">You save ${esc(money(savings))}</div>` : ''}
        </div>
      </div>
      ${q.pricing.note ? `<p class="d-callout">${esc(q.pricing.note)}</p>` : ''}`;

    // Round each milestone; the last one absorbs any rounding difference.
    const amounts = q.payment.map((p) => Math.round((price * (Number(p.percent) || 0)) / 100));
    if (amounts.length && sum(q.payment.map((p) => p.percent)) === 100) {
      amounts[amounts.length - 1] = price - sum(amounts.slice(0, -1));
    }
    const payment = q.payment.length
      ? `<table class="d-table">
          <thead><tr><th>Milestone</th><th>When</th><th class="r">%</th><th class="r">Amount</th></tr></thead>
          <tbody>${q.payment.map((p, i) => `<tr><td><strong>${esc(p.label)}</strong></td><td>${esc(p.trigger)}</td><td class="r">${esc(p.percent)}%</td><td class="r">${esc(money(amounts[i]))}</td></tr>`).join('')}</tbody>
          <tfoot><tr><td colspan="3">Total</td><td class="r">${esc(money(sum(amounts)))}</td></tr></tfoot>
        </table>`
      : '';

    const timeline = q.timeline.length
      ? `<ol class="d-timeline">${q.timeline
          .map(
            (t) => `<li class="${t.milestone ? 'ms' : ''}"><div class="d-tl-dur">${esc(t.duration)}</div>
              <div class="d-tl-body"><h4>${esc(t.phase)}${t.milestone ? ' <span class="d-ms">Milestone</span>' : ''}</h4><p>${esc(t.desc)}</p></div></li>`
          )
          .join('')}</ol>`
      : '';

    const third = q.thirdParty.length
      ? `<p class="d-lead">You pay these directly to each provider, on your own accounts. They are <strong>not part of this quotation</strong>.</p>
        <table class="d-table">
          <thead><tr><th>Item</th><th>Estimated cost</th><th>Notes</th></tr></thead>
          <tbody>${q.thirdParty.map((t) => `<tr><td><strong>${esc(t.item)}</strong></td><td>${esc(t.estimate)}</td><td>${esc(t.note)}</td></tr>`).join('')}</tbody>
        </table>`
      : '';

    const addons = q.addons.length
      ? `<p class="d-lead">Want to go further? These can be added at any time, now or after launch.</p>
        <table class="d-table">
          <thead><tr><th>Add-on</th><th>Description</th><th class="r">Price</th></tr></thead>
          <tbody>${q.addons.map((a) => `<tr><td><strong>${esc(a.title)}</strong></td><td>${esc(a.desc)}</td><td class="r">${esc(money(a.price))}${a.unit ? ` <small>${esc(a.unit)}</small>` : ''}</td></tr>`).join('')}</tbody>
        </table>`
      : '';

    const reqs =
      q.clientProvides.length || q.exclusions.length
        ? `<div class="d-cols">
            ${q.clientProvides.length ? `<div><h3>What I need from you</h3>${ul(q.clientProvides)}</div>` : ''}
            ${q.exclusions.length ? `<div><h3>Not included</h3>${ul(q.exclusions, 'd-checks d-x')}</div>` : ''}
          </div>`
        : '';

    const terms = q.terms.length ? `<ol class="d-terms">${q.terms.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>` : '';

    const accept = `${paras(q.acceptance)}
      <div class="d-sign">
        <div><div class="d-sign-line"></div><span>Client signature & date</span><strong>${esc(q.client.name)}${q.client.company ? `, ${esc(q.client.company)}` : ''}</strong></div>
        <div><div class="d-sign-line"></div><span>Authorised by</span><strong>${esc(q.from.name)}</strong></div>
      </div>`;

    $('#doc').innerHTML = `
      ${cover}
      <div class="d-body">
        ${sec('Project Overview', overview)}
        ${sec('Pages & Scope', pages)}
        ${sec("What's Included", groups)}
        ${sec('Technology & Setup', tech)}
        ${sec('Your Investment', investment, 'd-sec-invest')}
        ${sec('Payment Schedule', payment)}
        ${sec('Process & Timeline', timeline)}
        ${sec('Third-party Costs (Paid by You)', third)}
        ${sec('Optional Add-ons', addons)}
        ${sec('Project Requirements', reqs)}
        ${sec('Terms & Conditions', terms)}
        ${sec('Acceptance', accept)}
      </div>
      <footer class="d-foot"><strong>${esc(q.from.name)}</strong>${[q.from.email, q.from.phone, q.from.website].filter(Boolean).map((x) => ` · ${esc(x)}`).join('')}</footer>`;
  }

  // ---------- Saved quotes ----------
  function quoteLabel(q) {
    return `${q.meta.number || 'Untitled'} · ${q.client.company || q.client.name || 'No client'}`;
  }

  function renderQuoteList() {
    const sel = $('#quoteSelect');
    sel.innerHTML = Object.values(quotes)
      .map((q) => `<option value="${esc(q.id)}"${q.id === state.id ? ' selected' : ''}>${esc(quoteLabel(q))}</option>`)
      .join('');
  }

  function renderAll() {
    renderEditor();
    renderPreview();
    renderQuoteList();
  }

  // ---------- Events ----------
  function bind() {
    const editor = $('#editor');

    editor.addEventListener('input', (e) => {
      const el = e.target.closest('[data-path]');
      if (!el) return;
      setPath(el.dataset.path, readVal(el));
      if (el.hasAttribute('data-first')) {
        const [key, i] = el.dataset.path.split('.');
        const sec = SCHEMA.find((s) => s.id === key);
        el.closest('.ed-item').querySelector('.ed-item-title').textContent = itemTitle(sec, state[key][i], Number(i));
      }
      changed();
    });

    editor.addEventListener('click', (e) => {
      const b = e.target.closest('[data-op]');
      if (!b) return;
      e.preventDefault();
      if (b.dataset.op === 'del' && !confirm('Remove this item?')) return;
      listOp(b.dataset.op, b.dataset.list, Number(b.dataset.i));
    });

    // toggle does not bubble, so listen in the capture phase
    editor.addEventListener(
      'toggle',
      (e) => {
        const id = e.target.dataset && e.target.dataset.sec;
        if (!id) return;
        e.target.open ? openSections.add(id) : openSections.delete(id);
      },
      true
    );

    $('#quoteSelect').addEventListener('change', (e) => useQuote(quotes[e.target.value]));
    $('#btnNew').addEventListener('click', newQuote);

    $('#btnDup').addEventListener('click', () => {
      const q = clone(state);
      q.id = uid();
      q.meta.number = (q.meta.number || 'Q') + '-copy';
      useQuote(q);
      flash('Duplicated');
    });

    $('#btnDel').addEventListener('click', () => {
      if (!confirm(`Delete quote "${quoteLabel(state)}"? This cannot be undone.`)) return;
      delete quotes[state.id];
      const next = Object.values(quotes)[0];
      next ? useQuote(next) : newQuote();
    });

    $('#btnToggle').addEventListener('click', (e) => {
      const hidden = document.body.classList.toggle('preview-only');
      e.target.textContent = hidden ? 'Show editor' : 'Hide editor';
    });

    $('#btnExport').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${state.meta.number || 'quote'}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });

    $('#btnImport').addEventListener('click', () => $('#fileImport').click());
    $('#fileImport').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      e.target.value = '';
      if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        if (!data || typeof data !== 'object' || !data.meta) throw new Error('Not a quote file');
        data.id = uid();
        useQuote(data);
        flash('Imported');
      } catch (err) {
        alert('Could not import: ' + err.message);
      }
    });

    $('#btnPrint').addEventListener('click', () => {
      const prev = document.title;
      document.title = `Quotation ${state.meta.number} - ${state.client.company || state.client.name}`;
      window.print();
      document.title = prev;
    });
  }

  // ---------- Init ----------
  const currentId = readStore();
  bind();
  if (currentId && quotes[currentId]) useQuote(quotes[currentId]);
  else if (Object.keys(quotes).length) useQuote(Object.values(quotes)[0]);
  else newQuote();
})();
