// main.js
import { chromium } from 'playwright';

async function runWeWealthFlowInPage(page) {
  // aspetta 10 secondi (simile a await wait(10000);)
  await page.waitForTimeout(10000);

  // accetta cookie
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

  // chiudi eventuale pubblicità con la X
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

  // --- resto del flow: qui continua SEMPRE, anche se non ci sono cookie/pubblicità ---
  try {
    // esempio: aspetta ancora un attimo e fai altri step
    await page.waitForTimeout(3000);

    // qui aggiungi gli step BYNIGHTS veri (click, form, scroll, ecc.)
    console.log('Proseguo con il resto del flow...');
  } catch (e) {
    console.log('Errore nel resto del flow:', e);
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.we-wealth.com/it', { waitUntil: 'load' });
  await runWeWealthFlowInPage(page);

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
