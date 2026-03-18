// main.js
import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // entra su questo indirizzo
  console.log('Vado su we-wealth...');
  await page.goto('https://www.we-wealth.com/it', { waitUntil: 'load' });
  console.log('Pagina caricata.');

  // aspetta 10 secondi per sicurezza
  await page.waitForTimeout(10000);

  // 1) accetta cookie (se il bottone esiste)
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
    } else {
      console.log('Nessun banner pubblicità trovato.');
    }
  } catch (e) {
    console.log('Errore chiusura pubblicità:', e);
  }

  // 3) resto del flow: qui continui SEMPRE
  try {
    await page.waitForTimeout(3000);

    // qui aggiungi gli step BYNIGHTS veri (click, form, ecc.)
    console.log('Proseguo con il resto del flow...');
  } catch (e) {
    console.log('Errore nel resto del flow:', e);
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
