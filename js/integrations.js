
(function (){

    // const SELECTOR_ID = 'currencySelect';
    // const STORAGE_KEY = 'psh_currency';

    // function formatPriceForElement(el, currency){
    //     const attrName = 'data-price-' + currency.toLowerCase();
    //     const explicit = el.getAttribute(attrName);
    //     if(explicit !== null && explicit !== ''){
    //         return explicit;
    //     }
    //     if(currency === 'USD'){
    //         const usdAttr = el.getAttribute('data-price-usd');
    //         if(usdAttr !== null && usdAttr !== ''){
    //             const num = Number(usdAttr);
    //             if(!isNaN(num) && String(usdAttr).trim() !== ''){
    //                 return '$' + Number(num).toFixed(2);
    //             }
    //             return usdAttr;
    //         }
    //     }
    //     return el.textContent;
    // }

    // function updatePrices(currency){
    //     const elems = document.querySelectorAll('.price');
    //     elems.forEach(el => {
    //         el.textContent = formatPriceForElement(el, currency);
    //     });
    // }

    // function initCurrencySelector(){
    //     const sel = document.getElementById(SELECTOR_ID);
    //     if(!sel) return;
    //     const stored = localStorage.getItem(STORAGE_KEY) || 'USD';
    //     sel.value = stored;
    //     updatePrices(stored);
    //     sel.addEventListener('change', function(){
    //         const v = sel.value;
    //         localStorage.setItem(STORAGE_KEY, v);
    //         updatePrices(v);
    //     });
    // }

    const firebaseBaseUrl = 'https://platinum-star-hotel-default-rtdb.firebaseio.com/';

    async function sendToFirebase(path, data){
        if(!firebaseBaseUrl || firebaseBaseUrl.includes('YOUR_PROJECT_ID')){
            console.warn('Firebase base URL not configured. Please set firebaseBaseUrl in js/integrations.js');
            return { ok:false, error:'firebase-not-configured' };
        }
        const url = firebaseBaseUrl.replace(/\/+$/,'') + '/' + path + '.json';
        try{
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const body = await res.json();
            return { ok: res.ok, body };
        }catch(err){
            console.error('Firebase send error', err);
            return { ok:false, error: err };
        }
    }

    // --- Form handlers ---
    function initContactForm(){
        const form = document.getElementById('contactForm');
        if(!form) return;
        form.addEventListener('submit', async function(e){
            e.preventDefault();
            const name = form.querySelector('[name="name"]').value || '';
            const email = form.querySelector('[name="email"]').value || '';
            const message = form.querySelector('[name="message"]').value || '';
            const payload = {
                name, email, message,
                ts: new Date().toISOString()
            };
            const r = await sendToFirebase('contacts', payload);
            if(r.ok) alert('Thank you — message saved.');
            else alert('Could not save message (check Firebase configuration).');
            form.reset();
        });
    }

    function initFooterSubscribe(){
        const form = document.getElementById('footerSubscribeForm');
        if(!form) return;
        form.addEventListener('submit', async function(e){
            e.preventDefault();
            const name = form.querySelector('[name="name"]').value || '';
            const email = form.querySelector('[name="email"]').value || '';
            const payload = { name, email, ts: new Date().toISOString() };
            const r = await sendToFirebase('subscriptions', payload);
            if(r.ok) alert('Subscribed — thank you.');
            else alert('Could not subscribe (check Firebase configuration).');
            form.reset();
        });
    }

    function initBookingForm(){
        const form = document.getElementById('bookingForm');
        if(!form) return;
        form.addEventListener('submit', async function(e){
            e.preventDefault();
            const name = form.querySelector('[name="name"]').value || '';
            const email = form.querySelector('[name="email"]').value || '';
            const checkin = form.querySelector('#checkin') ? form.querySelector('#checkin').value : '';
            const checkout = form.querySelector('#checkout') ? form.querySelector('#checkout').value : '';
            const guestsSelect = form.querySelector('select');
            const guests = guestsSelect ? guestsSelect.value : '';
            const currency = localStorage.getItem(STORAGE_KEY) || 'USD';
            const payload = { name, email, checkin, checkout, guests, currency, ts: new Date().toISOString() };
            const r = await sendToFirebase('bookings', payload);
            if(r.ok){
                alert('Booking saved. We will contact you soon.');

                const modal = document.querySelector('.modalBox');
                if(modal) modal.style.display = 'none';
                document.body.style.overflow = '';
            }else alert('Could not save booking (check Firebase configuration).');
            form.reset();
        });
    }


    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', () => { initCurrencySelector(); initContactForm(); initFooterSubscribe(); initBookingForm(); });
    } else {
        initCurrencySelector(); initContactForm(); initFooterSubscribe(); initBookingForm();
    }

})();
