// Web Audio API Synthesizer - Retro 8-bit Chiptune Audio Manager
// 100% self-contained, no external MP3 dependencies!

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.musicEnabled = true;
    this.musicInterval = null;
    this.currentNoteIndex = 0;
    this.isMusicPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.musicEnabled;
  }

  playTone(freq, type = 'square', duration = 0.1, gainVal = 0.1, startFreq = null) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      const now = this.ctx.currentTime;

      if (startFreq) {
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq), now + duration);
      } else {
        osc.frequency.setValueAtTime(freq, now);
      }

      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // AudioContext safe fallback
    }
  }

  // Typewriter blip based on speaker
  playBlip(speaker = 'narrador') {
    if (!this.soundEnabled) return;
    let freq = 420;
    let type = 'square';
    if (speaker === 'jacinto') {
      freq = 240;
      type = 'triangle';
    } else if (speaker === 'rigoberto') {
      freq = 280;
      type = 'sawtooth';
    } else if (speaker === 'lucia') {
      freq = 520;
      type = 'triangle';
    } else if (speaker === 'copo') {
      this.playBark();
      return;
    } else if (speaker === 'player') {
      freq = 480;
      type = 'sine';
    }
    this.playTone(freq, type, 0.04, 0.04);
  }

  playStep() {
    if (!this.soundEnabled) return;
    // Quiet subtle crunch
    this.playTone(120, 'triangle', 0.03, 0.02, 180);
  }

  playSelect() {
    this.playTone(660, 'sine', 0.08, 0.08, 440);
  }

  playSuccess() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    // Arpeggio C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      setTimeout(() => {
        this.playTone(n, 'triangle', 0.15, 0.12);
      }, idx * 75);
    });
  }

  playError() {
    if (!this.soundEnabled) return;
    this.playTone(160, 'sawtooth', 0.18, 0.08, 220);
  }

  playFogDissolve() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    // Ethereal rising sweep
    const notes = [330, 440, 554, 659, 880, 1108, 1320];
    notes.forEach((f, i) => {
      setTimeout(() => {
        this.playTone(f, 'sine', 0.25, 0.09);
      }, i * 60);
    });
  }

  playBark() {
    if (!this.soundEnabled) return;
    // Cute puppy bark
    this.playTone(400, 'triangle', 0.06, 0.12, 600);
    setTimeout(() => {
      this.playTone(350, 'triangle', 0.08, 0.1, 550);
    }, 70);
  }

  playPortalLaser() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    const notes = [220, 330, 440, 660, 880, 1320, 1760];
    notes.forEach((f, i) => {
      setTimeout(() => {
        this.playTone(f, 'sawtooth', 0.12, 0.08);
      }, i * 50);
    });
  }

  playVictory() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    // Grand victory fanfare
    const seq = [
      { f: 523.25, d: 0.15, delay: 0 },
      { f: 523.25, d: 0.15, delay: 150 },
      { f: 523.25, d: 0.15, delay: 300 },
      { f: 659.25, d: 0.35, delay: 450 },
      { f: 587.33, d: 0.2, delay: 850 },
      { f: 659.25, d: 0.2, delay: 1050 },
      { f: 783.99, d: 0.5, delay: 1250 },
      { f: 1046.5, d: 0.8, delay: 1800 }
    ];
    seq.forEach((item) => {
      setTimeout(() => {
        this.playTone(item.f, 'triangle', item.d, 0.15);
      }, item.delay);
    });
  }

  // Background Andean-style Bambuco 8-bit melody
  startMusic() {
    if (!this.musicEnabled || this.isMusicPlaying) return;
    this.init();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    // Friendly Andean folk chord progression in C Major / A Minor
    // Notes: C4, D4, E4, F4, G4, A4, B4, C5
    const melody = [
      { f: 523, d: 0.18 }, // C5
      { f: 587, d: 0.18 }, // D5
      { f: 659, d: 0.25 }, // E5
      { f: 783, d: 0.35 }, // G5
      { f: 659, d: 0.18 }, // E5
      { f: 523, d: 0.25 }, // C5
      { f: 440, d: 0.35 }, // A4
      { f: 392, d: 0.35 }, // G4
      { f: 440, d: 0.18 }, // A4
      { f: 523, d: 0.18 }, // C5
      { f: 587, d: 0.25 }, // D5
      { f: 659, d: 0.35 }, // E5
      { f: 587, d: 0.25 }, // D5
      { f: 523, d: 0.45 }, // C5
      { f: 392, d: 0.25 }, // G4
      { f: 523, d: 0.5 }   // C5
    ];

    const bass = [
      261, 261, 329, 392, 220, 220, 261, 329,
      174, 174, 220, 261, 196, 196, 246, 261
    ];

    let step = 0;
    this.musicInterval = setInterval(() => {
      if (!this.musicEnabled || !this.isMusicPlaying) {
        clearInterval(this.musicInterval);
        return;
      }
      const mNote = melody[step % melody.length];
      const bFreq = bass[step % bass.length];

      // Play soft melody note
      this.playTone(mNote.f, 'triangle', mNote.d * 0.9, 0.04);
      // Play soft bass pulse
      if (step % 2 === 0) {
        this.playTone(bFreq, 'sine', 0.2, 0.03);
      }

      step++;
    }, 280);
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

const Audio = new SoundSystem();
