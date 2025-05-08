let canvas;
let ctx; // NEU
let world;
let gameMusic;
let gameOver = false; // Spielstatus
const keyboard = new Keyboard();

function init() {
  initLevel();
  canvas = document.getElementById("canvas");

  ctx = canvas.getContext("2d"); // NEU

  gameMusic = new Sound("audio/fast-rocky-loop-1.mp3");
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
  const textYPosition = canvas.height - 25; // Abstand von der unteren Kante (25px)
  ctx.fillText("Drücke Start, um das Spiel zu beginnen!", canvas.width / 2, textYPosition);
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

// Pause/Resume Audio when leave or return tab
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    gameMusic.stop();
  } else {
    gameMusic.play().catch(e => console.log("Auto-resume prevented:", e));
  }
});
