#!/usr/bin/env python3
# Setzt Kopfzeile + Hauptmenü auf ALLEN Seiten (*.html im Repo-Root) einheitlich neu.
# Menü ändern: Liste GROUPS anpassen, dann im Repo-Ordner:  python3 tools/menue.py
# (Beitragsseiten übernehmen den Kopf beim Build automatisch aus archiv.html.)
import glob,re,html
GROUPS=[
 ("Startseite","index.html"),
 ("Unternehmen",[("unternehmen.html","Firmenportrait"),("historie.html","Historie"),("geschaeftsfelder.html","Geschäftsfelder"),("umwelt.html","Umwelt")]),
 ("Produkte",[("produkte.html","Produktübersicht"),("anwendungsbereiche.html","Anwendungsbereiche")]),
 ("Leistungen",[("messlabor.html","EMV-Messlabor"),("beratung.html","Beratung &amp; Schulung")]),
 ("Downloads",[("downloads.html","Downloads"),("praesentationen.html","Präsentationen")]),
 ("Archiv","archiv.html"),
 ("Kontakt",[("kontakt.html","Kontakt"),("kontaktformular.html","Kontaktformular"),("anfahrt.html","Anfahrt")]),
]
def header(cur):
    out=['''  <header class="site-header">
    <div class="container">
      <a class="logo" href="index.html">
        <img class="logo__icon" src="assets/images/logo-kopf.png" alt="NKL GmbH – zur Startseite">
      </a>

      <button class="nav-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Navigation öffnen">
        <span class="nav-toggle__bar"></span>
        <span class="nav-toggle__bar"></span>
        <span class="nav-toggle__bar"></span>
      </button>

      <!-- Hauptmenü: Gruppen klappen per Klick/Tippen auf (Buttons, keine Links – auch auf dem iPad bedienbar) -->
      <nav class="main-nav" id="main-nav" aria-label="Hauptnavigation">
        <ul class="main-nav__list">''']
    for name,items in GROUPS:
        if isinstance(items,str):
            ac=' aria-current="page"' if cur==items else ''
            out.append(f'          <li><a href="{items}"{ac}>{name}</a></li>')
            continue
        active=any(cur==f for f,_ in items)
        out.append('          <li class="main-nav__item--dropdown">')
        out.append(f'            <button type="button" class="main-nav__toggle{" is-active" if active else ""}" aria-expanded="false">{name}</button>')
        out.append('            <ul class="dropdown">')
        for f,l in items:
            ac=' aria-current="page"' if cur==f else ''
            out.append(f'              <li><a href="{f}"{ac}>{l}</a></li>')
        out.append('            </ul>')
        out.append('          </li>')
    out.append('''        </ul>
      </nav>
    </div>
  </header>''')
    return '\n'.join(out)
for f in glob.glob('*.html'):
    s=open(f).read()
    s2,n=re.subn(r'  <header class="site-header">.*?</header>',lambda m: header(f),s,count=1,flags=re.S)
    assert n==1,f
    open(f,'w').write(s2)
print('Menü auf allen Seiten gesetzt.')
