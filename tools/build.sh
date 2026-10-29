#!/usr/bin/env bash
# Baut die veröffentlichte Website in dist/ (für GitHub Pages, später auch für einen eigenen Webspace).
#
#   bash tools/build.sh   -> dist/
#
# Enthält alles außer internen Dateien (siehe tools/upload-ausschluss.txt), erzeugt
# aus content/ die Beiträge (js/beitraege.js + beitraege/<id>.html) und die Downloads
# (js/downloads.js) und entfernt danach Werkzeuge und Quelltexte.
# Wird von der GitHub Action „Website veröffentlichen“ bei jedem Push auf main benutzt.
set -euo pipefail
cd "$(dirname "$0")/.."

SITE_URL="${SITE_URL:-https://jannelrnzn.github.io/nkl_testwebsite/}"

rm -rf dist
mkdir dist
tar --exclude-from=tools/upload-ausschluss.txt -cf - . | tar -xpf - -C dist

SITE_URL="$SITE_URL" node dist/tools/beitraege.js
node dist/tools/downloads.js
rm -rf dist/tools dist/content

# Cache-Busting für die erzeugten Listen: Version = Prüfsumme des Inhalts
BV=$(md5sum dist/js/beitraege.js | cut -c1-12)
DV=$(md5sum dist/js/downloads.js | cut -c1-12)
sed -i -E "s#js/beitraege\.js\?v=[0-9a-f]*\"#js/beitraege.js?v=$BV\"#" dist/index.html dist/archiv.html
sed -i -E "s#js/downloads\.js\?v=[0-9a-f]*\"#js/downloads.js?v=$DV\"#" dist/downloads.html dist/praesentationen.html

echo "Website in dist/ fertig ($(find dist -type f | wc -l) Dateien, $(du -sh dist | cut -f1)) für $SITE_URL"
