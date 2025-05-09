class AudioHub {
  static GAMEAUDIO = new Audio("audio/game-music-loop-1.mp3");
  static JUMP = new Audio("audio/jump-1.mp3");
  static WIN = new Audio("audio/bonus-1.mp3");
  static LOST = new Audio("audio/lose-funny-1.mp3");
  static GAMEOVER = new Audio("audio/game-over-classic-1.mp3");

  static allSounds = [AudioHub.GAMEAUDIO, AudioHub.JUMP];

  // Spielt eine einzelne Audiodatei ab
  //   static playOne(sound) {
  //     sound.volume = 0.2; // Setzt die Lautstärke auf 0.2 = 20% / 1 = 100%
  //     sound.currentTime = 0; // Startet ab einer bestimmten stelle (0=Anfang/ 5 = 5 sec.)
  //     sound.play(); // Spielt das übergebene Sound-Objekt ab
  //   }

  // Spielt eine einzelne Audiodatei ab, - wenn sie bereit ist -
  static playOne(sound) {
    if (sound.readyState == 4) {
      console.log("Sound ready");
      sound.volume = 0.2;
      sound.currentTime = 0;
      sound.play();
    } else {
      console.log("Sound not ready");
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
}
