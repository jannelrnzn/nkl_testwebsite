/**
 * NKL GmbH – alle Beiträge (Aktuelles) an einer Stelle.
 *
 * Neuer Beitrag: GANZ OBEN in die Liste einfügen (neueste zuerst) und danach
 *   node tools/beitraege.js
 * ausführen. Das Skript erzeugt für jeden Eintrag eine eigene Seite
 * beitraege/<id>.html (verlinkbar, mit Linkvorschau für LinkedIn, WhatsApp & Co.).
 *
 * Felder:
 *   id        eindeutig, nur a-z, 0-9 und "-", Muster JJJJ-MM-TT-stichwort
 *             (ohne genauen Tag: JJJJ-MM-stichwort). Wird Dateiname – später
 *             nicht mehr ändern, sonst gehen Links kaputt.
 *   datum     Anzeige-Datum, z. B. "20. Oktober 2026" oder "Februar 2026"
 *   titel     Überschrift
 *   text      kompletter Text; einfaches HTML erlaubt, Absätze mit </p><p>,
 *             Links z. B. <a href="downloads.html">…</a> (Pfad wie von der Startseite aus)
 *   teaser    optional eigener Kurztext für Startseite/Archiv
 *             (sonst automatisch die ersten ca. 160 Zeichen des Textes + „Weiterlesen“)
 *   komplett  optional true – auf Startseite/Archiv den ganzen Text zeigen statt Teaser
 *   bilder    optional, Dateien unter assets/images/beitraege/ (oder assets/images/fotos/):
 *               bilder: [
 *                 { datei: "assets/images/beitraege/messe-2026.jpg", beschreibung: "Unser Messestand" },
 *                 "assets/images/beitraege/zweites-bild.jpg"
 *               ]
 *   archiv    optional true – nicht mehr auf der Startseite anzeigen (nur noch im Archiv)
 *
 * Startseite: die drei neuesten Beiträge ohne archiv: true.
 * Unternehmen -> Aktuelles & Archiv (archiv.html): alle Beiträge, nach Jahren gruppiert.
 */

