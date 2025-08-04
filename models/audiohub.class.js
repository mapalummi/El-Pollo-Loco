/**
 * Central audio management hub for the El Pollo Loco game
 * Handles all audio playback, volume control, muting, and state management
 */
class AudioHub {
  static MENU_AUDIO = new Audio("audio/acoustic-mexican-guitar.mp3");
  static GAMEAUDIO = new Audio("audio/keep-up-flamenco.mp3");
  static SLEEP = new Audio("audio/sleep-1.mp3");
  static WALK = new Audio("audio/steps-2.mp3");
  static JUMP = new Audio("audio/jump-1.mp3");
  static HURT = new Audio("audio/hurt-1.mp3");
  static DEAD = new Audio("audio/death-1.mp3");
  static THROW = new Audio("audio/throw-1.mp3");
  static SPLASH = new Audio("audio/splash-1.mp3");
  static COINS = new Audio("audio/coin-1.mp3");
  static BOTTLES = new Audio("audio/bottle-1.mp3");
  static CHICKEN = new Audio("audio/chicken-1.mp3");
  static ENDBOSS = new Audio("audio/monster-1.mp3");
  static ENDBOSS_ATTACK = new Audio("audio/monster-2.mp3");
  static ENDBOSS_SOUND = new Audio("audio/endboss-sound-2.mp3");
  static WIN = new Audio("audio/bonus-1.mp3");
  static LOST = new Audio("audio/lose-funny-1.mp3");
  static GAMEOVER = new Audio("audio/game-over-classic-1.mp3");
  static COINS_COMPLETE = new Audio("audio/game-ui-1.mp3");

  static soundVolumes = {
    MENU_AUDIO: 0.3,
    GAMEAUDIO: 0.2,
    SLEEP: 0.03,
    WALK: 0.1,
    JUMP: 0.3,
    HURT: 0.25,
    DEAD: 0.3,
    THROW: 0.2,
    SPLASH: 0.2,
    COINS: 1,
    BOTTLES: 0.2,
    CHICKEN: 0.2,
    ENDBOSS: 0.5,
    ENDBOSS_ATTACK: 0.2,
    ENDBOSS_SOUND: 0.5,
    WIN: 0.2,
    LOST: 0.2,
    GAMEOVER: 0.2,
    COINS_COMPLETE: 0.2,
  };

  static allSounds = [
    AudioHub.MENU_AUDIO,
    AudioHub.GAMEAUDIO,
    AudioHub.SLEEP,
    AudioHub.WALK,
    AudioHub.JUMP,
    AudioHub.HURT,
    AudioHub.DEAD,
    AudioHub.THROW,
    AudioHub.SPLASH,
    AudioHub.COINS,
    AudioHub.BOTTLES,
    AudioHub.CHICKEN,
    AudioHub.ENDBOSS,
    AudioHub.ENDBOSS_ATTACK,
    AudioHub.ENDBOSS_SOUND,
    AudioHub.WIN,
    AudioHub.LOST,
    AudioHub.GAMEOVER,
    AudioHub.COINS_COMPLETE,
  ];

  static currentKeySound = null;
  static isMuted = false;

  static {
    try {
      const soundState = localStorage.getItem("elPolloLoco_soundMuted");
      if (soundState !== null) {
        AudioHub.isMuted = soundState === "true";

        if (AudioHub.isMuted) {
          AudioHub.muteAll();
        }
      }
    } catch (e) {
      console.warn("Could not access localStorage for sound settings");
    }
  }

  /**
   * Plays a sound effect once with appropriate volume settings
   * @param {HTMLAudioElement} sound - The audio element to play
   */
  static playOne(sound) {
    if (sound.readyState == 4) {
      const soundName = Object.keys(AudioHub).find(key => AudioHub[key] === sound);

      if (!AudioHub.isMuted) {
        sound.volume = AudioHub.soundVolumes[soundName] || 0.2;
      } else {
        sound.volume = 0;
      }

      sound.currentTime = 0;
      sound.play();
    }
  }

  /**
   * Plays a sound in loop mode with appropriate volume settings
   * @param {HTMLAudioElement} sound - The audio element to play in loop
   */
  static playLoop(sound) {
    if (sound.readyState == 4) {
      const soundName = Object.keys(AudioHub).find(key => AudioHub[key] === sound);

      if (!AudioHub.isMuted) {
        sound.volume = AudioHub.soundVolumes[soundName] || 0.2;
      } else {
        sound.volume = 0;
      }

      sound.loop = true;
      sound.currentTime = 0;
      sound.play();
    }
  }

  /**
   * Stops playback of a specific sound
   * @param {HTMLAudioElement} sound - The audio element to stop
   */
  static stopOne(sound) {
    sound.pause();
  }

  /**
   * Stops playback of all registered sounds
   */
  static stopAll() {
    AudioHub.allSounds.forEach(sound => {
      sound.pause();
    });
  }

  /**
   * Resumes playback of a specific sound with error handling
   * @param {HTMLAudioElement} sound - The audio element to resume
   */
  static resume(sound) {
    sound.play().catch(e => console.log("Auto-resume prevented:", e));
  }

  /**
   * Plays a sound while a key is pressed and tracks it as current key sound
   * @param {HTMLAudioElement} sound - The audio element to play while key is pressed
   */
  static playWhileKeyPressed(sound) {
    if (sound.readyState == 4) {
      if (!AudioHub.isMuted) {
        const soundName = Object.keys(AudioHub).find(key => AudioHub[key] === sound);
        sound.volume = AudioHub.soundVolumes[soundName] || 0.2;
      } else {
        sound.volume = 0;
      }

      sound.currentTime = 0;
      sound.play();
      AudioHub.currentKeySound = sound;
    }
  }

  /**
   * Stops the currently playing key sound and resets its state
   */
  static stopKeySound() {
    if (AudioHub.currentKeySound) {
      AudioHub.currentKeySound.pause();
      AudioHub.currentKeySound.currentTime = 0;
      AudioHub.currentKeySound = null;
    }
  }

  /**
   * Mutes all sounds by setting their volume to 0 while preserving original volumes
   */
  static muteAll() {
    AudioHub.isMuted = true;

    AudioHub.allSounds.forEach(sound => {
      if (sound._originalVolume === undefined) {
        sound._originalVolume = sound.volume;
      }
      sound.volume = 0;
    });
  }

  /**
   * Unmutes all sounds by restoring their original volume levels
   */
  static unmuteAll() {
    AudioHub.isMuted = false;

    AudioHub.allSounds.forEach(sound => {
      if (sound._originalVolume !== undefined) {
        const soundName = Object.keys(AudioHub).find(key => AudioHub[key] === sound);

        sound.volume = sound._originalVolume;
        delete sound._originalVolume;
      }
    });
  }

  /**
   * Pauses all currently playing sounds and tracks their playing state
   */
  static pauseAll() {
    AudioHub.allSounds.forEach(sound => {
      sound._wasPlaying = !sound.paused;
      sound.pause();
    });
  }

  /**
   * Resumes all sounds that were playing before pauseAll() was called
   */
  static resumeAll() {
    AudioHub.allSounds.forEach(sound => {
      if (sound._wasPlaying && !AudioHub.isMuted) {
        sound.play().catch(e => console.log("Auto-resume prevented:", e));
      }
      delete sound._wasPlaying;
    });
  }
}
