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
  static WIN = new Audio("audio/bonus-1.mp3");
  static LOST = new Audio("audio/lose-funny-1.mp3");
  static GAMEOVER = new Audio("audio/game-over-classic-1.mp3");

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
    AudioHub.WIN,
    AudioHub.LOST,
    AudioHub.GAMEOVER,
  ];

  // Spielt eine einzelne Audiodatei ab
  //   static playOne(sound) {
  //     sound.volume = 0.2; // Setzt die Lautstärke auf 0.2 = 20% / 1 = 100%
  //     sound.currentTime = 0; // Startet ab einer bestimmten stelle (0=Anfang/ 5 = 5 sec.)
  //     sound.play(); // Spielt das übergebene Sound-Objekt ab
  //   }

  // Spielt eine einzelne Audiodatei ab, - wenn sie bereit ist -
  static playOne(sound) {
    if (sound.readyState == 4) {
      sound.volume = 0.2;
      sound.currentTime = 0;
      sound.play();
    }
  }

  // Spielt eine Audiodatei in einer Endlosschleife ab
  // static playLoop(sound) {
  //   sound.loop = true; // Aktiviert die Loop-Funktion
  //   sound.volume = 0.2; // Setzt die Lautstärke auf 0.2 = 20%
  //   sound.currentTime = 0; // Startet vom Anfang
  //   sound.play(); // Spielt das Audio ab
  // }

  //NEU
  static playLoop(sound) {
    if (sound.readyState == 4) {
      sound.loop = true; // Aktiviert die Loop-Funktion
      sound.volume = 0.2;
      // sound.currentTime = 0; //Funktioniert nicht!
      sound.play();
    }
  }

  // Stoppt das Abspielen aller Audiodateien
  static stopAll() {
    AudioHub.allSounds.forEach(sound => {
      sound.pause(); // Pausiert jedes Audio in der Liste
    });
    document.getElementById("volume").value = 0.2; // Setzt den Sound-Slider wieder auf 0.2
  }

  // Stoppt das Abspielen einer einzelnen Audiodatei
  static stopOne(sound) {
    sound.pause(); // Pausiert das übergebene Audio
  }

  static resume(sound) {
    sound.play().catch(e => console.log("Auto-resume prevented:", e));
  }

  //NOTE: Testfunktionen

  // Spielt einen Sound ab, solange eine Taste gedrückt wird
  static playWhileKeyPressed(sound) {
    if (sound.readyState == 4) {
      sound.volume = 0.2;
      sound.currentTime = 0;
      sound.play();

      // Speichern Sie den Sound, damit er beim Loslassen der Taste gestoppt werden kann
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

  // Statische Variable für den aktuell abgespielten Tasten-Sound
  static currentKeySound = null;
}
