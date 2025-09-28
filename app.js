// app.js - main app logic
const canvas = document.getElementById('patternCanvas');
const ctx = canvas.getContext('2d');

// DOM elements
const canvasWidth = document.getElementById('canvasWidth');
const canvasHeight = document.getElementById('canvasHeight');
const previewScale = document.getElementById('previewScale');
const gridSpacing = document.getElementById('gridSpacing');
const dotRadius = document.getElementById('dotRadius');
const dotColor = document.getElementById('dotColor');
const patternList = document.getElementById('patternList');
const patternScale = document.getElementById('patternScale');
const patternColor = document.getElementById('patternColor');
const bgColor = document.getElementById('bgColor');
const enableLines = document.getElementById('enableLines');
const lineSpacing = document.getElementById('lineSpacing');
const lineAngle = document.getElementById('lineAngle');
const lineColor = document.getElementById('lineColor');
const lineWidth = document.getElementById('lineWidth');

const redrawBtn = document.getElementById('redraw');
const downloadJpegBtn = document.getElementById('downloadJpeg');
const downloadPdfBtn = document.getElementById('downloadPdf');

// helper: mm -> pixels for preview and for export
function mmToPx(mm, scale){ return Math.round(mm * scale); }

// populate patterns checklist
const patterns = window.KuguriPatterns || {};
Object.keys(patterns).forEach(key => {
  const p = patterns[key];
  const id = 'p_' + key;
  const wrapper = document.createElement('label');
  wrapper.style.display='block';
  wrapper.innerHTML = `<input type="checkbox" id="${id}" value="${key}"> ${p.name}`;
  patternList.appendChild(wrapper);
});

function getSelectedPatterns(){
  const boxes = patternList.querySelectorAll('input[type=checkbox]');
  const out = [];
  boxes.forEach(b => { if(b.checked) out.push(b.value); });
  return out;
}

function drawPreview(){
  const w_mm = parseFloat(canvasWidth.value);
  const h_mm = parseFloat(canvasHeight.value);
  const scale = parseFloat(previewScale.value); // px per mm for preview
  const spacing_mm = parseFloat(gridSpacing.value);
  const radius_mm = parseFloat(dotRadius.value);
  const sel = getSelectedPatterns();
  const pattern_scale = parseFloat(patternScale.value);

  const pxW = mmToPx(w_mm, scale);
  const pxH = mmToPx(h_mm, scale);
  canvas.width = pxW + 2; canvas.height = pxH + 2;

  // clear & background
  ctx.fillStyle = bgColor.value; ctx.fillRect(0,0,canvas.width,canvas.height);

  // draw dots grid
  ctx.fillStyle = dotColor.value;
  const spacingPx = mmToPx(spacing_mm, scale);
  const radiusPx = Math.max(0.2, mmToPx(radius_mm, scale));
  for(let y=0;y<=pxH;y+=spacingPx){
    for(let x=0;x<=pxW;x+=spacingPx){
      ctx.beginPath();
      ctx.arc(x, y, radiusPx, 0, Math.PI*2);
      ctx.fill();
    }
  }

  // pattern overlays
  sel.forEach(k => {
    const pat = patterns[k];
    if(pat && pat.draw){
      pat.draw(ctx, Math.max(pxW,pxH), spacingPx, {color: patternColor.value, scale: pattern_scale, lineSpacingPx: mmToPx(parseFloat(lineSpacing.value), scale), lineAngleDeg: parseFloat(lineAngle.value), lineWidthPx: Math.max(0.2, mmToPx(parseFloat(lineWidth.value), scale))});
    }
  });

  // optional simple lines overlay (stitch guides)
  if(enableLines.checked){
    const linesOpts = { color: lineColor.value, lineSpacingPx: mmToPx(parseFloat(lineSpacing.value), scale), lineAngleDeg: parseFloat(lineAngle.value), lineWidthPx: Math.max(0.2, mmToPx(parseFloat(lineWidth.value), scale)) };
    if(patterns['lines'] && patterns['lines'].draw){
      patterns['lines'].draw(ctx, Math.max(pxW,pxH), spacingPx, linesOpts);
    }
  }
}

