#!/usr/bin/env node
/**
 * Erzeugt aus tools/weiterleitungen.txt die Weiterleitungen alter und kurzer Adressen.
 *
 * Aufruf (macht tools/build.sh automatisch):  node tools/weiterleitungen.js <zielordner>
 *   - <zielordner>/<alter pfad>/index.html  = Umleitungsseite (sofort weiter, auch ohne JavaScript;
 *     funktioniert auf GitHub Pages und auf jedem Webspace)
 *   - <zielordner>/.htaccess                = dieselben Weiterleitungen als echte „301“-Regeln
 *     (Apache, z. B. IONOS) – greifen dort vor den Umleitungsseiten und sind für Google am besten
 */

"use strict";

var fs = require("fs");
var path = require("path");

var ROOT = path.join(__dirname, "..");
var ZIEL = path.resolve(process.argv[2] || ROOT);
var SITE_URL = process.env.SITE_URL || "https://jannelrnzn.github.io/nkl_testwebsite/";
var MARKER = "<!-- Weiterleitung, erzeugt aus tools/weiterleitungen.txt -->";

var fehler = [];
var regeln = fs.readFileSync(path.join(ROOT, "tools/weiterleitungen.txt"), "utf8")
  .split("\n")
  .map(function (z) { return z.replace(/#(?!\w).*$/, "").trim(); })
  .filter(Boolean)
  .map(function (z) {
    var t = z.split(/\s+/);
    var alt = t[0].replace(/^\/+|\/+$/g, "").normalize("NFC");
    var neu = t[1];
    if (t.length !== 2 || !alt || !neu) {
      fehler.push("Zeile unverständlich: " + z);
    } else if (!fs.existsSync(path.join(ZIEL, neu.split("#")[0]))) {
      fehler.push("Zielseite fehlt: " + neu + " (für " + alt + ")");
    } else if (fs.existsSync(path.join(ZIEL, alt)) && !fs.existsSync(path.join(ZIEL, alt, "index.html"))) {
      fehler.push("Pfad ist schon belegt: " + alt);
    }
    return { alt: alt, neu: neu };
  });

if (fehler.length) {
  console.error("Fehler in tools/weiterleitungen.txt:\n  - " + fehler.join("\n  - "));
  process.exit(1);
}

regeln.forEach(function (r) {
  var tiefe = r.alt.split("/").length;
  var rel = new Array(tiefe + 1).join("../") + r.neu;
  var ordner = path.join(ZIEL, r.alt);
  fs.mkdirSync(ordner, { recursive: true });
  fs.writeFileSync(path.join(ordner, "index.html"),
    "<!DOCTYPE html>\n" + MARKER + "\n<html lang=\"de\">\n<head>\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <title>Weiterleitung | NKL GmbH</title>\n" +
    "  <meta name=\"robots\" content=\"noindex\">\n" +
    "  <link rel=\"canonical\" href=\"" + SITE_URL + r.neu + "\">\n" +
    "  <meta http-equiv=\"refresh\" content=\"0; url=" + rel + "\">\n" +
    "  <script>location.replace(\"" + rel + "\"" + (r.neu.indexOf("#") < 0 ? " + location.hash" : "") + ");</script>\n" +
    "</head>\n<body>\n  <p>Diese Seite ist umgezogen: <a href=\"" + rel + "\">weiter zur neuen Seite</a>.</p>\n</body>\n</html>\n");
});

// .htaccess: 301-Regeln (mit und ohne Schrägstrich am Ende)
var htaccess =
  "# Weiterleitungen alter Adressen – erzeugt aus tools/weiterleitungen.txt (nicht von Hand bearbeiten)\n" +
  "# Gilt auf einem Apache-Webspace (z. B. IONOS); GitHub Pages ignoriert diese Datei.\n" +
  regeln.map(function (r) {
    var muster = r.alt.replace(/[.+*?()[\]{}^$|\\]/g, "\\$&");
    return "RedirectMatch 301 ^/" + muster + "/?$ /" + r.neu;
  }).join("\n") + "\n";
var vorhanden = fs.existsSync(path.join(ZIEL, ".htaccess")) ? fs.readFileSync(path.join(ZIEL, ".htaccess"), "utf8") + "\n" : "";
fs.writeFileSync(path.join(ZIEL, ".htaccess"), vorhanden + htaccess);

console.log(regeln.length + " Weiterleitungen erzeugt.");
