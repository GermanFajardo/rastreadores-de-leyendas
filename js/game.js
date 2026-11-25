// Core Game Engine for 'Los Rastreadores de Leyendas de San Miguel'
// Multi-screen Architecture with 1 Scenario per Level
// For 3rd Grade Students (I.E.M.R. La Granja - Sede San Miguel, Zipaquirá)

class GameEngine {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.map = new GameMap();

    this.state = 'title'; // 'title', 'playing', 'dialogue', 'activity', 'powers', 'notebook', 'victory'
    this.studentName = 'Estudiante';
    this.avatar = 'tomas'; // 'tomas' or 'valeria'
    this.currentScreenId = 'screen0'; // 'screen0', 'screen1', 'screen2', 'screen3', 'screenFinal'

    // Player character
    this.player = {
      x: 3,
      y: 6,
      targetX: 3,
      targetY: 6,
      prevX: 3,
      prevY: 6,
      pixelX: 3 * TILE_SIZE,
      pixelY: 6 * TILE_SIZE,
      isMoving: false,
      moveProgress: 0,
      direction: 0, // 0: Down, 1: Left, 2: Right, 3: Up
      animFrame: 0,
      animTimer: 0
    };
    Object.defineProperty(this.player, 'dir', {
      get() { return this.direction; },
      set(v) { this.direction = v; }
    });

    // Copo the dog (follows 1 step behind)
    this.copo = {
      x: 3,
      y: 7,
      targetX: 3,
      targetY: 7,
      pixelX: 3 * TILE_SIZE,
      pixelY: 7 * TILE_SIZE,
      isMoving: false,
      moveProgress: 0,
      direction: 3, // Facing Up toward player
      animFrame: 0,
      animTimer: 0
    };
    Object.defineProperty(this.copo, 'dir', {
      get() { return this.direction; },
      set(v) { this.direction = v; }
    });

    // Medals unlocked
    this.unlockedBadges = new Set();

    // Input state
    this.keys = {};

    // Dialogue state
    this.dialogueQueue = [];
    this.currentDialogueSpeaker = 'jacinto';
    this.currentDialogueSpeakerName = 'Abuelo Jacinto';
    this.typewriterText = '';
    this.typewriterIndex = 0;
    this.typewriterTimer = null;
    this.isTyping = false;

    // Toast notification
    this.toastTimer = null;

    // Signpost read gate for Screen 0 & hover tracking
    this.screen0SignRead = false;
    this.hoveredTile = { col: -1, row: -1 };

    // Confetti for victory
    this.confetti = [];

    // Timing
    this.lastTime = performance.now();

