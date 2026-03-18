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

  // ... qui puoi aggiungere il resto del flow ...
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
