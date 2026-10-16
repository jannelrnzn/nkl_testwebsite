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
- Konzept-Seite über GitHub Pages: https://jannelrnzn.github.io/nkl_testwebsite/index.html
  (an Agentur SPICY geschickt). Späteres Hosting noch offen (siehe „Hosting / Domain“).

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

## Agentur SPICY / Gespräch 16.10.2026

- Agentur SPICY, Anastassatos GbR (Ute und Andreas Anastassatos), Wasserstraße 9a,
  91126 Schwabach – Webdesign, Corporate Design, Messe, Drucksachen; Foto/Video über Partner.
- Gespräch mit Andreas Anastassatos am 16.10.2026 (vormittags). Ergebnis: Aufteilung nach
  seinem Vorschlag – **SPICY** liefert Aufnahmen (Video/Fotos) und die professionelle Sicht
  aufs Design (Verbesserungsvorschläge, „ansprechend und lebendig“); **Janne** setzt die
  Website technisch um und betreut Hosting/E-Mail.
- Schwerpunkt vorerst: Layout und vor allem die **Startseite**. Produktseite erst nach
  Abstimmung mit dem Fachbereich ausbauen.
- Social Media: LinkedIn und Instagram – beide Seiten sind sich einig, dass NKL dort
  zumindest erreichbar sein sollte (v. a. für jüngere Generationen). Noch nichts umgesetzt.
- SPICY informiert Janne bzw. nimmt Janne ins CC bei Themen zu Website, Messe und Medien.
- Noch zu klären: Nutzungsrechte an Video/Fotos schriftlich (inkl. Partner/Videograf, Musik),
  Lieferformat (Web-Loop fürs Hero-Video, Originaldateien).

## Hosting / Domain (Stand 16.10.2026, per DNS geprüft)

- Domain nkl-emv.de und E-Mail (MX `mx00/mx01.ionos.de`) bei **IONOS**.
- Bisherige Website www.nkl-emv.de = **Jimdo** (Baukasten, kein eigener Upload möglich).
- `nkl-emv.de` ohne www hat keinen A-Eintrag → lädt nicht; beim Umzug mit beheben.
- Offen: Wer hat die Zugänge zu IONOS/Jimdo, auf wen laufen die Verträge, wohin zieht die
  neue Seite (Webspace bei IONOS oder z. B. Strato)? Mail-Einträge beim Umzug nicht anfassen.

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

- **Beiträge-Funktion (Wunsch von Jannes Vater):** Beiträge verfassen, bearbeiten und auf der
  Startseite anzeigen – Janne hat Umsetzung **bis Ende der Woche 19.–23.10.2026** zugesagt,
  danach Treffen mit SPICY. Vorbild: Mitteilungen der TSV-Seite (`js/mitteilungen.js` +
  Generator). **Entschieden (16.10.2026):** Beiträge pflegt nur Janne (per Claude/GitHub,
  von überall) → keine Admin-Oberfläche/CMS nötig, Daten als JS-Datei im Repo.
- **Hero-Video** Firmengelände: fehlt noch – Aufnahmen (Imagevideo + Fotos) kommen von
  SPICY (Einbau-Vorlage als Kommentar in `index.html`,
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
