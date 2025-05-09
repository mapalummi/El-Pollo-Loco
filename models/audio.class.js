class AudioHub {
  static GAMEAUDIO = new Audio("audio/game-music-loop-1.mp3");
  static JUMP = new Audio("audio/jump-1.mp3");

  static allSounds = [AudioHub.GAMEAUDIO, AudioHub.JUMP];

  // Spielt eine einzelne Audiodatei ab
  //   static playOne(sound) {
  //     sound.volume = 0.2; // Setzt die Lautstärke auf 0.2 = 20% / 1 = 100%
  //     sound.currentTime = 0; // Startet ab einer bestimmten stelle (0=Anfang/ 5 = 5 sec.)
  //     sound.play(); // Spielt das übergebene Sound-Objekt ab
  //   }

  // Spielt eine einzelne Audiodatei ab, - wenn sie bereit ist -
  static playOne(sound) {
    setInterval(() => {
      // Wiederholt die Überprüfung alle 200ms
      //hier sound wird gestoppt
      if (sound.readyState == 4) {
        // Überprüft, ob die Audiodatei vollständig geladen ist, wenn man die if abfrage rausnehmen würde, würde es bei start & drücken auf den stopp Knopf einen Fehler werfen. (am besten low-tier throttling nutzen!)
        console.log("Sound ready");
        sound.volume = 0.2;
        sound.currentTime = 0;
        sound.play();
      } else {
        console.log("Sound not ready");
      }
    }, 200);
  }

  // Spielt eine Audiodatei in einer Endlosschleife ab
  //   static playLoop(sound) {
  //     sound.loop = true; // Aktiviert die Loop-Funktion
  //     sound.volume = 0.2; // Setzt die Lautstärke auf 0.2 = 20%
  //     sound.currentTime = 0; // Startet vom Anfang
  //     sound.play(); // Spielt das Audio ab
  //   }

  static playLoop(sound) {
    setInterval(() => {
      if (sound.readyState == 4) {
        sound.loop = true; // Aktiviert die Loop-Funktion
        sound.volume = 0.2;
        // sound.currentTime = 0; //Funktioniert nicht!
        sound.play();
      }
    }, 200);
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
