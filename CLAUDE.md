# NKL GmbH – Testwebsite

Neuer Webauftritt der NKL GmbH (EMV-Bauteile: Ringkerndrosseln, Entstörfilter,
Übertrager; Birkichstraße 15, 74549 Wolpertshausen). Originalseite: nkl-emv.de –
Texte werden von dort übernommen, möglichst im Originalwortlaut.

Statische Website (HTML/CSS/JS, kein Build, kein Backend). Repo:
`jannelrnzn/nkl_testwebsite`.

## Arbeitsweise

- Antworten und Commit-Messages auf Deutsch (Umlaute in Commit-Messages bisher als ae/oe/ue).
- Kleine, thematisch getrennte Commits. Änderungen **immer direkt auf `main` pushen** (Janne, 16.10.2026).
- Lokale Vorschau: VS Code Live Server (Port 5502) oder `.devserver/serve.ps1` (Port 5500).
- Kein Cache-Busting (CSS/JS ohne `?v=`) – bei Bedarf wie bei der TSV-Seite nachrüsten.
- Konzept-Seite über GitHub Pages: https://jannelrnzn.github.io/nkl_testwebsite/index.html
  (an Agentur SPICY geschickt). Späteres Hosting noch offen (siehe „Hosting / Domain“).

## Aufbau

- Kopf: nur Logo-Bild + Unterzeile `.logo__tagline` „EMV-Bauteile“ (kein Text „NKL GmbH“ – steht schon im Logo); Fuß: nur Logo
  auf weißem Feld (Logo-Blau auf Anthrazit sonst unlesbar). Endet eine Seite mit `.section--muted`, kein Abstand vor dem Footer.
- Jede Seite enthält Kopf (Logo, Navigation) und Fuß komplett im HTML – bei Menü- oder
  Footer-Änderungen **alle** `*.html` anpassen.
- Navigation: Startseite · Unternehmen ▾ (Firmenportrait = `unternehmen.html`, Historie, Geschäftsfelder,
  Präsentationen, Umwelt) · Produkte · Anwendungsbereiche · Messlabor · Beratung · Downloads ·
  Archiv (`archiv.html`, Beiträge) · Kontakt ▾ (Kontaktformular, Anfahrt). Aktive Seite mit `aria-current="page"`.
- „Unternehmen“ ist **kein Link**, sondern `<button class="main-nav__toggle">` (Klick klappt das Untermenü auf,
  `initMobileNav`); auf den fünf Unterseiten trägt er `is-active`. Handy-Menü (☰) schon unter 1200 px
  (`@media (max-width: 1199px)`), sonst passen die 9 Punkte nicht in eine Zeile.
- Footer-Leiste: Impressum · AGB · Datenschutz · Gesetzliche Gewährleistung; Jahr per JS (`#year`).
- `css/style.css`: eine Datei, CSS-Variablen oben (Farben, Abstände, Schriften).
- `js/main.js`: mobiles Menü, Kontaktformular (nur Bestätigungsmeldung), Footer-Jahr, Beiträge
  (`initNews`), Link teilen (`initShare`), Großansicht (`initGalleries`, alles mit `[data-gallery]`).
- Bilder flach unter `assets/images/` (teils mit Umlauten im Dateinamen, z. B. `entstörfilter.jpg`).
- Fotos von SPICY (Shooting 2026) unter `assets/images/fotos/` als `thema-motiv-NNNN.jpg`
  (NNNN = Nummer der Originaldatei DSC0NNNN.JPG), max. 2400 px, ohne EXIF, Qualität 82.
  Themen: fertigung, pruefung, messlabor, team, produkte. CSS: `.photo` (figure mit
  figcaption, `.photo--wide` = 16:10) und `.photo-grid` (3 Spalten, Handy 2).
  Eingebaut (20.10.2026): Startseite (Bild bei „Was uns auszeichnet“), Firmenportrait `unternehmen.html`
  (Team-Foto + Abschnitt „Einblicke in unsere Fertigung“ mit 6 Fotos – NICHT auf der Startseite,
  Wunsch Janne), Messlabor (3 Fotos).
