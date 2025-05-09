class Sound {
  constructor(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
  }

  play() {
    this.sound.play();
  }

  stop() {
    this.sound.pause();
  }

  enableLoop() {
    this.sound.loop = true; //Aktiviert Schleifenwiedergabe
    this.sound.load(); //lädt Audio neu, damit Schleife korrekt startet
  }

  setVolume(volume) {
    // volume zwischen 0.0 und 1.0
    this.sound.volume = volume;
  }
}
