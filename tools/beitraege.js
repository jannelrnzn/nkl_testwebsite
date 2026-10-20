#!/usr/bin/env node
/**
 * Erzeugt aus js/beitraege.js für jeden Beitrag eine eigene Seite
 * beitraege/<id>.html (Kopf, Menü und Fußzeile kommen aus archiv.html).
 *
 * Aufruf im Repo-Ordner:  node tools/beitraege.js
 *
 * Nach JEDER Änderung an js/beitraege.js oder an Menü/Footer
 * erneut ausführen. Seiten von gelöschten Beiträgen werden entfernt.
 */

"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

// Adresse der Website – für Linkvorschau (LinkedIn, WhatsApp) nötig.
// Nach dem Umzug auf die eigene Domain hier umstellen (Umgebungsvariable SITE_URL überschreibt).
var SITE_URL = process.env.SITE_URL || "https://jannelrnzn.github.io/nkl_testwebsite/";

var ROOT = path.join(__dirname, "..");
var ZIEL = path.join(ROOT, "beitraege");
var VORLAGE = path.join(ROOT, "archiv.html");
var MARKER = "<!-- Automatisch erzeugt aus js/beitraege.js (node tools/beitraege.js) – nicht von Hand bearbeiten -->";
var STANDARD_BILD = "assets/images/fotos/produkte-ringkerndrossel-9626.jpg";
var TEASER_LAENGE = 220;

// ---------- Daten laden und prüfen ----------

var code = fs.readFileSync(path.join(ROOT, "js/beitraege.js"), "utf8");
var sandbox = {};
vm.runInNewContext(code + "\nthis.BEITRAEGE = BEITRAEGE;", sandbox);
var liste = sandbox.BEITRAEGE;

var fehler = [];
var ids = {};
liste.forEach(function (item, i) {
  var name = item.id || "Eintrag " + (i + 1);
  if (!item.id || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.id)) {
    fehler.push(name + ": id fehlt oder enthält ungültige Zeichen (nur a-z, 0-9, -)");
  }
  if (ids[item.id]) {
    fehler.push(name + ": id doppelt vergeben");
  }
  ids[item.id] = true;
  ["datum", "titel", "text"].forEach(function (feld) {
    if (!item[feld]) {
      fehler.push(name + ": Feld \"" + feld + "\" fehlt");
    }
  });
  bilderVon(item).forEach(function (bild) {
    if (!fs.existsSync(path.join(ROOT, bild.datei))) {
      fehler.push(name + ": Bild nicht gefunden: " + bild.datei);
    }
  });
});

if (fehler.length) {
  console.error("Fehler in js/beitraege.js:\n  - " + fehler.join("\n  - "));
  process.exit(1);
}

// ---------- Vorlage zerlegen ----------

var vorlage = fs.readFileSync(VORLAGE, "utf8");
var kopf = vorlage.slice(0, vorlage.indexOf('<main id="main-content">'));
var fuss = vorlage.slice(vorlage.indexOf("</main>") + "</main>".length);

kopf = kopf
  .replace(/\s*<title>[\s\S]*?<\/title>/, "\n  __TITLE__")
  .replace(/\s*<meta name="description"[^>]*>/, "\n  __META__")
  .replace(/\s*<script src="js\/beitraege\.js[^"]*"[^>]*><\/script>/, "")
  .replace(/ aria-current="page"/g, "")
  .replace("<!DOCTYPE html>", "<!DOCTYPE html>\n" + MARKER);

kopf = relativ(kopf);
fuss = relativ(fuss);

// ---------- Seiten schreiben ----------

if (!fs.existsSync(ZIEL)) {
  fs.mkdirSync(ZIEL);
}

liste.forEach(function (item, i) {
  fs.writeFileSync(path.join(ZIEL, item.id + ".html"), seite(item, liste[i - 1], liste[i + 1]));
});

// Seiten entfernen, deren Beitrag es nicht mehr gibt (nur selbst erzeugte)
var entfernt = 0;
fs.readdirSync(ZIEL).forEach(function (datei) {
  var id = datei.replace(/\.html$/, "");
  var voll = path.join(ZIEL, datei);
  if (/\.html$/.test(datei) && !ids[id] && fs.readFileSync(voll, "utf8").indexOf(MARKER) > -1) {
    fs.unlinkSync(voll);
    entfernt++;
  }
});

console.log(liste.length + " Beitragsseiten erzeugt" + (entfernt ? ", " + entfernt + " veraltete entfernt" : "") + ".");

// ---------- Hilfsfunktionen ----------

