(function(){
  'use strict';

  // UI selectors
//   const SELECTOR_ID = 'currencySelect';
//   const STORAGE_KEY = 'psh_currency';

//   // --- Price helpers ---
//   function formatPriceForElement(el, currency){
//     const attrName = 'data-price-' + currency.toLowerCase();
//     const explicit = el.getAttribute(attrName);
//     if(explicit !== null && explicit !== '') return explicit;
//     if(currency === 'USD'){
//       const usdAttr = el.getAttribute('data-price-usd');
//       if(usdAttr !== null && usdAttr !== ''){
//         const num = Number(usdAttr);
//         if(!isNaN(num) && String(usdAttr).trim() !== '') return '$' + Number(num).toFixed(2);
//         return usdAttr;
//       }
//     }
//     return el.textContent;
//   }

//   function updatePrices(currency){
//     const elems = document.querySelectorAll('.price');
//     elems.forEach(el => { el.textContent = formatPriceForElement(el, currency); });
//   }

//   function initCurrencySelector(){
//     const sel = document.getElementById(SELECTOR_ID);
//     if(!sel) return;
//     const stored = localStorage.getItem(STORAGE_KEY) || 'USD';
//     sel.value = stored;
//     updatePrices(stored);
//     sel.addEventListener('change', function(){
//       const v = sel.value; localStorage.setItem(STORAGE_KEY, v); updatePrices(v);
//     });
//   }

  // --- Firebase config ---

    const firebaseBaseUrl = 'https://platinum-star-hotel-b646e-default-rtdb.asia-southeast1.firebasedatabase.app';
  // A helper to dynamically load SDKs
  const loadScript = (src) => new Promise((resolve, reject) => {
    const s = document.createElement('script'); s.src = src; s.async = true; s.onload = resolve; s.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });

  // SDK loader & auth
  let sdkLoaded = false;
  async function loadFirebaseSdk(){
    if(!firebaseConfig) return false; // nothing to do without config
    if(window.firebase && window.firebase.apps && window.firebase.apps.length) { sdkLoaded = true; return true; }
    try{
      await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js');
      window.firebase.initializeApp(firebaseConfig);
      sdkLoaded = true;
      console.info('[integrations] Firebase SDK loaded');
      return true;
    }catch(e){
      console.warn('[integrations] Could not load Firebase SDK', e);
      sdkLoaded = false;
      return false;
    }
  }

  async function ensureSignedInAnonymous(){
    if(!sdkLoaded) return null;
    if(!window.firebase || !window.firebase.auth) return null;
    try{
      const cur = window.firebase.auth().currentUser;
      if(cur) return cur;
      const res = await window.firebase.auth().signInAnonymously();
      console.info('[integrations] Signed in anonymously');
      return res.user;
    }catch(err){
      console.warn('[integrations] Anonymous sign-in failed', err);
      return null;
    }
  }

  async function sdkPush(path, payload){
    if(!sdkLoaded || !window.firebase || !window.firebase.database) return null;
    try{
      const ref = window.firebase.database().ref(path);
      await ref.push(payload);
      return { ok:true };
    }catch(e){ console.error('[integrations] SDK push error', e); return { ok:false, error:e}; }
  }

  // --- write helper: prefer SDK push, fallback to REST
  async function sendToFirebase(path, data){
    // prefer SDK push (auth + rules handled by SDK)
    if(sdkLoaded && window.firebase && window.firebase.database){
      const sdkRes = await sdkPush(path, data);
      if(sdkRes && sdkRes.ok) return sdkRes;
    }

    // fallback REST (no auth token) — only works if DB rules permit
    try{
      const url = firebaseBaseUrl.replace(/\/+$/,'') + '/' + path + '.json';
      const res = await fetch(url, { method: 'POST', headers:{ 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const body = await res.json();
      if(!res.ok) console.error('[integrations] POST error', res.status, body);
      return { ok: res.ok, body };
    }catch(err){
      console.error('[integrations] sendToFirebase error', err);
      return { ok:false, error:err };
    }
  }

  // --- Forms ---
  function initContactForm(){
    const form = document.getElementById('contactForm'); if(!form) return;
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value || '';
      const email = form.querySelector('[name="email"]').value || '';
      const message = form.querySelector('[name="message"]').value || '';
      const payload = { name, email, message, ts: new Date().toISOString() };
      const r = await sendToFirebase('contacts', payload);
      if(r.ok) alert('Thank you — message saved.'); else alert('Could not save message (check Firebase configuration).');
      form.reset();
    });
  }

  function initFooterSubscribe(){
    const form = document.getElementById('footerSubscribeForm'); if(!form) return;
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value || '';
      const email = form.querySelector('[name="email"]').value || '';
      const payload = { name, email, ts: new Date().toISOString() };
      const r = await sendToFirebase('subscriptions', payload);
      if(r.ok) alert('Subscribed — thank you.'); else alert('Could not subscribe (check Firebase configuration).');
      form.reset();
    });
  }

  function initBookingForm(){
    const form = document.getElementById('bookingForm'); if(!form) return;
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value || '';
      const email = form.querySelector('[name="email"]').value || '';
      const checkin = form.querySelector('#checkin') ? form.querySelector('#checkin').value : '';
      const checkout = form.querySelector('#checkout') ? form.querySelector('#checkout').value : '';
      const guestsSelect = form.querySelector('select');
      const guests = guestsSelect ? guestsSelect.value : '';
    //   const currency = localStorage.getItem(STORAGE_KEY) || 'USD';
      const payload = { name, email, checkin, checkout, guests, ts: new Date().toISOString() };
      const r = await sendToFirebase('bookings', payload);
      if(r.ok){ alert('Booking saved. We will contact you soon.');
        const modal = document.querySelector('.modalBox'); if(modal) modal.style.display = 'none'; document.body.style.overflow = ''; }
      else alert('Could not save booking (check Firebase configuration).');
      form.reset();
    });
  }

  // Bootstrap: try to load SDK and sign-in, then init UI
  async function bootstrap(){
    try{
      await loadFirebaseSdk();
      await ensureSignedInAnonymous();
    }catch(e){ console.warn('[integrations] bootstrap error', e); }
     initContactForm(); initFooterSubscribe(); initBookingForm();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootstrap); else bootstrap();

})();
