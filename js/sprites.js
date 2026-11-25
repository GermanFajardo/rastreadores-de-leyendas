// Sprites Manager for 'Los Rastreadores de Leyendas de San Miguel'
// Direct PNG drawing respecting original transparency, no color wiping filters.
// Equal grid subdivision: 4 rows x 4 columns (8 columns for jacinto.png).
// Fila 0: frente/abajo | Fila 1: derecha (y volteada para izquierda) | Fila 3: espalda/arriba

const SpriteManager = {
  images: {},
  loaded: false,
  list: ['tomas', 'valeria', 'copo', 'jacinto', 'rigoberto', 'lucia'],

  loadAll(onProgress) {
    return new Promise((resolve) => {
      let loadedCount = 0;
      const charTotal = this.list.length;
      const objTotal = ObjectSprites.tiles.length + ObjectSprites.objects.length;
      const total = charTotal + objTotal;

      const checkDone = () => {
        loadedCount++;
        if (onProgress) onProgress(loadedCount, total);
        if (loadedCount === total) {
          this.loaded = true;
          ObjectSprites.loaded = true;
          resolve();
        }
      };

      this.list.forEach((name) => {
        const img = new Image();
        img.onload = () => {
          // Direct image reference - no offscreen canvas color wiping
          this.images[name] = img;
          checkDone();
        };

        img.onerror = (err) => {
          console.error('Error loading sprite:', name, err);
          checkDone();
        };

        img.src = 'sprites/' + name + '.png?v=5';
      });

      ObjectSprites.loadAll(checkDone);
    });
  },

  // Regla unificada de dirección y volteo horizontal para TODOS los personajes (incluido Copo):
  // 1. Usa la Fila 1 (índice 1, donde el dibujo original mira a la derecha) para ambos movimientos laterales.
  // 2. Si mira a la derecha (right / dir 2): dibuja el fotograma normal SIN voltear (flip: false).
  // 3. Si mira a la izquierda (left / dir 1): aplica volteo espejo horizontal con ctx.scale(-1, 1) (flip: true).
  // 4. Si mira abajo (down / dir 0): Fila 0 (flip: false).
  // 5. Si mira arriba (up / dir 3): Fila 3 (flip: false).
  getRowAndFlipForDirection(dir, name = '') {
    if (dir === 1 || dir === 'left') {
      return { row: 1, flip: true };  // Izquierda: volteo espejo horizontal ctx.scale(-1, 1)
    } else if (dir === 2 || dir === 'right') {
      return { row: 1, flip: false }; // Derecha: normal SIN voltear ctx.scale(1, 1)
    } else if (dir === 3 || dir === 'up') {
      return { row: 3, flip: false }; // Arriba: Fila 3
    } else {
      return { row: 0, flip: false }; // Abajo: Fila 0
    }
  },

  getRowForDirection(dir, name = '') {
    return this.getRowAndFlipForDirection(dir, name).row;
  },

  // Draw full frame on game canvas tile, centered, without clipping
  draw(ctx, name, dirOrRow, col, x, y, tileSize, scale = 1.0) {
    const img = this.images[name];
    if (!img) return;

    const cols = (name === 'jacinto') ? 8 : 4;
    const rows = 4;
    const cellW = img.width / cols;
    let cellH = img.height / rows;

    const { row, flip } = this.getRowAndFlipForDirection(dirOrRow, name);
    const frameCol = col % cols;

    let sx = frameCol * cellW;
    let sy = row * cellH;
    let sw = cellW;
    let sh = cellH;

    // Para Don Rigoberto y Lucía en el mapa (proporcional a cellH):
    if (name === 'rigoberto' && row === 0) {
      sy = 0;
      sh = Math.min(img.height, Math.round(cellH * (430 / 384)));
    } else if (name === 'lucia' && row === 0) {
      sy = 0;
      sh = Math.min(img.height, Math.round(cellH * (415 / 384)));
    }

    let charScale = scale;
    if (name === 'copo') {
      charScale = 0.68 * scale;
    } else if (name === 'jacinto') {
      charScale = 1.05 * scale;
    } else if (name === 'rigoberto') {
      // Escala aumentada ~25% para que sea ligeramente más alto que Tomás (adulto)
      charScale = 1.25 * scale;
    }

    const drawH = tileSize * charScale;
    const drawW = (sw / sh) * drawH;
    const dx = Math.round(x + (tileSize - drawW) / 2);
    const dy = Math.round(y + (tileSize - drawH));

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    if (flip) {
      ctx.translate(dx + drawW, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, drawW, drawH);
    } else {
      ctx.drawImage(img, sx, sy, sw, sh, dx, dy, drawW, drawH);
    }

    ctx.restore();
  },

  // Draw full frame centered in circular / avatar canvas (no border clipping)
  drawAvatar(ctx, name, width, height, row = 0, col = 0) {
    const img = this.images[name];
    if (!img) return;

    const cols = (name === 'jacinto') ? 8 : 4;
    const rows = 4;
    const cellW = img.width / cols;
    const cellH = img.height / rows;

    let sx = (col % cols) * cellW;
    let sy = (row % rows) * cellH;
    let sw = cellW;
    let sh = cellH;

    // Para sprites con margen lateral transparente ancho (rigoberto y lucia)
    // recortar sw centrado proporcionalmente para que su altura no quede reducida en avatares circulares
    if (name === 'rigoberto' || name === 'lucia') {
      const charWidth = Math.round(cellW * 0.5);
      sx += (cellW - charWidth) / 2;
      sw = charWidth;
      if (row === 0) {
        sy = 0;
        const factor = (name === 'rigoberto') ? (430 / 384) : (415 / 384);
        sh = Math.min(img.height, Math.round(cellH * factor));
      }
    }

    // Margen interior (~10% padding) para que el círculo de radio 50% nunca recorte cabeza ni pies
    const padding = Math.max(3, Math.round(Math.min(width, height) * 0.10));
    const availW = width - padding * 2;
    const availH = height - padding * 2;
    const scale = Math.min(availW / sw, availH / sh);

    const dw = Math.round(sw * scale);
    const dh = Math.round(sh * scale);
    const dx = Math.round((width - dw) / 2);
    const dy = Math.round((height - dh) / 2);

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    ctx.restore();
  },

  // Compatibility helper aliases
  drawPortrait(ctx, name, x, y, size) {
    this.drawAvatar(ctx, name, size, size, 0, 0);
  },

  drawFullCharacter(ctx, name, x, y, width, height) {
    this.drawAvatar(ctx, name, width, height, 0, 0);
  }
};

