// Multi-screen Map Manager for 'Los Rastreadores de Leyendas de San Miguel'
// Screen 0: Escuela Rural San Miguel
// Screen 1: Cultivos de Papa y Huerta Escolar
// Screen 2: Potreros y Establo Lechero
// Screen 3: Quebrada y Bosque Alto
// Screen 4: Celebración en la Escuela San Miguel

const MAP_COLS = 12;
const MAP_ROWS = 10;
const TILE_SIZE = 64;

// Tile Key:
// 'G'  = Grass
// 'P'  = Dirt Path
// 'C'  = Cobblestone
// 'SW' = School Wall, 'SR' = School Roof, 'SD' = School Door, 'SF' = School Flag
// 'PF' = Potato Furrows, 'HB' = Huerta Bed, 'WF' = Wooden Fence
// 'BW' = Barn Wall, 'BR' = Barn Roof, 'MC' = Milk Cans
// 'W'  = Quebrada Water, 'WB' = Wooden Bridge, 'RK' = Rock, 'TR' = Native Tree
// 'SP' = Signpost ("👉 A la Huerta")
// 'IB' = Investigation Board / Table

const MAPS = {
  // PANTALLA 0: ESCUELA RURAL SAN MIGUEL
  screen0: [
    ['TR', 'TR', 'SR', 'SR', 'SR', 'SR', 'SR', 'SR', 'SF', 'TR', 'TR', 'TR'],
    ['TR', 'G',  'SW', 'SW', 'SD', 'SW', 'SW', 'SW', 'G',  'G',  'G',  'TR'],
    ['WF', 'G',  'G',  'G',  'C',  'G',  'G',  'G',  'G',  'G',  'G',  'WF'],
    ['WF', 'G',  'C',  'C',  'C',  'C',  'C',  'G',  'G',  'G',  'G',  'WF'],
    ['WF', 'G',  'C',  'C',  'C',  'C',  'C',  'C',  'P',  'P',  'SP', 'P' ],
    ['WF', 'G',  'C',  'C',  'C',  'C',  'C',  'C',  'P',  'P',  'P',  'P' ],
    ['WF', 'G',  'C',  'C',  'C',  'C',  'C',  'G',  'G',  'G',  'G',  'G' ],
    ['WF', 'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G' ],
    ['TR', 'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G' ],
    ['WF', 'WF', 'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G' ]
  ],

  // PANTALLA 1: CULTIVOS DE PAPA Y HUERTA ESCOLAR
  screen1: [
    ['TR', 'TR', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'TR', 'TR'],
    ['WF', 'G',  'G',  'P',  'PF', 'PF', 'PF', 'PF', 'PF', 'PF', 'G',  'WF'],
    ['WF', 'G',  'G',  'P',  'PF', 'PF', 'PF', 'PF', 'PF', 'PF', 'G',  'WF'],
    ['WF', 'G',  'G',  'P',  'PF', 'PF', 'PF', 'PF', 'PF', 'PF', 'G',  'WF'],
    ['P',  'P',  'P',  'P',  'P',  'P',  'IB', 'P',  'P',  'P',  'P',  'WF'],
    ['P',  'P',  'P',  'P',  'P',  'P',  'P',  'P',  'P',  'P',  'P',  'WF'],
    ['G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'BW', 'BW', 'G',  'WF'],
    ['G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'BW', 'BW', 'G',  'WF'],
    ['G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'WF'],
    ['G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'WF', 'WF', 'WF', 'WF']
  ],

  // PANTALLA 2: POTREROS Y ESTABLO LECHERO
  screen2: [
    ['TR', 'TR', 'BR', 'BR', 'BR', 'BR', 'WF', 'WF', 'WF', 'WF', 'TR', 'TR'],
    ['WF', 'G',  'BW', 'BW', 'BW', 'BW', 'G',  'G',  'G',  'G',  'G',  'WF'],
    ['WF', 'G',  'MC', 'P',  'P',  'P',  'P',  'G',  'G',  'G',  'G',  'WF'],
    ['WF', 'G',  'P',  'P',  'P',  'P',  'P',  'P',  'G',  'G',  'G',  'WF'],
    ['P',  'P',  'P',  'P',  'P',  'P',  'P',  'P',  'G',  'G',  'G',  'WF'],
    ['P',  'P',  'P',  'P',  'P',  'P',  'P',  'P',  'G',  'G',  'G',  'WF'],
    ['WF', 'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G' ],
    ['WF', 'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G' ],
    ['WF', 'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G' ],
    ['WF', 'WF', 'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G' ]
  ],

  // PANTALLA 3: QUEBRADA Y BOSQUE ALTO
  screen3: [
    ['TR', 'TR', 'RK', 'G',  'P',  'W',  'W',  'P',  'G',  'RK', 'TR', 'TR'],
    ['TR', 'G',  'G',  'G',  'P',  'W',  'W',  'P',  'G',  'G',  'G',  'TR'],
    ['TR', 'G',  'RK', 'G',  'P',  'W',  'W',  'P',  'G',  'RK', 'G',  'TR'],
    ['TR', 'G',  'G',  'G',  'P',  'W',  'W',  'P',  'G',  'G',  'G',  'TR'],
    ['P',  'P',  'P',  'P',  'P',  'WB', 'WB', 'P',  'P',  'P',  'P',  'TR'],
    ['P',  'P',  'P',  'P',  'P',  'WB', 'WB', 'P',  'P',  'P',  'P',  'TR'],
    ['G',  'G',  'G',  'G',  'G',  'W',  'W',  'P',  'G',  'G',  'G',  'TR'],
    ['G',  'G',  'G',  'G',  'G',  'W',  'W',  'P',  'G',  'RK', 'G',  'TR'],
    ['G',  'G',  'G',  'G',  'G',  'W',  'W',  'P',  'G',  'G',  'G',  'TR'],
    ['G',  'G',  'G',  'G',  'G',  'W',  'W',  'WF', 'WF', 'WF', 'TR', 'TR']
  ],

  // PANTALLA FINAL: CELEBRACIÓN EN LA ESCUELA
  screenFinal: [
    ['TR', 'TR', 'SR', 'SR', 'SR', 'SR', 'SR', 'SR', 'SF', 'TR', 'TR', 'TR'],
    ['TR', 'G',  'SW', 'SW', 'SD', 'SW', 'SW', 'SW', 'G',  'G',  'G',  'TR'],
    ['WF', 'G',  'G',  'G',  'C',  'G',  'G',  'G',  'G',  'G',  'G',  'WF'],
    ['WF', 'G',  'C',  'C',  'C',  'C',  'C',  'G',  'G',  'G',  'G',  'WF'],
    ['WF', 'G',  'C',  'C',  'C',  'C',  'C',  'C',  'C',  'C',  'G',  'WF'],
    ['WF', 'G',  'C',  'C',  'C',  'C',  'C',  'C',  'C',  'C',  'G',  'WF'],
    ['WF', 'G',  'C',  'C',  'C',  'C',  'C',  'C',  'C',  'C',  'G',  'WF'],
    ['WF', 'G',  'G',  'G',  'C',  'G',  'G',  'G',  'G',  'G',  'G',  'WF'],
    ['TR', 'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'G',  'TR'],
    ['WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF']
  ]
};

class GameMap {
  constructor() {
    this.cols = MAP_COLS;
    this.rows = MAP_ROWS;
    this.tileSize = TILE_SIZE;
    this.currentScreenId = 'screen0';
    this.waterFrame = 0;
  }

  setScreen(screenId) {
    if (MAPS[screenId]) {
      this.currentScreenId = screenId;
    }
  }

  getCurrentGrid() {
    return MAPS[this.currentScreenId] || MAPS.screen0;
  }

  isWalkable(col, row) {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
      return false;
    }

    const grid = this.getCurrentGrid();
    const tile = grid[row][col];

    // Solid obstacle tiles (school, barn, milk vats, trees, bushes/rocks, fences, water)
    const solidTiles = ['RK', 'TR', 'SR', 'SW', 'SD', 'BR', 'BW', 'WF', 'SF', 'MC'];
    if (solidTiles.includes(tile)) {
      return false;
    }

    // Water is impassable except on the stone/wooden bridge 'WB'
    if (tile === 'W') {
      return false;
    }

    // Screen-specific object & villager hitboxes
    if (this.currentScreenId === 'screen0') {
      if (row >= 7 && row <= 9 && col >= 5 && col <= 11) return false; // ~0.72x estudiantes in bottom-right lawn
    } else if (this.currentScreenId === 'screen1') {
      if (col >= 8 && col <= 10 && row >= 6 && row <= 8) return false; // enlarged bodega
      if (row >= 6 && row <= 9 && col >= 0 && col <= 6) return false; // 2.0x campesinos in bottom-left
    } else if (this.currentScreenId === 'screen2') {
      if ((col === 8 && row === 3) || (col === 9 && row === 5)) return false; // vacas
      if (row >= 7 && row <= 9 && col >= 5 && col <= 11) return false; // ~0.72x ganaderos in lower-right pasture
    } else if (this.currentScreenId === 'screen3') {
      if (row >= 7 && row <= 9 && col >= 1 && col <= 4) return false; // reduced ~28% pescadores near riverbank
    }

    return true;
  }

  update(delta) {
    this.waterFrame += delta * 3;
  }

  render(ctx) {
    const grid = this.getCurrentGrid();
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // Pass 1: Ground textures & water
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = c * this.tileSize;
        const y = r * this.tileSize;
        const tile = grid[r][c];
        this.renderGroundTile(ctx, tile, c, r, x, y);
      }
    }

    // Pass 2: Multi-tile structures (escuela, establo, zurcos, puente)
    this.renderMultiTileStructures(ctx);

    // Pass 3: Single-tile objects (trees, bushes, fences, signs, milk cans)
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = c * this.tileSize;
        const y = r * this.tileSize;
        const tile = grid[r][c];
        this.renderObjectTile(ctx, grid, tile, c, r, x, y);
      }
    }

    ctx.restore();
  }

  renderGroundTile(ctx, tile, col, row, x, y) {
    if (tile === 'W' || tile === 'WB') {
      this.drawWater(ctx, x, y, col, row);
      return;
    }
    if (tile === 'C') {
      if (!ObjectSprites.draw(ctx, 'piso', x, y, this.tileSize, this.tileSize)) {
        this.drawCobblestone(ctx, x, y, col, row);
      }
      return;
    }
    if (['P', 'PF', 'HB', 'MC', 'SP', 'IB'].includes(tile)) {
      if (!ObjectSprites.draw(ctx, 'tierra', x, y, this.tileSize, this.tileSize)) {
        this.drawDirtPath(ctx, x, y, col, row);
      }
      return;
    }
    if (!ObjectSprites.draw(ctx, 'hierba', x, y, this.tileSize, this.tileSize)) {
      this.drawGrass(ctx, x, y, col, row);
    }
  }

  renderMultiTileStructures(ctx) {
    const s = this.tileSize;

    if (this.currentScreenId === 'screen0' || this.currentScreenId === 'screenFinal') {
      const esc = ObjectSprites.images.escuela;
      if (esc) {
        const aspect = esc.width / esc.height;
        const dh = 138;
        const dw = dh * aspect;
        const dx = 2 * s + (6 * s - dw) / 2;
        const dy = 0;
        ObjectSprites.draw(ctx, 'escuela', dx, dy, dw, dh);
      } else {
        this.drawFallbackRange(ctx, 2, 0, 8, 1);
      }
      if (this.currentScreenId === 'screen0') {
        const estudiantes = ObjectSprites.images.estudiantes;
        if (estudiantes) {
          const aspect = estudiantes.width / estudiantes.height;
          // ~0.72x scale in bottom-right lawn, clear of courtyard tiles and bottom margin
          const dw = 7.05 * s;
          const dh = dw / aspect;
          const dx = 4.6 * s;
          const dy = 9.5 * s - dh;
          ObjectSprites.draw(ctx, 'estudiantes', dx, dy, dw, dh);
        }
      }
    } else if (this.currentScreenId === 'screen1') {
      const zurcos = ObjectSprites.images.zurcos;
      if (zurcos) {
        const aspect = zurcos.width / zurcos.height;
        // Main potato field (cols 4..9, rows 1..3 => 384x192)
        const dh = 3 * s;
        const dw = dh * aspect;
        const dx = 4 * s + (6 * s - dw) / 2;
        ObjectSprites.draw(ctx, 'zurcos', dx, 1 * s, dw, dh);
      }
      const campesinos = ObjectSprites.images.campesinos;
      if (campesinos) {
        const aspect = campesinos.width / campesinos.height;
        // ~2.0x scale in cleared bottom-left zone (cols 0..6, rows 6..9), clear of zurcos & bodega
        const dw = 7.0 * s;
        const dh = dw / aspect;
        const dx = 0.1 * s;
        const dy = 10 * s - dh - 4;
        ObjectSprites.draw(ctx, 'campesinos', dx, dy, dw, dh);
      }
      const bodega = ObjectSprites.images.bodega;
      if (bodega) {
        const aspect = bodega.width / bodega.height;
        // Enlarged ~43% (2.85x2.85 tiles) over cols 8..10, rows 6..8
        const dw = 2.85 * s;
        const dh = dw / aspect;
        const dx = 8 * s + (3 * s - dw) / 2;
        const dy = 6 * s + (3 * s - dh) / 2;
        ObjectSprites.draw(ctx, 'bodega', dx, dy, dw, dh);
      }
    } else if (this.currentScreenId === 'screen2') {
      const establo = ObjectSprites.images.establo;
      if (establo) {
        const aspect = establo.width / establo.height;
        const dw = 4.5 * s;
        const dh = dw / aspect;
        const dx = 2 * s + (4 * s - dw) / 2;
        const dy = 2 * s - dh;
        ObjectSprites.draw(ctx, 'establo', dx, dy, dw, dh);
      }
      const ganaderos = ObjectSprites.images.ganaderos;
      if (ganaderos) {
        const aspect = ganaderos.width / ganaderos.height;
        // ~0.72x scale in lower-right pasture, completely below cow at (9, 5) with clean border margins
        const dw = 6.2 * s;
        const dh = dw / aspect;
        const dx = 5.4 * s;
        const dy = 9.7 * s - dh;
        ObjectSprites.draw(ctx, 'ganaderos', dx, dy, dw, dh);
      }
    } else if (this.currentScreenId === 'screen3') {
      const puente = ObjectSprites.images.puente;
      if (puente) {
        const aspect = puente.width / puente.height;
        const dw = 2.8 * s;
        const dh = dw / aspect;
        const dx = 5 * s + (2 * s - dw) / 2;
        const dy = 4 * s + (2 * s - dh) / 2;
        ObjectSprites.draw(ctx, 'puente', dx, dy, dw, dh);
      }
      const pescadores = ObjectSprites.images.pescadores;
      if (pescadores) {
        const aspect = pescadores.width / pescadores.height;
        // Reduced ~28% (from 4.3*s to 3.1*s) so fishermen match Tomás and Jacinto's exact height
        const dh = 3.1 * s;
        const dw = dh * aspect;
        const dx = 1.4 * s;
        const dy = 10 * s - dh;
        ObjectSprites.draw(ctx, 'pescadores', dx, dy, dw, dh);
      }
    }
  }

  drawFallbackRange(ctx, c1, r1, c2, r2) {
    const grid = this.getCurrentGrid();
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        const x = c * this.tileSize;
        const y = r * this.tileSize;
        const t = grid[r][c];
        if (t === 'SW') this.drawSchoolWall(ctx, x, y, c, r);
        else if (t === 'SR') this.drawSchoolRoof(ctx, x, y, c, r);
        else if (t === 'SD') this.drawSchoolDoor(ctx, x, y);
        else if (t === 'SF') this.drawFlagpole(ctx, x, y);
      }
    }
  }

  renderObjectTile(ctx, grid, tile, col, row, x, y) {
    const s = this.tileSize;
    switch (tile) {
      case 'WF': {
        const leftWF = col > 0 && grid[row][col - 1] === 'WF';
        const rightWF = col < this.cols - 1 && grid[row][col + 1] === 'WF';
        if (leftWF || rightWF) {
          const img = ObjectSprites.images.cerca_horizontal;
          if (img) {
            const dw = s * 1.04;
            const dh = dw / (img.width / img.height);
            ObjectSprites.draw(ctx, 'cerca_horizontal', x + (s - dw) / 2, y + (s - dh) / 2, dw, dh);
            break;
          }
        } else {
          const img = ObjectSprites.images.cerca_vertical;
          if (img) {
            const dh = s * 1.04;
            const dw = dh * (img.width / img.height);
            ObjectSprites.draw(ctx, 'cerca_vertical', x + (s - dw) / 2, y + (s - dh) / 2, dw, dh);
            break;
          }
        }
        this.drawWoodenFence(ctx, x, y, col, row);
        break;
      }

      case 'TR': {
        const img = ObjectSprites.images.arbol;
        if (img) {
          const dh = s * 1.18;
          const dw = dh * (img.width / img.height);
          ObjectSprites.draw(ctx, 'arbol', x + (s - dw) / 2, y + s - dh, dw, dh);
        } else {
          this.drawTree(ctx, x, y, col, row);
        }
        break;
      }

      case 'RK': {
        const img = ObjectSprites.images.monte;
        if (img) {
          const dw = s * 0.96;
          const dh = dw / (img.width / img.height);
          ObjectSprites.draw(ctx, 'monte', x + (s - dw) / 2, y + s - dh, dw, dh);
        } else {
          this.drawRock(ctx, x, y, col, row);
        }
        break;
      }

      case 'SP':
      case 'IB': {
        const img = ObjectSprites.images.aviso;
        if (img) {
          const dw = s * 0.88;
          const dh = dw / (img.width / img.height);
          ObjectSprites.draw(ctx, 'aviso', x + (s - dw) / 2, y + s - dh, dw, dh);
        } else if (tile === 'SP') {
          this.drawSignpost(ctx, x, y);
        } else {
          this.drawInvestigationBoard(ctx, x, y);
        }
        break;
      }

      case 'MC': {
        const img = ObjectSprites.images.tinas;
        if (img) {
          const dw = s * 1.35;
          const dh = dw / (img.width / img.height);
          ObjectSprites.draw(ctx, 'tinas', x + (s - dw) / 2, y + s - dh, dw, dh);
        } else {
          this.drawMilkCans(ctx, x, y);
        }
        break;
      }

      case 'SW':
      case 'SR':
      case 'SD':
      case 'SF':
        if (!ObjectSprites.images.escuela) {
          if (tile === 'SW') this.drawSchoolWall(ctx, x, y, col, row);
          else if (tile === 'SR') this.drawSchoolRoof(ctx, x, y, col, row);
          else if (tile === 'SD') this.drawSchoolDoor(ctx, x, y);
          else this.drawFlagpole(ctx, x, y);
        }
        break;

      case 'PF':
        if (!ObjectSprites.images.zurcos) this.drawPotatoFurrow(ctx, x, y, col, row);
        break;

      case 'HB':
        if (!ObjectSprites.images.zurcos) this.drawHuertaBed(ctx, x, y, col, row);
        break;

      case 'BW':
        if (!ObjectSprites.images.establo) this.drawBarnWall(ctx, x, y, col, row);
        break;

      case 'BR':
        if (!ObjectSprites.images.establo) this.drawBarnRoof(ctx, x, y, col, row);
        break;

      case 'WB':
        if (!ObjectSprites.images.puente) this.drawWoodenBridge(ctx, x, y);
        break;

      default:
        break;
    }
  }

  // --- Procedural Pixel Art Renderers ---

  drawGrass(ctx, x, y, col, row) {
    const s = this.tileSize;
    ctx.fillStyle = '#569e32';
    ctx.fillRect(x, y, s, s);

    ctx.fillStyle = '#6ab840';
    ctx.fillRect(x + 8, y + 12, 3, 6);
    ctx.fillRect(x + 40, y + 24, 3, 6);
    ctx.fillRect(x + 20, y + 44, 3, 6);

    ctx.fillStyle = '#448024';
    ctx.fillRect(x + 11, y + 16, 2, 4);
    ctx.fillRect(x + 43, y + 28, 2, 4);
    ctx.fillRect(x + 23, y + 48, 2, 4);

    if ((col * 7 + row * 11) % 5 === 0) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 32, y + 36, 4, 4);
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(x + 33, y + 37, 2, 2);
    }
  }

  drawDirtPath(ctx, x, y, col, row) {
    const s = this.tileSize;
    ctx.fillStyle = '#caa163';
    ctx.fillRect(x, y, s, s);

    ctx.fillStyle = '#b38848';
    ctx.fillRect(x + 6, y + 8, 4, 3);
    ctx.fillRect(x + 38, y + 18, 5, 3);
    ctx.fillRect(x + 22, y + 42, 4, 3);
    ctx.fillRect(x + 48, y + 50, 3, 2);

    ctx.fillStyle = '#ddb578';
    ctx.fillRect(x + 10, y + 28, 4, 2);
    ctx.fillRect(x + 30, y + 48, 4, 2);
  }

  drawCobblestone(ctx, x, y, col, row) {
    const s = this.tileSize;
    ctx.fillStyle = '#8b8e91';
    ctx.fillRect(x, y, s, s);

    ctx.fillStyle = '#a2a5a8';
    ctx.fillRect(x + 2, y + 2, 28, 28);
    ctx.fillRect(x + 34, y + 2, 28, 28);
    ctx.fillRect(x + 2, y + 34, 28, 28);
    ctx.fillRect(x + 34, y + 34, 28, 28);

    ctx.fillStyle = '#646668';
    ctx.fillRect(x, y + 30, s, 4);
    ctx.fillRect(x + 30, y, 4, s);

    ctx.fillStyle = '#c0c3c6';
    ctx.fillRect(x + 4, y + 4, 24, 2);
    ctx.fillRect(x + 36, y + 4, 24, 2);
    ctx.fillRect(x + 4, y + 36, 24, 2);
    ctx.fillRect(x + 36, y + 36, 24, 2);
  }

  drawSchoolWall(ctx, x, y, col, row) {
    const s = this.tileSize;
    ctx.fillStyle = '#e8ecef';
    ctx.fillRect(x, y, s, s);

    ctx.fillStyle = '#cfd4d8';
    for (let by = 0; by < s; by += 16) {
      ctx.fillRect(x, y + by, s, 2);
    }

    if (col % 2 === 1) {
      ctx.fillStyle = '#216127';
      ctx.fillRect(x + 14, y + 16, 36, 36);
      ctx.fillStyle = '#7ac1eb';
      ctx.fillRect(x + 18, y + 20, 12, 12);
      ctx.fillRect(x + 34, y + 20, 12, 12);
      ctx.fillRect(x + 18, y + 36, 12, 12);
      ctx.fillRect(x + 34, y + 36, 12, 12);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 20, y + 22, 4, 4);
      ctx.fillRect(x + 36, y + 22, 4, 4);
    }
  }

  drawSchoolRoof(ctx, x, y, col, row) {
    const s = this.tileSize;
    ctx.fillStyle = '#b84e28';
    ctx.fillRect(x, y, s, s);

    ctx.fillStyle = '#d4653b';
    for (let ty = 4; ty < s; ty += 14) {
      ctx.fillRect(x, y + ty, s, 6);
    }
    ctx.fillStyle = '#8f3312';
    for (let ty = 10; ty < s; ty += 14) {
      ctx.fillRect(x, y + ty, s, 2);
    }

    if (col === 4) {
      ctx.fillStyle = '#6b401e';
      ctx.fillRect(x + 22, y + 2, 20, 36);
      ctx.fillStyle = '#e8ecef';
      ctx.fillRect(x + 26, y + 8, 12, 20);
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(x + 28, y + 12, 8, 10);
      ctx.fillStyle = '#d4ac0d';
      ctx.fillRect(x + 27, y + 22, 10, 3);
    }
  }

  drawSchoolDoor(ctx, x, y) {
    const s = this.tileSize;
    ctx.fillStyle = '#e8ecef';
    ctx.fillRect(x, y, s, s);

    ctx.fillStyle = '#5c381e';
    ctx.fillRect(x + 12, y + 8, 40, 56);
    ctx.fillStyle = '#794726';
    ctx.fillRect(x + 16, y + 12, 14, 48);
    ctx.fillRect(x + 34, y + 12, 14, 48);

    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(x + 26, y + 36, 4, 4);
    ctx.fillRect(x + 34, y + 36, 4, 4);

    ctx.fillStyle = '#f39c12';
    ctx.fillRect(x + 4, y + 2, 56, 8);
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(x + 6, y + 4, 52, 4);
  }

  drawFlagpole(ctx, x, y) {
    const s = this.tileSize;
    ctx.fillStyle = '#bdc3c7';
    ctx.fillRect(x + 14, y + 6, 4, 54);
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(x + 12, y + 4, 8, 4);

    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(x + 18, y + 8, 38, 12);
    ctx.fillStyle = '#2980b9';
    ctx.fillRect(x + 18, y + 20, 38, 6);
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(x + 18, y + 26, 38, 6);
  }

  drawPotatoFurrow(ctx, x, y, col, row) {
    const s = this.tileSize;
    ctx.fillStyle = '#4a2c14';
    ctx.fillRect(x, y, s, s);

    ctx.fillStyle = '#5c381e';
    ctx.fillRect(x, y + 4, s, 24);
    ctx.fillRect(x, y + 36, s, 24);

    ctx.fillStyle = '#3a8326';
    ctx.fillRect(x + 6, y + 8, 22, 16);
    ctx.fillRect(x + 36, y + 8, 22, 16);
    ctx.fillRect(x + 6, y + 40, 22, 16);
    ctx.fillRect(x + 36, y + 40, 22, 16);

    ctx.fillStyle = '#55a83a';
    ctx.fillRect(x + 10, y + 10, 14, 10);
    ctx.fillRect(x + 40, y + 10, 14, 10);
    ctx.fillRect(x + 10, y + 42, 14, 10);
    ctx.fillRect(x + 40, y + 42, 14, 10);

    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(x + 16, y + 12, 3, 3);
    ctx.fillRect(x + 46, y + 44, 3, 3);
  }

  drawHuertaBed(ctx, x, y, col, row) {
    const s = this.tileSize;
    this.drawDirtPath(ctx, x, y, col, row);

    ctx.fillStyle = '#795548';
    ctx.fillRect(x + 6, y + 6, s - 12, s - 12);
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(x + 10, y + 10, s - 20, s - 20);

    if (col % 2 === 0) {
      for (let cy = 16; cy <= 44; cy += 14) {
        for (let cx = 16; cx <= 44; cx += 14) {
          ctx.fillStyle = '#e67e22';
          ctx.fillRect(x + cx, y + cy + 3, 5, 5);
          ctx.fillStyle = '#27ae60';
          ctx.fillRect(x + cx - 1, y + cy - 2, 7, 4);
        }
      }
    } else {
      for (let cy = 16; cy <= 44; cy += 14) {
        for (let cx = 16; cx <= 44; cx += 14) {
          ctx.fillStyle = '#2ecc71';
          ctx.fillRect(x + cx - 2, y + cy - 2, 10, 10);
          ctx.fillStyle = '#a3e4d7';
          ctx.fillRect(x + cx, y + cy, 6, 6);
        }
      }
    }
  }

  drawWoodenFence(ctx, x, y, col, row) {
    const s = this.tileSize;
    ctx.fillStyle = '#704214';
    ctx.fillRect(x, y + 20, s, 6);
    ctx.fillRect(x, y + 42, s, 6);

    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(x + 6, y + 10, 10, 48);
    ctx.fillRect(x + 38, y + 10, 10, 48);

    ctx.fillStyle = '#a6723e';
    ctx.fillRect(x + 8, y + 8, 6, 4);
    ctx.fillRect(x + 40, y + 8, 6, 4);
  }

  drawBarnRoof(ctx, x, y, col, row) {
    const s = this.tileSize;
    ctx.fillStyle = '#5c2c10';
    ctx.fillRect(x, y, s, s);

    ctx.fillStyle = '#7a3e18';
    for (let ty = 4; ty < s; ty += 12) {
      ctx.fillRect(x, y + ty, s, 6);
    }
  }

  drawBarnWall(ctx, x, y, col, row) {
    const s = this.tileSize;
    ctx.fillStyle = '#52341b';
    ctx.fillRect(x, y, s, s);

    ctx.fillStyle = '#3b2311';
    for (let bx = 0; bx < s; bx += 12) {
      ctx.fillRect(x + bx, y, 2, s);
    }

    if (col === 4 || col === 8) {
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(x + 12, y + 28, 36, 24);
      ctx.fillStyle = '#d4ac0d';
      ctx.fillRect(x + 14, y + 34, 32, 4);
    }
  }

  drawMilkCans(ctx, x, y) {
    const s = this.tileSize;
    ctx.fillStyle = '#bdc3c7';
    ctx.fillRect(x + 10, y + 22, 18, 34);
    ctx.fillRect(x + 13, y + 14, 12, 8);
    ctx.fillStyle = '#95a5a6';
    ctx.fillRect(x + 11, y + 26, 16, 3);
    ctx.fillRect(x + 11, y + 44, 16, 3);

    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(x + 32, y + 26, 18, 30);
    ctx.fillRect(x + 35, y + 18, 12, 8);
    ctx.fillStyle = '#bdc3c7';
    ctx.fillRect(x + 33, y + 30, 16, 3);
  }

  drawWater(ctx, x, y, col, row) {
    const s = this.tileSize;
    ctx.fillStyle = '#2980b9';
    ctx.fillRect(x, y, s, s);

    const offset = Math.sin(this.waterFrame + col + row) * 4;
    ctx.fillStyle = '#5dade2';
    ctx.fillRect(x + 6 + offset, y + 14, 24, 4);
    ctx.fillRect(x + 28 - offset, y + 36, 26, 4);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 12 + offset, y + 16, 10, 2);
    ctx.fillRect(x + 36 - offset, y + 38, 12, 2);
  }

  drawWoodenBridge(ctx, x, y) {
    const s = this.tileSize;
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(x + 6, y, s - 12, s);

    ctx.fillStyle = '#6b401e';
    for (let py = 0; py < s; py += 10) {
      ctx.fillRect(x + 6, y + py, s - 12, 2);
    }

    ctx.fillStyle = '#d4ac0d';
    ctx.fillRect(x + 8, y, 4, s);
    ctx.fillRect(x + s - 12, y, 4, s);
  }

  drawRock(ctx, x, y, col, row) {
    const s = this.tileSize;
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(x + 8, y + 12, 48, 42);
    ctx.fillStyle = '#95a5a6';
    ctx.fillRect(x + 12, y + 16, 36, 22);
    ctx.fillStyle = '#555e60';
    ctx.fillRect(x + 12, y + 42, 40, 10);
  }

  drawTree(ctx, x, y, col, row) {
    const s = this.tileSize;
    ctx.fillStyle = '#5c381e';
    ctx.fillRect(x + 24, y + 32, 16, 28);

    ctx.fillStyle = '#1e5f20';
    ctx.fillRect(x + 8, y + 4, 48, 38);
    ctx.fillStyle = '#2d8630';
    ctx.fillRect(x + 12, y + 8, 40, 28);
    ctx.fillStyle = '#48a84b';
    ctx.fillRect(x + 16, y + 12, 20, 14);

    if ((col + row) % 2 === 0) {
      ctx.fillStyle = '#9b59b6';
      ctx.fillRect(x + 18, y + 16, 4, 4);
      ctx.fillRect(x + 38, y + 24, 4, 4);
    }
  }

  drawSignpost(ctx, x, y) {
    const s = this.tileSize;
    // Wooden post
    ctx.fillStyle = '#6e583c';
    ctx.fillRect(x + 28, y + 24, 8, 36);

    // Sign board
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(x + 8, y + 10, 48, 22);
    ctx.fillStyle = '#d68910';
    ctx.fillRect(x + 10, y + 12, 44, 18);

    // Direction arrow
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HUERTA 👉', x + 32, y + 21);
  }

  drawInvestigationBoard(ctx, x, y) {
    const s = this.tileSize;
    // Rustic field investigation table
    ctx.fillStyle = '#795548';
    ctx.fillRect(x + 8, y + 16, 48, 34);
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(x + 12, y + 46, 6, 14);
    ctx.fillRect(x + 46, y + 46, 6, 14);

    // Open book and magnifying glass on table
    ctx.fillStyle = '#fdfefe';
    ctx.fillRect(x + 16, y + 22, 14, 16);
    ctx.fillRect(x + 30, y + 22, 14, 16);
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(x + 29, y + 22, 2, 16);

    // Golden magnifying glass
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(x + 38, y + 26, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3498db';
    ctx.beginPath();
    ctx.arc(x + 38, y + 26, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCow(ctx, x, y, isWagging = false) {
    const s = this.tileSize;
    const vaca = ObjectSprites.images.vaca;
    if (vaca) {
      const aspect = vaca.width / vaca.height;
      const dh = s * 0.92;
      const dw = dh * aspect;
      const dx = Math.round(x + (s - dw) / 2);
      const dy = Math.round(y + s - dh);

      ctx.save();
      ctx.imageSmoothingEnabled = false;
      if (isWagging) {
        // Voltear la segunda vaca para que miren en direcciones opuestas
        ctx.translate(dx + dw, dy);
        ctx.scale(-1, 1);
        ctx.drawImage(vaca, 0, 0, vaca.width, vaca.height, 0, 0, Math.round(dw), Math.round(dh));
      } else {
        ctx.drawImage(vaca, 0, 0, vaca.width, vaca.height, dx, dy, Math.round(dw), Math.round(dh));
      }
      ctx.restore();
      return;
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 12, y + 20, 36, 24);

    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(x + 16, y + 22, 12, 10);
    ctx.fillRect(x + 34, y + 26, 10, 12);
    ctx.fillRect(x + 22, y + 36, 8, 6);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 6, y + 14, 16, 18);
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(x + 6, y + 14, 8, 8);

    ctx.fillStyle = '#f8a5c2';
    ctx.fillRect(x + 2, y + 22, 8, 10);
    ctx.fillStyle = '#596275';
    ctx.fillRect(x + 4, y + 26, 2, 2);
    ctx.fillRect(x + 4, y + 29, 2, 2);

    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(x + 10, y + 10, 3, 4);
    ctx.fillRect(x + 18, y + 10, 3, 4);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 16, y + 44, 5, 14);
    ctx.fillRect(x + 24, y + 44, 5, 14);
    ctx.fillRect(x + 36, y + 44, 5, 14);
    ctx.fillRect(x + 42, y + 44, 5, 14);

    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(x + 16, y + 56, 5, 4);
    ctx.fillRect(x + 24, y + 56, 5, 4);
    ctx.fillRect(x + 36, y + 56, 5, 4);
    ctx.fillRect(x + 42, y + 56, 5, 4);

    ctx.fillStyle = '#ffffff';
    const tailOff = isWagging ? 4 : 0;
    ctx.fillRect(x + 48, y + 24 + tailOff, 4, 14);
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(x + 47, y + 36 + tailOff, 6, 6);
  }
}
