#!/usr/bin/env node
/**
 * Erzeugt aus den Beiträgen in content/beitraege/*.md (eine Datei je Beitrag,
 * gepflegt über das CMS unter /admin oder von Hand):
 *   - js/beitraege.js  (Liste BEITRAEGE für Startseite und Archiv)
 *   - beitraege/<id>.html  (eigene Seite je Beitrag; Kopf, Menü und Fußzeile
 *     kommen aus archiv.html)
 * Beides ist erzeugt, steht nicht im Repository und wird nie von Hand bearbeitet.
 *
 * Aufruf im Repo-Ordner:  node tools/beitraege.js
 *
 * Läuft bei jeder Veröffentlichung automatisch (tools/build.sh, GitHub Action).
 * Lokal nach Änderungen an den Beiträgen oder am Menü/Footer erneut ausführen.
 * Seiten von gelöschten Beiträgen werden entfernt.
 *
 * Aufbau einer Datei content/beitraege/<id>.md (Dateiname = id = Adresse,
 * Muster JJJJ-MM-TT-stichwort, ältere auch JJJJ-MM-stichwort, später nie ändern):
 *   ---
 *   titel: Überschrift
 *   datum: 2026-10-20            (sortiert die Liste, neueste zuerst)
 *   datum_text: Februar 2026     optional, ersetzt das angezeigte Datum
 *   stichwort: electronica-2026  nur für den Dateinamen beim Anlegen im CMS
 *   teaser: …                    optional eigener Kurztext für Startseite/Archiv
 *   komplett: true               optional, ganzer Text statt Teaser (nur von Hand)
 *   archiv: true                 optional, nicht mehr auf der Startseite
 *   bilder:                      optional, erstes Bild groß, weitere als Raster
 *     - datei: /assets/images/beitraege/bild.jpg
 *       beschreibung: Bildunterschrift
 *   ---
 *   Text in Markdown: Leerzeile = neuer Absatz, einfacher Zeilenumbruch = <br>,
 *   **fett**, [Link](downloads.html) (Pfad wie von der Startseite aus),
 *   ![Alternativtext](/assets/images/beitraege/bild.jpg "Bildunterschrift")
 *   als eigener Absatz = Bild mitten im Text.
 */

"use strict";

var fs = require("fs");
var path = require("path");
var yaml = require("./vendor/js-yaml.js");
var marked = require("./vendor/marked.js");

// Adresse der Website – für Linkvorschau (LinkedIn, WhatsApp) nötig.
// Nach dem Umzug auf die eigene Domain hier und in tools/build.sh umstellen.
var SITE_URL = process.env.SITE_URL || "https://jannelrnzn.github.io/nkl_testwebsite/";

var ROOT = path.join(__dirname, "..");
var QUELLE = path.join(ROOT, "content/beitraege");
var ZIEL = path.join(ROOT, "beitraege");
var LISTE = path.join(ROOT, "js/beitraege.js");
var VORLAGE = path.join(ROOT, "archiv.html");
var MARKER = "<!-- Automatisch erzeugt aus content/beitraege (node tools/beitraege.js) – nicht von Hand bearbeiten -->";
var ALTER_MARKER = "<!-- Automatisch erzeugt aus js/beitraege.js";
var STANDARD_BILD = "assets/images/fotos/produkte-ringkerndrossel-9626.jpg";
var TEASER_LAENGE = 220;
var MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

// ---------- Markdown -> HTML ----------

marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    // Bild als eigener Absatz -> Bild in Textbreite mit Bildunterschrift (Großansicht per Klick)
    paragraph: function (token) {
      var inhalt = token.tokens.filter(function (t) { return !(t.type === "text" && !t.raw.trim()); });
      if (inhalt.length === 1 && inhalt[0].type === "image") {
        var bild = inhalt[0];
        var datei = pfad(bild.href);
        var unterschrift = bild.title || "";
        return '<figure class="news-detail__figure" data-gallery><a href="' + datei + '"><img src="' + datei +
          '" alt="' + attr(bild.text || unterschrift) + '" loading="lazy"></a>' +
          (unterschrift ? "<figcaption>" + unterschrift + "</figcaption>" : "") + "</figure>";
      }
      return "<p>" + this.parser.parseInline(token.tokens) + "</p>";
    },
    image: function (token) {
      return '<img src="' + pfad(token.href) + '" alt="' + attr(token.text || "") + '" loading="lazy">';
    },
    // Externe Links in neuem Tab
    link: function (token) {
      var extern = /^https?:/.test(token.href);
      return '<a href="' + attr(pfad(token.href)) + '"' + (extern ? ' target="_blank" rel="noopener"' : "") + ">" +
        this.parser.parseInline(token.tokens) + "</a>";
    },
    table: function (token) {
      var self = this;
      var zeile = function (zellen, tag) {
        return "<tr>" + zellen.map(function (z) { return "<" + tag + ">" + self.parser.parseInline(z.tokens) + "</" + tag + ">"; }).join("") + "</tr>";
      };
      return '<table class="stats-table"><thead>' + zeile(token.header, "th") + "</thead><tbody>" +
        token.rows.map(function (r) { return zeile(r, "td"); }).join("") + "</tbody></table>";
    }
  }
});

