#!/usr/bin/env node
/**
 * Erzeugt aus content/downloads/*.yml (eine Datei je Download, gepflegt über das
 * CMS unter /admin, Sammlung „Downloads & Präsentationen“, oder von Hand):
 *   - js/downloads.js  (Liste DOWNLOADS; initDownloads in js/main.js füllt damit
 *     die Bereiche [data-downloads="…"] auf downloads.html und praesentationen.html)
 * Die Datei ist erzeugt, steht nicht im Repository und wird nie von Hand bearbeitet.
 *
 * Aufruf im Repo-Ordner:  node tools/downloads.js
 * Läuft bei jeder Veröffentlichung automatisch (tools/build.sh, GitHub Action).
 *
 * Aufbau einer Datei content/downloads/<bereich>-<titel>.yml:
 *   titel: REACH-Erklärung
 *   bereich: information        unternehmen | schulungen | information | praesentationen
 *   beschreibung: …             optional, ein Satz unter dem Titel
 *   datei: /assets/downloads/reach-erklaerung.pdf   optional – ohne Datei: „In Vorbereitung“
 *   hinweis: …                  optional, z. B. „Stand 02/2026“ oder Aussteller
 *   reihenfolge: 10             kleinere Zahl = weiter oben
 */

"use strict";

var fs = require("fs");
var path = require("path");
var yaml = require("./vendor/js-yaml.js");

var ROOT = path.join(__dirname, "..");
var QUELLE = path.join(ROOT, "content/downloads");
var LISTE = path.join(ROOT, "js/downloads.js");
var BEREICHE = ["unternehmen", "schulungen", "information", "praesentationen"];
var TYPEN = {
  pdf: "PDF", ppt: "PowerPoint", pptx: "PowerPoint", doc: "Word", docx: "Word",
  xls: "Excel", xlsx: "Excel", zip: "ZIP", jpg: "Bild", jpeg: "Bild", png: "Bild", webp: "Bild"
};

var fehler = [];
var liste = fs.readdirSync(QUELLE).filter(function (d) { return /\.ya?ml$/.test(d); }).map(function (datei) {
  var name = datei.replace(/\.ya?ml$/, "");
  var d;
  try {
    d = yaml.load(fs.readFileSync(path.join(QUELLE, datei), "utf8")) || {};
  } catch (e) {
    fehler.push(name + ": Datei fehlerhaft (" + e.reason + ")");
    return null;
  }
  var item = { titel: String(d.titel || "").trim(), bereich: d.bereich };
  if (!item.titel) {
    fehler.push(name + ": Feld \"titel\" fehlt");
  }
  if (BEREICHE.indexOf(d.bereich) < 0) {
    fehler.push(name + ": unbekannter bereich \"" + d.bereich + "\"");
  }
  if (d.beschreibung && String(d.beschreibung).trim()) {
    item.beschreibung = String(d.beschreibung).trim();
  }
  if (d.hinweis && String(d.hinweis).trim()) {
    item.hinweis = String(d.hinweis).trim();
  }
  if (d.datei) {
    // Pfade aus dem CMS beginnen mit "/" – auf der Seite relativ zur Startseite
    item.datei = String(d.datei).replace(/^\/(?!\/)/, "");
    var voll = path.join(ROOT, item.datei);
    if (!/^https?:/.test(item.datei) && !fs.existsSync(voll)) {
      fehler.push(name + ": Datei nicht gefunden: " + item.datei);
    } else {
      item.typ = TYPEN[(item.datei.split(".").pop() || "").toLowerCase()] || "Datei";
      if (fs.existsSync(voll)) {
        item.groesse = groesse(fs.statSync(voll).size);
      }
    }
  }
  item._sort = [BEREICHE.indexOf(d.bereich), Number(d.reihenfolge) || 999, item.titel.toLowerCase()];
  return item;
}).filter(Boolean);

if (fehler.length) {
  console.error("Fehler in content/downloads:\n  - " + fehler.join("\n  - "));
  process.exit(1);
}

liste.sort(function (a, b) {
  for (var i = 0; i < 3; i++) {
    if (a._sort[i] !== b._sort[i]) {
      return a._sort[i] < b._sort[i] ? -1 : 1;
    }
  }
  return 0;
});
liste.forEach(function (item) {
  delete item._sort;
});

fs.writeFileSync(
  LISTE,
  "/* Automatisch erzeugt aus content/downloads (node tools/downloads.js) – nicht von Hand bearbeiten. */\n" +
  "var DOWNLOADS = " + JSON.stringify(liste, null, 1) + ";\n"
);

console.log(liste.length + " Downloads eingelesen (" + liste.filter(function (d) { return d.datei; }).length + " mit Datei).");

function groesse(bytes) {
  if (bytes < 1024 * 1024) {
    return Math.max(1, Math.round(bytes / 1024)) + " KB";
  }
  return (bytes / 1024 / 1024).toFixed(1).replace(".", ",") + " MB";
}
