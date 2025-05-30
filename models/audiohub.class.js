class AudioHub {
  static GAMEAUDIO = new Audio("audio/game-music-loop-1.mp3");
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
    GAMEAUDIO: 0.5,
    SLEEP: 0.1,
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

  // Statische Variable für den aktuell abgespielten Tasten-Sound
  static currentKeySound = null;

  // static property to track mute state
  static isMuted = false;

  //NEU Local Storage
  // Static initializer to load sound state from localStorage
  static {
    try {
      const soundState = localStorage.getItem("elPolloLoco_soundMuted");
      if (soundState !== null) {
        AudioHub.isMuted = soundState === "true";

        // Apply the loaded state immediately
        if (AudioHub.isMuted) {
          AudioHub.muteAll();
        }
      }
    } catch (e) {
      console.warn("Could not access localStorage for sound settings");
    }
  }

  // Spielt eine einzelne Audiodatei ab
  //   static playOne(sound) {
  //     sound.volume = 0.2; // Setzt die Lautstärke auf 0.2 = 20% / 1 = 100%
  //     sound.currentTime = 0; // Startet ab einer bestimmten stelle (0=Anfang/ 5 = 5 sec.)
  //     sound.play(); // Spielt das übergebene Sound-Objekt ab
  //   }

  // Spielt eine einzelne Audiodatei ab, - wenn sie bereit ist -
  // static playOne(sound) {
  //   if (sound.readyState == 4) {
  //     sound.volume = 0.2;
  //     sound.currentTime = 0;
  //     sound.play();
  //   }
  // }

  // Modifiziertes playOne
  static playOne(sound) {
    if (sound.readyState == 4) {
      // Finde den Namen des Sounds
      const soundName = Object.keys(AudioHub).find(key => AudioHub[key] === sound);

      if (!AudioHub.isMuted) {
        sound.volume = AudioHub.soundVolumes[soundName] || 0.2;
      } else {
        sound.volume = 0; // Keep it muted
      }

      sound.currentTime = 0;
      sound.play();
    }
  }

  // Modifiziertes playLoop
  static playLoop(sound) {
    if (sound.readyState == 4) {
      // Finde den Namen des Sounds
      const soundName = Object.keys(AudioHub).find(key => AudioHub[key] === sound);

      // Only set volume if not muted
      if (!AudioHub.isMuted) {
        sound.volume = AudioHub.soundVolumes[soundName] || 0.2;
      } else {
        sound.volume = 0; // Keep it muted
      }

      sound.loop = true; // Aktiviert die Loop-Funktion
      sound.currentTime = 0;
      sound.play();
    }
  }

  // Stoppt das Abspielen einer einzelnen Audiodatei
  static stopOne(sound) {
    sound.pause(); // Pausiert das übergebene Audio
  }

  // Stoppt das Abspielen ALLER Audiodateien
  static stopAll() {
    AudioHub.allSounds.forEach(sound => {
      sound.pause(); // Pausiert jedes Audio in der Liste
    });
  }

  static resume(sound) {
    sound.play().catch(e => console.log("Auto-resume prevented:", e));
  }

  // Spielt einen Sound ab, solange eine Taste gedrückt wird
  static playWhileKeyPressed(sound) {
    if (sound.readyState == 4) {
      // Check if sound should be muted
      if (!AudioHub.isMuted) {
        // Find the sound name for volume settings
        const soundName = Object.keys(AudioHub).find(key => AudioHub[key] === sound);
        sound.volume = AudioHub.soundVolumes[soundName] || 0.2;
      } else {
        sound.volume = 0; // Keep it muted
      }

      sound.currentTime = 0;
      sound.play();

      // Speichert den Sound, damit er beim Loslassen der Taste gestoppt werden kann
      AudioHub.currentKeySound = sound;
    }
  }

  // Stoppt den aktuell durch Tastendruck gespielten Sound
  static stopKeySound() {
    if (AudioHub.currentKeySound) {
      AudioHub.currentKeySound.pause();
      AudioHub.currentKeySound.currentTime = 0;
      AudioHub.currentKeySound = null;
    }
  }

  // Update the muteAll method
  static muteAll() {
    AudioHub.isMuted = true;
    // Mute all sounds without stopping them
    AudioHub.allSounds.forEach(sound => {
      // Save the original volume first (if not already saved)
      if (sound._originalVolume === undefined) {
        sound._originalVolume = sound.volume;
      }
      // Set volume to 0 (mute)
      sound.volume = 0;
    });
  }

  // Update the unmuteAll method
  static unmuteAll() {
    AudioHub.isMuted = false;
    // Restore original volumes
    AudioHub.allSounds.forEach(sound => {
      if (sound._originalVolume !== undefined) {
        // Get the sound name for volume settings
        const soundName = Object.keys(AudioHub).find(key => AudioHub[key] === sound);
        // Restore original volume
        sound.volume = sound._originalVolume;
        // Clear stored original volume
        delete sound._originalVolume;
      }
    });
  }

  static pauseAll() {
    // Store current playing states before pausing
    AudioHub.allSounds.forEach(sound => {
      sound._wasPlaying = !sound.paused;
      sound.pause();
    });
  }

  static resumeAll() {
    // Only resume sounds that were playing before pause
    AudioHub.allSounds.forEach(sound => {
      if (sound._wasPlaying && !AudioHub.isMuted) {
        sound.play().catch(e => console.log("Auto-resume prevented:", e));
      }
      delete sound._wasPlaying;
    });
  }
}