// Ergebnis im bisherigen Format: Inhalt ohne äußeres <p>…</p>, Absätze mit </p><p> getrennt
function textHtml(markdown) {
  var html = marked.parse(markdown).replace(/>\s*\n\s*</g, "><").trim();
  if (html.indexOf("<p>") === 0) {
    html = html.slice(3);
  }
  if (html.slice(-4) === "</p>") {
    html = html.slice(0, -4);
  }
  return html;
}

// Pfade aus dem CMS beginnen mit "/" – auf der Seite relativ zur Startseite
function pfad(p) {
  return String(p || "").replace(/^\/(?!\/)/, "");
}

function datumText(iso) {
  var t = iso.split("-");
  return parseInt(t[2], 10) + ". " + MONATE[parseInt(t[1], 10) - 1] + " " + t[0];
}

// ---------- Daten laden und prüfen ----------

var fehler = [];
var liste = fs.readdirSync(QUELLE).filter(function (d) { return /\.md$/.test(d); }).map(function (datei) {
  var id = datei.replace(/\.md$/, "");
  var roh = fs.readFileSync(path.join(QUELLE, datei), "utf8").replace(/\r\n/g, "\n");
  var m = roh.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) {
    fehler.push(id + ": Kopfbereich (--- … ---) fehlt");
    return null;
  }
  var fm;
  try {
    fm = yaml.load(m[1]) || {};
  } catch (e) {
    fehler.push(id + ": Kopfbereich fehlerhaft (" + e.reason + ")");
    return null;
  }
  var datum = fm.datum instanceof Date ? fm.datum.toISOString().slice(0, 10) : String(fm.datum || "");
  var item = { id: id };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
    fehler.push(id + ": Feld \"datum\" fehlt oder ist kein Datum (JJJJ-MM-TT)");
  } else {
    item.datum = fm.datum_text ? String(fm.datum_text) : datumText(datum);
  }
  item.titel = attr(String(fm.titel || "").trim()).replace(/&quot;/g, '"');
  item.text = textHtml(m[2]);
  if (fm.teaser && String(fm.teaser).trim()) {
    item.teaser = attr(String(fm.teaser).trim()).replace(/&quot;/g, '"');
  }
  if (fm.komplett) {
    item.komplett = true;
  }
  if (fm.archiv) {
    item.archiv = true;
  }
  var bilder = (fm.bilder || []).map(function (b) {
    return typeof b === "string" ? { datei: pfad(b) } : { datei: pfad(b && b.datei), beschreibung: (b && b.beschreibung) || "" };
  }).filter(function (b) { return b.datei; });
  if (bilder.length) {
    item.bilder = bilder;
  }
  item._sort = datum;
  return item;
}).filter(Boolean);

// Neueste zuerst (bei gleichem Datum nach id)
liste.sort(function (a, b) {
  return a._sort === b._sort ? (a.id < b.id ? 1 : -1) : (a._sort < b._sort ? 1 : -1);
});

liste.forEach(function (item) {
  var name = item.id;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.id)) {
    fehler.push(name + ": Dateiname enthält ungültige Zeichen (nur a-z, 0-9, -)");
  }
  ["titel", "text"].forEach(function (feld) {
    if (!item[feld]) {
      fehler.push(name + ": Feld \"" + feld + "\" fehlt");
    }
  });
  bilderVon(item).concat((item.text.match(/src="[^"]*"/g) || []).map(function (s) {
    return { datei: s.slice(5, -1) };
  })).forEach(function (bild) {
    if (!/^https?:/.test(bild.datei) && !fs.existsSync(path.join(ROOT, bild.datei))) {
      fehler.push(name + ": Bild nicht gefunden: " + bild.datei);
    }
  });
});

if (fehler.length) {
  console.error("Fehler in content/beitraege:\n  - " + fehler.join("\n  - "));
  process.exit(1);
}

liste.forEach(function (item) {
  delete item._sort;
});

fs.writeFileSync(
  LISTE,
  "/* Automatisch erzeugt aus content/beitraege (node tools/beitraege.js) – nicht von Hand bearbeiten. */\n" +
  "var BEITRAEGE = " + JSON.stringify(liste, null, 1) + ";\n"
);

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
var ids = {};
liste.forEach(function (item) {
  ids[item.id] = true;
});
var entfernt = 0;
fs.readdirSync(ZIEL).forEach(function (datei) {
  var id = datei.replace(/\.html$/, "");
  var voll = path.join(ZIEL, datei);
  var inhalt = /\.html$/.test(datei) ? fs.readFileSync(voll, "utf8") : "";
  if (!ids[id] && (inhalt.indexOf(MARKER) > -1 || inhalt.indexOf(ALTER_MARKER) > -1)) {
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
    '        <p class="breadcrumb"><a href="../index.html">Startseite</a> / <a href="../archiv.html">Archiv</a></p>\n' +
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