- Personen auf den Fotos: Geschäftsführer **Uwe Lorenzen** (kariertes Hemd, Brille; u. a.
  9590, 9593, 9603, rechts auf 9597) und Fertigungsleiter **Zoran Beric** (grünes Polo,
  links auf 9597) – von Janne bestätigt (20.10.2026).
- Uploads über die GitHub-Weboberfläche landen im Repo-Root → verschieben, umbenennen,
  verkleinern, Originale aus dem Repo entfernen.

## Hero-Video (Startseite, seit 20.10.2026)

- Clip `spulen02.mp4` von SPICY (6,5 s, Kamerafahrt über Ringkerne) als Schleife vorwärts+rückwärts (13 s,
  ruckelfrei), ohne Ton: `assets/video/hero-spulen-1080.mp4` (~3,5 MB, PC) und `-720.mp4` (~1,7 MB, bis
  900 px über `<source media>`), Standbild `hero-spulen-poster.jpg` (auch CSS-Hintergrund, falls Video nicht lädt).
  ffmpeg: `scale=-2:1080,fps=30,split,reverse,concat`, x264 CRF 27/28, `-an -movflags +faststart`.
- `.hero--video` mit Farbverlauf (`::before`) über dem Video; Knopf `.hero__pause` unten rechts;
  `initHeroVideo` (js/main.js) hält bei „Bewegung reduzieren“ an. Originalclip NICHT im Repo.

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

- `index.html` (Reihenfolge laut Janne, 20.10.2026): Hero mit Hintergrundvideo · Kennzahlen ·
  Was uns auszeichnet (Foto `fertigung-drosseln-trays-9543.jpg`) · Warum NKL? (3 Karten) · **Aktuelles**
  (3 neueste Beiträge) · Dienstleistungen · Produktwelt · Musterkästen · Qualitätspolitik mit Zertifikat
  **ganz unten**. Hintergründe abwechselnd weiß/grau.
- `unternehmen.html` (gekürzt, nur Originaltext), `historie.html` (Zeitleiste, Fotos
  Klaus und Uwe Lorenzen), `geschaeftsfelder.html`, `umwelt.html`, `archiv.html`
  (= „Aktuelles & Archiv“, alle Beiträge, siehe unten).
- `produkte.html` (Karten mit „Anfrage stellen“ → Kontaktformular),
  `anwendungsbereiche.html` (Schaltplan + Typenbezeichnung; Musterkästen entfernt),
  `messlabor.html` (Originaltext + 4 Laborfotos), `beratung.html`.
- `downloads.html`, `praesentationen.html`: nur Einträge mit Badge „In Vorbereitung“.
- `kontakt.html`, `kontaktformular.html`, `anfahrt.html` (Google-Maps-iframe, direkt eingebunden).
- Rechtliches: `impressum.html`, `agb.html`, `datenschutz.html`, `gewaehrleistung.html`.

## Beiträge (Aktuelles) – wie Mitteilungen der TSV-Seite (umgesetzt 20.10.2026)

- Pflege nur durch Janne (über Claude/GitHub). Inhalt nur in `js/beitraege.js` (Liste `BEITRAEGE`,
  neueste zuerst). Neuer Beitrag = neuer Eintrag ganz oben: `id` (`JJJJ-MM-TT-stichwort`, ohne Tag
  `JJJJ-MM-stichwort`; nie mehr ändern), `datum` (Anzeige, z. B. „Februar 2026“), `titel`, `text`
  (HTML, Absätze `</p><p>`, Links wie von der Startseite aus); optional `teaser`, `komplett: true`,
  `bilder` (`assets/images/beitraege/` oder `assets/images/fotos/`), `archiv: true`.
- **Danach immer `node tools/beitraege.js`** → erzeugt `beitraege/<id>.html` (Kopf/Menü/Fuß aus
  `archiv.html`, Pfade `../`, Linkvorschau für LinkedIn/WhatsApp, Neuer/Älter, „Link kopieren“), löscht
  veraltete. Dateien in `beitraege/` nie von Hand bearbeiten. Auch nach Menü-/Footer-Änderungen ausführen.
- Startseite: Abschnitt „Aktuelles“ (`data-news="latest"`) = 3 neueste ohne `archiv: true`, als Karten
  nebeneinander, Button „Alle Beiträge & Archiv“. `archiv.html` (`data-news="archive"`) = alle, nach
  Jahr gruppiert (Jahr aus der `id`). Teaser automatisch ca. 160 Zeichen (`NEWS_TEASER_LENGTH`).