    this.bindEvents();
  }

  init() {
    this.canvas.width = MAP_COLS * TILE_SIZE;
    this.canvas.height = MAP_ROWS * TILE_SIZE;
    requestAnimationFrame((t) => this.loop(t));
  }

  bindEvents() {
    // Keyboard inputs
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }

      if (this.state === 'playing') {
        if (e.key === ' ' || e.key === 'Enter') {
          this.interactFacing();
        }
      } else if (this.state === 'dialogue') {
        if (e.key === ' ' || e.key === 'Enter') {
          this.advanceDialogue();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });

    // Canvas click / touch
    this.canvas.addEventListener('click', (e) => {
      if (this.state === 'dialogue') {
        this.advanceDialogue();
        return;
      }
      if (this.state !== 'playing') return;

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      const targetCol = Math.floor(clickX / TILE_SIZE);
      const targetRow = Math.floor(clickY / TILE_SIZE);

      this.handleTileClick(targetCol, targetRow);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.state !== 'playing') {
        this.canvas.style.cursor = 'default';
        return;
      }
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const col = Math.floor(((e.clientX - rect.left) * scaleX) / TILE_SIZE);
      const row = Math.floor(((e.clientY - rect.top) * scaleY) / TILE_SIZE);
      this.hoveredTile = { col, row };

      const interactive = this.isInteractiveTile(col, row);
      this.canvas.style.cursor = interactive ? 'pointer' : 'default';
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoveredTile = { col: -1, row: -1 };
      this.canvas.style.cursor = 'default';
    });

    // Virtual D-pad
    const dpadButtons = document.querySelectorAll('.dpad-btn');
    dpadButtons.forEach((btn) => {
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        const dir = btn.dataset.dir;
        this.handleDpadDirection(dir);
      });
    });

    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
      actionBtn.addEventListener('click', () => {
        if (this.state === 'playing') {
          this.interactFacing();
        } else if (this.state === 'dialogue') {
          this.advanceDialogue();
        }
      });
    }

    // Cover screen "¡Comencemos!" button
    const coverBtn = document.getElementById('btnStartCover');
    if (coverBtn) {
      coverBtn.addEventListener('click', () => {
        Audio.init();
        Audio.playSuccess();
        const coverScreen = document.getElementById('coverScreen');
        const titleScreen = document.getElementById('titleScreen');
        if (coverScreen) coverScreen.classList.add('hidden');
        if (titleScreen) titleScreen.classList.remove('hidden');
      });
    }

    // Title screen start button
    const startBtn = document.getElementById('startGameBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startGameFromTitle());
    }

    // Avatar selector
    const avatarCards = document.querySelectorAll('.avatar-choice');
    avatarCards.forEach((card) => {
      card.addEventListener('click', () => {
        avatarCards.forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
        this.avatar = card.dataset.avatar;
        Audio.playSelect();
      });
    });

    // HUD: Mis Poderes
    const powersBtn = document.getElementById('hudPowersBtn');
    if (powersBtn) {
      powersBtn.addEventListener('click', () => this.openPowersModal());
    }

    const closePowersBtn = document.getElementById('btnClosePowers');
    if (closePowersBtn) {
      closePowersBtn.addEventListener('click', () => {
        document.getElementById('powersModal').classList.add('hidden');
        Speech.stop();
        if (this.state === 'powers') this.state = 'playing';
      });
    }

    const readAllPowersBtn = document.getElementById('btnReadPowersAll');
    if (readAllPowersBtn) {
      readAllPowersBtn.addEventListener('click', () => {
        const text = GAME_DATA.powers.map(p => `${p.name}. ${p.text}`).join(' ');
        Speech.speak(text);
      });
    }

    // HUD: Libro de Leyendas
    const bookBtn = document.getElementById('hudBookBtn');
    if (bookBtn) {
      bookBtn.addEventListener('click', () => this.openNotebook());
    }

    // HUD: Sonido & Música & Voz
    const soundBtn = document.getElementById('hudSoundBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const soundOn = Audio.toggleSound();
        soundBtn.innerHTML = soundOn ? '🔊 Sonido' : '🔇 Silencio';
        soundBtn.classList.toggle('muted', !soundOn);
      });
    }

    const musicBtn = document.getElementById('hudMusicBtn');
    if (musicBtn) {
      musicBtn.addEventListener('click', () => {
        const musicOn = Audio.toggleMusic();
        musicBtn.innerHTML = musicOn ? '🎵 Música' : '🎵 Mute';
        musicBtn.classList.toggle('muted', !musicOn);
      });
    }

    const speechBtn = document.getElementById('hudSpeechBtn');
    if (speechBtn) {
      speechBtn.addEventListener('click', () => {
        const speechOn = Speech.toggle();
        speechBtn.innerHTML = speechOn ? '🗣️ Voz On' : '🗣️ Voz Off';
        speechBtn.classList.toggle('muted', !speechOn);
      });
    }

    // Dialogue TTS button
    const diagTtsBtn = document.getElementById('dialogueTtsBtn');
    if (diagTtsBtn) {
      diagTtsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = document.getElementById('dialogueText').textContent;
        Speech.speak(text);
      });
    }

    // Play again button
    const playAgainBtn = document.getElementById('btnPlayAgain');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => {
        document.getElementById('victoryModal').classList.add('hidden');
        this.loadScreen('screen0');
        this.startScreen0Intro();
      });
    }
  }

  startGameFromTitle() {
    const nameInput = document.getElementById('studentNameInput');
    if (nameInput && nameInput.value.trim() !== '') {
      this.studentName = nameInput.value.trim();
    } else {
      this.studentName = this.avatar === 'tomas' ? 'Tomás' : 'Valeria';
    }

    // Update HUD display
    const hudName = document.getElementById('hudPlayerName');
    if (hudName) hudName.textContent = this.studentName;

    const hudCanvas = document.getElementById('hudPlayerAvatarCanvas');
    if (hudCanvas) {
      const hctx = hudCanvas.getContext('2d');
      SpriteManager.drawPortrait(hctx, this.avatar, 0, 0, 44);
    }

    document.getElementById('titleScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');

    this.state = 'playing';
    Audio.init();
    Audio.playSuccess();
    Audio.startMusic();

    this.loadScreen('screen0');
    this.startScreen0Intro();
  }

  loadScreen(screenId) {
    this.currentScreenId = screenId;
    this.map.setScreen(screenId);
    if (screenId === 'screen0') {
      this.screen0SignRead = false;
    }

    // Update stage name in HUD
    const stageNames = {
      screen0: 'Escuela San Miguel',
      screen1: 'Nivel 1: Huerta',
      screen2: 'Nivel 2: Establo',
      screen3: 'Nivel 3: Quebrada',
      screenFinal: 'Celebración San Miguel'
    };
    const stageNameEl = document.getElementById('hudCurrentStageName');
    if (stageNameEl) stageNameEl.textContent = stageNames[screenId] || 'San Miguel';

    // Position player and Copo per screen
    if (screenId === 'screen0') {
      this.player.x = 3;
      this.player.y = 5;
      this.player.direction = 2; // Facing right
      this.copo.x = 2;
      this.copo.y = 4;
      this.copo.direction = 2;
    } else if (screenId === 'screen1') {
      this.player.x = 1;
      this.player.y = 4;
      this.player.direction = 2;
      this.copo.x = 0;
      this.copo.y = 4;
      this.copo.direction = 2;
      this.showToast('¡Llegaste a la Huerta Escolar! Acércate al tablero de pistas (📌).');
    } else if (screenId === 'screen2') {
      this.player.x = 1;
      this.player.y = 4;
      this.player.direction = 2;
      this.copo.x = 0;
      this.copo.y = 4;
      this.copo.direction = 2;
      this.showToast('¡Llegaste al Establo Lechero! Habla con Don Rigoberto (👨‍🌾).');
    } else if (screenId === 'screen3') {
      this.player.x = 1;
      this.player.y = 4;
      this.player.direction = 2;
      this.copo.x = 0;
      this.copo.y = 4;
      this.copo.direction = 2;
      this.showToast('¡Llegaste a la Quebrada! Habla con el Abuelo Jacinto (👴).');
    } else if (screenId === 'screenFinal') {
      this.player.x = 5;
      this.player.y = 6;
      this.player.direction = 0;
      this.copo.x = 5;
      this.copo.y = 7;
      this.copo.direction = 3;
      this.triggerFinalCelebration();
    }

    this.player.pixelX = this.player.x * TILE_SIZE;
    this.player.pixelY = this.player.y * TILE_SIZE;
    this.player.prevX = this.player.x;
    this.player.prevY = this.player.y;
    this.player.isMoving = false;

    this.copo.pixelX = this.copo.x * TILE_SIZE;
    this.copo.pixelY = this.copo.y * TILE_SIZE;
    this.copo.prevX = this.copo.x;
    this.copo.prevY = this.copo.y;
    this.copo.isMoving = false;
  }

  startScreen0Intro() {
    const dialogs = GAME_DATA.levels.screen0.dialogues.map((d) => ({
      speaker: d.speaker,
      speakerName: d.speakerName,
      text: d.text.replace(/\{name\}/g, this.studentName)
    }));
    this.startDialogueSequence(dialogs);
  }

  loop(currentTime) {
    const delta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(delta);
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(delta) {
    this.map.update(delta);

    if (this.state === 'playing') {
      this.handlePlayerInput();
      this.updateMovement(delta);
      this.checkScreenTransitions();
    }

    if (this.currentScreenId === 'screenFinal') {
      this.updateConfetti(delta);
    }
  }

  handlePlayerInput() {
    if (this.player.isMoving) return;

    let dx = 0;
    let dy = 0;

    if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
      dy = -1;
      this.player.direction = 3; // Up
    } else if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
      dy = 1;
      this.player.direction = 0; // Down
    } else if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
      dx = -1;
      this.player.direction = 1; // Left (Fila 1 volteada horizontalmente)
      this.copo.direction = 1;
    } else if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
      dx = 1;
      this.player.direction = 2; // Right (Fila 1 normal)
      this.copo.direction = 2;
    }

    if (dx !== 0 || dy !== 0) {
      this.tryMovePlayer(this.player.x + dx, this.player.y + dy);
    }
  }

  handleDpadDirection(dir) {
    if (this.player.isMoving || this.state !== 'playing') return;

    let dx = 0;
    let dy = 0;
    if (dir === 'up') {
      dy = -1;
      this.player.direction = 3;
    } else if (dir === 'down') {
      dy = 1;
      this.player.direction = 0;
    } else if (dir === 'left') {
      dx = -1;
      this.player.direction = 1;
      this.copo.direction = 1;
    } else if (dir === 'right') {
      dx = 1;
      this.player.direction = 2;
      this.copo.direction = 2;
    }
 
    if (dx !== 0 || dy !== 0) {
      this.tryMovePlayer(this.player.x + dx, this.player.y + dy);
    }
  }

  handleTileClick(col, row) {
    if (this.player.isMoving || this.state !== 'playing') return;

    const dx = col - this.player.x;
    const dy = row - this.player.y;

    // Check adjacent click
    if (Math.abs(dx) + Math.abs(dy) === 1) {
      if (dx === 1) {
        this.player.direction = 2;
        this.copo.direction = 2;
      } else if (dx === -1) {
        this.player.direction = 1;
        this.copo.direction = 1;
      } else if (dy === 1) {
        this.player.direction = 0;
      } else if (dy === -1) {
        this.player.direction = 3;
      }

      if (this.checkInteractAt(col, row)) {
        return;
      }
      this.tryMovePlayer(col, row);
    } else {
      // If clicked directly on the interactive object/NPC
      this.checkInteractAt(col, row);
    }
  }

  tryMovePlayer(targetX, targetY) {
    if (!this.map.isWalkable(targetX, targetY)) {
      return;
    }

    // Gate exit in Screen 0 until player clicks & reads the wooden signpost (10, 4)
    if (this.currentScreenId === 'screen0' && !this.screen0SignRead) {
      if (targetX >= 11 || (targetX === 10 && targetY === 4)) {
        Audio.playError();
        this.showToast('Debes hacer clic en el aviso para avanzar');
        return;
      }
    }

    // Check NPC collisions
    const npcs = this.getScreenNpcs();
    for (const npc of npcs) {
      if (npc.x === targetX && npc.y === targetY) {
        return;
      }
    }

    // Save previous for Copo follower
    this.player.prevX = this.player.x;
    this.player.prevY = this.player.y;

    this.player.targetX = targetX;
    this.player.targetY = targetY;
    this.player.isMoving = true;
    this.player.moveProgress = 0;

    // Copo steps into player's previous tile
    this.copo.targetX = this.player.prevX;
    this.copo.targetY = this.player.prevY;
    this.copo.isMoving = true;
    this.copo.moveProgress = 0;

    // Dirección de Copo:
    // Cuando el jugador se mueve horizontalmente (izquierda o derecha),
    // Copo adopta exactamente la misma dirección del jugador (copo.dir = player.dir)
    if (this.player.dir === 1 || this.player.dir === 2) {
      this.copo.dir = this.player.dir;
    } else {
      const cdx = this.copo.targetX - this.copo.x;
      const cdy = this.copo.targetY - this.copo.y;
      if (cdx > 0) this.copo.dir = 2; // Right
      else if (cdx < 0) this.copo.dir = 1; // Left
      else if (cdy > 0) this.copo.dir = 0; // Down
      else if (cdy < 0) this.copo.dir = 3; // Up
      else this.copo.dir = this.player.dir;
    }

    Audio.playStep();
  }

  updateMovement(delta) {
    const moveSpeed = 4.5;

    // Sincronización continua de Copo: copo.dir = player.dir en horizontal
    if (this.player.dir === 1 || this.player.dir === 2) {
      this.copo.dir = this.player.dir;
    }

    if (this.player.isMoving) {
      this.player.moveProgress += delta * moveSpeed;
      this.player.animTimer += delta * 10;
      this.player.animFrame = Math.floor(this.player.animTimer) % 4;

      if (this.player.moveProgress >= 1) {
        this.player.moveProgress = 1;
        this.player.isMoving = false;
        this.player.x = this.player.targetX;
        this.player.y = this.player.targetY;
        this.player.pixelX = this.player.x * TILE_SIZE;
        this.player.pixelY = this.player.y * TILE_SIZE;
        this.player.animFrame = 0;
      } else {
        this.player.pixelX = (this.player.prevX + (this.player.targetX - this.player.prevX) * this.player.moveProgress) * TILE_SIZE;
        this.player.pixelY = (this.player.prevY + (this.player.targetY - this.player.prevY) * this.player.moveProgress) * TILE_SIZE;
      }
    }

    if (this.copo.isMoving) {
      this.copo.moveProgress += delta * moveSpeed;
      this.copo.animTimer += delta * 10;
      this.copo.animFrame = Math.floor(this.copo.animTimer) % 4;

      if (this.copo.moveProgress >= 1) {
        this.copo.moveProgress = 1;
        this.copo.isMoving = false;
        this.copo.x = this.copo.targetX;
        this.copo.y = this.copo.targetY;
        this.copo.pixelX = this.copo.x * TILE_SIZE;
        this.copo.pixelY = this.copo.y * TILE_SIZE;
        this.copo.animFrame = 0;
      } else {
        const startX = this.copo.x * TILE_SIZE;
        const startY = this.copo.y * TILE_SIZE;
        const endX = this.copo.targetX * TILE_SIZE;
        const endY = this.copo.targetY * TILE_SIZE;
        this.copo.pixelX = startX + (endX - startX) * this.copo.moveProgress;
        this.copo.pixelY = startY + (endY - startY) * this.copo.moveProgress;
      }
    }
  }

  checkScreenTransitions() {
    // In Screen 0, walking to the right border exits to Screen 1 (Huerta) once signpost is read
    if (this.currentScreenId === 'screen0') {
      if (this.player.x >= 11 || (this.player.x === 10 && this.player.y === 4)) {
        if (!this.screen0SignRead) {
          this.showToast('Debes hacer clic en el aviso para avanzar');
          return;
        }
        Audio.playSuccess();
        this.loadScreen('screen1');
      }
    }
  }

  interactFacing() {
    let cx = this.player.x;
    let cy = this.player.y;

    if (this.player.direction === 0) cy += 1;
    else if (this.player.direction === 1) cx -= 1;
    else if (this.player.direction === 2) cx += 1;
    else if (this.player.direction === 3) cy -= 1;

    if (!this.checkInteractAt(cx, cy)) {
      this.checkInteractAt(this.player.x, this.player.y);
    }
  }

  checkInteractAt(x, y) {
    if (this.currentScreenId === 'screen0') {
      // Abuelo Jacinto at (2, 5) or Lucía at (5, 5)
      if (x === 2 && y === 5) {
        this.startDialogue({
          speaker: 'jacinto',
          speakerName: 'Abuelo Jacinto',
          text: `¡Vamos, ${this.studentName}! Camina hacia la derecha donde está el letrero para entrar a la huerta escolar.`
        });
        return true;
      }
      if (x === 5 && y === 5) {
        this.startDialogue({
          speaker: 'lucia',
          speakerName: 'Profesora Lucía',
          text: 'Recuerda usar el botón "Mis Poderes" en cualquier momento si quieres repasar los 4 superpoderes.'
        });
        return true;
      }
      if (x === 10 && y === 4) {
        // Signpost (aviso.png)
        if (!this.screen0SignRead) {
          this.screen0SignRead = true;
          Audio.playSuccess();
          this.startDialogue({
            speaker: 'jacinto',
            speakerName: 'Aviso de la Vereda',
            text: '📍 "Cultivos de Papa y Huerta Escolar ->". ¡Paso desbloqueado! Ahora avanza hacia la derecha para iniciar la Misión 1.'
          });
        } else {
          Audio.playSuccess();
          this.loadScreen('screen1');
        }
        return true;
      }
    } else if (this.currentScreenId === 'screen1') {
      // Investigation board at (6, 4)
      if (Math.abs(x - 6) <= 1 && Math.abs(y - 4) <= 1) {
        this.openLevel1Activity();
        return true;
      }
    } else if (this.currentScreenId === 'screen2') {
      // Don Rigoberto at (5, 4)
      if (Math.abs(x - 5) <= 1 && Math.abs(y - 4) <= 1) {
        this.openLevel2Activity();
        return true;
      }
    } else if (this.currentScreenId === 'screen3') {
      // Abuelo Jacinto at (4, 4)
      if (Math.abs(x - 4) <= 1 && Math.abs(y - 4) <= 1) {
        this.openLevel3Activity();
        return true;
      }
    }
    return false;
  }

  // --- Dialogue System ---
  startDialogueSequence(dialogueList) {
    this.state = 'dialogue';
    this.dialogueQueue = [...dialogueList];
    document.getElementById('dialogueBox').classList.remove('hidden');
    this.showNextDialogue();
  }

  startDialogue(dialogueObj) {
    this.startDialogueSequence([dialogueObj]);
  }

  showNextDialogue() {
    if (this.dialogueQueue.length === 0) {
      this.closeDialogue();
      return;
    }

    const d = this.dialogueQueue.shift();
    this.currentDialogueSpeaker = d.speaker;
    this.currentDialogueSpeakerName = d.speakerName;

    const speakerNameEl = document.getElementById('dialogueSpeakerName');
    const speakerCanvas = document.getElementById('dialogueSpeakerCanvas');
    const textEl = document.getElementById('dialogueText');

    speakerNameEl.textContent = d.speakerName;
    if (speakerCanvas) {
      const sctx = speakerCanvas.getContext('2d');
      SpriteManager.drawPortrait(sctx, d.speaker, 0, 0, 44);
    }

    this.typewriterText = d.text;
    this.typewriterIndex = 0;
    textEl.textContent = '';
    this.isTyping = true;

    if (this.typewriterTimer) clearInterval(this.typewriterTimer);

    // Read aloud automatically
    Speech.speak(d.text);

    this.typewriterTimer = setInterval(() => {
      if (this.typewriterIndex < this.typewriterText.length) {
        textEl.textContent += this.typewriterText[this.typewriterIndex];
        if (this.typewriterIndex % 2 === 0) {
          Audio.playBlip(this.currentDialogueSpeaker);
        }
        this.typewriterIndex++;
      } else {
        clearInterval(this.typewriterTimer);
        this.isTyping = false;
      }
    }, 28);
  }

  advanceDialogue() {
    if (this.isTyping) {
      clearInterval(this.typewriterTimer);
      document.getElementById('dialogueText').textContent = this.typewriterText;
      this.isTyping = false;
    } else {
      this.showNextDialogue();
    }
  }

  closeDialogue() {
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);
    Speech.stop();
    document.getElementById('dialogueBox').classList.add('hidden');
    this.state = 'playing';
  }

  // --- Modal "Mis Poderes" ---
  openPowersModal() {
    Audio.playSelect();
    Speech.stop();
    document.getElementById('powersModal').classList.remove('hidden');
    this.state = 'powers';
  }

  // --- Nivel 1 Activity: Lectura Literal + Descomponer ---
  openLevel1Activity() {
    this.state = 'activity';
    Audio.playSelect();
    Speech.stop();

    const modal = document.getElementById('activityModal');
    modal.classList.remove('hidden');

    const titleEl = document.getElementById('actTitle');
    const diffEl = document.getElementById('actDifficulty');
    const contentEl = document.getElementById('actContent');

    const lvlData = GAME_DATA.levels.screen1;
    titleEl.textContent = 'NIVEL 1: CULTIVO DE PAPA Y HUERTA ESCOLAR';
    diffEl.textContent = 'Dificultad Fácil: Lectura Literal + Descomponer';

    // Step 1: Tarjeta educativa previa
    this.renderPreReadingCard(lvlData.cardPrevia, () => {
      // Step 2: Lectura completa
      this.renderStoryCard(lvlData.story, () => {
        // Step 3: Reto de las 4 Cajas de Descomposición
        this.renderLevel1BoxesChallenge(lvlData, contentEl);
      });
    });
  }

  renderPreReadingCard(cardData, onContinue) {
    const contentEl = document.getElementById('actContent');
    contentEl.innerHTML = `
      <div class="card-previa-box">
        <div class="previa-header">
          <span class="badge-tag">🎯 TU MISIÓN ANTES DE LEER</span>
          <h3>${cardData.title}</h3>
        </div>

        <div class="previa-body">
          <div class="previa-item">
            <strong>📖 Tu reto de lectura (Nivel Literal):</strong>
            <p>"${cardData.reto}"</p>
          </div>

          <div class="previa-item highlight">
            <strong>🧩 Tu superpoder (Descomponer):</strong>
            <p>"${cardData.superpoder}"</p>
          </div>
        </div>

        <div class="previa-actions">
          <button id="btnReadPrevia" class="retro-btn secondary-btn">🔊 Escuchar instrucción</button>
          <button id="btnContinueToStory" class="retro-btn primary-btn large-btn">¡VAMOS A LEER EL CUENTO! ➡️</button>
        </div>
      </div>
    `;

    document.getElementById('btnReadPrevia').onclick = () => {
      Speech.speak(`Tu reto de lectura: ${cardData.reto}. Tu superpoder: ${cardData.superpoder}`);
    };

    document.getElementById('btnContinueToStory').onclick = () => {
      Audio.playSelect();
      onContinue();
    };
  }

  renderStoryCard(storyData, onContinue) {
    const contentEl = document.getElementById('actContent');
    contentEl.innerHTML = `
      <div class="story-reading-box">
        <div class="story-header">
          <h3>${storyData.title}</h3>
          <button id="btnReadStoryFull" class="retro-btn secondary-btn small-btn">🔊 Escuchar lectura completa</button>
        </div>

        <div class="story-text">
          ${storyData.paragraphs.map(p => `<p class="large-story-p">${p}</p>`).join('')}
        </div>

        <button id="btnStartChallenge" class="retro-btn primary-btn large-btn">
          ¡LISTO, VAMOS AL RETO DE LAS 4 CAJAS! 🧩
        </button>
      </div>
    `;

    document.getElementById('btnReadStoryFull').onclick = () => {
      Speech.speak(storyData.paragraphs.join(' '));
    };

    document.getElementById('btnStartChallenge').onclick = () => {
      Audio.playSelect();
      onContinue();
    };
  }

  renderLevel1BoxesChallenge(lvlData, container) {
    // 4 Cajas y 4 Tarjetas para ubicar
    const boxes = lvlData.reto.boxes;
    const cardsPool = [
      { id: 1, text: "Cerca de los ríos, los barrancos y las fincas del campo." },
      { id: 2, text: "Un sombrero gigante y una guitarra chiquita." },
      { id: 3, text: "Esconde palas, mueve ollas y hace trenzas a las colas de los caballos." },
      { id: 4, text: "Dejando una guitarra afinada junto a la puerta de la casa." }
    ];

    // Shuffled cards for child to assign
    const shuffledCards = [...cardsPool].sort(() => Math.random() - 0.5);

    let assigned = { 1: null, 2: null, 3: null, 4: null };
    let selectedCard = null;

    const render = () => {
      container.innerHTML = `
        <div class="challenge-board">
          <p class="challenge-instruction">
            <strong>🧩 Reto de Descomposición:</strong> Ubica cada respuesta en su caja correspondiente haciendo clic en la tarjeta y luego en la caja:
          </p>

          <div class="cards-pool-container">
            <h4>Tarjetas de respuestas:</h4>
            <div class="cards-flex">
              ${shuffledCards.map(c => {
                const isPlaced = Object.values(assigned).includes(c.id);
                const isSelected = selectedCard === c.id;
                return `
                  <button class="answer-card-btn ${isPlaced ? 'placed' : ''} ${isSelected ? 'selected' : ''}" 
                          data-id="${c.id}" ${isPlaced ? 'disabled' : ''}>
                    « ${c.text} »
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <div class="boxes-grid">
            ${boxes.map(b => {
              const assignedCardId = assigned[b.id];
              const cardObj = assignedCardId ? cardsPool.find(c => c.id === assignedCardId) : null;
              return `
                <div class="box-slot ${assignedCardId ? 'filled' : 'empty'}" data-box="${b.id}">
                  <div class="box-title">${b.title}</div>
                  <div class="box-content">
                    ${cardObj ? `<strong>✅ Respuesta:</strong> ${cardObj.text}` : '<span class="drop-hint">Haz clic aquí para ubicar la respuesta</span>'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div id="boxFeedback" class="feedback-box hidden"></div>
        </div>
      `;

      // Event handlers
      container.querySelectorAll('.answer-card-btn:not(.placed)').forEach(btn => {
        btn.onclick = () => {
          selectedCard = parseInt(btn.dataset.id);
          Audio.playSelect();
          render();
        };
      });

      container.querySelectorAll('.box-slot').forEach(slot => {
        slot.onclick = () => {
          const boxId = parseInt(slot.dataset.box);
          if (selectedCard !== null) {
            // Check if correct
            const targetBox = boxes.find(b => b.id === boxId);
            const cardObj = cardsPool.find(c => c.id === selectedCard);

            if (cardObj.id === boxId) {
              Audio.playSuccess();
              assigned[boxId] = selectedCard;
              selectedCard = null;
              render();

              // Check if all 4 are completed
              if (Object.values(assigned).every(v => v !== null)) {
                this.celebrateLevelComplete(1, 'ojo_lince', 'Medalla Ojo de Lince 👁️', 'screen2');
              }
            } else {
              Audio.playError();
              const fb = document.getElementById('boxFeedback');
              fb.className = 'feedback-box error-feedback';
              fb.innerHTML = `<strong>¡Atento!</strong> Lee bien la pregunta: «${targetBox.title}». Esa tarjeta no responde a esa pregunta. ¡Inténtalo de nuevo!`;
              fb.classList.remove('hidden');
              Speech.speak(`Atento. Lee bien: ${targetBox.title}. Esa no es la respuesta correcta.`);
            }
          }
        };
      });
    };

    render();
  }

  // --- Nivel 2 Activity: Lectura Inferencial + Buscar Patrones ---
  openLevel2Activity() {
    this.state = 'activity';
    Audio.playSelect();
    Speech.stop();

    const modal = document.getElementById('activityModal');
    modal.classList.remove('hidden');

    const titleEl = document.getElementById('actTitle');
    const diffEl = document.getElementById('actDifficulty');
    const contentEl = document.getElementById('actContent');

    const lvlData = GAME_DATA.levels.screen2;
    titleEl.textContent = 'NIVEL 2: POTREROS Y ESTABLO LECHERO';
    diffEl.textContent = 'Dificultad Media: Lectura Inferencial + Buscar Patrones';

    // Step 1: Previa
    this.renderPreReadingCard(lvlData.cardPrevia, () => {
      // Step 2: Lectura
      this.renderStoryCard(lvlData.story, () => {
        // Step 3: Reto en 2 pasos
        this.renderLevel2Challenge(lvlData, contentEl);
      });
    });
  }

  renderLevel2Challenge(lvlData, container) {
    let selectedClues = new Set();
    const p1 = lvlData.reto.paso1;

    const renderPaso1 = () => {
      container.innerHTML = `
        <div class="challenge-board">
          <div class="step-indicator">PASO 1 DE 2: Unir pistas escondidas</div>
          <p class="challenge-instruction">
            <strong>🔍 ${p1.instruction}</strong> (Marca las 3 que explican el cambio del río):
          </p>

          <div class="clues-options-list">
            ${p1.options.map(opt => `
              <button class="clue-check-btn ${selectedClues.has(opt.id) ? 'checked' : ''}" data-id="${opt.id}">
                <span class="chk-box">${selectedClues.has(opt.id) ? '☑️' : '⬜'}</span>
                <span class="chk-text">${opt.text}</span>
              </button>
            `).join('')}
          </div>

          <button id="btnVerifyPaso1" class="retro-btn primary-btn large-btn" ${selectedClues.size !== 3 ? 'disabled' : ''}>
            ¡VERIFICAR MIS 3 PISTAS! 🔍
          </button>

          <div id="p1Feedback" class="feedback-box hidden"></div>
        </div>
      `;

      container.querySelectorAll('.clue-check-btn').forEach(btn => {
        btn.onclick = () => {
          const id = btn.dataset.id;
          if (selectedClues.has(id)) {
            selectedClues.delete(id);
          } else {
            if (selectedClues.size < 3) {
              selectedClues.add(id);
            }
          }
          Audio.playSelect();
          renderPaso1();
        };
      });

      const verifyBtn = document.getElementById('btnVerifyPaso1');
      if (verifyBtn) {
        verifyBtn.onclick = () => {
          const isCorrect = selectedClues.has('p1') && selectedClues.has('p2') && selectedClues.has('p3');
          const fb = document.getElementById('p1Feedback');

          if (isCorrect) {
            Audio.playSuccess();
            fb.className = 'feedback-box success-feedback';
            fb.innerHTML = '<strong>¡PISTAS PERFECTAS! ⭐</strong> Has unido los patrones: gritos y basura + atrapar pececitos = el río rugió enfurecido.';
            fb.classList.remove('hidden');
            Speech.speak('¡Pistas perfectas! Ahora vamos a las 2 preguntas de detective.');

            setTimeout(() => {
              renderPaso2();
            }, 2500);
          } else {
            Audio.playError();
            fb.className = 'feedback-box error-feedback';
            fb.innerHTML = '<strong>Piénsalo bien:</strong> ¿Cómo se ve el Mohán no explica por qué cambió el agua. Busca las 3 cosas que hicieron los hombres y lo que pasó en el río.';
            fb.classList.remove('hidden');
            Speech.speak('Revisa tus pistas: el físico del Mohán no causó los remolinos.');
          }
        };
      }
    };

    const renderPaso2 = () => {
      const qList = lvlData.reto.paso2.questions;
      let qIndex = 0;

      const showQuestion = () => {
        const q = qList[qIndex];
        container.innerHTML = `
          <div class="challenge-board">
            <div class="step-indicator">PASO 2 DE 2: Preguntas de Detective (${qIndex + 1} de ${qList.length})</div>
            <p class="question-large"><strong>🕵️ ${q.question}</strong></p>

            <div class="options-vertical">
              ${q.options.map((opt, i) => `
                <button class="opt-choice-btn" data-correct="${opt.correct}">
                  <strong>${i + 1}.</strong> ${opt.text}
                </button>
              `).join('')}
            </div>

            <div id="qFeedback" class="feedback-box hidden"></div>
          </div>
        `;

        container.querySelectorAll('.opt-choice-btn').forEach(btn => {
          btn.onclick = () => {
            const isCorrect = btn.dataset.correct === 'true';
            const fb = document.getElementById('qFeedback');

            if (isCorrect) {
              Audio.playSuccess();
              fb.className = 'feedback-box success-feedback';
              fb.innerHTML = '<strong>¡DEDUCCIÓN BRILLANTE! ⭐</strong> Encontraste el significado oculto de las pistas.';
              fb.classList.remove('hidden');
              Speech.speak('¡Deducción brillante!');

              setTimeout(() => {
                qIndex++;
                if (qIndex < qList.length) {
                  showQuestion();
                } else {
                  this.celebrateLevelComplete(2, 'detective', 'Medalla del Detective 🔍', 'screen3');
                }
              }, 2200);
            } else {
              Audio.playError();
              fb.className = 'feedback-box error-feedback';
              fb.innerHTML = '<strong>Vuelve a mirar las pistas:</strong> Recuerda lo que hicieron los hombres y cómo reaccionaron al final.';
              fb.classList.remove('hidden');
              Speech.speak('Intenta de nuevo. Conecta las pistas de la lectura.');
            }
          };
        });
      };

      showQuestion();
    };

    renderPaso1();
  }

  // --- Nivel 3 Activity: Lectura Crítica + Limpiar Errores y Sacar la Idea Principal ---
  openLevel3Activity() {
    this.state = 'activity';
    Audio.playSelect();
    Speech.stop();

    const modal = document.getElementById('activityModal');
    modal.classList.remove('hidden');

    const titleEl = document.getElementById('actTitle');
    const diffEl = document.getElementById('actDifficulty');
    const contentEl = document.getElementById('actContent');

    const lvlData = GAME_DATA.levels.screen3;
    titleEl.textContent = 'NIVEL 3: QUEBRADA Y BOSQUE ALTO';
    diffEl.textContent = 'Dificultad Retadora: Lectura Crítica + Limpiar Errores';

    // Step 1: Previa
    this.renderPreReadingCard(lvlData.cardPrevia, () => {
      // Step 2: Lectura
      this.renderStoryCard(lvlData.story, () => {
        // Step 3: Reto en 2 pasos
        this.renderLevel3Challenge(lvlData, contentEl);
      });
    });
  }

  renderLevel3Challenge(lvlData, container) {
    const p1 = lvlData.reto.paso1;
    let cleanedSet = new Set();

    const renderPaso1 = () => {
      container.innerHTML = `
        <div class="challenge-board">
          <div class="step-indicator">PASO 1 DE 2: Limpiar Errores (Depuración)</div>
          <p class="challenge-instruction">
            <strong>🧹 ${p1.instruction}</strong>
          </p>

          <div class="cleaning-cards-list">
            ${p1.phrases.map(f => {
              const isCleaned = cleanedSet.has(f.id);
              return `
                <div class="cleaning-card ${isCleaned ? 'cleaned' : ''}">
                  <div class="cleaning-text">« ${f.text} »</div>
                  <div class="cleaning-actions">
                    ${isCleaned ? `
                      <span class="cleaned-tag">🗑️ ¡LIMPIADA EN EL BASURERO!</span>
                    ` : `
                      <button class="retro-btn danger-btn btn-clean" data-id="${f.id}">🗑️ Limpiar (Basurero)</button>
                      <button class="retro-btn success-btn btn-keep" data-id="${f.id}">🌿 Conservar (Verdad)</button>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div id="p1Fb" class="feedback-box hidden"></div>
        </div>
      `;

      container.querySelectorAll('.btn-clean').forEach(btn => {
        btn.onclick = () => {
          const id = btn.dataset.id;
          const phrase = p1.phrases.find(p => p.id === id);
          const fb = document.getElementById('p1Fb');

          if (phrase.shouldClean) {
            Audio.playTone(880, 'sawtooth', 0.15, 0.1);
            cleanedSet.add(id);
            renderPaso1();

            if (cleanedSet.size === 2) {
              Audio.playSuccess();
              Speech.speak('¡Excelente! Has limpiado las 2 ideas falsas. Ahora vamos a sacar la idea principal.');
              setTimeout(() => {
                renderPaso2();
              }, 2200);
            }
          } else {
            Audio.playError();
            fb.className = 'feedback-box error-feedback';
            fb.innerHTML = '<strong>¡Cuidado!</strong> Esa frase es una verdad ecológica sobre los árboles y páramos. ¡Esa no se limpia, se conserva!';
            fb.classList.remove('hidden');
            Speech.speak('¡Cuidado! Esa frase es una verdad que debemos conservar.');
          }
        };
      });

      container.querySelectorAll('.btn-keep').forEach(btn => {
        btn.onclick = () => {
          const id = btn.dataset.id;
          const phrase = p1.phrases.find(p => p.id === id);
          const fb = document.getElementById('p1Fb');

          if (!phrase.shouldClean) {
            Audio.playTone(660, 'triangle', 0.15, 0.1);
            fb.className = 'feedback-box success-feedback';
            fb.innerHTML = '<strong>¡Exacto!</strong> Esta es la gran verdad: los árboles y páramos son esponjas de vida.';
            fb.classList.remove('hidden');
            Speech.speak('¡Exacto! Esa verdad se conserva.');
          } else {
            Audio.playError();
            fb.className = 'feedback-box error-feedback';
            fb.innerHTML = '<strong>Esa idea es falsa o dañina:</strong> No podemos conservar ideas que destruyan el bosque. ¡Tírala al basurero!';
            fb.classList.remove('hidden');
            Speech.speak('Esa idea es dañina. Tírala al basurero.');
          }
        };
      });
    };

    const renderPaso2 = () => {
      const qList = lvlData.reto.paso2.questions;
      let qIndex = 0;

      const showQuestion = () => {
        const q = qList[qIndex];
        container.innerHTML = `
          <div class="challenge-board">
            <div class="step-indicator">PASO 2 DE 2: Sacar la Idea Principal (${qIndex + 1} de ${qList.length})</div>
            <p class="question-large"><strong>💡 ${q.question}</strong></p>

            <div class="options-vertical">
              ${q.options.map((opt, i) => `
                <button class="opt-choice-btn" data-correct="${opt.correct}">
                  <strong>${i + 1}.</strong> ${opt.text}
                </button>
              `).join('')}
            </div>

            <div id="qFeedback" class="feedback-box hidden"></div>
          </div>
        `;

        container.querySelectorAll('.opt-choice-btn').forEach(btn => {
          btn.onclick = () => {
            const isCorrect = btn.dataset.correct === 'true';
            const fb = document.getElementById('qFeedback');

            if (isCorrect) {
              Audio.playSuccess();
              fb.className = 'feedback-box success-feedback';
              fb.innerHTML = '<strong>¡RESPUESTA BRILLANTE! ⭐</strong> Has descubierto el valor real de cuidar la naturaleza.';
              fb.classList.remove('hidden');
              Speech.speak('¡Respuesta brillante!');

              setTimeout(() => {
                qIndex++;
                if (qIndex < qList.length) {
                  showQuestion();
                } else {
                  this.celebrateLevelComplete(3, 'guardian_bosque', 'Medalla Guardián del Bosque 🌿', 'screenFinal');
                }
              }, 2200);
            } else {
              Audio.playError();
              fb.className = 'feedback-box error-feedback';
              fb.innerHTML = '<strong>Vuelve a reflexionar:</strong> La leyenda busca que cuidemos nuestro entorno, no que nos quedemos de brazos cruzados.';
              fb.classList.remove('hidden');
              Speech.speak('Reflexiona: ¿cómo nos enseña la leyenda a cuidar nuestra vereda?');
            }
          };
        });
      };

      showQuestion();
    };

    renderPaso1();
  }

  // --- Celebración de Fin de Nivel ---
  celebrateLevelComplete(levelNum, badgeId, badgeName, nextScreenId) {
    this.unlockedBadges.add(badgeId);
    this.updateHudBadges();
    Audio.playVictory();

    const contentEl = document.getElementById('actContent');
    contentEl.innerHTML = `
      <div class="level-complete-celebration">
        <div class="trophy-bounce">🏅</div>
        <h2>¡NIVEL ${levelNum} COMPLETADO CON ÉXITO!</h2>
        <p class="award-text">Has obtenido la <strong>${badgeName}</strong>.</p>
        <p class="praise-text">¡Aplicaste tus superpoderes como todo un científico y lector de Zipaquirá!</p>

        <button id="btnAdvanceToNextScreen" class="retro-btn primary-btn large-btn">
          ${nextScreenId === 'screenFinal' ? '🎉 ¡IR A LA GRAN FIESTA EN LA ESCUELA! 🎉' : `🚀 ¡AVANZAR AL NIVEL ${levelNum + 1}! 🚀`}
        </button>
      </div>
    `;

    Speech.speak(`¡Felicitaciones! Has completado el nivel ${levelNum} y ganado la ${badgeName}.`);

    document.getElementById('btnAdvanceToNextScreen').onclick = () => {
      document.getElementById('activityModal').classList.add('hidden');
      this.state = 'playing';
      this.loadScreen(nextScreenId);
    };
  }

  updateHudBadges() {
    GAME_DATA.badges.forEach(b => {
      const slot = document.getElementById(`badge_${b.id}`);
      if (slot && this.unlockedBadges.has(b.id)) {
        slot.classList.remove('locked');
        slot.classList.add('unlocked');
        slot.title = `${b.name} - ${b.level}`;
      }
    });
  }

  // --- Gran Celebración Final ---
  triggerFinalCelebration() {
    this.state = 'victory';
    Audio.playVictory();
    this.initConfetti();

    const victoryModal = document.getElementById('victoryModal');
    victoryModal.classList.remove('hidden');

    document.getElementById('victoryStudentName').textContent = this.studentName;

    // Dibujar los avatares de felicitación usando SpriteManager.drawAvatar
    ['jacinto', 'copo', 'rigoberto', 'lucia'].forEach(name => {
      const c = document.getElementById(`cheerCanvas_${name}`);
      if (c) {
        SpriteManager.drawAvatar(c.getContext('2d'), name, c.width, c.height, 0, 0);
      }
    });

    Speech.speak(`¡Felicitaciones, ${this.studentName}! Has completado las 3 leyendas colombianas y ganado tus 3 Medallas de Honor.`);

    document.getElementById('btnOpenBookFromVictory').onclick = () => {
      victoryModal.classList.add('hidden');
      this.openNotebook();
    };
  }

  initConfetti() {
    this.confetti = [];
    const colors = ['#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#ffffff'];
    for (let i = 0; i < 90; i++) {
      this.confetti.push({
        x: Math.random() * (MAP_COLS * TILE_SIZE),
        y: Math.random() * -300,
        size: 5 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 2,
        vy: 1.5 + Math.random() * 3,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1
      });
    }
  }

  updateConfetti(delta) {
    this.confetti.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      if (p.y > MAP_ROWS * TILE_SIZE) {
        p.y = -20;
        p.x = Math.random() * (MAP_COLS * TILE_SIZE);
      }
    });
  }

  // --- Libro de Leyendas y Saberes (Notebook) ---
  openNotebook() {
    Audio.playSelect();
    Speech.stop();

    const modal = document.getElementById('notebookModal');
    modal.classList.remove('hidden');

    // Update student name and date
    document.getElementById('diplomaStudentName').textContent = this.studentName;
    const now = new Date();
    document.getElementById('diplomaDate').textContent = `Zipaquirá, ${now.getDate()} de Noviembre de ${now.getFullYear()}`;

    // Update diploma badges
    GAME_DATA.badges.forEach(b => {
      const slot = document.getElementById(`dipBadge_${b.id}`);
      if (slot) {
        if (this.unlockedBadges.has(b.id)) {
          slot.classList.remove('locked');
          slot.classList.add('unlocked');
        } else {
          slot.classList.add('locked');
          slot.classList.remove('unlocked');
        }
      }
    });

    // Tab buttons
    const tabs = document.querySelectorAll('.notebook-tab');
    const panes = document.querySelectorAll('.notebook-pane');
    tabs.forEach(tab => {
      tab.onclick = () => {
        tabs.forEach(t => t.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const target = document.getElementById(tab.dataset.pane);
        if (target) target.classList.add('active');
        Audio.playSelect();
      };
    });

    document.getElementById('btnCloseNotebook').onclick = () => {
      modal.classList.add('hidden');
      if (this.state === 'notebook') this.state = 'playing';
    };

    const printBtn = document.getElementById('btnPrintDiploma');
    if (printBtn) {
      printBtn.onclick = () => {
        window.print();
      };
    }
  }

  showToast(msg) {
    const toast = document.getElementById('gameToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('hidden');

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 4000);
  }

  getScreenNpcs() {
    if (this.currentScreenId === 'screen0') {
      return [
        { name: 'jacinto', x: 2, y: 5, dir: 0, frame: 0, scale: 1.05 },
        { name: 'lucia', x: 5, y: 5, dir: 0, frame: 0, scale: 1.0 }
      ];
    } else if (this.currentScreenId === 'screen2') {
      return [
        { name: 'rigoberto', x: 5, y: 4, dir: 0, frame: 0, scale: 1.0 }
      ];
    } else if (this.currentScreenId === 'screen3') {
      return [
        { name: 'jacinto', x: 4, y: 4, dir: 0, frame: 0, scale: 1.05 }
      ];
    } else if (this.currentScreenId === 'screenFinal') {
      return [
        { name: 'jacinto', x: 2, y: 5, dir: 0, frame: 0, scale: 1.05 },
        { name: 'lucia', x: 3, y: 5, dir: 0, frame: 0, scale: 1.0 },
        { name: 'rigoberto', x: 6, y: 5, dir: 0, frame: 0, scale: 1.0 }
      ];
    }
    return [];
  }

  // --- Main Render ---
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw Map Tiles & Objects
    this.map.render(this.ctx);

    // 2. Draw Cows in pasture if on Screen 2
    if (this.currentScreenId === 'screen2') {
      this.map.drawCow(this.ctx, 8 * TILE_SIZE, 3 * TILE_SIZE, false);
      this.map.drawCow(this.ctx, 9 * TILE_SIZE, 5 * TILE_SIZE, true);
    }

    // 3. Draw Characters (Y-sorted)
    const npcs = this.getScreenNpcs();
    const characters = [
      { name: this.avatar, x: this.player.pixelX, y: this.player.pixelY, dir: this.player.direction, frame: this.player.animFrame, scale: 1.0 },
      { name: 'copo', x: this.copo.pixelX, y: this.copo.pixelY, dir: this.copo.direction, frame: this.copo.animFrame, scale: 0.72 }
    ];

    npcs.forEach(npc => {
      characters.push({
        name: npc.name,
        x: npc.x * TILE_SIZE,
        y: npc.y * TILE_SIZE,
        dir: npc.dir,
        frame: npc.frame,
        scale: npc.scale
      });
    });

    characters.sort((a, b) => a.y - b.y);

    characters.forEach(char => {
      SpriteManager.draw(this.ctx, char.name, char.dir, char.frame, char.x, char.y, TILE_SIZE, char.scale);
    });

    // 4. Draw Floating Interactive Indicators (always cleanly on top)
    this.renderInteractiveMarkers();

    // 5. Confetti in victory screen
    if (this.currentScreenId === 'screenFinal' && this.confetti.length > 0) {
      this.ctx.save();
      this.confetti.forEach((p) => {
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      this.ctx.restore();
    }
  }

  isInteractiveTile(col, row) {
    if (this.currentScreenId === 'screen0') {
      return (col === 2 && row === 5) || (col === 5 && row === 5) || (col === 10 && row === 4);
    } else if (this.currentScreenId === 'screen1') {
      return col === 6 && row === 4;
    } else if (this.currentScreenId === 'screen2') {
      return col === 5 && row === 4;
    } else if (this.currentScreenId === 'screen3') {
      return col === 4 && row === 4;
    }
    return false;
  }

  renderInteractiveMarkers() {
    const t = Date.now() * 0.005;
    const bounce = Math.sin(t) * 4;
    const pulse = 1 + Math.sin(t * 1.4) * 0.04;

    const signs = [];
    const npcs = [];

    if (this.currentScreenId === 'screen0') {
      signs.push({ x: 10, y: 4, text: 'Hacer clic aquí' });
      npcs.push({ x: 2, y: 5, yOff: -12 }); // Abuelo Jacinto
      npcs.push({ x: 5, y: 5, yOff: -12 }); // Prof. Lucía
    } else if (this.currentScreenId === 'screen1') {
      signs.push({ x: 6, y: 4, text: 'Hacer clic aquí' });
    } else if (this.currentScreenId === 'screen2') {
      npcs.push({ x: 5, y: 4, yOff: -22 }); // Don Rigoberto (adult height)
    } else if (this.currentScreenId === 'screen3') {
      npcs.push({ x: 4, y: 4, yOff: -12 }); // Abuelo Jacinto
    }

    // 1. Floating "Hacer clic aquí" bubbles on all avisos (aviso.png)
    signs.forEach((pt) => {
      const px = pt.x * TILE_SIZE + TILE_SIZE / 2;
      const py = pt.y * TILE_SIZE - 8 + bounce;
      this.drawSpeechPill(px, py, pt.text, '#fef08a', '#1a202c', pulse);
    });

    // 2. Animated speech bubbles on interactive NPCs
    npcs.forEach((npc) => {
      const px = npc.x * TILE_SIZE + TILE_SIZE / 2;
      const py = npc.y * TILE_SIZE + npc.yOff + bounce;
      const isNear = Math.abs(this.player.x - npc.x) <= 2 && Math.abs(this.player.y - npc.y) <= 2;
      const isHover = this.hoveredTile.col === npc.x && this.hoveredTile.row === npc.y;

      if (isNear || isHover) {
        this.drawSpeechPill(px, py, 'Clic para hablar', '#fffbeb', '#1a202c', pulse);
      } else {
        this.drawAnimatedDotsBubble(px, py, t);
      }
    });
  }

  drawSpeechPill(cx, bottomY, text, bgColor, borderColor, scale = 1) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, bottomY);
    ctx.scale(scale, scale);

    ctx.font = 'bold 11px sans-serif';
    const textW = ctx.measureText(text).width;
    const padX = 9;
    const w = Math.max(46, textW + padX * 2);
    const h = 22;
    const x = -w / 2;
    const y = -h - 6;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    this.roundRectPath(ctx, x + 2, y + 2, w, h, 8);
    ctx.fill();

    // Pill body
    ctx.fillStyle = bgColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    this.roundRectPath(ctx, x, y, w, h, 8);
    ctx.fill();
    ctx.stroke();

    // Pointer triangle
    ctx.beginPath();
    ctx.moveTo(-5, y + h - 1);
    ctx.lineTo(0, y + h + 6);
    ctx.lineTo(5, y + h - 1);
    ctx.closePath();
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-5, y + h);
    ctx.lineTo(0, y + h + 6);
    ctx.lineTo(5, y + h);
    ctx.stroke();

    // Text
    ctx.fillStyle = borderColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, y + h / 2 + 0.5);
    ctx.restore();
  }

  drawAnimatedDotsBubble(cx, bottomY, t) {
    const ctx = this.ctx;
    ctx.save();
    const w = 36;
    const h = 20;
    const x = cx - w / 2;
    const y = bottomY - h - 6;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    this.roundRectPath(ctx, x + 2, y + 2, w, h, 8);
    ctx.fill();

    // White speech bubble
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#1a202c';
    ctx.lineWidth = 2;
    this.roundRectPath(ctx, x, y, w, h, 8);
    ctx.fill();
    ctx.stroke();

    // Pointer triangle
    ctx.beginPath();
    ctx.moveTo(cx - 4, y + h - 1);
    ctx.lineTo(cx, y + h + 5);
    ctx.lineTo(cx + 4, y + h - 1);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - 4, y + h);
    ctx.lineTo(cx, y + h + 5);
    ctx.lineTo(cx + 4, y + h);
    ctx.stroke();

    // 3 animated bouncing dots (...)
    for (let i = 0; i < 3; i++) {
      const dotBounce = Math.sin(t * 2.2 - i * 0.9) * 2;
      ctx.fillStyle = '#2d3748';
      ctx.beginPath();
      ctx.arc(cx - 8 + i * 8, y + h / 2 + dotBounce, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

// Global initialization
let game = null;

window.addEventListener('DOMContentLoaded', async () => {
  const loadingStatus = document.getElementById('loadingStatus');
  if (loadingStatus) loadingStatus.textContent = 'Cargando personajes y escenarios de San Miguel...';

  await SpriteManager.loadAll((loaded, total) => {
    if (loadingStatus) loadingStatus.textContent = `Cargando personajes (${loaded}/${total})...`;
  });

  if (loadingStatus) loadingStatus.textContent = '¡Todo listo para rastrear!';

  const tomasPrev = document.getElementById('previewTomasCanvas');
  if (tomasPrev) {
    SpriteManager.drawFullCharacter(tomasPrev.getContext('2d'), 'tomas', 0, 0, 72, 72);
  }
  const valeriaPrev = document.getElementById('previewValeriaCanvas');
  if (valeriaPrev) {
    SpriteManager.drawFullCharacter(valeriaPrev.getContext('2d'), 'valeria', 0, 0, 72, 72);
  }

  game = new GameEngine();
  game.init();

  const startBtn = document.getElementById('startGameBtn');
  if (startBtn) {
    startBtn.disabled = false;
    startBtn.textContent = '¡INICIAR AVENTURA!';
  }
});
