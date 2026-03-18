export async function runWeWealthFlow() {
  // STEP 1: vai sul sito, ma solo se siamo in un browser
  if (typeof window !== "undefined" && window.location) {
    if (!window.location.href.startsWith("https://www.we-wealth.com/it")) {
      window.location.href = "https://www.we-wealth.com/it";
      // aspetta che la pagina ricarichi prima di continuare
      return;
    }
  }

  // 1.b aspetta 10 secondi
  await wait(10000);

  // accetta i cookie
  try {
    var cookieBtn = document.querySelector(
      'button[aria-label*="Accetta"], ' +
      'button[aria-label*="accept"], ' +
      '.cookie-accept, ' +
      'button.accept'
    );
    if (cookieBtn) {
      cookieBtn.click();
      console.log("Cookie accettati.");
    } else {
      console.log("Nessun pulsante cookie trovato.");
    }
  } catch (e) {
    console.log("Errore cookie:", e);
  }

  // ... resto del codice uguale ...
}
