/**
 * NKL GmbH – gemeinsames Frontend-Skript für alle Seiten.
 * Enthält: mobiles Navigations-Menü, Kontaktformular-Handling, Beiträge
 * (Startseite/Archiv), Link teilen und Bild-Großansicht.
 */

document.addEventListener("DOMContentLoaded", function () {
  initMobileNav();
  initHeroVideo();
  initContactForm();
  updateFooterYear();
  initNews();
  initDownloads();
  initShare();
  initGalleries();
});

/**
 * Startseite: Hintergrundvideo. Bei „Bewegung reduzieren“ (Betriebssystem-Einstellung)
 * bleibt nur das Standbild stehen; der Knopf unten rechts hält das Video an bzw. startet es.
 */
function initHeroVideo() {
  var video = document.querySelector(".hero__video");
  var button = document.querySelector(".hero__pause");

  if (!video) {
    return;
  }

  var pfadPause = "M7 5h3v14H7zM14 5h3v14h-3z";
  var pfadPlay = "M8 5v14l11-7z";

  function anzeigen(laeuft) {
    if (!button) {
      return;
    }
    button.setAttribute("aria-pressed", laeuft ? "false" : "true");
    button.setAttribute("aria-label", laeuft ? "Hintergrundvideo anhalten" : "Hintergrundvideo abspielen");
    button.querySelector("path").setAttribute("d", laeuft ? pfadPause : pfadPlay);
  }

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    video.removeAttribute("autoplay");
    video.pause();
    anzeigen(false);
  }

  if (button) {
    button.addEventListener("click", function () {
      if (video.paused) {
        video.play();
        anzeigen(true);
      } else {
        video.pause();
        anzeigen(false);
      }
    });
  }
}

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

  // „Unternehmen“ ist ein Button: per Klick/Tippen Untermenü auf- und zuklappen (Tablets ohne Hover)
  nav.querySelectorAll(".main-nav__toggle").forEach(function (button) {
    var item = button.parentElement;
    button.addEventListener("click", function () {
      var offen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", offen ? "true" : "false");
    });
    document.addEventListener("click", function (event) {
      if (!item.contains(event.target)) {
        item.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
      }
    });
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

/**
 * Wurzel der Website (Ordner, in dem js/main.js liegt). Damit funktionieren
 * Links auch auf Seiten in Unterordnern (z. B. beitraege/<id>.html).
 */
function siteUrl(path) {
  var self = document.querySelector('script[src*="js/main.js"]');
  var root = self ? self.src.replace(/js\/main\.js.*$/, "") : "";
  return root + path;
}

/**
 * Beiträge aus js/beitraege.js (Liste BEITRAEGE, neueste zuerst), jeweils als
 * Teaser mit Link auf die eigene Seite beitraege/<id>.html.
 * Startseite:  data-news="latest"  -> die drei neuesten Beiträge ohne archiv: true
 * Archivseite: data-news="archive" -> alle Beiträge, nach Jahren gruppiert
 */
var NEWS_ON_HOMEPAGE = 3;
var NEWS_TEASER_LENGTH = 160;

function initNews() {
  var lists = document.querySelectorAll("[data-news]");

  if (!lists.length || typeof BEITRAEGE === "undefined") {
    return;
  }

  lists.forEach(function (list) {
    var art = list.getAttribute("data-news");

    if (art === "latest") {
      var items = BEITRAEGE.filter(function (item) {
        return !item.archiv;
      }).slice(0, NEWS_ON_HOMEPAGE);
      list.innerHTML = items.length
        ? items.map(renderNewsTeaser).join("")
        : "<p>Derzeit gibt es keine Beiträge.</p>";
      return;
    }

    // Archiv: Jahres-Überschrift vor dem ersten Beitrag eines Jahres
    var jahr = "";
    list.innerHTML = BEITRAEGE.map(function (item) {
      var j = item.id.slice(0, 4);
      var kopf = j !== jahr ? '<h2 class="news-year" id="jahr-' + j + '">' + j + "</h2>" : "";
      jahr = j;
      return kopf + renderNewsTeaser(item);
    }).join("");
  });
}

function renderNewsTeaser(item) {
  var url = siteUrl("beitraege/" + item.id + ".html");
  var bild = item.bilder && item.bilder.length ? item.bilder[0] : null;
  var bildHtml = "";

  if (bild) {
    var datei = typeof bild === "string" ? bild : bild.datei;
    var beschreibung = (typeof bild === "string" ? "" : bild.beschreibung || "").replace(/"/g, "&quot;");
    bildHtml =
      '<a class="news-item__thumb" href="' + url + '" tabindex="-1" aria-hidden="true">' +
        '<img src="' + siteUrl(datei) + '" alt="' + beschreibung + '" loading="lazy">' +
      "</a>";
  }

  return (
    '<article class="news-item news-item--teaser' + (bildHtml ? " news-item--media" : "") + '">' +
      '<div class="news-item__body">' +
        '<span class="news-item__date">' + item.datum + "</span>" +
        '<h3 class="news-item__title"><a href="' + url + '">' + item.titel + "</a></h3>" +
        (item.komplett
          ? "<p>" + item.text + "</p>"
          : "<p>" + newsTeaser(item) + "</p>" +
            '<a class="news-item__more" href="' + url + '">Weiterlesen <span aria-hidden="true">→</span></a>') +
      "</div>" +
      bildHtml +
    "</article>"
  );
}

/**
 * Downloads und Präsentationen aus js/downloads.js (Liste DOWNLOADS, erzeugt aus
 * content/downloads, gepflegt im CMS). Füllt jeden Bereich [data-downloads="…"].
 * Ohne Datei erscheint der Eintrag als „In Vorbereitung“.
 */
function initDownloads() {
  var listen = document.querySelectorAll("[data-downloads]");

  if (!listen.length || typeof DOWNLOADS === "undefined") {
    return;
  }

  var icon =
    '<svg class="download-item__icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">' +
    '<path d="M12 4h16l8 8v32H12V4z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M28 4v8h8" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>';

  listen.forEach(function (liste) {
    var bereich = liste.getAttribute("data-downloads");
    var eintraege = DOWNLOADS.filter(function (d) {
      return d.bereich === bereich;
    });

    liste.innerHTML = eintraege.map(function (d) {
      var url = d.datei ? siteUrl(d.datei) : "";
      var meta = d.datei
        ? [d.typ, d.groesse, d.hinweis].filter(Boolean).join(" · ")
        : (d.hinweis ? d.hinweis + " · " : "") + "wird in Kürze bereitgestellt";
      return (
        '<div class="download-item">' + icon +
          '<div class="download-item__info">' +
            "<h3>" + (url ? '<a href="' + url + '" target="_blank" rel="noopener">' + escapeHtml(d.titel) + "</a>" : escapeHtml(d.titel)) + "</h3>" +
            (d.beschreibung ? "<p>" + escapeHtml(d.beschreibung) + "</p>" : "") +
            '<span class="download-item__meta">' + escapeHtml(meta) + "</span>" +
          "</div>" +
          "<div>" + (url
            ? '<a class="badge badge--available" href="' + url + '" target="_blank" rel="noopener">Öffnen</a>'
            : '<span class="badge badge--pending">In Vorbereitung</span>') + "</div>" +
        "</div>"
      );
    }).join("") || '<p class="download-item__meta">Derzeit keine Einträge.</p>';
  });
}

/** Eigener Teaser oder die ersten NEWS_TEASER_LENGTH Zeichen des Textes (ohne HTML), am Wortende gekürzt. */
function newsTeaser(item) {
  if (item.teaser) {
    return item.teaser;
  }
  var tmp = document.createElement("div");
  tmp.innerHTML = item.text.replace(/<\/p>\s*<p>/g, " ");
  var text = tmp.textContent.replace(/\s+/g, " ").trim();
  if (text.length <= NEWS_TEASER_LENGTH) {
    return escapeHtml(text);
  }
  var cut = text.slice(0, NEWS_TEASER_LENGTH);
  cut = cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.–-]+$/, "");
  return escapeHtml(cut) + " …";
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Einzelseite eines Beitrags: Link teilen (Handy) bzw. kopieren (PC). */
function initShare() {
  var button = document.querySelector("[data-share]");
  if (!button) {
    return;
  }

  button.addEventListener("click", function () {
    var url = window.location.href.split("#")[0];
    var label = button.querySelector("span");

    if (navigator.share) {
      navigator.share({ title: document.title, url: url }).catch(function () {});
      return;
    }

    function fertig(text) {
      label.textContent = text;
      setTimeout(function () { label.textContent = "Link kopieren"; }, 2500);
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        fertig("Link kopiert ✓");
      }, function () {
        window.prompt("Link zum Kopieren:", url);
      });
    } else {
      window.prompt("Link zum Kopieren:", url);
    }
  });
}