// create a high-res export canvas (print-ready) and return blob dataURL
async function createExportCanvas(exportDpiPerMm){ // dpi in px/mm (e.g., 11.811 -> 300dpi)
  const w_mm = parseFloat(canvasWidth.value);
  const h_mm = parseFloat(canvasHeight.value);
  const spacing_mm = parseFloat(gridSpacing.value);
  const radius_mm = parseFloat(dotRadius.value);
  const sel = getSelectedPatterns();
  const pattern_scale = parseFloat(patternScale.value);

  const pxW = mmToPx(w_mm, exportDpiPerMm);
  const pxH = mmToPx(h_mm, exportDpiPerMm);
  const spacingPx = mmToPx(spacing_mm, exportDpiPerMm);
  const radiusPx = Math.max(0.3, mmToPx(radius_mm, exportDpiPerMm));

  const off = document.createElement('canvas');
  off.width = pxW; off.height = pxH;
  const oc = off.getContext('2d');
  // background
  oc.fillStyle = bgColor.value; oc.fillRect(0,0,pxW,pxH);

  // dots
  oc.fillStyle = dotColor.value;
  for(let y=0;y<=pxH;y+=spacingPx){
    for(let x=0;x<=pxW;x+=spacingPx){
      oc.beginPath(); oc.arc(x,y,radiusPx,0,Math.PI*2); oc.fill();
    }
  }

  // patterns
  sel.forEach(k => {
    const pat = patterns[k];
    if(pat && pat.draw){
      pat.draw(oc, Math.max(pxW,pxH), spacingPx, {color: patternColor.value, scale: pattern_scale, lineSpacingPx: mmToPx(parseFloat(lineSpacing.value), exportDpiPerMm), lineAngleDeg: parseFloat(lineAngle.value), lineWidthPx: Math.max(0.2, mmToPx(parseFloat(lineWidth.value), exportDpiPerMm))});
    }
  });

  // lines
  if(enableLines.checked){
    const linesOpts = { color: lineColor.value, lineSpacingPx: mmToPx(parseFloat(lineSpacing.value), exportDpiPerMm), lineAngleDeg: parseFloat(lineAngle.value), lineWidthPx: Math.max(0.2, mmToPx(parseFloat(lineWidth.value), exportDpiPerMm)) };
    if(patterns['lines'] && patterns['lines'].draw){
      patterns['lines'].draw(oc, Math.max(pxW,pxH), spacingPx, linesOpts);
    }
  }

  return off;
}

redrawBtn.addEventListener('click', drawPreview);
[canvasWidth, canvasHeight, previewScale, gridSpacing, dotRadius, dotColor, patternScale, patternColor, bgColor, enableLines, lineSpacing, lineAngle, lineColor, lineWidth].forEach(el => el.addEventListener('input', drawPreview));
patternList.addEventListener('change', drawPreview);

// Download JPEG (high-res)
downloadJpegBtn.addEventListener('click', async ()=>{
  // export at 300dpi => px/mm = 300 / 25.4 = 11.811 px per mm
  const pxPerMm = 11.811023622;
  const exportCanvas = await createExportCanvas(pxPerMm);
  const dataUrl = exportCanvas.toDataURL('image/jpeg', 1.0);
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'kuguri-pattern.jpg';
  a.click();
});

// Download PDF (print-ready)
downloadPdfBtn.addEventListener('click', async ()=>{
  const pxPerMm = 11.811023622;
  const exportCanvas = await createExportCanvas(pxPerMm);
  const { jsPDF } = window.jspdf;
  const w_mm = parseFloat(canvasWidth.value);
  const h_mm = parseFloat(canvasHeight.value);
  const pdf = new jsPDF({ unit: 'mm', format: [w_mm, h_mm] });
  // convert canvas to JPEG data URL at full resolution
  const imgData = exportCanvas.toDataURL('image/jpeg', 1.0);
  // add image filling the whole page
  pdf.addImage(imgData, 'JPEG', 0, 0, w_mm, h_mm);
  pdf.save('kuguri-pattern.pdf');
});

// initial draw
drawPreview();
