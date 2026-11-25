// Web Speech API Narrator (Lectura en Voz Alta)
// Specially tailored for 3rd grade children (I.E.M.R. La Granja, Zipaquirá)

class SpeechSystem {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.voice = null;
    this.enabled = true;
    this.isSpeaking = false;
    this.rate = 0.88; // Friendly, clear pace for children
    this.pitch = 1.05;

    if (this.synth) {
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize Colombian Spanish, Latin American Spanish, then general Spanish
    this.voice =
      voices.find((v) => v.lang === 'es-CO') ||
      voices.find((v) => v.lang === 'es-419') ||
      voices.find((v) => v.lang.startsWith('es-') && (v.name.includes('Latin') || v.name.includes('America'))) ||
      voices.find((v) => v.lang.startsWith('es')) ||
      null;
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stop();
    }
    return this.enabled;
  }

  speak(text, onStart = null, onEnd = null) {
    if (!this.synth || !this.enabled) {
      if (onEnd) onEnd();
      return;
    }

    // Stop current speech before starting new one
    this.stop();

    // Clean markdown/special characters for speech
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/!+/g, '!')
      .replace(/\?+/g, '?');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.lang = this.voice ? this.voice.lang : 'es-ES';
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }
}

const Speech = new SpeechSystem();
