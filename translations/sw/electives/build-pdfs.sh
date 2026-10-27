#!/usr/bin/env bash
# Build printable PDFs for one course's Swahili files: build-pdfs.sh B-C1
set -euo pipefail
C="$1"; D="/home/claude/swahili-electives/$C"; OUT="$D/pdf"; mkdir -p "$OUT"
CSS='body{font-family:"Noto Serif","DejaVu Serif",serif;font-size:11.5pt;line-height:1.5;max-width:42em;margin:auto}
h1{font-size:20pt;margin-top:0}h2{font-size:14.5pt;margin-top:1.6em;page-break-before:auto}
blockquote{margin:0.8em 1.5em;color:#333}.small{font-size:9.5pt}
@page{size:A4;margin:18mm 16mm 20mm 16mm}'
for f in textbook readings textbook-test readings-test; do
  [ -f "$D/$f.sw.md" ] || { echo "skip $f (missing)"; continue; }
  pandoc "$D/$f.sw.md" -f markdown -t html5 -s --metadata title=" " \
    --css /dev/null -V lang=sw -o "$OUT/$f.html"
  python3 - "$OUT/$f.html" "$CSS" <<'EOF'
import sys;p,css=sys.argv[1],sys.argv[2];t=open(p,encoding='utf-8').read()
t=t.replace('</head>','<style>'+css+'</style></head>',1);open(p,'w',encoding='utf-8').write(t)
EOF
  node -e '
const {chromium}=require("playwright");(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto("file://"+process.argv[1]);await p.pdf({path:process.argv[2],format:"A4",printBackground:true,
displayHeaderFooter:true,headerTemplate:"<span></span>",
footerTemplate:"<div style=\"font-size:8pt;width:100%;text-align:center;color:#666\">Seminari ya Kitheolojia ya Chapala · <span class=pageNumber></span>/<span class=totalPages></span></div>",
margin:{top:"18mm",bottom:"20mm",left:"16mm",right:"16mm"}});await b.close()})()' "$OUT/$f.html" "$OUT/$C-$f-SW.pdf"
  rm -f "$OUT/$f.html"
done
ls -la "$OUT"