/**
 * Großansicht für Bilder: jeder Bereich mit [data-gallery], der Bildlinks
 * (<a href="großes Bild"><img></a>) enthält. Pfeile, Esc und Wischen.
 * Bildunterschrift: data-caption am Link oder figcaption der umgebenden figure.
 */
function initGalleries() {
  var galerien = document.querySelectorAll("[data-gallery]");
  if (!galerien.length) {
    return;
  }

  var box = document.createElement("div");
  box.className = "lightbox";
  box.hidden = true;
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Bild in Großansicht");
  box.innerHTML =
    '<img class="lightbox__img" alt="">' +
    '<button type="button" class="lightbox__btn lightbox__close" aria-label="Schließen">&times;</button>' +
    '<button type="button" class="lightbox__btn lightbox__prev" aria-label="Vorheriges Bild">&#8249;</button>' +
    '<button type="button" class="lightbox__btn lightbox__next" aria-label="Nächstes Bild">&#8250;</button>' +
    '<p class="lightbox__count" aria-live="polite"></p>';
  document.body.appendChild(box);

  var bild = box.querySelector(".lightbox__img");
  var zaehler = box.querySelector(".lightbox__count");
  var links = [];
  var index = 0;
  var ausloeser = null;

  function zeigen(i) {
    index = (i + links.length) % links.length;
    var link = links[index];
    bild.src = link.href;
    bild.alt = link.querySelector("img").alt;
    var figur = link.closest("figure");
    var unterschrift = link.getAttribute("data-caption") ||
      (figur && figur.querySelector("figcaption") ? figur.querySelector("figcaption").textContent : "");
    zaehler.textContent = (index + 1) + " / " + links.length + (unterschrift ? " · " + unterschrift.replace(/\s+/g, " ").trim() : "");
    var mehrere = links.length > 1;
    box.querySelector(".lightbox__prev").hidden = !mehrere;
    box.querySelector(".lightbox__next").hidden = !mehrere;
  }

  function oeffnen(galerie, link) {
    links = Array.prototype.slice.call(galerie.querySelectorAll("a[href]")).filter(function (a) {
      return a.querySelector("img");
    });
    ausloeser = link;
    zeigen(links.indexOf(link));
    box.hidden = false;
    document.body.style.overflow = "hidden";
    box.querySelector(".lightbox__close").focus();
  }

  function schliessen() {
    box.hidden = true;
    bild.removeAttribute("src");
    document.body.style.overflow = "";
    if (ausloeser) {
      ausloeser.focus();
    }
  }

  galerien.forEach(function (galerie) {
    galerie.addEventListener("click", function (e) {
      var link = e.target.closest("a[href]");
      if (!link || !link.querySelector("img")) {
        return;
      }
      e.preventDefault();
      oeffnen(galerie, link);
    });
  });

  box.querySelector(".lightbox__close").addEventListener("click", schliessen);
  box.querySelector(".lightbox__prev").addEventListener("click", function () { zeigen(index - 1); });
  box.querySelector(".lightbox__next").addEventListener("click", function () { zeigen(index + 1); });
  box.addEventListener("click", function (e) {
    if (e.target === box) {
      schliessen();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (box.hidden) {
      return;
    }
    if (e.key === "Escape") { schliessen(); }
    if (e.key === "ArrowLeft") { zeigen(index - 1); }
    if (e.key === "ArrowRight") { zeigen(index + 1); }
  });

  var startX = null;
  box.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", function (e) {
    if (startX === null) {
      return;
    }
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) {
      zeigen(dx < 0 ? index + 1 : index - 1);
    }
    startX = null;
  });
}
