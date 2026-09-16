/**
 * NKL GmbH – gemeinsames Frontend-Skript für alle Seiten.
 * Enthält: mobiles Navigations-Menü, Kontaktformular-Handling.
 */

document.addEventListener("DOMContentLoaded", function () {
  initMobileNav();
  initContactForm();
  updateFooterYear();
});

/**
 * Trägt das aktuelle Jahr in den Footer-Copyright-Hinweis ein.
 */
function updateFooterYear() {
  var yearEl = document.querySelector("#year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * Öffnet/schließt das mobile Navigationsmenü und hält den
 * aria-expanded-Status des Toggle-Buttons synchron.
 */
function initMobileNav() {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Menü schließen, wenn ein Link angeklickt wird (z. B. auf dem Handy)
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/**
 * Da dieses Projekt (noch) kein Backend besitzt, wird das Absenden des
 * Kontaktformulars clientseitig abgefangen und dem Nutzer eine
 * Bestätigung angezeigt. Sobald ein Formular-Endpunkt zur Verfügung
 * steht, kann hier der echte Versand (fetch/POST) ergänzt werden.
 */
function initContactForm() {
  var form = document.querySelector("#contact-form");

  if (!form) {
    return;
  }

  var status = form.querySelector(".form-status");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var name = form.querySelector("#name").value.trim();

    if (status) {
      status.textContent =
        "Vielen Dank, " + name + "! Ihre Nachricht wurde erfasst. " +
        "Hinweis: Dieses Formular ist noch nicht an ein Backend angebunden – " +
        "die Anbindung folgt in einem späteren Schritt.";
      status.classList.add("is-visible");
    }

    form.reset();
  });
}