var BEITRAEGE = [
  {
    id: "2026-10-20-electronica-2026",
    datum: "20. Oktober 2026",
    titel: "Besuchen Sie uns auf der electronica 2026",
    text:
      "Vom 10. bis 13. November 2026 ist es wieder so weit: Die electronica, die Weltleitmesse der " +
      "Elektronik, findet auf dem Messegelände in München statt – und die NKL GmbH ist dabei!" +
      "</p><p>Sie finden uns in <strong>Halle B6 am Stand 130 (B6.130)</strong>. Wir freuen uns darauf, " +
      "Ihnen unsere Ringkerndrosseln, Entstörfilter und Übertrager vorzustellen und mit Ihnen über Ihre " +
      "EMV-Fragen zu sprechen." +
      "</p><p>Sie möchten vorab einen Termin am Stand vereinbaren? Schreiben Sie uns gerne über das " +
      "<a href=\"kontaktformular.html\">Kontaktformular</a>." +
      "</p><p><small>Hallenplan: <a href=\"https://exhibitors.electronica.de/exhibitor-portal/2026/hallplans/hallplan/?lid=b6\" " +
      "target=\"_blank\" rel=\"noopener\">electronica.de – Hallenplan B6</a> (© jl.medien GmbH). " +
      "Logo: © Messe München GmbH.</small>",
    bilder: [
      { datei: "assets/images/beitraege/electronica-2026.jpg", beschreibung: "electronica 2026 – 10. bis 13. November, Messe München" },
      { datei: "assets/images/beitraege/electronica-2026-hallenplan-b6.jpg", beschreibung: "Hallenplan B6 – unser Stand B6.130 ist rot markiert" }
    ]
  },
  {
    id: "2026-02-reach-2026",
    datum: "Februar 2026",
    titel: "REACH 2026",
    text:
      "Wir produzieren REACH-kompatible Bauelemente. Bezüglich der EU-Chemikalienverordnung " +
      "(Verordnung (EG) Nr. 1907/2006, REACH-Verordnung), die am 1. Juni 2007 in Kraft getreten ist, " +
      "ist die Kandidatenliste auf der Webseite der Europäischen Chemikalienagentur (ECHA) veröffentlicht. " +
      "Diese Liste wurde im Februar 2026 aktualisiert und dementsprechend auch unsere Erklärung." +
      "</p><p>Unsere aktuelle REACH-Erklärung finden Sie im <a href=\"downloads.html\">Downloadbereich</a>. " +
      "Informationen zur Kandidatenliste finden Sie auf der " +
      "<a href=\"https://echa.europa.eu/de/candidate-list-table\" target=\"_blank\" rel=\"noopener\">Webseite der ECHA</a>."
  },
  {
    id: "2025-10-downloads",
    datum: "Oktober 2025",
    titel: "Wichtige Informationen zum Herunterladen",
    text:
      "Zur Unterstützung unserer Kunden haben wir verschiedene nützliche Informationen zum Download " +
      "zusammengestellt: Schulungsunterlagen (Stand 15.10.2025), ISO-9001-Zertifikat, REACH-Erklärung, " +
      "RoHS-Erklärung und Konfliktmaterialien-Erklärung." +
      "</p><p>Alles Weitere finden Sie im <a href=\"downloads.html\">Downloadbereich</a>."
  },
  {
    id: "2025-09-iso-9001-rezertifizierung",
    datum: "September 2025",
    titel: "Rezertifizierung nach ISO 9001",
    bilder: [
      { datei: "assets/images/NKL_ISO9001_Zertifikat.png", beschreibung: "ISO-9001:2015-Zertifikat der NKL GmbH" }
    ],
    text:
      "Unsere erfolgreiche Rezertifizierung nach ISO 9001:2015 durch die LGA InterCert (gültig bis " +
      "06.09.2028) belegt einmal mehr den hohen Stand unseres Qualitätsmanagementsystems, das wir seit " +
      "1998 durchgängig zum Nutzen unserer Kunden und für uns selbst erfolgreich anwenden." +
      "</p><p>Das aktuelle Zertifikat finden Sie im <a href=\"downloads.html\">Downloadbereich</a>."
  },

  // ---------------- Archiv (von der bisherigen Website übernommen) ----------------

  {
    id: "2022-10-electronica-2022",
    datum: "Herbst 2022",
    titel: "electronica 2022",
    archiv: true,
    text:
      "Endlich können wieder Messen stattfinden – eine gute Möglichkeit, uns und unsere Produkte " +
      "kennenzulernen. Die electronica 2022 findet vom 15. bis 18. November in München statt." +
      "</p><p>Wir würden uns freuen, wenn Sie in Halle A5 an unserem Stand A5.127 vorbeischauen."
  },
  {
    id: "2020-03-aktuelle-situation",
    datum: "März 2020",
    titel: "Aktuelle Situation",
    archiv: true,
    text:
      "Wegen der aktuellen Gesundheitslage wurde die bevorstehende Gewerbeschau in Wolpertshausen " +
      "abgesagt. Bis jetzt laufen die Geschäftstätigkeiten bei NKL wie gewohnt." +
      "</p><p>Wir wünschen unseren Kunden Gesundheit und einen weiteren undramatischen Geschäftsverlauf."
  },
  {
    id: "2019-08-iso-9001-rezertifizierung",
    datum: "August 2019",
    titel: "Erfolgreiche ISO-9001-Rezertifizierung",
    archiv: true,
    text:
      "Das konstant hohe Niveau unseres Qualitätsmanagement-Systems nach ISO 9001:2015 wurde diesen Monat " +
      "durch eine erfolgreiche Rezertifizierung wieder einmal bestätigt."
  },
  {
    id: "2019-03-firmenjubilaeum",
    datum: "März 2019",
    titel: "Firmenjubiläum",
    archiv: true,
    text:
      "In diesem Jahr haben wir unser 40-jähriges Firmenjubiläum. Die Planungen für die Feier sind noch " +
      "im Gange. Die Belegschaft darf auf den bevorstehenden Event gespannt sein."
  },
  {
    id: "2018-11-electronica-2018-danke",
    datum: "November 2018",
    titel: "electronica 2018",
    archiv: true,
    text: "Vielen Dank für Ihre Besuche auf unserem Messestand auf der electronica 2018."
  },
  {
    id: "2018-07-electronica-2018",
    datum: "Sommer 2018",
    titel: "electronica 2018 in München",
    archiv: true,
    text:
      "Eine gute Möglichkeit, uns und unsere Produkte kennenzulernen, bietet sich auf der electronica 2018. " +
      "Sie findet vom 13. bis 16. November in München statt." +
      "</p><p>Falls Sie dort als Aussteller oder Besucher sind, würden wir uns freuen, wenn Sie an unserem " +
      "Stand A6 / 431 vorbeischauen."
  },
  {
    id: "2017-07-leitfaden-din-en-60940",
    datum: "Sommer 2017",
    titel: "Leitfaden / DIN EN 60940",
    archiv: true,
    text:
      "Der Leitfaden für die Anwendung von Kondensatoren, Widerständen, Drosseln und vollständigen " +
      "Filtereinheiten zur Unterdrückung elektromagnetischer Störungen (jetzt DIN EN 60940) wurde letztes " +
      "Jahr aktualisiert. Da die NKL® GmbH im Normungsausschuss mit vertreten ist, können wir Sie zu " +
      "Fragen diesbezüglich gerne <a href=\"beratung.html\">beraten</a>."
  },
  {
    id: "2017-01-umwelt-led",
    datum: "Januar 2017",
    titel: "Unsere Umwelt ist uns wichtig",
    archiv: true,
    text:
      "Wir haben den restlichen Teil unserer (Firmen-)Beleuchtung auf LED umgestellt. Außerdem wurden " +
      "unsere Außenlampen durch LED-Strahler ersetzt. Dadurch reduzieren wir unseren Verbrauch an " +
      "elektrischer Energie um ungefähr weitere 8 % auf insgesamt ca. 28 %." +
      "</p><p>Mehr zu unserer <a href=\"umwelt.html\">Umweltpolitik</a>."
  },
  {
    id: "2016-08-messe-im-november",
    datum: "August 2016",
    titel: "Messe im November",
    archiv: true,
    text:
      "Die Zeit schreitet schnell voran … Im November ist es wieder so weit: Alle zwei Jahre findet die " +
      "electronica in München statt. Wir freuen uns, Ihnen mitteilen zu können, dass wir dort in Halle B5, " +
      "Stand 209 vertreten sind." +
      "</p><p>Geschäftsleitung und Entwicklung stellen die Produkte und Neuigkeiten vor."
  },
  {
    id: "2016-06-umwelt-led",
    datum: "Juni 2016",
    titel: "Unsere Umwelt ist uns wichtig",
    archiv: true,
    text:
      "Wir haben einen Teil unserer (Firmen-)Beleuchtung auf LED umgestellt. Dadurch reduzieren wir " +
      "unseren Verbrauch von elektrischer Energie um ca. 20 %."
  }
];
