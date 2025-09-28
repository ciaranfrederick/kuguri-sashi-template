// app.js
const mmToPx = mm => mm * 3.78;
const canvas = document.getElementById("patternCanvas");
const ctx = canvas.getContext("2d");
const sizeInput = document.getElementById("canvasSize");
const spacingInput = document.getElementById("gridSpacing");
const dotRadiusInput = document.getElementById("dotRadius");
const patternSelect = document.getElementById("patternSelect");
const downloadBtn = document.getElementById("downloadSVG");

for (const key in KuguriPatterns) {
  const opt = document.createElement("option");
  opt.value = key;
  opt.textContent = KuguriPatterns[key].name;
  patternSelect.appendChild(opt);
}

function draw() {
  const mmSize = +sizeInput.value;
  const mmSpacing = +spacingInput.value;
  const mmRadius = +dotRadiusInput.value;

  const pxSize = mmToPx(mmSize);
  const spacing = mmToPx(mmSpacing);
  const radius = mmToPx(mmRadius);

  canvas.width = canvas.height = pxSize + 20;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(10, 10);

  ctx.fillStyle = "black";
  for (let y = 0; y <= pxSize; y += spacing) {
    for (let x = 0; x <= pxSize; x += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const patternKey = patternSelect.value;
  if (patternKey && KuguriPatterns[patternKey]) {
    KuguriPatterns[patternKey].draw(ctx, pxSize, spacing);
  }

  ctx.restore();
}

function downloadSVG() {
  const mmSize = +sizeInput.value;
  const mmSpacing = +spacingInput.value;
  const mmRadius = +dotRadiusInput.value;
  const patternKey = patternSelect.value;

  const dots = [];
  for (let y = 0; y <= mmSize; y += mmSpacing) {
    for (let x = 0; x <= mmSize; x += mmSpacing) {
      dots.push(`<circle cx="${x}" cy="${y}" r="${mmRadius}" />`);
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${mmSize}mm" height="${mmSize}mm" viewBox="0 0 ${mmSize} ${mmSize}" stroke="blue" stroke-width="0.3" fill="black">${dots.join("")}</svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "kuguri-pattern.svg";
  a.click();
}

[sizeInput, spacingInput, dotRadiusInput, patternSelect].forEach(el =>
  el.addEventListener("input", draw)
);
downloadBtn.addEventListener("click", downloadSVG);

draw();
