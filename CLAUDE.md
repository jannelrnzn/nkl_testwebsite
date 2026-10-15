# NKL GmbH – Testwebsite

Neuer Webauftritt der NKL GmbH (EMV-Bauteile: Ringkerndrosseln, Entstörfilter,
Übertrager; Birkichstraße 15, 74549 Wolpertshausen). Originalseite: nkl-emv.de –
Texte werden von dort übernommen, möglichst im Originalwortlaut.

Statische Website (HTML/CSS/JS, kein Build, kein Backend). Repo:
`jannelrnzn/nkl_testwebsite`.

## Arbeitsweise

- Antworten und Commit-Messages auf Deutsch (Umlaute in Commit-Messages bisher als ae/oe/ue).
- Kleine, thematisch getrennte Commits.
- Lokale Vorschau: VS Code Live Server (Port 5502) oder `.devserver/serve.ps1` (Port 5500).
- Kein Cache-Busting (CSS/JS ohne `?v=`) – bei Bedarf wie bei der TSV-Seite nachrüsten.
- **Zu klären:** Veröffentlichung (GitHub Pages? direkt auf `main` pushen?) und späteres Hosting.

## Aufbau

- Jede Seite enthält Kopf (Logo, Navigation) und Fuß komplett im HTML – bei Menü- oder
  Footer-Änderungen **alle** `*.html` anpassen.
- Navigation: Startseite · Unternehmen ▾ (Historie, Geschäftsfelder, Präsentationen,
  Umwelt, Archiv) · Produkte · Anwendungsbereiche · Messlabor · Beratung · Downloads ·
  Kontakt ▾ (Kontaktformular, Anfahrt). Aktive Seite mit `aria-current="page"`.
- Footer-Leiste: Impressum · AGB · Datenschutz · Gesetzliche Gewährleistung; Jahr per JS (`#year`).
- `css/style.css`: eine Datei, CSS-Variablen oben (Farben, Abstände, Schriften).
- `js/main.js`: mobiles Menü, Kontaktformular (nur Bestätigungsmeldung), Footer-Jahr.
- Bilder flach unter `assets/images/` (teils mit Umlauten im Dateinamen, z. B. `entstörfilter.jpg`).

## Seiten (Stand 18.09.2026)

- `index.html`: Hero mit Foto Firmengelände (Video folgt), Kennzahlen, Dienstleistungen,
  Produktwelt mit Bildern, Kompetenz, Qualitätspolitik, Aktuelles (ISO 9001, Downloads, REACH 2026).
- `unternehmen.html` (gekürzt, nur Originaltext), `historie.html` (Zeitleiste, Fotos
  Klaus und Uwe Lorenzen), `geschaeftsfelder.html`, `umwelt.html`, `archiv.html`
  (electronica 2022, ISO-Rezertifizierung 2019).
- `produkte.html` (Karten mit „Anfrage stellen“ → Kontaktformular),
  `anwendungsbereiche.html` (Schaltplan + Typenbezeichnung; Musterkästen entfernt),
  `messlabor.html` (Originaltext + 4 Laborfotos), `beratung.html`.
- `downloads.html`, `praesentationen.html`: nur Einträge mit Badge „In Vorbereitung“.
- `kontakt.html`, `kontaktformular.html`, `anfahrt.html` (Google-Maps-iframe, direkt eingebunden).
- Rechtliches: `impressum.html`, `agb.html`, `datenschutz.html`, `gewaehrleistung.html`.

## Offene Punkte (beim Erledigen hier streichen)

- **Hero-Video** Firmengelände: fehlt noch (Einbau-Vorlage als Kommentar in `index.html`,
  Ziel `assets/video/firmengelaende.mp4`). Danach Hinweis „Hintergrundvideo folgt“ entfernen.
- **Downloads/Präsentationen:** PDFs/PowerPoints fehlen (Kurzbeschreibung, Präsentation,
  Messlabor, Produkte, Zertifikate, REACH-Erklärung …). Wenn da: `href` setzen, Badge und
  Meta-Text anpassen (Hinweis als Kommentar in `downloads.html`). Hinweis auf den
  PowerPoint-Viewer ggf. streichen (von Microsoft eingestellt).
- **Archiv:** weitere ältere Meldungen (Jahresgrüße, Betriebsferien) „folgen in Kürze“.
- **Kontaktformular:** nicht angebunden (kein Backend). Weg klären (z. B. PHP beim Hoster
  wie `kontakt.php` bei der TSV-Seite), danach Platzhalter-Hinweise in
  `kontaktformular.html` und `js/main.js` entfernen.
- **Datenschutz:** von der Originalseite übernommen, beschreibt reCAPTCHA und Webanalyse,
  die hier nicht eingesetzt werden. Fehlt: Google Maps (Anfahrt), Hosting, Kontaktformular.
  Vor Go-live anpassen und prüfen lassen.
- **Impressum:** Hinweis am Ende („Datenschutzerklärung fehlt noch“) ist veraltet –
  anpassen bzw. nach juristischer Prüfung entfernen.
- **AGB/Gewährleistung:** von der Originalseite übernommen – Aktualität mit NKL abstimmen.
- Bildgrößen: `NKL_ISO9001_Zertifikat.png` (~500 KB) ggf. verkleinern; `NKL_Logo.JPEG`
  wird nirgends verwendet (`hero-placeholder.svg` nur in der Video-Vorlage).
