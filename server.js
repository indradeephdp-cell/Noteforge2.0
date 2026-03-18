require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "100mb" }));

// HTML embedded directly — no file path needed ever
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
:root{--bg:#07090f;--bg2:#0b0f1a;--border:#1a2235;--gold:#e8a020;--gold2:#f5b93a;--gold3:#fdd06a;--text:#dde3ef;--text2:#8a96ac;--text3:#3d4a62;--green:#34c97a;--red:#e85454}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden}
body{font-family:'Source Sans 3',sans-serif;background:var(--bg);color:var(--text);display:flex;flex-direction:column}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
header{background:linear-gradient(135deg,#060810,#0b1020,#0d0f18);border-bottom:1px solid var(--border);padding:11px 18px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;position:sticky;top:0;z-index:200;box-shadow:0 4px 32px rgba(0,0,0,.7)}
.brand{display:flex;align-items:center;gap:11px}
.brand-icon{width:40px;height:40px;border-radius:11px;flex-shrink:0;background:linear-gradient(135deg,#5c2a00,var(--gold));display:flex;align-items:center;justify-content:center;font-size:19px;animation:iconGlow 3s ease infinite}
.brand-name{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--gold)}
.brand-sub{font-size:8px;color:var(--text3);text-transform:uppercase;letter-spacing:2px;margin-top:1px}
.tabs{display:flex;background:var(--bg2);border-radius:9px;padding:3px;border:1px solid var(--border);gap:2px}
.tab{padding:6px 14px;border-radius:7px;border:none;cursor:pointer;font-family:'Source Sans 3',sans-serif;font-size:11.5px;font-weight:600;transition:all .2s;background:transparent;color:var(--text2)}
.tab.on{background:linear-gradient(135deg,#5c2a00,var(--gold));color:#07090f}
.hdr-actions{display:flex;gap:6px}
.hdr-actions button{padding:6px 13px;border-radius:7px;font-family:'Source Sans 3',sans-serif;font-size:11.5px;font-weight:700;cursor:pointer;transition:all .2s;border:none}
.btn-dl-md{background:transparent;border:1px solid var(--border)!important;color:var(--text2)}
.btn-dl-md:hover{border-color:var(--gold)!important;color:var(--gold)}
.btn-dl-pdf{background:linear-gradient(135deg,#5c2a00,var(--gold));color:#07090f}
.layout{flex:1;display:flex;overflow:hidden;height:calc(100vh - 63px)}
.left{width:370px;flex-shrink:0;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow-y:auto;padding:14px;gap:12px}
@media(max-width:680px){.left{width:100%}}
.sec-label{font-size:8.5px;color:var(--text3);text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;display:block}
.src-row{display:flex;background:var(--bg);border-radius:9px;padding:3px;border:1px solid var(--border)}
.src-btn{flex:1;padding:8px;border-radius:7px;border:none;cursor:pointer;font-family:'Source Sans 3',sans-serif;font-size:12px;font-weight:600;transition:all .2s;background:transparent;color:var(--text2)}
.src-btn.on{background:linear-gradient(135deg,#5c2a00,var(--gold));color:#07090f}
.upload-zone{border:2px dashed var(--border);border-radius:13px;padding:20px 14px;text-align:center;background:var(--bg);transition:all .25s}
.upload-zone.has{border-color:var(--green);background:rgba(52,201,122,.04)}
.upload-zone.drag{border-color:var(--gold);background:rgba(232,160,32,.06)}
.uz-icon{font-size:40px;line-height:1;margin-bottom:8px}
.uz-title{font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px}
.uz-sub{font-size:10.5px;color:var(--text2)}
.upload-btn-label{display:block;width:100%;margin-top:10px;padding:14px 16px;background:linear-gradient(135deg,#5c2a00,var(--gold),var(--gold2));border-radius:11px;text-align:center;cursor:pointer;font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:#07090f;letter-spacing:.3px;box-shadow:0 0 20px rgba(232,160,32,.25);box-sizing:border-box}
.upload-btn-label input[type=file]{position:absolute;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none}
.status{display:none;align-items:center;gap:8px;padding:9px 12px;border-radius:8px;font-size:12px;line-height:1.5}
.status.show{display:flex}
.status.ok{background:rgba(52,201,122,.08);border:1px solid rgba(52,201,122,.28);color:var(--green)}
.status.err{background:rgba(232,84,84,.08);border:1px solid rgba(232,84,84,.28);color:var(--red)}
.status.info{background:rgba(232,160,32,.08);border:1px solid rgba(232,160,32,.22);color:var(--gold2)}
.page-box{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:13px}
.range-row{display:flex;gap:10px;margin-top:8px}
.range-col{flex:1}
.range-col label{font-size:10px;color:var(--text2);display:block;margin-bottom:5px}
input[type=number]{width:100%;padding:9px;background:var(--bg2);border:1px solid rgba(232,160,32,.3);border-radius:8px;color:var(--gold);font-family:'Source Sans 3',sans-serif;font-size:17px;font-weight:700;text-align:center;-moz-appearance:textfield}
input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
input[type=number]:focus{outline:none;border-color:var(--gold)}
.pg-hint{margin-top:8px;text-align:center;font-size:10px;color:var(--text3)}
textarea{width:100%;min-height:200px;padding:12px;background:var(--bg);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'Source Sans 3',sans-serif;font-size:13px;line-height:1.75;resize:vertical}
textarea:focus{outline:none;border-color:var(--gold)}
.char-c{font-size:10px;color:var(--text3);margin-top:4px}
.gen-btn{width:100%;padding:14px;border-radius:11px;border:none;cursor:pointer;font-family:'Playfair Display',serif;font-size:16px;font-weight:700;letter-spacing:.3px;transition:all .25s;background:linear-gradient(135deg,#5c2a00,var(--gold),var(--gold2));color:#07090f;box-shadow:0 0 22px rgba(232,160,32,.22)}
.gen-btn:not(:disabled):hover{filter:brightness(1.1);transform:translateY(-1px)}
.gen-btn:disabled{background:var(--border);color:var(--text3);cursor:default;box-shadow:none;transform:none}
.prog{font-size:11px;color:var(--text3);text-align:center;margin-top:7px;display:none;animation:pulse 1.5s infinite}
.prog.show{display:block}
.gen-err{padding:9px 12px;border-radius:8px;background:rgba(232,84,84,.08);border:1px solid rgba(232,84,84,.28);color:var(--red);font-size:12px;display:none}
.gen-err.show{display:block}
.chips{display:flex;flex-wrap:wrap;gap:4px}
.chip{padding:3px 8px;border-radius:20px;border:1px solid var(--border);color:var(--text3);font-size:9.5px}
.right-placeholder{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:32px;text-align:center;overflow-y:auto}
.rp-icon{font-size:58px;line-height:1}
.rp-title{font-family:'Playfair Display',serif;font-size:19px;color:var(--border);font-weight:700}
.rp-sub{font-size:12.5px;color:var(--text3);line-height:2}
.spinner{width:48px;height:48px;border:3px solid var(--border);border-top-color:var(--gold);border-radius:50%;animation:spin 1s linear infinite}
.spin-msg{font-size:14px;font-weight:600;color:var(--text2)}
.spin-sub{font-size:11.5px;color:var(--text3)}
#preview-panel{flex:1;overflow-y:auto;display:none;flex-direction:column}
#preview-panel.show{display:flex}
.prev-inner{max-width:860px;width:100%;margin:0 auto;padding:26px 28px;animation:fadeUp .5s ease}
.style-badge{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:rgba(232,160,32,.08);border:1px solid rgba(232,160,32,.2);border-radius:8px;font-size:12px;color:var(--gold2);margin-bottom:16px;font-style:italic}
#notes-body{line-height:1.85}
#notes-body h1{font-family:'Playfair Display',serif;color:var(--gold);font-size:1.75em;border-bottom:1px solid var(--border);padding-bottom:10px;margin:34px 0 14px}
#notes-body h2{color:var(--gold2);font-size:1.3em;border-left:3px solid var(--gold);padding-left:12px;margin:26px 0 10px;font-weight:700}
#notes-body h3{color:var(--gold3);font-size:1.07em;margin:18px 0 8px;font-weight:600}
#notes-body h4{color:#fde68a;font-size:.96em;margin:13px 0 6px;font-weight:600}
#notes-body p{color:#c8d0e0;margin:7px 0}
#notes-body strong{color:var(--gold)}
#notes-body em{color:#7ee8a2;font-style:italic}
#notes-body ul,#notes-body ol{padding-left:20px;margin:7px 0}
#notes-body li{margin:5px 0;color:#c8d0e0;line-height:1.72}
#notes-body code{background:#0f1724;padding:2px 6px;border-radius:4px;font-family:'Courier New',monospace;font-size:.84em;color:#4ec9b0}
#notes-body pre{background:#0a0f1a;border:1px solid var(--border);border-radius:10px;padding:16px;overflow:auto;margin:12px 0}
#notes-body blockquote{border-left:3px solid var(--gold);margin:12px 0;padding:10px 15px;background:rgba(232,160,32,.06);border-radius:0 8px 8px 0;color:var(--gold3);font-style:italic}
#notes-body hr{border:none;border-top:1px solid var(--border);margin:26px 0}
#notes-body table{width:100%;border-collapse:collapse;margin:12px 0;font-size:13px}
#notes-body th{padding:8px 12px;background:rgba(232,160,32,.1);color:var(--gold);border:1px solid var(--border);text-align:left;font-weight:700}
#notes-body td{padding:7px 12px;border:1px solid var(--border);color:#c8d0e0}
#notes-body tr:nth-child(even) td{background:var(--bg2)}
.mmd-box{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px 10px;margin:16px 0;overflow-x:auto;text-align:center;width:100%}
.mmd-box svg{max-width:100%!important;max-height:280px!important;width:auto!important;height:auto!important;display:block!important;margin:0 auto!important}
.dl-bar{margin-top:38px;padding-top:24px;border-top:1px solid var(--border);display:flex;flex-direction:column;align-items:center;gap:12px}
.dl-label{font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:1.6px}
.dl-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.dl-md-btn{padding:11px 22px;border-radius:10px;border:1px solid var(--border);background:transparent;color:var(--text2);cursor:pointer;font-size:13px;font-family:'Source Sans 3',sans-serif;font-weight:600;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:2px}
.dl-md-btn:hover{border-color:var(--gold);color:var(--gold);background:rgba(232,160,32,.05)}
.dl-pdf-btn{padding:11px 26px;border-radius:10px;border:none;background:linear-gradient(135deg,#5c2a00,var(--gold),var(--gold2));color:#07090f;cursor:pointer;font-size:13px;font-family:'Source Sans 3',sans-serif;font-weight:700;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:2px;box-shadow:0 0 16px rgba(232,160,32,.25)}
.dl-pdf-btn:disabled{background:var(--border);color:var(--text3);cursor:default;box-shadow:none}
.dl-md-btn small,.dl-pdf-btn small{font-size:9px;font-weight:400;opacity:.7}
.no-notes{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;gap:12px;padding:40px;text-align:center}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes iconGlow{0%,100%{box-shadow:0 0 18px rgba(232,160,32,.35)}50%{box-shadow:0 0 36px rgba(232,160,32,.65)}}
</style>
</head>
<body>
<header>
  <div class="brand">
    <div class="brand-icon">&#x1F4DD;</div>
    <div><div class="brand-name">NoteForge AI</div><div class="brand-sub">Powered by Gemini 2.5 Flash</div></div>
  </div>
  <div class="tabs">
    <button class="tab on" id="t-input" onclick="switchTab('input')">Input</button>
    <button class="tab" id="t-preview" onclick="switchTab('preview')">Preview</button>
  </div>
  <div class="hdr-actions" id="hdr-actions" style="display:none">
    <button class="btn-dl-md" onclick="dlMd()">Markdown</button>
    <button class="btn-dl-pdf" id="h-pdf" onclick="dlPdf()">PDF</button>
  </div>
</header>
<div class="layout">
  <div id="input-tab" style="display:flex;width:100%;height:100%">
    <div class="left">
      <div>
        <span class="sec-label">Source Type</span>
        <div class="src-row">
          <button class="src-btn on" id="sb-pdf" onclick="setSrc('pdf')">PDF Upload</button>
          <button class="src-btn" id="sb-text" onclick="setSrc('text')">Paste Text</button>
        </div>
      </div>
      <div id="pdf-sec">
        <span class="sec-label">Upload Your PDF</span>
        <div class="upload-zone" id="uz" ondragover="event.preventDefault();this.classList.add('drag')" ondragleave="this.classList.remove('drag')" ondrop="onDrop(event)">
          <div id="uz-inner">
            <div class="uz-icon">&#x1F4C2;</div>
            <div class="uz-title">Tap button below to upload</div>
            <div class="uz-sub">or drag and drop file here</div>
          </div>
        </div>
        <label class="upload-btn-label">
          Select PDF from Device
          <input type="file" accept=".pdf,application/pdf" onchange="onFileChange(event)"/>
        </label>
        <div class="status info" id="s-reading"><div class="spinner" style="width:16px;height:16px;border-width:2px;flex-shrink:0"></div>&nbsp;Reading PDF...</div>
        <div class="status err" id="s-err"></div>
        <div class="status ok" id="s-ok"></div>
        <div class="page-box" id="pg-box" style="display:none">
          <span class="sec-label">Page Range (optional)</span>
          <div class="range-row">
            <div class="range-col"><label>From page</label><input type="number" id="pg-from" value="1" min="1" oninput="updatePg()"/></div>
            <div class="range-col"><label>To page</label><input type="number" id="pg-to" value="10" min="1" oninput="updatePg()"/></div>
          </div>
          <div class="pg-hint" id="pg-hint">Pages 1 to 10 - 10 selected</div>
        </div>
      </div>
      <div id="text-sec" style="display:none">
        <span class="sec-label">Paste Source Content</span>
        <textarea id="txt-in" placeholder="Paste articles, chapters, study material..." oninput="document.getElementById('cc').textContent=this.value.length.toLocaleString()+' characters'"></textarea>
        <div class="char-c" id="cc">0 characters</div>
      </div>
      <div class="gen-err" id="gen-err"></div>
      <button class="gen-btn" id="gen-btn" onclick="generate()">Generate Notes</button>
      <div class="prog" id="prog-msg"></div>
      <div class="chips">
        <span class="chip">Deep Analysis</span>
        <span class="chip">Smart Structure</span>
        <span class="chip">Auto Diagrams</span>
        <span class="chip">Chart Insights</span>
        <span class="chip">PDF Export</span>
      </div>
    </div>
    <div class="right-placeholder" id="r-empty">
      <div class="rp-icon">&#x1F4CB;</div>
      <div class="rp-title">Notes appear in Preview</div>
      <div class="rp-sub">1. Upload PDF or paste text<br/>2. Click Generate Notes<br/>3. View and download from Preview</div>
    </div>
    <div class="right-placeholder" id="r-spin" style="display:none">
      <div class="spinner"></div>
      <div class="spin-msg" id="spin-msg">Analysing...</div>
      <div class="spin-sub">Switching to Preview when ready...</div>
    </div>
  </div>
  <div id="preview-panel">
    <div class="no-notes" id="pv-empty">
      <div style="font-size:54px">&#x1F4CB;</div>
      <div style="font-family:'Playfair Display',serif;font-size:17px;color:var(--border);font-weight:700">No notes yet</div>
      <button onclick="switchTab('input')" style="padding:9px 20px;border-radius:8px;border:1px solid rgba(232,160,32,.35);background:rgba(232,160,32,.07);color:var(--gold);cursor:pointer;font-family:'Source Sans 3',sans-serif;font-size:13px;font-weight:600">Go to Input</button>
    </div>
    <div class="no-notes" id="pv-spin" style="display:none">
      <div class="spinner"></div>
      <div class="spin-msg" id="pv-spin-msg">Generating...</div>
    </div>
    <div class="prev-inner" id="pv-notes" style="display:none">
      <div class="style-badge" id="style-badge" style="display:none"></div>
      <div id="notes-body"></div>
      <div class="dl-bar">
        <div class="dl-label">Download Your Notes</div>
        <div class="dl-row">
          <button class="dl-md-btn" onclick="dlMd()">Markdown (.md)<small>Obsidian - Notion</small></button>
          <button class="dl-pdf-btn" id="dl-pdf" onclick="dlPdf()">Download as PDF<small>Saves to your device</small></button>
        </div>
      </div>
    </div>
  </div>
</div>
<script>
let pdfB64=null,pdfName="",notesText="",noteStyle="",src="pdf";

mermaid.initialize({startOnLoad:false,theme:"dark",securityLevel:"loose",themeVariables:{primaryColor:"#1a2744",primaryTextColor:"#dde3ef",primaryBorderColor:"#e8a020",lineColor:"#e8a020",secondaryColor:"#0b0f1a",background:"#07090f",fontSize:"13px"}});

async function renderMermaid(){
  const els=document.querySelectorAll(".mmd-box:not([data-done])");
  for(const el of els){
    const code=decodeURIComponent(el.getAttribute("data-code")||"");
    if(!code)continue;
    try{
      const id="g"+Math.random().toString(36).slice(2);
      const {svg}=await mermaid.render(id,code);
      const wrap=document.createElement("div");
      wrap.style.cssText="width:100%;overflow-x:auto;text-align:center";
      wrap.innerHTML=svg;
      const svgEl=wrap.querySelector("svg");
      if(svgEl){svgEl.removeAttribute("width");svgEl.removeAttribute("height");svgEl.style.cssText="max-width:100%;max-height:280px;width:auto;height:auto;display:block;margin:0 auto";}
      el.innerHTML="";el.appendChild(wrap);
    }catch(e){
      el.innerHTML=\`<pre style="color:#8a96ac;font-size:11px;padding:10px;white-space:pre-wrap;text-align:left">\${decodeURIComponent(el.getAttribute("data-code")||"")}</pre>\`;
    }
    el.setAttribute("data-done","1");
  }
}

function switchTab(t){
  const inp=t==="input";
  document.getElementById("input-tab").style.display=inp?"flex":"none";
  const pp=document.getElementById("preview-panel");
  pp.style.display=inp?"none":"flex";pp.style.flexDirection="column";
  document.getElementById("t-input").classList.toggle("on",inp);
  document.getElementById("t-preview").classList.toggle("on",!inp);
  if(!inp)setTimeout(renderMermaid,500);
}

function setSrc(s){
  src=s;
  document.getElementById("sb-pdf").classList.toggle("on",s==="pdf");
  document.getElementById("sb-text").classList.toggle("on",s==="text");
  document.getElementById("pdf-sec").style.display=s==="pdf"?"block":"none";
  document.getElementById("text-sec").style.display=s==="text"?"block":"none";
}

function updatePg(){
  const f=parseInt(document.getElementById("pg-from").value)||1;
  const t=parseInt(document.getElementById("pg-to").value)||1;
  document.getElementById("pg-hint").textContent=\`Pages \${f} to \${t} - \${Math.max(0,t-f+1)} selected\`;
}

function onDrop(e){e.preventDefault();document.getElementById("uz").classList.remove("drag");processFile(e.dataTransfer.files[0]);}
function onFileChange(e){processFile(e.target.files[0]);e.target.value="";}

function hideStatuses(){["s-reading","s-err","s-ok"].forEach(id=>document.getElementById(id).classList.remove("show"));}
function showStatus(type,html){
  const el=document.getElementById("s-"+type);if(!el)return;
  if(type==="reading")el.innerHTML='<div class="spinner" style="width:16px;height:16px;border-width:2px;flex-shrink:0"></div>&nbsp;Reading PDF...';
  else el.innerHTML=html;
  el.classList.add("show");
}

function processFile(file){
  if(!file)return;
  if(!file.name.toLowerCase().endsWith(".pdf")&&file.type!=="application/pdf"){hideStatuses();showStatus("err","Please select a valid PDF file.");return;}
  hideStatuses();showStatus("reading","");pdfB64=null;pdfName="";
  const reader=new FileReader();
  reader.onload=()=>{
    pdfB64=reader.result.split(",")[1];pdfName=file.name;
    hideStatuses();
    showStatus("ok",\`<span>&#x2705;</span><div><strong>\${file.name}</strong><br/><span style="font-size:10px;opacity:.7">\${(file.size/1024/1024).toFixed(2)} MB loaded</span></div>\`);
    document.getElementById("uz-inner").innerHTML=\`<div class="uz-icon">&#x2705;</div><div class="uz-title" style="color:var(--green)">\${file.name}</div><div class="uz-sub">\${(file.size/1024/1024).toFixed(2)} MB</div>\`;
    document.getElementById("uz").classList.add("has");
    document.getElementById("pg-box").style.display="block";
    updatePg();
  };
  reader.onerror=()=>{hideStatuses();showStatus("err","Could not read file. Please try again.");};
  reader.readAsDataURL(file);
}

function md2html(md){
  if(!md)return"";
  const esc=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const inl=t=>esc(t).replace(/\\*\\*\\*(.+?)\\*\\*\\*/g,"<strong><em>$1</em></strong>").replace(/\\*\\*(.+?)\\*\\*/g,"<strong>$1</strong>").replace(/\\*(.+?)\\*/g,"<em>$1</em>").replace(/\`(.+?)\`/g,"<code>$1</code>");
  const lines=md.split("\\n");let html="",i=0,inUl=false,inOl=false;
  const cul=()=>{if(inUl){html+="</ul>";inUl=false;}};
  const col=()=>{if(inOl){html+="</ol>";inOl=false;}};
  const cl=()=>{cul();col();};
  const isTR=s=>s.trim().startsWith("|")&&s.trim().endsWith("|");
  const isSep=s=>/^\\|[\\s|:-]+\\|$/.test(s.trim());
  while(i<lines.length){
    const t=lines[i].trim();
    if(t.startsWith("\`\`\`")){
      cl();const lang=t.slice(3).trim().toLowerCase();let code="";i++;
      while(i<lines.length&&!lines[i].trim().startsWith("\`\`\`")){code+=lines[i]+"\\n";i++;}
      code=code.trimEnd();
      if(lang==="mermaid"){
        const clean=code.replace(/<br\\s*\\/?>/gi," ");
        const uid="m"+Math.random().toString(36).slice(2);
        html+=\`<div class="mmd-box" id="\${uid}" data-code="\${encodeURIComponent(clean)}"><pre style="color:#8a96ac;font-size:11px;white-space:pre-wrap;margin:0">\${esc(clean)}</pre></div>\`;
      }else{html+=\`<pre><code>\${esc(code)}</code></pre>\`;}
      i++;continue;
    }
    if(isTR(t)&&i+1<lines.length&&isSep(lines[i+1])){
      cl();const hs=t.split("|").filter((_,j,a)=>j>0&&j<a.length-1).map(c=>c.trim());
      i+=2;let rows=[];
      while(i<lines.length&&isTR(lines[i].trim())){rows.push(lines[i].trim().split("|").filter((_,j,a)=>j>0&&j<a.length-1).map(c=>c.trim()));i++;}
      html+=\`<table><thead><tr>\${hs.map(h=>\`<th>\${inl(h)}</th>\`).join("")}</tr></thead><tbody>\${rows.map(r=>\`<tr>\${r.map(c=>\`<td>\${inl(c)}</td>\`).join("")}</tr>\`).join("")}</tbody></table>\`;
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
  cl();return html;
}

async function generate(){
  const errEl=document.getElementById("gen-err");errEl.classList.remove("show");
  if(src==="pdf"&&!pdfB64){errEl.textContent="Please upload a PDF first.";errEl.classList.add("show");return;}
  const txtVal=document.getElementById("txt-in").value.trim();
  if(src==="text"&&!txtVal){errEl.textContent="Please paste some text.";errEl.classList.add("show");return;}
  const genBtn=document.getElementById("gen-btn");
  genBtn.disabled=true;genBtn.textContent="Generating...";
  document.getElementById("prog-msg").classList.add("show");
  document.getElementById("r-empty").style.display="none";document.getElementById("r-spin").style.display="flex";
  document.getElementById("pv-empty").style.display="none";document.getElementById("pv-notes").style.display="none";document.getElementById("pv-spin").style.display="flex";
  const setP=msg=>{document.getElementById("prog-msg").textContent=msg;document.getElementById("spin-msg").textContent=msg;document.getElementById("pv-spin-msg").textContent=msg;};
  try{
    let body;
    if(src==="pdf"){setP("Sending PDF to AI...");body={pdfBase64:pdfB64,pageFrom:parseInt(document.getElementById("pg-from").value)||1,pageTo:parseInt(document.getElementById("pg-to").value)||10};}
    else{setP("Analysing text...");body={prompt:txtVal.length>70000?txtVal.slice(0,70000)+"\\n[Truncated]":txtVal};}
    setP("Building your notes...");
    const res=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    const data=await res.json();
    if(data.error)throw new Error(data.error);
    notesText=data.text;
    const sm=notesText.match(/Note Style: (.+)/);noteStyle=sm?sm[1]:"";
    document.getElementById("notes-body").innerHTML=md2html(notesText);
    const sb=document.getElementById("style-badge");
    if(noteStyle){sb.textContent="Note Style: "+noteStyle;sb.style.display="inline-flex";}else{sb.style.display="none";}
    document.getElementById("pv-spin").style.display="none";document.getElementById("pv-notes").style.display="block";document.getElementById("hdr-actions").style.display="flex";
    switchTab("preview");setTimeout(renderMermaid,600);setTimeout(renderMermaid,1800);
  }catch(e){
    errEl.textContent="Generation failed: "+e.message;errEl.classList.add("show");
    document.getElementById("r-spin").style.display="none";document.getElementById("r-empty").style.display="flex";
    document.getElementById("pv-spin").style.display="none";document.getElementById("pv-empty").style.display="flex";
  }finally{
    genBtn.disabled=false;genBtn.textContent="Generate Notes";
    document.getElementById("prog-msg").classList.remove("show");setP("");
  }
}

function dlMd(){
  if(!notesText)return;
  const name=(pdfName.replace(/\\.pdf$/i,"")||"notes").replace(/\\s+/g,"_");
  const a=document.createElement("a");
  a.href="data:text/markdown;charset=utf-8,"+encodeURIComponent(notesText);
  a.download=name+"_notes.md";
  document.body.appendChild(a);a.click();document.body.removeChild(a);
}

function dlPdf(){
  if(!notesText)return;
  const btns=["dl-pdf","h-pdf"].map(id=>document.getElementById(id)).filter(Boolean);
  btns.forEach(b=>{b.disabled=true;});
  const dpb=document.getElementById("dl-pdf");
  if(dpb&&dpb.firstChild)dpb.firstChild.textContent="Building PDF...";
  try{
    const {jsPDF}=window.jspdf;
    const doc=new jsPDF({unit:"pt",format:"a4",orientation:"portrait"});
    const PW=doc.internal.pageSize.getWidth(),PH=doc.internal.pageSize.getHeight();
    const ML=58,MR=58,MT=70,MB=60,TW=PW-ML-MR;
    let y=MT,pageNum=1;
    // OXFORD COLORS - excellent visibility on white/cream background
    const navy=[12,30,74],gold=[160,100,0],darkgold=[120,70,0],brown=[80,45,0];
    const body=[25,25,25],light=[80,80,80],cream=[255,252,244],ivory=[255,248,228];
    const goldline=[180,120,0],tblhead=[12,30,74],tblalt=[248,244,234],tblbord=[180,170,150];
    const paintPage=()=>{
      doc.setFillColor(...cream);doc.rect(0,0,PW,PH,"F");
      doc.setFillColor(...navy);doc.rect(0,0,7,PH,"F");
      doc.setDrawColor(...goldline);doc.setLineWidth(1);doc.line(7,50,PW,50);doc.line(7,PH-38,PW,PH-38);
      doc.setFontSize(7.5);doc.setFont("helvetica","italic");doc.setTextColor(...light);
      doc.text("NoteForge AI - Generated Study Notes",ML,PH-24);doc.text("Page "+pageNum,PW-ML,PH-24,{align:"right"});pageNum++;
    };
    const np=()=>{doc.addPage();paintPage();y=MT;};
    const chk=(n=18)=>{if(y+n>PH-MB)np();};
    paintPage();
    const docTitle=(pdfName.replace(/\\.pdf$/i,"")||"Study Notes").replace(/_/g," ").replace(/\\b\\w/g,c=>c.toUpperCase());
    doc.setFillColor(...navy);doc.rect(7,52,PW-7,50,"F");
    doc.setFontSize(17);doc.setFont("helvetica","bold");doc.setTextColor(255,248,210);doc.text(docTitle,ML,80);
    doc.setFontSize(8.5);doc.setFont("helvetica","normal");doc.setTextColor(200,170,100);
    doc.text("NoteForge AI  |  "+new Date().toLocaleDateString("en-IN",{year:"numeric",month:"long",day:"numeric"}),ML,95);
    y=MT+32;
    const cl=t=>t.replace(/\\*\\*/g,"").replace(/\\*/g,"").replace(/\`/g,"").replace(/[^\\x00-\\x7F]/g,"").trim();
    const lines=notesText.split("\\n");
    for(let i=0;i<lines.length;i++){
      const t=lines[i].trim();
      if(t.startsWith("\`\`\`mermaid")){
        let code="";i++;
        while(i<lines.length&&!lines[i].trim().startsWith("\`\`\`")){code+=lines[i]+"\\n";i++;}
        code=code.trimEnd();
        const titleM=code.match(/%%\\s*(.+)/);const dTitle=titleM?cl(titleM[1]):"Diagram";
        const typeM=code.match(/^(flowchart|graph|timeline|sequenceDiagram|pie|gantt)/m);const dType=typeM?typeM[1]:"graph";
        const dLines=code.split("\\n").filter(l=>{const lt=l.trim();return lt&&!lt.startsWith("%%")&&!lt.match(/^(flowchart|graph\\s|graph$|timeline|sequenceDiagram|pie|gantt)/i)&&lt!=="end";}).slice(0,16);
        const bH=Math.min(dLines.length*14+65,260);chk(bH+36);y+=8;
        doc.setFillColor(248,244,232);doc.rect(ML-4,y-4,TW+8,bH+28,"F");
        doc.setFillColor(...navy);doc.rect(ML-4,y-4,4,bH+28,"F");
        doc.setFillColor(...goldline);doc.rect(ML,y-4,TW+4,20,"F");
        doc.setFontSize(9.5);doc.setFont("helvetica","bold");doc.setTextColor(255,255,255);
        doc.text("["+dType.charAt(0).toUpperCase()+dType.slice(1)+"] "+dTitle.slice(0,50),ML+8,y+9);
        let dy=y+24;
        if(dType==="timeline"){
          const evs=dLines.filter(l=>/^\\s*\\d{4}/.test(l)).slice(0,7);
          if(evs.length>0){
            const tx=ML+6,tw=TW-12,ly=dy+18;
            doc.setDrawColor(...goldline);doc.setLineWidth(2);doc.line(tx,ly,tx+tw,ly);
            evs.forEach((ev,idx)=>{
              const ci=ev.indexOf(":");const yr=ci>-1?ev.slice(0,ci).trim():ev.trim();const ds=ci>-1?cl(ev.slice(ci+1)).slice(0,18):"";
              const xp=tx+(idx*tw/Math.max(evs.length-1,1));
              doc.setFillColor(...navy);doc.circle(xp,ly,3.5,"F");doc.setDrawColor(...goldline);doc.setLineWidth(1);doc.circle(xp,ly,3.5,"S");
              doc.setFontSize(7.5);doc.setFont("helvetica","bold");doc.setTextColor(...navy);doc.text(yr.slice(0,7),xp,ly-7,{align:"center"});
              doc.setFontSize(7);doc.setFont("helvetica","normal");doc.setTextColor(...body);doc.text(ds,xp,ly+13,{align:"center",maxWidth:55});
            });
            dy=ly+28;
          }
        }else{
          dLines.forEach(line=>{
            if(dy+13>y+bH+20)return;
            let cl2=line.replace(/\\["([^"]+)"\\]/g,"$1").replace(/"([^"]+)"/g,"$1").replace(/[\\[\\]{}()]/g,"").replace(/-->/g," -> ").replace(/\\|([^|]*)\\|/g,"[$1]").replace(/subgraph\\s+/gi,"GROUP: ").replace(/[^\\x00-\\x7F]/g,"").trim();
            if(!cl2||cl2.length<2)return;
            const ind=Math.min((line.match(/^\\s+/)||[""])[0].length,10);const xo=ML+8+ind*3;
            if(cl2.includes("->")){doc.setTextColor(...navy);doc.setFont("helvetica","bold");}else{doc.setTextColor(...body);doc.setFont("helvetica","normal");}
            doc.setFontSize(9);doc.setFillColor(...goldline);doc.circle(xo-2,dy-3,1.8,"F");
            const wr=doc.splitTextToSize(cl2,TW-ind*3-14);doc.text(wr[0],xo+4,dy);dy+=13;
          });
        }
        doc.setDrawColor(...tblbord);doc.setLineWidth(0.5);doc.rect(ML-4,y-4,TW+8,bH+28,"S");
        y+=bH+36;continue;
      }
      if(t.startsWith("\`\`\`")){while(i<lines.length&&!lines[++i]?.trim().startsWith("\`\`\`")){}continue;}
      const hm=t.match(/^(#{1,4}) (.+)/);
      if(hm){
        const lvl=hm[1].length,txt=cl(hm[2]);
        if(lvl===1){chk(36);y+=10;doc.setFillColor(...navy);doc.rect(ML-6,y-13,TW+12,25,"F");doc.setFillColor(...goldline);doc.rect(ML-6,y-13,4,25,"F");doc.setFontSize(13.5);doc.setFont("helvetica","bold");doc.setTextColor(255,248,210);const wr=doc.splitTextToSize(txt,TW-10);doc.text(wr,ML+2,y);y+=wr.length*17+8;}
        else if(lvl===2){chk(28);y+=6;doc.setFontSize(12);doc.setFont("helvetica","bold");doc.setTextColor(...navy);const wr=doc.splitTextToSize(txt,TW);doc.text(wr,ML,y);y+=wr.length*15+2;doc.setDrawColor(...goldline);doc.setLineWidth(1.5);doc.line(ML,y,ML+Math.min(txt.length*6,TW),y);y+=8;}
        else if(lvl===3){chk(20);y+=4;doc.setFontSize(11);doc.setFont("helvetica","bold");doc.setTextColor(...darkgold);doc.setFillColor(...navy);doc.rect(ML-1,y-7,5,5,"F");const wr=doc.splitTextToSize(txt,TW-10);doc.text(wr,ML+8,y);y+=wr.length*14+3;}
        else{chk(17);y+=2;doc.setFontSize(10.5);doc.setFont("helvetica","bold");doc.setTextColor(...brown);const wr=doc.splitTextToSize(txt,TW-12);doc.text(wr,ML+6,y);y+=wr.length*13+2;}
        continue;
      }
      if(t.match(/^[-*_]{3,}$/)&&!t.replace(/[-*_ ]/g,"")){chk(18);y+=6;doc.setDrawColor(...goldline);doc.setLineWidth(0.5);doc.line(ML,y,PW-MR,y);doc.setFillColor(...goldline);doc.rect(PW/2-4,y-3,8,6,"F");y+=12;continue;}
      if(t.startsWith("> ")){
        const txt=cl(t.slice(2));doc.setFontSize(10.5);doc.setFont("helvetica","italic");
        const wr=doc.splitTextToSize(txt,TW-22);const bh2=wr.length*14+16;chk(bh2+8);y+=4;
        doc.setFillColor(...ivory);doc.rect(ML,y-11,TW,bh2,"F");doc.setFillColor(...navy);doc.rect(ML,y-11,3,bh2,"F");doc.setFillColor(...goldline);doc.rect(ML+TW-2,y-11,2,bh2,"F");
        doc.setTextColor(...navy);doc.text(wr,ML+9,y);y+=bh2+4;continue;
      }
      if(t.match(/^[-*+] /)){
        const txt=cl(t.replace(/^[-*+] /,""));doc.setFontSize(10.5);doc.setFont("helvetica","normal");doc.setTextColor(...body);
        const wr=doc.splitTextToSize(txt,TW-16);chk(wr.length*14+4);
        doc.setFillColor(...navy);doc.circle(ML+4,y-3,2.2,"F");doc.text(wr,ML+12,y);y+=wr.length*14+3;continue;
      }
      if(t.match(/^\\d+[.)]\\s/)){
        const num=t.match(/^(\\d+)/)?.[1]||"1";const txt=cl(t.replace(/^\\d+[.)]\\s/,""));
        doc.setFontSize(10.5);doc.setFont("helvetica","normal");doc.setTextColor(...body);
        const wr=doc.splitTextToSize(txt,TW-20);chk(wr.length*14+4);
        doc.setFillColor(...navy);doc.circle(ML+7,y-3.5,7,"F");doc.setFontSize(7.5);doc.setFont("helvetica","bold");doc.setTextColor(255,255,255);doc.text(num,ML+7,y-1,{align:"center"});
        doc.setFontSize(10.5);doc.setFont("helvetica","normal");doc.setTextColor(...body);doc.text(wr,ML+18,y);y+=wr.length*14+3;continue;
      }
      if(t.startsWith("|")&&t.endsWith("|")){
        if(/^\\|[\\s|:-]+\\|$/.test(t))continue;
        const cells=t.split("|").filter((_,j,a)=>j>0&&j<a.length-1).map(c=>cl(c.trim()));
        const isH=i+1<lines.length&&/^\\|[\\s|:-]+\\|$/.test(lines[i+1]?.trim());
        const cw=TW/Math.max(cells.length,1);chk(22);
        if(isH){doc.setFillColor(...tblhead);doc.rect(ML,y-12,TW,22,"F");doc.setTextColor(255,248,210);doc.setFont("helvetica","bold");}
        else{const ri=Math.round((y-MT)/22)%2;if(ri===0){doc.setFillColor(...tblalt);doc.rect(ML,y-12,TW,20,"F");}doc.setTextColor(...body);doc.setFont("helvetica","normal");}
        doc.setFontSize(9.5);
        cells.forEach((c,ci)=>{doc.text(c.slice(0,26),ML+ci*cw+5,y);if(ci>0){doc.setDrawColor(...tblbord);doc.setLineWidth(.3);doc.line(ML+ci*cw,y-12,ML+ci*cw,y+8);}});
        doc.setDrawColor(...tblbord);doc.setLineWidth(.4);doc.rect(ML,y-12,TW,isH?22:20,"S");y+=isH?22:20;continue;
      }
      if(!t){y+=5;continue;}
      const txt=cl(t);if(!txt)continue;
      doc.setFontSize(10.5);doc.setFont("helvetica","normal");doc.setTextColor(...body);
      const wr=doc.splitTextToSize(txt,TW);chk(wr.length*14+4);doc.text(wr,ML,y);y+=wr.length*14+4;
    }
    const fname=(pdfName.replace(/\\.pdf$/i,"")||"notes").replace(/\\s+/g,"_");
    doc.save(fname+"_notes.pdf");
  }catch(e){alert("PDF export failed: "+e.message);}
  finally{
    btns.forEach(b=>{b.disabled=false;});
    const dpb=document.getElementById("dl-pdf");if(dpb)dpb.innerHTML='Download as PDF<small>Saves to your device</small>';
    const hpb=document.getElementById("h-pdf");if(hpb)hpb.textContent="PDF";
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
    parts.push({ text: "Create comprehensive exam-ready notes from this PDF. Pages " + (pageFrom||1) + " to " + (pageTo||999) + ".\n\n" + SYS() });
  } else {
    parts.push({ text: "Create comprehensive exam-ready notes from this content.\n\n" + SYS() + "\n\nCONTENT:\n" + prompt });
  }
  try {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + key, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig: { temperature: 0.4, maxOutputTokens: 8192, topP: 0.95 } })
    });
    const d = await r.json();
    if (d.error) return res.status(400).json({ error: d.error.message });
    res.json({ text: d?.candidates?.[0]?.content?.parts?.[0]?.text || "" });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Serve embedded HTML for ALL routes
app.get("*", (_, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(HTML);
});

app.listen(PORT, () => console.log("\n NoteForge AI running at http://localhost:" + PORT + "\n"));

function SYS() {
  return "You are a world-class academic note synthesizer.\n\nSTART with this exact line:\nNote Style: [Name] - [reason]\nStyles: Hierarchical Outline / Cornell Method / Thematic Clustering / Data-Centric Analytics / Comparative Framework / Timeline + Analysis\n\nNOTES RULES:\n- # ## ### #### headings\n- **Bold** key terms, dates, figures\n- > Blockquote for critical facts\n- --- between major sections\n- Numbered steps for processes\n\nMANDATORY DIAGRAMS - include ALL types where relevant:\n\nFlowchart for every process:\n```mermaid\nflowchart TD\n  %% Title\n  A[\"Start\"] --> B{\"Decision?\"}\n  B -->|\"Yes\"| C[\"Action A\"]\n  B -->|\"No\"| D[\"Action B\"]\n  C --> E[\"Result\"]\n```\n\nClassification for every hierarchy:\n```mermaid\ngraph TD\n  %% Title\n  A[\"Main\"] --> B[\"Cat 1\"]\n  A --> C[\"Cat 2\"]\n  B --> D[\"Sub 1\"]\n  B --> E[\"Sub 2\"]\n```\n\nTimeline - NO colons inside text, max 4 words:\n```mermaid\ntimeline\n  title Title Here\n  1947 : India Independence\n  1991 : LPG Reforms\n  2007 : RKVY Started\n  2015 : Funding Revised\n```\n\nMind map for connected concepts:\n```mermaid\ngraph LR\n  %% Title\n  A[\"Center\"] --> B[\"Branch 1\"]\n  A --> C[\"Branch 2\"]\n  B --> D[\"Detail\"]\n  C --> E[\"Detail\"]\n```\n\nMERMAID RULES: ALL labels in double quotes. NEVER use <br/> tags. Max 5 words.\n\nTABLES for all comparative data:\n| Col A | Col B | Col C |\n|-------|-------|-------|\n| data  | data  | data  |\n\nCHART INSIGHTS for every chart/figure in source:\n### Chart Insights: [Name]\n- Key values: ...\n- Trend: ...\n- Comparisons: ...\n- Anomalies: ...\n- Inference: ...\n\n> Key Takeaway: [one sentence after each section]\n\nAt end:\n## Quick Revision - Top 10 Points\n## Likely Exam Questions with Answers\n\nOUTPUT: Pure Markdown. Start with Note Style line.";
}
