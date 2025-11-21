Platinum Star Hotel Website
===========================

Overview
--------
This repository contains the static website for Platinum Star Hotel: a Bootstrap-based responsive site with pages for the homepage (`index.html`), rooms & suites, about, and contact. The project includes a small integration script (`js/integrations.js`) that lets visitors switch displayed prices between currencies and optionally POST form data to a Firebase Realtime Database.

Repository Structure
--------------------
- `index.html`                : Main landing page
- `about.html`                : About / gallery page
- `contact.html`              : Contact form page
- `room&suites.html`          : Rooms listing (price elements present)
- `css/`                      : Page-specific and global CSS files
- `js/`                       : JavaScript (`app.js`, `about.js`, `integrations.js`)
- `img/`                      : Images used across the site
- `readme.txt`                : This file

Quick Local Preview
-------------------
1. Open the project folder in VS Code.
2. Recommended: Install the "Live Server" extension and click "Go Live".
3. Alternatively run a simple static server (PowerShell):

```powershell
# From project root
# Option A: Python 3 built-in server (port 8000)
python -m http.server 8000
# Then open http://localhost:8000/index.html

# Option B: If you have Node.js installed, install http-server once:
# npm install -g http-server
# then run:
http-server -p 8000
```

Currency & Price Integration
----------------------------
The script `js/integrations.js` updates elements with the class `price` when the currency selector changes.

To show exact prices for each currency (no conversion), annotate each price element with explicit attributes:

- `data-price-usd="33"` (or `data-price-usd="$33"`)
- `data-price-thb="฿1,100"`
- `data-price-mmk="110,000 MMK"`

Example:

```html
<span class="price" data-price-usd="33" data-price-thb="฿1,100" data-price-mmk="110,000 MMK">$33</span>
```

The integration script will display the `data-price-{currency}` attribute exactly as provided for the selected currency. If an attribute is missing, the element's current text remains unchanged.

Configuring Firebase (Realtime Database)
---------------------------------------
If you want form submissions to be saved to Firebase, follow these steps:

1. Create a Firebase project
   - Go to https://console.firebase.google.com and sign in with a Google account.
   - Click "Add project", follow the prompts and create the project.

2. Enable Realtime Database
   - In the Firebase console, open your project → "Realtime Database".
   - Click "Create Database" and choose a location.
   - For testing, you may set the rules temporarily to allow public writes (NOT for production):

     Rules (temporary testing only):

     {
       "rules": {
         ".read": true,
         ".write": true
       }
     }

   - Save rules.

3. Get your database URL
   - In the Realtime Database panel you will see the URL in the form `https://<PROJECT_ID>.firebaseio.com` or `https://<PROJECT_ID>.<region>.firebasedatabase.app`.

4. Configure the site
   - Open `js/integrations.js` and set the constant `firebaseBaseUrl` to the full database root URL (no trailing slash). Example:

     ```javascript
     const firebaseBaseUrl = 'https://your-project-id.firebaseio.com';
     ```

5. Test a form submit
   - With the server running, open the site, fill the contact or subscribe form and submit.
   - If configured, the script will POST JSON to `/contacts`, `/subscriptions`, or `/bookings` under your DB root.

Security note: Do not leave the Realtime Database rules public in production. For production, configure proper authentication (Firebase Auth) and tighten rules.

Testing & Verification
----------------------
- Currency switch: change the navbar selector and confirm `.price` elements display the value from the corresponding `data-price-{currency}` attribute.
- Form writes: after configuring `firebaseBaseUrl`, submit a form and check the Realtime Database panel to see the new JSON entry.

Deployment Notes
----------------
- The site is static and can be hosted on GitHub Pages, Netlify, or any static host.
- If deploying to GitHub Pages, ensure image filename casing matches references (some hosts are case-sensitive).

Editing Tips
------------
- Update prices: edit `room&suites.html` (or other pages) and add or change the `data-price-*` attributes for each `.price` element.
- Update styles: `css/style.css` and page-specific CSS files live in `css/`.
- JavaScript: `js/app.js` controls the carousel and UI behaviors; `js/integrations.js` handles currency display and optional Firebase POSTs.

Troubleshooting
---------------
- If images do not appear: confirm files exist in `img/` and the filenames match exactly (case matters on some hosts).
- If the currency selector doesn't update prices: ensure `integrations.js` is included on the page and `.price` elements have `data-price-*` attributes.
- If form submissions fail: check the browser console for warnings about Firebase configuration; make sure `firebaseBaseUrl` is set correctly and rules allow writes for testing.

Contact
-------
For help updating content or configuring Firebase, contact LuxCode IT Solution (Thet Htoo San - 09 969 140 518) or reply here with your Firebase DB URL and I can set it for you and run a quick verification.

License / Notes
----------------
- This project is a static website. If you plan to collect production data, consider adding server-side validation and authentication for security.

Enjoy working on the Platinum Star Hotel website!
