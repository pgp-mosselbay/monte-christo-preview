/* Monte Christo Retirement Village — page behaviour (no dependencies).
   Language-specific strings come from window.MC_TEXT, written into each page at build time. */
(function () {
  'use strict';
  var T = window.MC_TEXT || {};
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Text size (A / A / A) ---------- */
  var page = document.getElementById('page');
  var sizeBtns = document.querySelectorAll('.size-btn');
  function setSize(i) {
    page.setAttribute('data-size', String(i));
    sizeBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.size === String(i) ? 'true' : 'false'); });
    store.set('mc-text-size', String(i));
  }
  sizeBtns.forEach(function (b) { b.addEventListener('click', function () { setSize(+b.dataset.size); }); });
  var savedSize = +store.get('mc-text-size');
  if (savedSize) setSize(savedSize);

  /* ---------- Language: remember choice ---------- */
  var langBtn = document.querySelector('.lang-btn');
  if (langBtn) langBtn.addEventListener('click', function () { store.set('mc-lang', langBtn.getAttribute('hreflang')); });

  /* ---------- Floor plan / site plan viewer ---------- */
  var modal = document.getElementById('modal');
  var modalImg = document.getElementById('modal-img');
  var modalTitle = document.getElementById('modal-title');
  var closeBtn = document.getElementById('modal-close');
  var lastFocus = null;
  function openModal(src, title) {
    lastFocus = document.activeElement;
    modalImg.src = src; modalImg.alt = title; modalTitle.textContent = title;
    modal.hidden = false; document.body.style.overflow = 'hidden'; closeBtn.focus();
  }
  function closeModal() {
    modal.hidden = true; document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('[data-modal-img]').forEach(function (el) {
    el.addEventListener('click', function () { openModal(el.dataset.modalImg, el.dataset.modalTitle); });
  });
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  /* ---------- Enquiry form ---------- */
  var form = document.getElementById('enquiry');
  var thanks = document.getElementById('thanks');
  var unitNote = document.getElementById('unit-note');
  var interestBtns = form.querySelectorAll('.interest-btn');

  function setInterest(value, unit) {
    form.interest.value = value;
    if (unit !== undefined) form.unit.value = unit;
    interestBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.value === value ? 'true' : 'false'); });
    var showUnit = value === 'unit' && form.unit.value;
    unitNote.hidden = !showUnit;
    if (showUnit) unitNote.textContent = T.unitNote.replace('__UNIT__', form.unit.value);
  }
  interestBtns.forEach(function (b) { b.addEventListener('click', function () { setInterest(b.dataset.value); }); });

  // "Book a viewing", "Enquire about this unit", "Request the price list" pre-select the enquiry type.
  document.querySelectorAll('[data-interest]').forEach(function (el) {
    el.addEventListener('click', function () {
      form.hidden = false; thanks.hidden = true;
      setInterest(el.dataset.interest, el.dataset.unit || (el.dataset.interest === 'unit' ? form.unit.value : ''));
    });
  });

  function validate() {
    var errs = {
      name: !form.name.value.trim(),
      phone: form.phone.value.replace(/\D/g, '').length < 9,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim())
    };
    Object.keys(errs).forEach(function (k) {
      form.querySelector('[data-error="' + k + '"]').hidden = !errs[k];
      form[k].setAttribute('aria-invalid', errs[k] ? 'true' : 'false');
    });
    return !errs.name && !errs.phone && !errs.email;
  }

  function showThanks() {
    var i = form.interest.value;
    var line = (i === 'unit' && !form.unit.value) ? T.thanksLine.unitNone : T.thanksLine[i];
    document.getElementById('thanks-title').textContent = T.thanks.replace('__NAME__', form.name.value.trim());
    document.getElementById('thanks-line').textContent = line.replace('__PHONE__', form.phone.value.trim()).replace('__UNIT__', form.unit.value);
    form.hidden = true; thanks.hidden = false; thanks.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    var endpoint = form.dataset.endpoint;
    if (!endpoint) { showThanks(); return; } // TODO(developer): set data-endpoint so enquiries are delivered.
    var btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); showThanks(); })
      .catch(function () { alert(T.sendError); })
      .then(function () { btn.disabled = false; });
  });

  document.getElementById('another').addEventListener('click', function () {
    form.message.value = ''; thanks.hidden = true; form.hidden = false;
  });
})();
