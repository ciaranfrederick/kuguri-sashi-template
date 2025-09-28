// patterns.js
window.KuguriPatterns = {
  none: {
    name: "None",
    draw: () => {}
  },
  diamonds: {
    name: "Diamonds",
    draw: (ctx, pxSize, spacing) => {
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 0.5;
      for (let y = 0; y <= pxSize - spacing; y += spacing) {
        for (let x = 0; x <= pxSize - spacing; x += spacing) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + spacing, y + spacing);
          ctx.moveTo(x + spacing, y);
          ctx.lineTo(x, y + spacing);
          ctx.stroke();
        }
      }
    }
  },
  crosses: {
    name: "Crosses",
    draw: (ctx, pxSize, spacing) => {
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 0.5;
      for (let y = 0; y <= pxSize; y += spacing) {
        for (let x = 0; x <= pxSize; x += spacing) {
          ctx.beginPath();
          ctx.moveTo(x - 5, y);
          ctx.lineTo(x + 5, y);
          ctx.moveTo(x, y - 5);
          ctx.lineTo(x, y + 5);
          ctx.stroke();
        }
      }
    }
  }
};
