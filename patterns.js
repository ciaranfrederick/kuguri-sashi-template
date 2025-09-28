// patterns.js - pattern definitions
// Each pattern implements draw(ctx, pxSize, spacingPx, options)
window.KuguriPatterns = {
  diamonds: {
    id: 'diamonds',
    name: 'Diamonds (crossed)',
    draw: function(ctx, pxSize, spacing, opts){
      ctx.save();
      ctx.strokeStyle = opts.color; ctx.lineWidth = Math.max(0.3, 0.5*opts.scale);
      for(let y=0;y<=pxSize-spacing;y+=spacing*opts.scale){
        for(let x=0;x<=pxSize-spacing;x+=spacing*opts.scale){
          ctx.beginPath();
          ctx.moveTo(x,y); ctx.lineTo(x+spacing*opts.scale, y+spacing*opts.scale);
          ctx.moveTo(x+spacing*opts.scale, y); ctx.lineTo(x, y+spacing*opts.scale);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
  },

  crosses: {
    id: 'crosses',
    name: 'X Crosses',
    draw: function(ctx, pxSize, spacing, opts){
      ctx.save();
      ctx.strokeStyle = opts.color; ctx.lineWidth = Math.max(0.25, 0.4*opts.scale);
      const s = spacing*opts.scale;
      const size = Math.max(2, s*0.35);
      for(let y=0;y<=pxSize;y+=s){
        for(let x=0;x<=pxSize;x+=s){
          ctx.beginPath();
          ctx.moveTo(x-size,y-size); ctx.lineTo(x+size,y+size);
          ctx.moveTo(x+size,y-size); ctx.lineTo(x-size,y+size);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
  },

  starburst: {
    id: 'starburst',
    name: 'Starburst (petals)',
    draw: function(ctx, pxSize, spacing, opts){
      ctx.save();
      ctx.strokeStyle = opts.color; ctx.lineWidth = Math.max(0.25, 0.35*opts.scale);
      const s = spacing*opts.scale;
      const R = Math.max(3, s*0.45);
      for(let y=0;y<=pxSize;y+=s){
        for(let x=0;x<=pxSize;x+=s){
          for(let a=0;a<Math.PI*2;a+=Math.PI/3){
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(a)*R, y + Math.sin(a)*R);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    }
  },

  nested: {
    id: 'nested',
    name: 'Nested diamonds',
    draw: function(ctx, pxSize, spacing, opts){
      ctx.save();
      ctx.strokeStyle = opts.color; ctx.lineWidth = Math.max(0.2, 0.3*opts.scale);
      const s = spacing*opts.scale;
      for(let y=0;y<=pxSize-s;y+=s){
        for(let x=0;x<=pxSize-s;x+=s){
          const cx = x + s/2, cy = y + s/2;
          ctx.beginPath();
          ctx.moveTo(cx, cy - s*0.45); ctx.lineTo(cx + s*0.45, cy); ctx.lineTo(cx, cy + s*0.45); ctx.lineTo(cx - s*0.45, cy); ctx.closePath();
          ctx.stroke();
          ctx.beginPath();
          const small = s*0.25;
          ctx.moveTo(cx, cy - small); ctx.lineTo(cx + small, cy); ctx.lineTo(cx, cy + small); ctx.lineTo(cx - small, cy); ctx.closePath();
          ctx.stroke();
        }
      }
      ctx.restore();
    }
  },

  diagonals: {
    id: 'diagonals',
    name: 'Diagonal lines',
    draw: function(ctx, pxSize, spacing, opts){
      ctx.save();
      ctx.strokeStyle = opts.color; ctx.lineWidth = Math.max(0.2, 0.3*opts.scale);
      ctx.beginPath();
      ctx.moveTo(0,0); ctx.lineTo(pxSize, pxSize);
      ctx.moveTo(pxSize,0); ctx.lineTo(0, pxSize);
      ctx.stroke();
      ctx.restore();
    }
  },

  lines: {
    id: 'lines',
    name: 'Simple lines (stitch guides)',
    draw: function(ctx, pxSize, spacing, opts){
      ctx.save();
      ctx.strokeStyle = opts.color; ctx.lineWidth = opts.lineWidthPx || 0.6;
      const step = opts.lineSpacingPx || 10;
      const angle = (opts.lineAngleDeg || 0) * Math.PI/180;
      // draw parallel lines across the canvas at given angle
      // compute bounds large enough and draw
      const cos = Math.cos(angle), sin = Math.sin(angle);
      // find bounding box proj range
      const diag = Math.sqrt(pxSize*pxSize + pxSize*pxSize);
      for(let t = -diag; t <= diag; t += step){
        const cx = pxSize/2 + Math.cos(angle+Math.PI/2)*t;
        const cy = pxSize/2 + Math.sin(angle+Math.PI/2)*t;
        // draw a long line through (cx,cy)
        ctx.beginPath();
        ctx.moveTo(cx - cos*diag - sin*diag, cy - sin*diag + cos*diag);
        ctx.lineTo(cx + cos*diag + sin*diag, cy + sin*diag - cos*diag);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
};
