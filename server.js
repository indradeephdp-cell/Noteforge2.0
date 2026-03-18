require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "100mb" }));

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>NoteForge AI</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@300;400;600;700&display=swap" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<style>
:root {
  --bg:       #07090f;
  --bg2:      #0b0f1a;
  --bg3:      #0f1521;
  --border:   #1a2235;
  --gold:     #e8a020;
  --gold2:    #f5b93a;
  --gold3:    #fdd06a;
  --text:     #dde3ef;
  --text2:    #8a96ac;
  --text3:    #3d4a62;
  --green:    #34c97a;
  --red:      #e85454;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden}
body{font-family:'Source Sans 3',sans-serif;background:var(--bg);color:var(--text);display:flex;flex-direction:column}

/* scrollbar */
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}

/* ══ HEADER ══ */
header{
  background:linear-gradient(135deg,#060810 0%,#0b1020 60%,#0d0f18 100%);
  border-bottom:1px solid var(--border);
  padding:11px 20px;
  display:flex;align-items:center;justify-content:space-between;
  gap:10px;flex-wrap:wrap;
  position:sticky;top:0;z-index:200;
  box-shadow:0 4px 32px rgba(0,0,0,.7);
}
.brand{display:flex;align-items:center;gap:12px}
.brand-icon{
  width:42px;height:42px;border-radius:12px;flex-shrink:0;
  background:linear-gradient(135deg,#5c2a00,var(--gold));
  display:flex;align-items:center;justify-content:center;font-size:20px;
  box-shadow:0 0 24px rgba(232,160,32,.4);
  animation:iconGlow 3s ease infinite;
}
.brand-name{font-family:'Playfair Display',serif;font-size:19px;font-weight:700;color:var(--gold);letter-spacing:.2px}
.brand-sub{font-size:8px;color:var(--text3);text-transform:uppercase;letter-spacing:2px;margin-top:1px}

/* tabs */
.tabs{display:flex;background:var(--bg2);border-radius:10px;padding:3px;border:1px solid var(--border);gap:2px}
.tab{padding:7px 16px;border-radius:8px;border:none;cursor:pointer;font-family:'Source Sans 3',sans-serif;font-size:12px;font-weight:600;transition:all .2s;background:transparent;color:var(--text2)}
.tab.on{background:linear-gradient(135deg,#5c2a00,var(--gold));color:#07090f}
.tab:not(.on):hover{color:var(--gold2)}

/* header action buttons */
.hdr-actions{display:flex;gap:7px}
.hdr-actions button{padding:7px 15px;border-radius:8px;font-family:'Source Sans 3',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;border:none}
.btn-dl-md{background:transparent;border:1px solid var(--border)!important;color:var(--text2)}
.btn-dl-md:hover{border-color:var(--gold)!important;color:var(--gold)}
.btn-dl-pdf{background:linear-gradient(135deg,#5c2a00,var(--gold));color:#07090f}
.btn-dl-pdf:hover:not(:disabled){filter:brightness(1.1);transform:translateY(-1px)}
.btn-dl-pdf:disabled{background:var(--border);color:var(--text3);cursor:default}

/* ══ LAYOUT ══ */
.layout{flex:1;display:flex;overflow:hidden;height:calc(100vh - 65px)}

/* ══ LEFT PANEL ══ */
.left{
  width:370px;flex-shrink:0;
  background:var(--bg2);border-right:1px solid var(--border);
  display:flex;flex-direction:column;overflow-y:auto;
  padding:16px;gap:14px;
}
@media(max-width:680px){.left{width:100%}}

.sec-label{font-size:8.5px;color:var(--text3);text-transform:uppercase;letter-spacing:2px;margin-bottom:7px;display:block}

/* source toggle */
.src-row{display:flex;background:var(--bg);border-radius:9px;padding:3px;border:1px solid var(--border)}
.src-btn{flex:1;padding:8px;border-radius:7px;border:none;cursor:pointer;font-family:'Source Sans 3',sans-serif;font-size:12px;font-weight:600;transition:all .2s;background:transparent;color:var(--text2)}
.src-btn.on{background:linear-gradient(135deg,#5c2a00,var(--gold));color:#07090f}

/* ── UPLOAD BOX ── */
.upload-zone{
  border:2px dashed var(--border);border-radius:14px;
  padding:28px 18px;text-align:center;
  background:var(--bg);cursor:pointer;
  transition:all .25s;position:relative;overflow:hidden;
}
.upload-zone input[type=file]{
  position:absolute;inset:0;width:100%;height:100%;
  opacity:0;cursor:pointer;font-size:0;
}
.upload-zone:hover{border-color:var(--gold);background:rgba(232,160,32,.04)}
.upload-zone.has{border-color:var(--green);background:rgba(52,201,122,.04)}
.upload-zone.drag{border-color:var(--gold);background:rgba(232,160,32,.08)}
.uz-icon{font-size:44px;line-height:1;margin-bottom:10px;pointer-events:none}
.uz-title{font-size:14px;font-weight:700;color:var(--text);margin-bottom:5px;pointer-events:none}
.uz-sub{font-size:11px;color:var(--text2);pointer-events:none}
.uz-chip{display:inline-block;margin-top:9px;padding:4px 12px;border-radius:20px;border:1px solid var(--border);color:var(--text3);font-size:10px;pointer-events:none}

/* status messages */
.status{display:none;align-items:center;gap:9px;padding:10px 13px;border-radius:9px;font-size:12px;line-height:1.5}
.status.show{display:flex}
.status.ok{background:rgba(52,201,122,.08);border:1px solid rgba(52,201,122,.28);color:var(--green)}
.status.err{background:rgba(232,84,84,.08);border:1px solid rgba(232,84,84,.28);color:var(--red)}
.status.info{background:rgba(232,160,32,.08);border:1px solid rgba(232,160,32,.22);color:var(--gold2)}

/* page range */
.page-box{background:var(--bg);border:1px solid var(--border);border-radius:11px;padding:14px}
.range-row{display:flex;gap:10px;margin-top:9px}
.range-col{flex:1}
.range-col label{font-size:10px;color:var(--text2);display:block;margin-bottom:5px}
input[type=number]{width:100%;padding:9px;background:var(--bg2);border:1px solid rgba(232,160,32,.3);border-radius:8px;color:var(--gold);font-family:'Source Sans 3',sans-serif;font-size:17px;font-weight:700;text-align:center;-moz-appearance:textfield}
input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
input[type=number]:focus{outline:none;border-color:var(--gold)}
.pg-hint{margin-top:8px;text-align:center;font-size:10px;color:var(--text3)}

/* textarea */
textarea{width:100%;min-height:220px;padding:13px;background:var(--bg);border:1px solid var(--border);border-radius:11px;color:var(--text);font-family:'Source Sans 3',sans-serif;font-size:13px;line-height:1.75;resize:vertical}
textarea:focus{outline:none;border-color:var(--gold)}
.char-c{font-size:10px;color:var(--text3);margin-top:4px}

/* generate button */
.gen-btn{
  width:100%;padding:14px;border-radius:12px;border:none;
  cursor:pointer;font-family:'Playfair Display',serif;
  font-size:16px;font-weight:700;letter-spacing:.3px;
  transition:all .25s;
  background:linear-gradient(135deg,#5c2a00,var(--gold),var(--gold2));
  color:#07090f;
  box-shadow:0 0 24px rgba(232,160,32,.22);
}
.gen-btn:not(:disabled):hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 8px 32px rgba(232,160,32,.38)}
.gen-btn:disabled{background:var(--border);color:var(--text3);cursor:default;box-shadow:none;transform:none}

/* progress */
.prog{font-size:11px;color:var(--text3);text-align:center;margin-top:7px;display:none;animation:pulse 1.5s infinite}
.prog.show{display:block}

/* gen error */
.gen-err{padding:9px 12px;border-radius:8px;background:rgba(232,84,84,.08);border:1px solid rgba(232,84,84,.28);color:var(--red);font-size:12px;display:none}
.gen-err.show{display:block}

/* chips */
.chips{display:flex;flex-wrap:wrap;gap:5px}
.chip{padding:3px 9px;border-radius:20px;border:1px solid var(--border);color:var(--text3);font-size:9.5px}

/* ══ RIGHT EMPTY ══ */
.right-placeholder{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:36px;text-align:center;overflow-y:auto}
.rp-icon{font-size:64px;line-height:1}
.rp-title{font-family:'Playfair Display',serif;font-size:21px;color:var(--border);font-weight:700}
.rp-sub{font-size:13px;color:var(--text3);line-height:2}
.rp-feats{display:flex;gap:20px;flex-wrap:wrap;justify-content:center;margin-top:6px}
.rp-feat{text-align:center;color:var(--text3)}
.rp-feat .fi{font-size:26px;margin-bottom:4px}
.rp-feat .fl{font-size:9px;text-transform:uppercase;letter-spacing:1px}

/* spinner */
.spinner{width:50px;height:50px;border:3px solid var(--border);border-top-color:var(--gold);border-radius:50%;animation:spin 1s linear infinite}
.spin-msg{font-size:15px;font-weight:600;color:var(--text2)}
.spin-sub{font-size:12px;color:var(--text3)}

/* ══ PREVIEW PANEL ══ */
#preview-panel{flex:1;overflow-y:auto;display:none;flex-direction:column}
#preview-panel.show{display:flex}

.prev-inner{max-width:870px;width:100%;margin:0 auto;padding:28px 34px;animation:fadeUp .5s ease}

/* style badge */
.style-badge{display:inline-flex;align-items:center;gap:7px;padding:8px 16px;background:rgba(232,160,32,.08);border:1px solid rgba(232,160,32,.2);border-radius:9px;font-size:12px;color:var(--gold2);margin-bottom:18px;font-style:italic}

/* ══ NOTES BODY ══ */
#notes-body{line-height:1.85}
#notes-body h1{font-family:'Playfair Display',serif;color:var(--gold);font-size:1.8em;border-bottom:1px solid var(--border);padding-bottom:11px;margin:36px 0 15px}
#notes-body h2{color:var(--gold2);font-size:1.32em;border-left:3px solid var(--gold);padding-left:13px;margin:28px 0 11px;font-weight:700}
#notes-body h3{color:var(--gold3);font-size:1.08em;margin:20px 0 8px;font-weight:600}
#notes-body h4{color:#fde68a;font-size:.97em;margin:14px 0 7px;font-weight:600}
#notes-body p{color:#c8d0e0;margin:8px 0}
#notes-body strong{color:var(--gold)}
#notes-body em{color:#7ee8a2;font-style:italic}
#notes-body ul,#notes-body ol{padding-left:22px;margin:8px 0}
#notes-body li{margin:5px 0;color:#c8d0e0;line-height:1.72}
#notes-body code{background:#0f1724;padding:2px 7px;border-radius:4px;font-family:'Courier New',monospace;font-size:.84em;color:#4ec9b0}
#notes-body pre{background:#0a0f1a;border:1px solid var(--border);border-radius:11px;padding:18px;overflow:auto;margin:13px 0}
#notes-body blockquote{border-left:3px solid var(--gold);margin:13px 0;padding:11px 17px;background:rgba(232,160,32,.06);border-radius:0 9px 9px 0;color:var(--gold3);font-style:italic}
#notes-body hr{border:none;border-top:1px solid var(--border);margin:28px 0}
#notes-body table{width:100%;border-collapse:collapse;margin:13px 0;font-size:13px}
#notes-body th{padding:9px 13px;background:rgba(232,160,32,.1);color:var(--gold);border:1px solid var(--border);text-align:left;font-weight:700}
#notes-body td{padding:8px 13px;border:1px solid var(--border);color:#c8d0e0}
#notes-body tr:nth-child(even) td{background:var(--bg2)}
.mmd-box{background:var(--bg2);border:2px solid var(--border);border-radius:14px;padding:16px 14px;margin:20px 0;overflow:hidden;text-align:center;width:100%}
.mmd-box svg{width:100%!important;max-width:100%!important;max-height:300px!important;height:auto!important;display:block!important;margin:0 auto!important}
.mmd-box text{font-size:13px!important}
.mmd-box .label div{font-size:13px!important}
.mmd-box .nodeLabel{font-size:13px!important}
.mmd-box .edgeLabel{font-size:12px!important}

/* download bar */
.dl-bar{margin-top:42px;padding-top:26px;border-top:1px solid var(--border);display:flex;flex-direction:column;align-items:center;gap:13px}
.dl-label{font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:1.8px}
.dl-row{display:flex;gap:11px;flex-wrap:wrap;justify-content:center}
.dl-md-btn{padding:12px 24px;border-radius:11px;border:1px solid var(--border);background:transparent;color:var(--text2);cursor:pointer;font-size:13px;font-family:'Source Sans 3',sans-serif;font-weight:600;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:3px}
.dl-md-btn:hover{border-color:var(--gold);color:var(--gold);background:rgba(232,160,32,.05)}
.dl-pdf-btn{padding:12px 28px;border-radius:11px;border:none;background:linear-gradient(135deg,#5c2a00,var(--gold),var(--gold2));color:#07090f;cursor:pointer;font-size:13px;font-family:'Source Sans 3',sans-serif;font-weight:700;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:3px;box-shadow:0 0 18px rgba(232,160,32,.26)}
.dl-pdf-btn:not(:disabled):hover{filter:brightness(1.1);transform:translateY(-1px)}
.dl-pdf-btn:disabled{background:var(--border);color:var(--text3);cursor:default;box-shadow:none;transform:none}
.dl-md-btn small,.dl-pdf-btn small{font-size:9.5px;font-weight:400;opacity:.7}

/* no notes state */
.no-notes{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;gap:13px;padding:40px;text-align:center}

/* ── animations ── */
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes iconGlow{0%,100%{box-shadow:0 0 20px rgba(232,160,32,.35)}50%{box-shadow:0 0 38px rgba(232,160,32,.65)}}
</style>
</head>
<body>

<!-- ══════ HEADER ══════ -->
<header>
  <div class="brand">
    <div class="brand-icon">📝</div>
    <div>
      <div class="brand-name">NoteForge AI</div>
      <div class="brand-sub">Powered by Gemini 1.5 Pro</div>
    </div>
  </div>

  <div class="tabs">
    <button class="tab on" id="t-input"   onclick="switchTab('input')">⚙️ Input</button>
    <button class="tab"    id="t-preview" onclick="switchTab('preview')">📋 Preview</button>
  </div>

  <div class="hdr-actions" id="hdr-actions" style="display:none">
    <button class="btn-dl-md"  onclick="dlMd()">⬇ .md</button>
    <button class="btn-dl-pdf" id="h-pdf" onclick="dlPdf()">📄 PDF</button>
  </div>
</header>

<!-- ══════ LAYOUT ══════ -->
<div class="layout">

  <!-- ━━ INPUT TAB ━━ -->
  <div id="input-tab" style="display:flex;width:100%;height:100%">

    <!-- Left -->
    <div class="left">

      <!-- Source -->
      <div>
        <span class="sec-label">Source Type</span>
        <div class="src-row">
          <button class="src-btn on" id="sb-pdf"  onclick="setSrc('pdf')">📄 PDF Upload</button>
          <button class="src-btn"    id="sb-text" onclick="setSrc('text')">📋 Paste Text</button>
        </div>
      </div>

      <!-- PDF section -->
      <div id="pdf-sec">
        <span class="sec-label">Upload Your PDF</span>

        <!-- Drop zone — input covers entire area at opacity 0 -->
        <div class="upload-zone" id="uz"
          ondragover="event.preventDefault();document.getElementById('uz').classList.add('drag')"
          ondragleave="document.getElementById('uz').classList.remove('drag')"
          ondrop="onDrop(event)">
          <input type="file" accept=".pdf,application/pdf" onchange="onFileChange(event)" title="Select PDF"/>
          <div id="uz-inner">
            <div class="uz-icon">📂</div>
            <div class="uz-title">Click to Upload PDF</div>
            <div class="uz-sub">or drag &amp; drop your file here</div>
            <div class="uz-chip">No file size limit · Any PDF</div>
          </div>
        </div>

        <div class="status info" id="s-reading"><div class="spinner" style="width:16px;height:16px;border-width:2px;flex-shrink:0"></div>&nbsp;Reading PDF…</div>
        <div class="status err"  id="s-err"></div>
        <div class="status ok"   id="s-ok"></div>

        <!-- Page range -->
        <div class="page-box" id="pg-box" style="display:none">
          <span class="sec-label">📄 Page Range (optional)</span>
          <div class="range-row">
            <div class="range-col">
              <label>From page</label>
              <input type="number" id="pg-from" value="1" min="1" oninput="updatePg()"/>
            </div>
            <div class="range-col">
              <label>To page</label>
              <input type="number" id="pg-to" value="10" min="1" oninput="updatePg()"/>
            </div>
          </div>
          <div class="pg-hint" id="pg-hint">Pages 1 → 10 · 10 pages selected</div>
        </div>
      </div>

      <!-- Text section -->
      <div id="text-sec" style="display:none">
        <span class="sec-label">Paste Source Content</span>
        <textarea id="txt-in"
          placeholder="Paste articles, textbook chapters, study material, reports…&#10;&#10;Gemini Pro will:&#10;• Auto-detect content type&#10;• Choose the best note style&#10;• Build comprehensive structured notes&#10;• Generate flowcharts and diagrams&#10;• Extract insights from charts and tables"
          oninput="document.getElementById('cc').textContent=this.value.length.toLocaleString()+' characters'"></textarea>
        <div class="char-c" id="cc">0 characters</div>
      </div>

      <!-- Error -->
      <div class="gen-err" id="gen-err"></div>

      <!-- Generate -->
      <button class="gen-btn" id="gen-btn" onclick="generate()">✨  Generate Notes</button>
      <div class="prog" id="prog-msg"></div>

      <!-- Chips -->
      <div class="chips">
        <span class="chip">🔍 Deep Analysis</span>
        <span class="chip">🗂 Smart Structure</span>
        <span class="chip">🔀 Auto Diagrams</span>
        <span class="chip">📊 Chart Insights</span>
        <span class="chip">📄 PDF Export</span>
        <span class="chip">📝 Markdown Export</span>
      </div>
    </div>

    <!-- Right placeholder / spinner -->
    <div class="right-placeholder" id="r-empty">
      <div class="rp-icon">📋</div>
      <div class="rp-title">Notes appear in Preview</div>
      <div class="rp-sub">
        1. Upload a PDF <strong style="color:var(--border)">or</strong> paste text<br/>
        2. Set page range if needed<br/>
        3. Click <strong style="color:var(--border)">Generate Notes</strong><br/>
        4. View &amp; download from <strong style="color:var(--border)">Preview</strong> tab
      </div>
      <div class="rp-feats">
        <div class="rp-feat"><div class="fi">🧠</div><div class="fl">AI Style</div></div>
        <div class="rp-feat"><div class="fi">🗂️</div><div class="fl">Structured</div></div>
        <div class="rp-feat"><div class="fi">🔀</div><div class="fl">Diagrams</div></div>
        <div class="rp-feat"><div class="fi">📊</div><div class="fl">Insights</div></div>
        <div class="rp-feat"><div class="fi">📄</div><div class="fl">PDF Export</div></div>
      </div>
    </div>

    <div class="right-placeholder" id="r-spin" style="display:none">
      <div class="spinner"></div>
      <div class="spin-msg" id="spin-msg">Analysing…</div>
      <div class="spin-sub">Switching to Preview when ready…</div>
    </div>
  </div>

  <!-- ━━ PREVIEW TAB ━━ -->
  <div id="preview-panel">
    <div class="no-notes" id="pv-empty">
      <div style="font-size:58px">📋</div>
      <div style="font-family:'Playfair Display',serif;font-size:18px;color:var(--border);font-weight:700">No notes yet</div>
      <div style="font-size:12px;color:var(--text3)">Go to Input tab, upload or paste, then generate.</div>
      <button onclick="switchTab('input')" style="padding:9px 22px;border-radius:9px;border:1px solid rgba(232,160,32,.35);background:rgba(232,160,32,.07);color:var(--gold);cursor:pointer;font-family:'Source Sans 3',sans-serif;font-size:13px;font-weight:600">→ Go to Input</button>
    </div>

    <div class="no-notes" id="pv-spin" style="display:none">
      <div class="spinner"></div>
      <div class="spin-msg" id="pv-spin-msg">Generating…</div>
    </div>

    <div class="prev-inner" id="pv-notes" style="display:none">
      <div class="style-badge" id="style-badge" style="display:none"></div>
      <div id="notes-body"></div>
      <div class="dl-bar">
        <div class="dl-label">Download Your Notes</div>
        <div class="dl-row">
          <button class="dl-md-btn" onclick="dlMd()">
            ⬇ Markdown (.md)
            <small>Obsidian · Notion · GitHub</small>
          </button>
          <button class="dl-pdf-btn" id="dl-pdf" onclick="dlPdf()">
            📄 Download as PDF
            <small>Saves directly to your device</small>
          </button>
        </div>
      </div>
    </div>
  </div>

</div>

<script>
// ═══════════════════ STATE ═══════════════════
let pdfB64 = null, pdfName = "", notesText = "", noteStyle = "";
let src = "pdf";

// ═══════════════════ MERMAID ═══════════════════
mermaid.initialize({
  startOnLoad:false, theme:"dark", securityLevel:"loose",
  fontSize: 16,
  flowchart: { useMaxWidth: false, htmlLabels: true, curve: "basis" },
  sequence: { useMaxWidth: false },
  gantt: { useMaxWidth: false },
  themeVariables:{
    primaryColor:"#1a2744",primaryTextColor:"#dde3ef",
    primaryBorderColor:"#e8a020",lineColor:"#e8a020",
    secondaryColor:"#0b0f1a",background:"#07090f",
    fontSize:"16px",
    nodeBorder:"#e8a020",
    clusterBkg:"#0b0f1a",
    titleColor:"#e8a020",
    edgeLabelBackground:"#0b0f1a",
    tertiaryColor:"#0f1521"
  }
});

async function renderMermaid() {
  const els = document.querySelectorAll(".mmd-box:not([data-done])");
  for (const el of els) {
    const code = decodeURIComponent(el.getAttribute("data-code")||"");
    if (!code) continue;
    try {
      const id = "g"+Math.random().toString(36).slice(2);
      const {svg} = await mermaid.render(id, code);

      const wrapper = document.createElement("div");
      wrapper.style.cssText = "width:100%;overflow-x:auto;padding:4px 0;text-align:center";
      wrapper.innerHTML = svg;

      const svgEl = wrapper.querySelector("svg");
      if (svgEl) {
        // Remove any fixed width/height attributes mermaid sets
        svgEl.removeAttribute("width");
        svgEl.removeAttribute("height");
        svgEl.removeAttribute("style");
        // Let CSS control it
        svgEl.style.cssText = "width:100%;max-width:100%;height:auto;max-height:320px;display:block;margin:0 auto";
      }

      el.innerHTML = "";
      el.appendChild(wrapper);
    } catch(e) {
      el.innerHTML = \`<pre style="color:#8a96ac;font-size:11px;padding:12px;white-space:pre-wrap;text-align:left;line-height:1.6;overflow-x:auto">\${decodeURIComponent(el.getAttribute("data-code")||"")}</pre>\`;
    }
    el.setAttribute("data-done","1");
  }
}

// ═══════════════════ TABS ═══════════════════
function switchTab(t) {
  const inp = t==="input";
  document.getElementById("input-tab").style.display   = inp?"flex":"none";
  const pp = document.getElementById("preview-panel");
  pp.style.display = inp?"none":"flex";
  pp.style.flexDirection = "column";
  document.getElementById("t-input").classList.toggle("on",inp);
  document.getElementById("t-preview").classList.toggle("on",!inp);
  if (!inp) setTimeout(renderMermaid,500);
}

// ═══════════════════ SOURCE ═══════════════════
function setSrc(s) {
  src = s;
  document.getElementById("sb-pdf").classList.toggle("on",s==="pdf");
  document.getElementById("sb-text").classList.toggle("on",s==="text");
  document.getElementById("pdf-sec").style.display  = s==="pdf" ?"block":"none";
  document.getElementById("text-sec").style.display = s==="text"?"block":"none";
}

// ═══════════════════ PAGE RANGE ═══════════════════
function updatePg() {
  const f=parseInt(document.getElementById("pg-from").value)||1;
  const t=parseInt(document.getElementById("pg-to").value)||1;
  document.getElementById("pg-hint").textContent=\`Pages \${f} → \${t} · \${Math.max(0,t-f+1)} pages selected\`;
}

// ═══════════════════ FILE HANDLING ═══════════════════
function onDrop(e) {
  e.preventDefault();
  document.getElementById("uz").classList.remove("drag");
  processFile(e.dataTransfer.files[0]);
}
function onFileChange(e) {
  processFile(e.target.files[0]);
  e.target.value="";
}

function hideStatuses() {
  ["s-reading","s-err","s-ok"].forEach(id=>{
    document.getElementById(id).classList.remove("show");
  });
}
function showStatus(type, html) {
  const el = document.getElementById("s-"+type);
  if (!el) return;
  if (type==="reading") {
    el.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;flex-shrink:0"></div>&nbsp;Reading PDF…';
  } else {
    el.innerHTML = html;
  }
  el.classList.add("show");
}

function processFile(file) {
  if (!file) return;
  if (!file.name.toLowerCase().endsWith(".pdf") && file.type!=="application/pdf") {
    hideStatuses(); showStatus("err","⚠️ Please select a valid PDF file."); return;
  }
  hideStatuses(); showStatus("reading","");
  pdfB64=null; pdfName="";

  const reader = new FileReader();
  reader.onload = () => {
    pdfB64 = reader.result.split(",")[1];
    pdfName = file.name;
    hideStatuses();
    showStatus("ok",\`✅ &nbsp;<div><strong>\${file.name}</strong><br/><span style="font-size:10px;opacity:.7">\${(file.size/1024/1024).toFixed(2)} MB — loaded successfully</span></div>\`);
    document.getElementById("uz-inner").innerHTML=\`
      <div class="uz-icon">✅</div>
      <div class="uz-title" style="color:var(--green)">\${file.name}</div>
      <div class="uz-sub">\${(file.size/1024/1024).toFixed(2)} MB · Click to replace</div>\`;
    document.getElementById("uz").classList.add("has");
    document.getElementById("pg-box").style.display="block";
    updatePg();
  };
  reader.onerror = () => { hideStatuses(); showStatus("err","⚠️ Could not read file. Please try again."); };
  reader.readAsDataURL(file);
}

// ═══════════════════ MARKDOWN → HTML ═══════════════════
function md2html(md) {
  if (!md) return "";
  const esc = t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const inl = t=>esc(t)
    .replace(/\\*\\*\\*(.+?)\\*\\*\\*/g,"<strong><em>$1</em></strong>")
    .replace(/\\*\\*(.+?)\\*\\*/g,"<strong>$1</strong>")
    .replace(/\\*(.+?)\\*/g,"<em>$1</em>")
    .replace(/\`(.+?)\`/g,"<code>$1</code>");

  const lines=md.split("\\n");
  let html="",i=0,inUl=false,inOl=false;
  const cul=()=>{if(inUl){html+="</ul>";inUl=false;}};
  const col=()=>{if(inOl){html+="</ol>";inOl=false;}};
  const cl=()=>{cul();col();};
  const isTR=s=>s.trim().startsWith("|")&&s.trim().endsWith("|");
  const isSep=s=>/^\\|[\\s|:-]+\\|$/.test(s.trim());

  while(i<lines.length){
    const t=lines[i].trim();

    if(t.startsWith("\`\`\`")){
      cl();
      const lang=t.slice(3).trim().toLowerCase();
      let code="";i++;
      while(i<lines.length&&!lines[i].trim().startsWith("\`\`\`")){code+=lines[i]+"\\n";i++;}
      code=code.trimEnd();
      if(lang==="mermaid"){
        const clean=code.replace(/<br\\s*\\/?>/gi," ").replace(/&lt;br.*?&gt;/gi," ");
        const uid="m"+Math.random().toString(36).slice(2);
        html+=\`<div class="mmd-box" id="\${uid}" data-code="\${encodeURIComponent(clean)}">
          <pre style="color:#8a96ac;font-size:11px;white-space:pre-wrap;margin:0">\${esc(clean)}</pre>
        </div>\`;
      } else {
        html+=\`<pre><code>\${esc(code)}</code></pre>\`;
      }
      i++;continue;
    }

    if(isTR(t)&&i+1<lines.length&&isSep(lines[i+1])){
      cl();
      const hs=t.split("|").filter((_,j,a)=>j>0&&j<a.length-1).map(c=>c.trim());
      i+=2;let rows=[];
      while(i<lines.length&&isTR(lines[i].trim())){
        rows.push(lines[i].trim().split("|").filter((_,j,a)=>j>0&&j<a.length-1).map(c=>c.trim()));i++;
      }
      html+=\`<table><thead><tr>\${hs.map(h=>\`<th>\${inl(h)}</th>\`).join("")}</tr></thead>
        <tbody>\${rows.map(r=>\`<tr>\${r.map(c=>\`<td>\${inl(c)}</td>\`).join("")}</tr>\`).join("")}</tbody></table>\`;
      continue;
    }

    const hm=t.match(/^(#{1,4}) (.+)/);
    if(hm){cl();html+=\`<h\${hm[1].length}>\${inl(hm[2])}</h\${hm[1].length}>\`;i++;continue;}
    if(t.match(/^[-*_]{3,}$/)&&!t.replace(/[-*_ ]/g,"")){cl();html+="<hr>";i++;continue;}
    if(t.startsWith("> ")){cl();html+=\`<blockquote>\${inl(t.slice(2))}</blockquote>\`;i++;continue;}
    if(t.match(/^[-*+] /)){col();if(!inUl){html+="<ul>";inUl=true;}html+=\`<li>\${inl(t.replace(/^[-*+] /,""))}</li>\`;i++;continue;}
    if(t.match(/^\\d+[.)]\\s/)){cul();if(!inOl){html+="<ol>";inOl=true;}html+=\`<li>\${inl(t.replace(/^\\d+[.)]\\s/,""))}</li>\`;i++;continue;}
    if(!t){cl();i++;continue;}
    cl();html+=\`<p>\${inl(t)}</p>\`;i++;
  }
  cl();
  return html;
}

// ═══════════════════ GENERATE ═══════════════════
async function generate() {
  const errEl=document.getElementById("gen-err");
  errEl.classList.remove("show");

  if(src==="pdf"&&!pdfB64){errEl.textContent="⚠️ Please upload a PDF first.";errEl.classList.add("show");return;}
  const txtVal=document.getElementById("txt-in").value.trim();
  if(src==="text"&&!txtVal){errEl.textContent="⚠️ Please paste some text.";errEl.classList.add("show");return;}

  const genBtn=document.getElementById("gen-btn");
  genBtn.disabled=true;genBtn.textContent="⏳  Generating…";
  document.getElementById("prog-msg").classList.add("show");
  document.getElementById("r-empty").style.display="none";
  document.getElementById("r-spin").style.display="flex";
  document.getElementById("pv-empty").style.display="none";
  document.getElementById("pv-notes").style.display="none";
  document.getElementById("pv-spin").style.display="flex";

  const setP=msg=>{
    document.getElementById("prog-msg").textContent=msg;
    document.getElementById("spin-msg").textContent=msg;
    document.getElementById("pv-spin-msg").textContent=msg;
  };

  try {
    let body;
    if(src==="pdf"){
      setP("📡 Sending PDF to Gemini Pro…");
      const pf=parseInt(document.getElementById("pg-from").value)||1;
      const pt=parseInt(document.getElementById("pg-to").value)||10;
      body={pdfBase64:pdfB64,pageFrom:pf,pageTo:pt};
    } else {
      setP("🧠 Analysing text…");
      body={prompt:txtVal.length>80000?txtVal.slice(0,80000)+"\\n[Truncated]":txtVal};
    }

    setP("✍️ Building your notes…");

    const res=await fetch("/api/generate",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(body)
    });
    const data=await res.json();
    if(data.error) throw new Error(data.error);

    notesText=data.text;
    const sm=notesText.match(/📐 Note Style: (.+)/);
    noteStyle=sm?sm[1]:"";

    document.getElementById("notes-body").innerHTML=md2html(notesText);

    const sb=document.getElementById("style-badge");
    if(noteStyle){sb.textContent="📐 "+noteStyle;sb.style.display="inline-flex";}
    else{sb.style.display="none";}

    document.getElementById("pv-spin").style.display="none";
    document.getElementById("pv-notes").style.display="block";
    document.getElementById("hdr-actions").style.display="flex";

    switchTab("preview");
    setTimeout(renderMermaid,600);
    setTimeout(renderMermaid,1800);

  } catch(e) {
    errEl.textContent="⚠️ "+e.message;
    errEl.classList.add("show");
    document.getElementById("r-spin").style.display="none";
    document.getElementById("r-empty").style.display="flex";
    document.getElementById("pv-spin").style.display="none";
    document.getElementById("pv-empty").style.display="flex";
  } finally {
    genBtn.disabled=false;genBtn.textContent="✨  Generate Notes";
    document.getElementById("prog-msg").classList.remove("show");
    setP("");
  }
}

// ═══════════════════ DOWNLOAD MARKDOWN ═══════════════════
function dlMd(){
  if(!notesText)return;
  const name=(pdfName.replace(/\\.pdf$/i,"")||"notes").replace(/\\s+/g,"_");
  const a=document.createElement("a");
  a.href="data:text/markdown;charset=utf-8,"+encodeURIComponent(notesText);
  a.download=name+"_notes.md";
  document.body.appendChild(a);a.click();document.body.removeChild(a);
}

// ═══════════════════ DOWNLOAD PDF (jsPDF) ═══════════════════
function dlPdf(){
  if(!notesText)return;
  const btns=["dl-pdf","h-pdf"].map(id=>document.getElementById(id)).filter(Boolean);
  btns.forEach(b=>{b.disabled=true;});
  document.getElementById("dl-pdf").firstChild.textContent="⏳ Building PDF…";

  // ═══ CLASSIC OXFORD-STYLE COLOR PALETTE ═══
  const C = {
    navy:     [15, 35, 80],      // Deep navy blue — headings
    gold:     [139, 90, 0],      // Rich antique gold — accents
    darkgold: [100, 60, 0],      // Darker gold — subheadings
    brown:    [80, 40, 10],      // Warm brown — H3
    text:     [30, 30, 30],      // Near black — body text
    light:    [90, 90, 90],      // Medium grey — secondary text
    cream:    [255, 252, 245],   // Warm cream — page background
    ivory:    [255, 248, 230],   // Ivory — blockquote background
    navyline: [15, 35, 80],      // Navy — divider lines
    goldline: [180, 130, 0],     // Gold — accent lines
    tblhead:  [15, 35, 80],      // Navy — table header bg
    tblalt:   [245, 242, 235],   // Light cream — table alt rows
    tblbord:  [180, 170, 150],   // Warm grey — table borders
  };

  try {
    const {jsPDF}=window.jspdf;
    const doc=new jsPDF({unit:"pt",format:"a4",orientation:"portrait"});
    const PW=doc.internal.pageSize.getWidth();
    const PH=doc.internal.pageSize.getHeight();
    const ML=62, MR=62, MT=72, MB=72, TW=PW-ML-MR;
    let y=MT;
    let pageNum=1;

    // ── Paint cream background on every page ──
    const paintPage = () => {
      doc.setFillColor(...C.cream);
      doc.rect(0,0,PW,PH,"F");
      // Left accent bar
      doc.setFillColor(...C.navy);
      doc.rect(0,0,6,PH,"F");
      // Top border line
      doc.setDrawColor(...C.goldline);
      doc.setLineWidth(1);
      doc.line(6,45,PW,45);
      // Bottom border line
      doc.line(6,PH-40,PW,PH-40);
      // Footer text
      doc.setFontSize(8);
      doc.setTextColor(...C.light);
      doc.setFont("helvetica","italic");
      doc.text("NoteForge AI — Generated Study Notes",ML,PH-25);
      doc.text(\`Page \${pageNum}\`,PW-ML,PH-25,{align:"right"});
      pageNum++;
    };

    const np=()=>{
      doc.addPage();
      paintPage();
      y=MT;
    };
    const chk=(n=18)=>{if(y+n>PH-MB)np();};

    // ── Paint first page ──
    paintPage();

    // ── Cover header block ──
    const docTitle = pdfName.replace(/\\.pdf$/i,"").replace(/_/g," ").replace(/\\b\\w/g,c=>c.toUpperCase()) || "Study Notes";
    doc.setFillColor(...C.navy);
    doc.rect(6,48,PW-6,52,"F");
    doc.setFontSize(18);
    doc.setFont("helvetica","bold");
    doc.setTextColor(255,248,220);
    doc.text(docTitle, ML, 82);
    doc.setFontSize(9);
    doc.setFont("helvetica","normal");
    doc.setTextColor(180,160,100);
    doc.text("NoteForge AI  |  Comprehensive Study Notes  |  "+new Date().toLocaleDateString("en-IN",{year:"numeric",month:"long",day:"numeric"}), ML, 96);
    y = MT + 30;

    const lines=notesText.split("\\n");
    let mmdIndex = 0;
    const mmdEls = document.querySelectorAll(".mmd-box[data-done='1']");

    for(let i=0;i<lines.length;i++){
      const t=lines[i].trim();

      // ── MERMAID DIAGRAM — render as styled box with diagram lines ──
      if(t.startsWith("\`\`\`mermaid")){
        let code = ""; i++;
        while(i<lines.length && !lines[i].trim().startsWith("\`\`\`")){code+=lines[i]+"\\n";i++;}
        code = code.trimEnd();

        // Extract title
        const titleMatch = code.match(/%%\\s*(.+)/);
        const diagramTitle = titleMatch ? titleMatch[1].trim() : "Diagram";

        // Extract diagram type
        const typeMatch = code.match(/^(flowchart|graph|timeline|sequenceDiagram|classDiagram|gantt|pie)/m);
        const diagramType = typeMatch ? typeMatch[1] : "diagram";

        // Parse diagram lines for display
        const diagramLines = code.split("\\n")
          .filter(l => l.trim() && !l.trim().startsWith("%%") && !l.trim().match(/^(flowchart|graph|timeline|sequenceDiagram)/))
          .slice(0, 20);

        // Calculate box height
        const diagramLines = code.split("\\n")
          .filter(l => {
            const t = l.trim();
            return t && !t.startsWith("%%") && !t.match(/^(flowchart|graph\\s|graph\\b|timeline|sequenceDiagram|classDiagram|gantt|pie)/);
          })
          .slice(0, 18);

        const boxH = Math.min(diagramLines.length * 15 + 70, 280);
        chk(boxH + 44);
        y += 10;

        // Draw diagram box — cream background
        doc.setFillColor(248, 245, 235);
        doc.rect(ML-4, y-4, TW+8, boxH+32, "F");

        // Navy left border
        doc.setFillColor(...C.navy);
        doc.rect(ML-4, y-4, 4, boxH+32, "F");

        // Gold top bar — NO emoji
        doc.setFillColor(...C.goldline);
        doc.rect(ML, y-4, TW+4, 22, "F");

        // Title in gold bar — plain text only, no emoji
        doc.setFontSize(10);
        doc.setFont("helvetica","bold");
        doc.setTextColor(255, 255, 255);
        const typeLabel = diagramType.charAt(0).toUpperCase() + diagramType.slice(1);
        const cleanTitle = diagramTitle.replace(/[^\\x00-\\x7F]/g, "").trim() || "Diagram";
        doc.text(\`[\${typeLabel}] \${cleanTitle}\`, ML+8, y+11);

        // Draw diagram content
        let dy = y + 30;

        if (diagramType === "timeline") {
          // Draw timeline as horizontal line with dots
          const events = diagramLines.filter(l => /^\\s*[\\d]{4}/.test(l));
          if (events.length > 0) {
            const timeX = ML + 8;
            const timeW = TW - 16;
            const lineY = dy + 20;
            // Gold horizontal line
            doc.setDrawColor(...C.goldline);
            doc.setLineWidth(2);
            doc.line(timeX, lineY, timeX + timeW, lineY);

            events.slice(0, 7).forEach((ev, idx) => {
              const colonIdx = ev.indexOf(":");
              const year = colonIdx > -1 ? ev.slice(0, colonIdx).trim() : ev.trim();
              const desc = colonIdx > -1 ? ev.slice(colonIdx+1).trim().replace(/[^\\x00-\\x7F]/g,"") : "";
              const xPos = timeX + (idx * timeW / Math.max(events.length-1, 1));
              // Navy dot
              doc.setFillColor(...C.navy);
              doc.circle(xPos, lineY, 4, "F");
              // Gold ring
              doc.setDrawColor(...C.goldline);
              doc.setLineWidth(1);
              doc.circle(xPos, lineY, 4, "S");
              // Year above
              doc.setFontSize(7.5);
              doc.setFont("helvetica","bold");
              doc.setTextColor(...C.navy);
              doc.text(year.slice(0,7), xPos, lineY-8, {align:"center"});
              // Desc below
              doc.setFontSize(7);
              doc.setFont("helvetica","normal");
              doc.setTextColor(...C.text);
              const wr = doc.splitTextToSize(desc.slice(0,20), 55);
              doc.text(wr[0]||"", xPos, lineY+14, {align:"center"});
            });
            dy = lineY + 35;
          }

        } else {
          // Flowchart / Graph / Mind map — clean structured text
          diagramLines.slice(0, 14).forEach(line => {
            // Parse: remove quotes, brackets, convert arrows
            let clean = line
              .replace(/\\["([^"]+)"\\]/g, "$1")   // ["label"] → label
              .replace(/"([^"]+)"/g, "$1")         // "text" → text
              .replace(/[\\[\\]{}()]/g, "")           // remove brackets
              .replace(/-->/g, " -> ")
              .replace(/---/g, " -- ")
              .replace(/\\|([^|]*)\\|/g, "[$1]")     // |label| → [label]
              .replace(/subgraph\\s+/gi, "GROUP: ")
              .replace(/^end\\s*$/i, "")
              .replace(/[^\\x00-\\x7F]/g, "")        // remove non-ASCII
              .trim();

            if (!clean || clean.length < 2) return;
            if (dy + 14 > y + boxH + 18) return;

            const indent = Math.min((line.match(/^\\s+/)||[""])[0].length, 12);
            const xOff = ML + 6 + indent * 3;

            // Arrow lines in navy, others in dark text
            if (clean.includes("->")) {
              doc.setFontSize(9);
              doc.setFont("helvetica","bold");
              doc.setTextColor(...C.navy);
              // Small arrow bullet
              doc.setFillColor(...C.goldline);
              doc.rect(xOff-2, dy-6, 4, 8, "F");
            } else {
              doc.setFontSize(9);
              doc.setFont("helvetica","normal");
              doc.setTextColor(...C.text);
              // Small navy dot
              doc.setFillColor(...C.navy);
              doc.circle(xOff+1, dy-2.5, 2, "F");
            }

            const wr = doc.splitTextToSize(clean, TW - indent*3 - 16);
            doc.text(wr[0], xOff+6, dy);
            dy += 14;
          });
        }

        // Border
        doc.setDrawColor(...C.tblbord);
        doc.setLineWidth(0.5);
        doc.rect(ML-4, y-4, TW+8, boxH+32, "S");

        y += boxH + 42;
        mmdIndex++;
        continue;
      }

      // skip other code blocks
      if(t.startsWith("\`\`\`")){
        while(i<lines.length&&!lines[++i]?.trim().startsWith("\`\`\`")){}
        continue;
      }

      // ── HEADINGS ──
      const hm=t.match(/^(#{1,4}) (.+)/);
      if(hm){
        const lvl=hm[1].length;
        const txt=hm[2].replace(/\\*\\*/g,"").replace(/\\*/g,"").replace(/📐/g,"").replace(/📊/g,"").replace(/💡/g,"").replace(/🧠/g,"").replace(/❓/g,"");
        if(lvl===1){
          chk(38);
          y+=10;
          // Full-width navy background for H1
          doc.setFillColor(...C.navy);
          doc.rect(ML-8,y-14,TW+16,26,"F");
          // Gold left accent
          doc.setFillColor(...C.goldline);
          doc.rect(ML-8,y-14,4,26,"F");
          doc.setFontSize(14);
          doc.setFont("helvetica","bold");
          doc.setTextColor(255,248,220);
          const wr=doc.splitTextToSize(txt,TW-10);
          doc.text(wr,ML,y);
          y+=wr.length*18+8;
        } else if(lvl===2){
          chk(30);
          y+=6;
          // Gold underline style for H2
          doc.setFontSize(12);
          doc.setFont("helvetica","bold");
          doc.setTextColor(...C.navy);
          const wr=doc.splitTextToSize(txt,TW);
          doc.text(wr,ML,y);
          y+=wr.length*16+2;
          doc.setDrawColor(...C.goldline);
          doc.setLineWidth(1.5);
          doc.line(ML,y,ML+Math.min(txt.length*6.5,TW),y);
          y+=8;
        } else if(lvl===3){
          chk(22);
          y+=4;
          doc.setFontSize(11);
          doc.setFont("helvetica","bold");
          doc.setTextColor(...C.darkgold);
          // Small gold diamond bullet
          doc.setFillColor(...C.gold);
          doc.rect(ML-1,y-7,6,6,"F");
          const wr=doc.splitTextToSize(txt,TW-10);
          doc.text(wr,ML+10,y);
          y+=wr.length*15+4;
        } else {
          chk(18);
          y+=2;
          doc.setFontSize(10.5);
          doc.setFont("helvetica","bold");
          doc.setTextColor(...C.brown);
          const wr=doc.splitTextToSize(txt,TW-14);
          doc.text(wr,ML+8,y);
          y+=wr.length*14+3;
        }
        continue;
      }

      // ── HORIZONTAL RULE ──
      if(t.match(/^[-*_]{3,}$/)&&!t.replace(/[-*_ ]/g,"")){
        chk(20);
        y+=6;
        doc.setDrawColor(...C.goldline);
        doc.setLineWidth(0.5);
        doc.line(ML,y,PW-MR,y);
        // Small gold diamond center
        doc.setFillColor(...C.goldline);
        doc.rect(PW/2-4,y-3,8,6,"F");
        y+=14;
        continue;
      }

      // ── BLOCKQUOTE ──
      if(t.startsWith("> ")){
        const txt=t.slice(2).replace(/\\*\\*/g,"").replace(/\\*/g,"").replace(/💡/g,"").trim();
        doc.setFontSize(10.5);
        doc.setFont("helvetica","italic");
        const wr=doc.splitTextToSize(txt,TW-28);
        const bh=wr.length*14+16;
        chk(bh+8);
        y+=4;
        // Cream background with navy left border
        doc.setFillColor(...C.ivory);
        doc.rect(ML,y-12,TW,bh,"F");
        doc.setFillColor(...C.navy);
        doc.rect(ML,y-12,3,bh,"F");
        // Thin gold right border
        doc.setFillColor(...C.goldline);
        doc.rect(ML+TW-2,y-12,2,bh,"F");
        doc.setTextColor(...C.navy);
        doc.text(wr,ML+10,y);
        y+=bh+4;
        continue;
      }

      // ── BULLET LIST ──
      if(t.match(/^[-*+] /)){
        const txt=t.replace(/^[-*+] /,"").replace(/\\*\\*/g,"").replace(/\\*/g,"");
        doc.setFontSize(10.5);
        doc.setFont("helvetica","normal");
        doc.setTextColor(...C.text);
        const wr=doc.splitTextToSize(txt,TW-18);
        chk(wr.length*14+4);
        // Classic filled circle bullet
        doc.setFillColor(...C.navy);
        doc.circle(ML+5,y-3,2.2,"F");
        doc.text(wr,ML+14,y);
        y+=wr.length*14+3;
        continue;
      }

      // ── NUMBERED LIST ──
      if(t.match(/^\\d+[.)]\\s/)){
        const num=t.match(/^(\\d+)/)?.[1]||"1";
        const txt=t.replace(/^\\d+[.)]\\s/,"").replace(/\\*\\*/g,"").replace(/\\*/g,"");
        doc.setFontSize(10.5);
        doc.setFont("helvetica","normal");
        doc.setTextColor(...C.text);
        const wr=doc.splitTextToSize(txt,TW-22);
        chk(wr.length*14+4);
        // Number in navy circle
        doc.setFillColor(...C.navy);
        doc.circle(ML+7,y-3.5,7,"F");
        doc.setFontSize(7.5);
        doc.setFont("helvetica","bold");
        doc.setTextColor(255,255,255);
        doc.text(num,ML+7,y-1,{align:"center"});
        doc.setFontSize(10.5);
        doc.setFont("helvetica","normal");
        doc.setTextColor(...C.text);
        doc.text(wr,ML+18,y);
        y+=wr.length*14+3;
        continue;
      }

      // ── TABLE ──
      if(t.startsWith("|")&&t.endsWith("|")){
        if(/^\\|[\\s|:-]+\\|$/.test(t))continue;
        const cells=t.split("|").filter((_,j,a)=>j>0&&j<a.length-1).map(c=>c.trim().replace(/\\*\\*/g,"").replace(/\\*/g,""));
        const isH=i+1<lines.length&&/^\\|[\\s|:-]+\\|$/.test(lines[i+1]?.trim());
        const cw=TW/Math.max(cells.length,1);
        chk(24);
        if(isH){
          // Navy header row
          doc.setFillColor(...C.tblhead);
          doc.rect(ML,y-13,TW,22,"F");
          doc.setFontSize(9.5);
          doc.setFont("helvetica","bold");
          doc.setTextColor(255,248,220);
          cells.forEach((c,ci)=>{
            doc.text(c.slice(0,26),ML+ci*cw+5,y);
          });
        } else {
          // Alternating row
          const rowIdx = Math.round((y-MT)/22)%2;
          if(rowIdx===0){
            doc.setFillColor(...C.tblalt);
            doc.rect(ML,y-13,TW,20,"F");
          }
          doc.setFontSize(9.5);
          doc.setFont("helvetica","normal");
          doc.setTextColor(...C.text);
          cells.forEach((c,ci)=>{
            doc.text(c.slice(0,26),ML+ci*cw+5,y);
            // Vertical cell divider
            if(ci>0){
              doc.setDrawColor(...C.tblbord);
              doc.setLineWidth(.3);
              doc.line(ML+ci*cw,y-13,ML+ci*cw,y+7);
            }
          });
        }
        // Horizontal border
        doc.setDrawColor(...C.tblbord);
        doc.setLineWidth(.4);
        doc.rect(ML,y-13,TW,isH?22:20,"S");
        y+=isH?22:20;
        continue;
      }

      // ── BLANK LINE ──
      if(!t){y+=5;continue;}

      // ── PARAGRAPH ──
      const txt=t.replace(/\\*\\*/g,"").replace(/\\*/g,"").replace(/\`/g,"").replace(/[^\\x00-\\x7F]/g,"");
      if(!txt.trim())continue;
      doc.setFontSize(10.5);
      doc.setFont("helvetica","normal");
      doc.setTextColor(...C.text);
      const wr=doc.splitTextToSize(txt,TW);
      chk(wr.length*14+4);
      doc.text(wr,ML,y);
      y+=wr.length*14+4;
    }

    const fname=(pdfName.replace(/\\.pdf$/i,"")||"notes").replace(/\\s+/g,"_");
    doc.save(fname+"_notes.pdf");

  } catch(e){
    alert("PDF export failed: "+e.message);
  } finally {
    btns.forEach(b=>{b.disabled=false;});
    const dpb=document.getElementById("dl-pdf");
    if(dpb) dpb.innerHTML='📄 Download as PDF<small>Saves directly to your device</small>';
    const hpb=document.getElementById("h-pdf");
    if(hpb) hpb.textContent="📄 PDF";
  }
}
</script>
</body>
</html>
`;

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.post("/api/generate", async (req, res) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: "GEMINI_API_KEY not set on server." });
  const { prompt, pdfBase64, pageFrom, pageTo } = req.body;
  const parts = [];
  if (pdfBase64) {
    parts.push({ inline_data: { mime_type: "application/pdf", data: pdfBase64 } });
    parts.push({ text: `Create comprehensive exam-ready notes from this PDF. Pages ${pageFrom||1} to ${pageTo||999}.\n\n${SYS()}` });
  } else {
    parts.push({ text: `Create comprehensive exam-ready notes:\n\n${SYS()}\n\nCONTENT:\n${prompt}` });
  }
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ contents:[{role:"user",parts}], generationConfig:{temperature:0.4,maxOutputTokens:8192,topP:0.95} })
    });
    const d = await r.json();
    if (d.error) return res.status(400).json({ error: d.error.message });
    res.json({ text: d?.candidates?.[0]?.content?.parts?.[0]?.text || "" });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("*", (_, res) => { res.setHeader("Content-Type","text/html"); res.send(HTML); });

app.listen(PORT, () => console.log(`\n🚀 NoteForge AI → http://localhost:${PORT}\n`));

function SYS() { return `You are a world-class academic note synthesizer.

START with this exact line:
Note Style: [Name] - [reason]
Styles: Hierarchical Outline / Cornell Method / Thematic Clustering / Data-Centric Analytics / Comparative Framework / Timeline + Analysis

NOTES RULES:
- # ## ### #### headings
- **Bold** key terms, dates, figures
- > Blockquote for critical facts
- --- between major sections
- Numbered steps for processes

DIAGRAMS - MANDATORY (place after each section):

Flowchart:
\`\`\`mermaid
flowchart TD
  %% Title
  A["Start"] --> B{"Decision?"}
  B -->|"Yes"| C["Action A"]
  B -->|"No"| D["Action B"]
  C --> E["Result"]
\`\`\`

Classification:
\`\`\`mermaid
graph TD
  %% Title
  A["Main"] --> B["Cat 1"]
  A --> C["Cat 2"]
  B --> D["Sub 1"]
  B --> E["Sub 2"]
\`\`\`

Timeline - STRICT: NO colons inside text, max 4 words per event:
\`\`\`mermaid
timeline
  title Title Here
  1947 : Independence India
  1991 : LPG Reforms
  2007 : RKVY Started
  2015 : Funding Changed
\`\`\`

Mind map:
\`\`\`mermaid
graph LR
  %% Title
  A["Center"] --> B["Branch 1"]
  A --> C["Branch 2"]
  B --> D["Detail"]
  C --> E["Detail"]
\`\`\`

MERMAID RULES: ALL labels in double quotes. NEVER use <br/> tags. Max 5 words per label.

TABLES for all comparative data:
| Col A | Col B | Col C |
|-------|-------|-------|
| data  | data  | data  |

CHART INSIGHTS for every chart/table in source:
### Chart Insights: [Name]
- Key values: ...
- Trend: ...
- Comparisons: ...
- Anomalies: ...
- Inference: ...

After each major section:
> Key Takeaway: [one sentence]

At end:
## Quick Revision - Top 10 Points
## Likely Exam Questions
5 questions with brief answers.

OUTPUT: Pure Markdown only. Start with Note Style line.`; }