// Map & Environment Pixel Art Assets Manager (sprites/Objetos/)
// - Ground tiles: hierba, tierra, piso (baked to crisp 64x64 canvases)
// - Objects & buildings: flood-fill white background removal from corners (preserving inner whites)
const ObjectSprites = {
  images: {},
  loaded: false,
  tiles: ['hierba', 'tierra', 'piso'],
  objects: [
    'escuela',
    'establo',
    'bodega',
    'flores',
    'vaca',
    'zurcos',
    'puente',
    'arbol',
    'monte',
    'cerca_horizontal',
    'cerca_vertical',
    'aviso',
    'estudiantes',
    'campesinos',
    'tinas',
    'ganaderos',
    'pescadores'
  ],

  loadAll(onItemDone) {
    this.tiles.forEach((name) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = 64;
        c.height = 64;
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 64, 64);
        this.images[name] = c;
        if (onItemDone) onItemDone();
      };
      img.onerror = (err) => {
        console.error('Error loading tile sprite:', name, err);
        if (onItemDone) onItemDone();
      };
      img.src = 'sprites/Objetos/' + name + '.png?v=4';
    });

    this.objects.forEach((name) => {
      const img = new Image();
      img.onload = () => {
        this.images[name] = this.removeOuterWhiteAndCrop(img);
        if (onItemDone) onItemDone();
      };
      img.onerror = (err) => {
        console.error('Error loading object sprite:', name, err);
        if (onItemDone) onItemDone();
      };
      img.src = 'sprites/Objetos/' + name + '.png?v=4';
    });
  },

  // Flood-fill from outer corners to remove exterior white background
  // without erasing interior whites (e.g., cow eyes/spots, school walls)
  removeOuterWhiteAndCrop(img) {
    const w = img.width;
    const h = img.height;
    const aux = document.createElement('canvas');
    aux.width = w;
    aux.height = h;
    const ctx = aux.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const total = w * h;
    const visited = new Uint8Array(total);
    const queue = new Int32Array(total);
    let head = 0;
    let tail = 0;

    const isOuterWhite = (idx) => {
      const o = idx * 4;
      return data[o] >= 232 && data[o + 1] >= 232 && data[o + 2] >= 232;
    };

    const seed = (x, y) => {
      const idx = y * w + x;
      if (!visited[idx] && isOuterWhite(idx)) {
        visited[idx] = 1;
        queue[tail++] = idx;
      }
    };

    // Seed from all 4 corners and outer perimeter
    seed(0, 0);
    seed(w - 1, 0);
    seed(0, h - 1);
    seed(w - 1, h - 1);
    for (let x = 0; x < w; x++) {
      seed(x, 0);
      seed(x, h - 1);
    }
    for (let y = 0; y < h; y++) {
      seed(0, y);
      seed(w - 1, y);
    }

    while (head < tail) {
      const idx = queue[head++];
      data[idx * 4 + 3] = 0;

      const x = idx % w;
      const y = (idx - x) / w;

      if (x + 1 < w) {
        const r = idx + 1;
        if (!visited[r] && isOuterWhite(r)) {
          visited[r] = 1;
          queue[tail++] = r;
        }
      }
      if (x - 1 >= 0) {
        const l = idx - 1;
        if (!visited[l] && isOuterWhite(l)) {
          visited[l] = 1;
          queue[tail++] = l;
        }
      }
      if (y + 1 < h) {
        const d = idx + w;
        if (!visited[d] && isOuterWhite(d)) {
          visited[d] = 1;
          queue[tail++] = d;
        }
      }
      if (y - 1 >= 0) {
        const u = idx - w;
        if (!visited[u] && isOuterWhite(u)) {
          visited[u] = 1;
          queue[tail++] = u;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Find tight bounding box of remaining opaque pixels
    let minX = w, minY = h, maxX = -1, maxY = -1;
    for (let y = 0; y < h; y++) {
      const rowOffset = y * w;
      for (let x = 0; x < w; x++) {
        if (data[(rowOffset + x) * 4 + 3] > 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX < minX || maxY < minY) {
      return aux;
    }

    const cropW = maxX - minX + 1;
    const cropH = maxY - minY + 1;
    const cropped = document.createElement('canvas');
    cropped.width = cropW;
    cropped.height = cropH;
    const cctx = cropped.getContext('2d');
    cctx.imageSmoothingEnabled = false;
    cctx.drawImage(aux, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
    return cropped;
  },

  // Draw an object sprite preserving aspect ratio and pixel-art crispness
  draw(ctx, name, dx, dy, dw, dh) {
    const img = this.images[name];
    if (!img) return false;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, img.width, img.height, Math.round(dx), Math.round(dy), Math.round(dw), Math.round(dh));
    ctx.restore();
    return true;
  }
};
