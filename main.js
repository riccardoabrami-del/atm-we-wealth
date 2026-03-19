// main.js
import { chromium } from 'playwright';

// helper: esegue una funzione dentro la pagina
async function waitForElementOnPage(page, selector, timeoutMs) {
  return await page.evaluate(
    ({ selector, timeoutMs }) =>
      new Promise((resolve, reject) => {
        const start = Date.now();
        (function check() {
          const el = document.querySelector(selector);
          if (el) return resolve(selector);
          if (Date.now() - start > timeoutMs) {
            return reject(new Error('Timeout in attesa di ' + selector));
          }
          requestAnimationFrame(check);
        })();
      }),
    { selector, timeoutMs } // <‑ UN SOLO ARGOMENTO (oggetto)
  );
}

// genera email riccardo.abrami+XXX@we-wealth.com
function generaEmailWeWealth() {
  const n1 = Math.floor(Math.random() * 10);
  const n2 = Math.floor(Math.random() * 10);
  const n3 = Math.floor(Math.random() * 10);
  return `riccardo.abrami+${n1}${n2}${n3}@we-wealth.com`;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Vado su we-wealth...');
  await page.goto('https://www.we-wealth.com/it', { waitUntil: 'load' });
  console.log('Pagina caricata.');

  // 1.b aspetta 10 secondi
  await page.waitForTimeout(10000);

  // accetta i cookie
  try {
    await page.evaluate(() => {
      const cookieBtn = document.querySelector(
        'button[aria-label*="Accetta"], button[aria-label*="accept"], .cookie-accept, button.accept'
      );
      if (cookieBtn) {
        cookieBtn.click();
        console.log('Cookie accettati.');
      } else {
        console.log('Nessun pulsante cookie trovato.');
      }
    });
  } catch (e) {
    console.log('Errore cookie:', e);
  }

  // STEP 2: aspetta il link .btn-accedi.otp-popup-button e cliccalo
  try {
    await waitForElementOnPage(page, 'a.btn-accedi.otp-popup-button', 60000);
    await page.evaluate(() => {
      const accediLink = document.querySelector('a.btn-accedi.otp-popup-button');
      if (accediLink) accediLink.click();
    });
    console.log('Link .btn-accedi.otp-popup-button cliccato.');
  } catch (e) {
    console.log('Errore link accedi:', e.message);
  }

  // 2.b clicca il bottone "Accedi o registrati" (#otp-submit-button)
  try {
    await waitForElementOnPage(page, '#otp-submit-button', 60000);
    await page.evaluate(() => {
      const accediRegBtn = document.querySelector('#otp-submit-button');
      if (accediRegBtn) accediRegBtn.click();
    });
    console.log('Bottone "Accedi o registrati" cliccato (fase pre-email).');
  } catch (e) {
    console.log('Errore bottone Accedi o registrati (pre-email):', e.message);
  }

  // STEP 3: genera email univoca
  const email = generaEmailWeWealth();
  console.log('Email generata:', email);

  // 3.b inserisci l’email nel contenitore #otp-email
  try {
    await waitForElementOnPage(page, '#otp-email', 60000);
    await page.evaluate(({ email }) => {
      const emailInput = document.querySelector('#otp-email');
      if (emailInput) {
        emailInput.value = email;
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        emailInput.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('Email inserita in #otp-email:', email);
      }
    }, { email });
  } catch (e) {
    console.log('Errore campo email #otp-email:', e.message);
  }

  // 3.c clicca il bottone "Invia codice via email"
  try {
    await waitForElementOnPage(page, '#otp-start-process', 60000);
    await page.evaluate(() => {
      const inviaCodiceBtn = document.querySelector('#otp-start-process');
      if (inviaCodiceBtn) inviaCodiceBtn.click();
    });
    console.log('Bottone "Invia codice via email" cliccato.');
  } catch (e) {
    console.log('Errore bottone invia codice:', e.message);
  }

  console.log('Flow completato, chiudo il browser.');
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
