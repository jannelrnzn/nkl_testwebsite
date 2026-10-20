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
    id: "2022-12-frohe-feiertage",
    datum: "Dezember 2022",
    titel: "Frohe Feiertage",
    archiv: true,
    text:
      "Die NKL GmbH wünscht Ihnen und Ihrer Familie frohe Weihnachten, erholsame Feiertage und einen " +
      "guten Start ins neue Jahr! Wir bedanken uns für die gute Zusammenarbeit." +
      "</p><p><strong>Bitte beachten Sie:</strong> Unser Unternehmen (Wareneingang) ist nur bis Mittwoch, " +
      "21. Dezember 2022 geöffnet und wieder ab dem 02. Januar 2023."
  },
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
    id: "2022-01-wuensche-neues-jahr",
    datum: "Januar 2022",
    titel: "Wünsche für das neue Jahr",
    archiv: true,
    text:
      "Wir hoffen, Sie hatten eine gute und erholsame Zeit zwischen den Jahren und einen guten Start in " +
      "das neue Jahr." +
      "</p><p>Wir haben wieder durchgestartet und versuchen trotz Coronarestriktionen, Lieferengpässen " +
      "und ähnlichen Schwierigkeiten unsere Kunden zufriedenstellend mit unseren Bauteilen zu beliefern."
  },
  {
    id: "2021-12-frohe-weihnachten",
    datum: "Dezember 2021",
    titel: "Frohe Weihnachten",
    archiv: true,
    text:
      "Auch wenn in der Welt um uns herum so vieles im Argen liegt, bleibt Weihnachten doch ein Fest, an " +
      "dem Freude, Besinnlichkeit und Frieden im Vordergrund stehen. Deshalb wünschen wir Ihnen viel " +
      "Freude, besinnliche und friedliche Feiertage." +
      "</p><p><strong>Bitte beachten Sie:</strong> Unser Unternehmen (Wareneingang) ist nur bis Dienstag, " +
      "21. Dezember 2021 geöffnet und wieder ab dem 03. Januar 2022."
  },
  {
    id: "2021-01-wuensche-2021",
    datum: "Januar 2021",
    titel: "Wünsche für das Jahr 2021",
    archiv: true,
    text:
      "Wir, die NKL GmbH, wünschen Ihnen und uns ein gutes und besseres Jahr. Wir hoffen, dass sich die " +
      "Lage bald entspannt und die Arbeits- und Lebensbedingungen wieder wie vor der Krise werden."
  },
  {
    id: "2020-12-schoene-feiertage",
    datum: "Dezember 2020",
    titel: "Schöne Feiertage",
    archiv: true,
    text:
      "Die NKL GmbH bedankt sich für die gute Zusammenarbeit und wünscht Ihnen und Ihrer Familie frohe " +
      "Weihnachten, erholsame Feiertage und einen guten Start ins neue Jahr!" +
      "</p><p><strong>Bitte beachten Sie:</strong> Unser Unternehmen (Wareneingang) ist nur bis Dienstag, " +
      "22. Dezember 2020 geöffnet und wieder ab dem 07. Januar 2021."
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
    id: "2020-01-neujahrsgruss",
    datum: "Januar 2020",
    titel: "Neujahrsgruß",
    archiv: true,
    text:
      "Wir bedanken uns recht herzlich für die erfolgreiche Zusammenarbeit im vergangenen Jahr und " +
      "wünschen Ihnen einen guten und erfolgreichen Start in das neue Jahr 2020."
  },
  {
    id: "2019-12-frohe-feiertage",
    datum: "Dezember 2019",
    titel: "Frohe Feiertage",
    archiv: true,
    text:
      "Frohe und erholsame Weihnachten und ein gutes neues Jahr 2020 wünscht Ihnen die NKL GmbH." +
      "</p><p><strong>Bitte beachten Sie:</strong> Unser Unternehmen (Wareneingang) ist nur bis Donnerstag, " +
      "19. Dezember 2019 geöffnet und wieder ab dem 07. Januar 2020."
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
    id: "2019-01-wuensche-2019",
    datum: "Januar 2019",
    titel: "Wünsche für das neue Jahr 2019",
    archiv: true,
    text:
      "Im Namen des gesamten NKL-Teams wünschen wir Ihnen einen guten Start in das neue Jahr und " +
      "Gesundheit, Glück und Erfolg." +
      "</p><p><em>„Nicht die Jahre in unserem Leben zählen, sondern das Leben in unseren Jahren.“</em> – Adlai Stevenson"
  },
  {
    id: "2018-12-frohe-weihnachten",
    datum: "Dezember 2018",
    titel: "Frohe Weihnachten und schöne Feiertage",
    archiv: true,
    text:
      "Im Namen des gesamten NKL-Teams wünschen wir Ihnen erholsame Weihnachtsfeiertage und für das neue " +
      "Jahr Gesundheit, Glück und Erfolg." +
      "</p><p><strong>Bitte beachten Sie:</strong> Unser Wareneingang und die Firma sind ab Donnerstag, " +
      "20. Dezember 2018 geschlossen. Ab Mittwoch, 02. Januar 2019 sind wir wieder für Sie erreichbar."
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
    id: "2018-01-neujahrsgruesse",
    datum: "Januar 2018",
    titel: "Neujahrsgrüße",
    archiv: true,
    text:
      "<em>„Wenn das alte Jahr erfolgreich war, dann freue dich aufs Neue. Und war es schlecht, ja, dann " +
      "erst recht.“</em> – Albert Einstein" +
      "</p><p>In diesem Sinne wünschen wir unseren Kunden ein gutes und erfolgreiches neues Jahr 2018."
  },
  {
    id: "2017-12-schoene-feiertage",
    datum: "Dezember 2017",
    titel: "Erholsame und schöne Feiertage",
    archiv: true,
    text:
      "Das NKL-Team wünscht Ihnen und Ihrer Familie fröhliche Feiertage mit vielen großen und kleinen " +
      "Freuden, erholsame Stunden der Gemütlichkeit sowie einen gesunden und erfolgreichen Start in das neue Jahr."
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
    id: "2016-12-frohe-feiertage",
    datum: "Dezember 2016",
    titel: "Frohe und schöne Feiertage",
    archiv: true,
    text:
      "Es ist wieder so weit … Wir wünschen unseren Kunden eine erholsame Weihnachtszeit und ein gutes " +
      "neues Jahr 2017 und bedanken uns für die Zusammenarbeit." +
      "</p><p><strong>Bitte beachten Sie:</strong> Unser Unternehmen (Wareneingang) ist nur bis Donnerstag, " +
      "22. Dezember 2016 geöffnet und dann wieder ab dem 02. Januar 2017. Bitte beachten Sie auch den " +
      "lokalen Feiertag am 06.01.2017."
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