function seite(item, neuer, aelter) {
  var bilder = bilderVon(item);
  var teaser = item.teaser ? klartext(item.teaser) : kurz(klartext(item.text));
  var ogBild = bilder.length ? bilder[0].datei : STANDARD_BILD;
  var url = SITE_URL + "beitraege/" + item.id + ".html";

  var head =
    "<title>" + attr(klartext(item.titel)) + " | NKL GmbH</title>\n" +
    '  <meta name="description" content="' + attr(teaser) + '">\n' +
    '  <link rel="canonical" href="' + url + '">\n' +
    '  <meta property="og:type" content="article">\n' +
    '  <meta property="og:site_name" content="NKL GmbH">\n' +
    '  <meta property="og:title" content="' + attr(klartext(item.titel)) + '">\n' +
    '  <meta property="og:description" content="' + attr(teaser) + '">\n' +
    '  <meta property="og:url" content="' + url + '">\n' +
    '  <meta property="og:image" content="' + SITE_URL + encodeURI(ogBild) + '">';

  // Erstes Bild groß nach dem ersten Absatz, weitere Bilder als Raster am Ende
  var figur = function (bild) {
    return (
      '              <a href="../' + bild.datei + '"><img src="../' + bild.datei + '" alt="' + attr(bild.beschreibung) + '"></a>\n' +
      (bild.beschreibung ? "              <figcaption>" + bild.beschreibung + "</figcaption>\n" : "")
    );
  };
  var absaetze = relativ(item.text).split("</p><p>");
  var inhalt = '          <div class="news-detail__text">\n            <p>' + absaetze[0] + "</p>\n          </div>\n";
  if (bilder.length) {
    inhalt +=
      '          <figure class="news-detail__figure" data-gallery>\n' + figur(bilder[0]) + "          </figure>\n";
  }
  if (absaetze.length > 1) {
    inhalt += '          <div class="news-detail__text">\n            <p>' + absaetze.slice(1).join("</p><p>") + "</p>\n          </div>\n";
  }
  if (bilder.length > 1) {
    inhalt +=
      '          <div class="news-detail__images" data-gallery>\n' +
      bilder.slice(1).map(function (bild) {
        return "            <figure>\n" + figur(bild) + "            </figure>\n";
      }).join("") +
      "          </div>\n";
  }

  var pager = "";
  if (neuer || aelter) {
    pager =
      '\n        <nav class="news-pager" aria-label="Weitere Beiträge">\n' +
      (neuer
        ? '          <a class="news-pager__link news-pager__link--neuer" href="' + neuer.id + '.html"><span>← Neuer</span>' + neuer.titel + "</a>\n"
        : "          <span></span>\n") +
      (aelter
        ? '          <a class="news-pager__link news-pager__link--aelter" href="' + aelter.id + '.html"><span>Älter →</span>' + aelter.titel + "</a>\n"
        : "") +
      "        </nav>";
  }

  var main =
    '<main id="main-content">\n\n' +
    '    <div class="page-header">\n' +
    '      <div class="container">\n' +
    '        <p class="breadcrumb"><a href="../index.html">Startseite</a> / <a href="../archiv.html">Aktuelles</a></p>\n' +
    '        <span class="eyebrow">' + (item.archiv ? "Archiv" : "Aktuelles") + " · " + item.datum + "</span>\n" +
    "        <h1>" + item.titel + "</h1>\n" +
    "      </div>\n" +
    "    </div>\n\n" +
    '    <section class="section">\n' +
    '      <div class="container">\n' +
    '        <article class="news-detail">\n' +
    inhalt +
    "        </article>\n\n" +
    '        <div class="news-detail__actions">\n' +
    '          <a class="btn btn--ghost" href="../archiv.html">← Alle Beiträge</a>\n' +
    '          <button type="button" class="btn btn--ghost" data-share>' +
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>' +
    " <span>Link kopieren</span></button>\n" +
    "        </div>" +
    pager + "\n" +
    "      </div>\n" +
    "    </section>\n\n" +
    "  </main>";

  return kopf.replace("__TITLE__", head).replace(/\n\s*__META__/, "") + main + fuss;
}

function bilderVon(item) {
  return (item.bilder || []).map(function (bild) {
    return typeof bild === "string" ? { datei: bild, beschreibung: "" } : { datei: bild.datei, beschreibung: bild.beschreibung || "" };
  });
}

// Relative Pfade (von der Startseite aus) für den Unterordner mit "../" versehen
function relativ(html) {
  return html.replace(/(\s(?:href|src))="(?!https?:|mailto:|tel:|#|\/|data:|\.\.\/)([^"]*)"/g, '$1="../$2"');
}

function klartext(html) {
  return html
    .replace(/<\/p>\s*<p>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function kurz(text) {
  if (text.length <= TEASER_LAENGE) {
    return text;
  }
  var cut = text.slice(0, TEASER_LAENGE);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.–-]+$/, "") + " …";
}

function attr(text) {
  return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
