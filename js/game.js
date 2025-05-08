let canvas;

let ctx; // NEU

let world;
let gameMusic;
const keyboard = new Keyboard();

function init() {
  initLevel();
  canvas = document.getElementById("canvas");

  ctx = canvas.getContext("2d"); // NEU

  gameMusic = new sound("audio/fast-rocky-loop-1.mp3");
  gameMusic.enableLoop(); // Schleifenwiedergabe aktivieren
  console.log("Audio geladen", gameMusic.sound.src);

  // Lade und zeige den Startscreen
  const startScreenImage = new Image();
  startScreenImage.src = "img/9_intro_outro_screens/start/startscreen_1.png"; // Pfad zum Startscreen-Bild
  startScreenImage.onload = () => {
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
    drawStartText(); // Text über dem Bild zeichnen
    document.getElementById("startButton").style.display = "block"; // Button anzeigen
  };
}

// NEU - Starttext
function drawStartText() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Drücke Start, um das Spiel zu beginnen!", canvas.width / 2, canvas.height - 50);
}

function startGame() {
  world = new World(canvas, keyboard);
  gameMusic.play(); // Musik abspielen

  // Startscreen löschen (Geht auch ohne !?)
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("startButton").style.display = "none";
}

// Debugging
// window.addEventListener("keydown", e => {
//   console.log(`Taste gedrückt: ${e.key}`);
// });

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);

  // Methode zum Abspielen
  this.play = function () {
    this.sound.play();
  };

  // Methode zum Stoppen
  this.stop = function () {
    this.sound.pause();
  };

  // Methode zum aktivieren der Endlossschleife
  this.enableLoop = function () {
    this.sound.loop = true; //Aktiviert Schleifenwiedergabe
    this.sound.load(); //lädt Audio neu, damit Schleife korrekt startet
  };
}

// Pause/Resume Audio when leave or return tab
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    gameMusic.stop();
  } else {
    gameMusic.play().catch(e => console.log("Auto-resume prevented:", e));
  }
});

window.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowRight":
      keyboard.RIGHT = true;
      break;
    case "ArrowLeft":
      keyboard.LEFT = true;
      break;
    case "ArrowUp":
      keyboard.UP = true;
      break;
    case "ArrowDown":
      keyboard.DOWN = true;
      break;
    case " ":
      keyboard.SPACE = true;
      break;
    case "b":
      keyboard.B = true;
      break;
  }
  // console.log("KeyDown:", keyboard);
});

window.addEventListener("keyup", e => {
  switch (e.key) {
    case "ArrowRight":
      keyboard.RIGHT = false;
      break;
    case "ArrowLeft":
      keyboard.LEFT = false;
      break;
    case "ArrowUp":
      keyboard.UP = false;
      break;
    case "ArrowDown":
      keyboard.DOWN = false;
      break;
    case " ":
      keyboard.SPACE = false;
      break;
    case "b":
      keyboard.B = false;
      break;
  }
  // console.log("KeyUp:", keyboard);
});