- `SITE_URL` in `tools/beitraege.js` = https://jannelrnzn.github.io/nkl_testwebsite/ → nach dem Umzug auf
  die eigene Domain umstellen und Skript neu ausführen. Standardbild Linkvorschau: Ringkerndrossel-Foto.
- Bestand: electronica 2026 (20.10.2026, Halle B6 Stand 130, 10.–13.11.2026; Bild = offizielles
  Logo von electronica.de/Messebilder & Logos + Messedaten, Hallenplan B6 mit rot markiertem Stand, ohne
  Werbebanner, Quelle exhibitors.electronica.de, © jl.medien GmbH), REACH 2026, Downloads (Okt. 2025),
  ISO-Rezertifizierung (Sept. 2025, mit Zertifikat); Meldungen 2016–2022 von nkl-emv.de/unternehmen/archiv
  als `archiv: true` – **ohne Weihnachts-/Neujahrsgrüße** (Janne, 20.10.2026), Texte übernommen, ohne Bilder.
- Bilder für Beiträge unter `assets/images/beitraege/`, Titelbild am besten 1200 × 630 (Format der
  Linkvorschau; Startseiten-Karten zeigen es unbeschnitten). Ein einzelnes weiteres Bild erscheint auf der
  Einzelseite in voller Breite.

## Offene Punkte (beim Erledigen hier streichen)

- **Medien von SPICY (erhalten 20.10.2026 per SwissTransfer, ca. 1,8 GB):** Fotos + Videos für
  Imagefilm, Website und Messe. Originale NICHT ins Repo (GitHub: max. 100 MB/Datei, Pages
  max. 1 GB) – Janne archiviert sie selbst. Ins Repo nur Auswahl in Web-Größe: Fotos max.
  2400 px, JPG ca. 200–400 KB, unter `assets/images/`; Hero-Video als Loop 10–20 s ohne Ton,
  1080p H.264 + 720p für Handy, je max. ca. 5–8 MB, plus Standbild (`poster`), unter
  `assets/video/`. Kompletter Imagefilm nicht selbst hosten → YouTube/Vimeo (dann
  Datenschutz ergänzen) oder später beim eigenen Hoster.
- **Downloads/Präsentationen:** PDFs/PowerPoints fehlen (Kurzbeschreibung, Präsentation,
  Messlabor, Produkte, Zertifikate, REACH-Erklärung …). Wenn da: `href` setzen, Badge und
  Meta-Text anpassen (Hinweis als Kommentar in `downloads.html`). Hinweis auf den
  PowerPoint-Viewer ggf. streichen (von Microsoft eingestellt).
- **Kontaktformular:** nicht angebunden (kein Backend). Weg klären (z. B. PHP beim Hoster
  wie `kontakt.php` bei der TSV-Seite), danach Platzhalter-Hinweise in
  `kontaktformular.html` und `js/main.js` entfernen.
- **Datenschutz:** von der Originalseite übernommen, beschreibt reCAPTCHA und Webanalyse,
  die hier nicht eingesetzt werden. Fehlt: Google Maps (Anfahrt), Hosting, Kontaktformular.
  Vor Go-live anpassen und prüfen lassen.
- **Impressum** (20.10.2026): „Gestaltung & Umsetzung: Janne Lorenzen“ ergänzt (freiwillig, ohne Anschrift);
  „Redaktionell verantwortlich“ bleibt Uwe Lorenzen (Janne NICHT als Verantwortlicher). OS-Plattform-Link
  entfernt (EU-Plattform seit 20.07.2025 eingestellt), Satz zur Verbraucherschlichtung bleibt; veralteter
  Hinweis am Ende entfernt. Vor Go-live fachlich prüfen lassen.
- **AGB/Gewährleistung:** von der Originalseite übernommen – Aktualität mit NKL abstimmen.
- Bildgrößen: `NKL_ISO9001_Zertifikat.png` (~500 KB) ggf. verkleinern; `NKL_Logo.JPEG`
  wird nirgends verwendet; `firmengelaende.jpg` seit dem Hero-Video ungenutzt (evtl. für Anfahrt).
