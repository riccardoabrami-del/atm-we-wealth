// atm-we-wealth.js

// --- helper base ---
export function wait(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

export function waitForElement(selector, timeoutMs) {
  return new Promise(function (resolve, reject) {
    var start = Date.now();
    (function check() {
      var el = document.querySelector(selector);
      if (el) return resolve(el);
      if (Date.now() - start > timeoutMs) {
        return reject(new Error("Timeout in attesa di " + selector));
      }
      requestAnimationFrame(check);
    })();
  });
}

// STEP 3: genera email riccardo.abrami+XXX@we-wealth.com (XXX = 3 cifre 0–9)
export function generaEmailWeWealth() {
  var n1 = Math.floor(Math.random() * 10);
  var n2 = Math.floor(Math.random() * 10);
  var n3 = Math.floor(Math.random() * 10);
  return "riccardo.abrami+" + n1 + n2 + n3 + "@we-wealth.com";
}

// funzione principale riutilizzabile
export async function runWeWealthFlow() {
  // STEP 1: (se vuoi forzare la navigazione, va fatto dal contesto che chiama questa funzione)
  // window.location.href = "https://www.we-wealth.com";

  // 1.b aspetta 10 secondi
  await wait(10000);

  // accetta i cookie (best effort, dipende dal sito)
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

  // STEP 2: aspetta il pulsante <a class="btn-accedi otp-popup-button"> e cliccalo
  try {
    var accediLink = await waitForElement("a.btn-accedi.otp-popup-button", 60000);
    accediLink.click();
    console.log("Link .btn-accedi.otp-popup-button cliccato.");
  } catch (e) {
    console.log("Errore link accedi:", e.message);
  }

  // 2.b clicca il bottone "Accedi o registrati" (#otp-submit-button)
  try {
    var accediRegBtn = await waitForElement("#otp-submit-button", 60000);
    accediRegBtn.click();
    console.log('Bottone "Accedi o registrati" cliccato (fase pre-email).');
  } catch (e) {
    console.log("Errore bottone Accedi o registrati (pre-email):", e.message);
  }

  // STEP 3: genera email univoca riccardo.abrami+XXX@we-wealth.com
  var email = generaEmailWeWealth();
  console.log("Email generata:", email);

  // 3.b inserisci l’email nel contenitore #otp-email
  try {
    var emailInput = await waitForElement("#otp-email", 60000);
    emailInput.value = email;
    emailInput.dispatchEvent(new Event("input",  { bubbles: true }));
    emailInput.dispatchEvent(new Event("change", { bubbles: true }));
    console.log("Email inserita in #otp-email:", email);
  } catch (e) {
    console.log("Errore campo email #otp-email:", e.message);
  }

  // 3.c dopo aver verificato che c’è l’email, clicca il bottone "Invia codice via email"
  try {
    var inviaCodiceBtn = await waitForElement("#otp-start-process", 60000);
    inviaCodiceBtn.click();
    console.log('Bottone "Invia codice via email" cliccato.');
  } catch (e) {
    console.log("Errore bottone invia codice:", e.message);
  }
}
