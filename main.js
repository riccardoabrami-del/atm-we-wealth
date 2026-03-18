// main.js
import { chromium } from 'playwright';

// genera email riccardo.abrami+XYZ@we-wealth.com
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

  // aspetta 10 secondi per sicurezza
  await page.waitForTimeout(10000);

  // 1) accetta cookie (best effort)
  try {
    const cookieBtn = await page.$(
      'button[aria-label*="Accetta"], ' +
      'button[aria-label*="accept"], ' +
      '.cookie-accept, ' +
      'button.accept'
    );
    if (cookieBtn) {
      await cookieBtn.click();
      console.log('Cookie accettati.');
      await page.waitForTimeout(1000);
    } else {
      console.log('Nessun pulsante cookie trovato.');
    }
  } catch (e) {
    console.log('Errore cookie:', e);
  }

  // 2) chiudi eventuale pubblicità con la X (se esiste)
  try {
    const closeAdBtn = await page.$('#banner_interstitial_close_b');
    if (closeAdBtn) {
      await closeAdBtn.click();
      console.log('Pubblicità chiusa.');
      await page.waitForTimeout(1000);
    } else {
      console.log('Nessun banner pubblicità trovato.');
    }
  } catch (e) {
    console.log('Errore chiusura pubblicità:', e);
  }

  // --- RESTO DEL FLOW BYNIGHTS ---

  // 2.a clicca link .btn-accedi.otp-popup-button
  try {
    const accediLink = await page.waitForSelector('a.btn-accedi.otp-popup-button', {
      timeout: 60000
    });
    await accediLink.click();
    console.log('Link .btn-accedi.otp-popup-button cliccato.');
  } catch (e) {
    console.log('Errore link accedi:', e.message);
  }

  // 2.b clicca bottone "Accedi o registrati" (#otp-submit-button)
  try {
    const accediRegBtn = await page.waitForSelector('#otp-submit-button', {
      timeout: 60000
    });
    await accediRegBtn.click();
    console.log('Bottone "Accedi o registrati" cliccato (fase pre-email).');
  } catch (e) {
    console.log('Errore bottone Accedi o registrati (pre-email):', e.message);
  }

  // 3) genera email univoca
  const email = generaEmailWeWealth();
  console.log('Email generata:', email);

  // 3.b inserisci l’email in #otp-email
  try {
    const emailInput = await page.waitForSelector('#otp-email', { timeout: 60000 });
    await emailInput.fill('');
    await emailInput.type(email, { delay: 50 });
    console.log('Email inserita in #otp-email:', email);
  } catch (e) {
    console.log('Errore campo email #otp-email:', e.message);
  }

  // 3.c clicca bottone "Invia codice via email" (#otp-start-process)
  try {
    const inviaCodiceBtn = await page.waitForSelector('#otp-start-process', {
      timeout: 60000
    });
    await inviaCodiceBtn.click();
    console.log('Bottone "Invia codice via email" cliccato.');
  } catch (e) {
    console.log('Errore bottone invia codice:', e.message);
  }

  console.log('Flow completato, chiudo il browser.');
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
