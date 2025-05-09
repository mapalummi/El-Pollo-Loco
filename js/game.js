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

// Starttext
function drawStartText() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  const textYPosition = canvas.height - 25; // Abstand von der unteren Kante (25px)
  ctx.fillText("Drücke Start, um das Spiel zu beginnen!", canvas.width / 2, textYPosition);
}

function startGame() {
  world = new World(canvas, keyboard);

  gameMusic.play();
  gameMusic.setVolume(0.1);

  gameOver = false; // Gameover zurücksetzen
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("startButton").style.display = "none";
}

// Pause/Resume Audio wenn anderer Tab
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    gameMusic.stop();
  } else {
    gameMusic.play().catch(e => console.log("Auto-resume prevented:", e));
  }
});

//NOTE: Muss evtl. noch ausgebessert werden !!!
function showGameOverScreen(hasWon) {
  console.log("Game over screen called, hasWon:", hasWon); // Debug-Info

  if (gameOver) return;
  gameOver = true;
  gameMusic.stop();

  // Behalte nur den Hintergrund, entferne alle anderen Objekte
  if (world) {
    world.level.enemies = [];
    world.level.clouds = [];
    world.level.coins = [];
    world.level.bottles = [];

    //CHECK:
    // Wolken-Rendering explizit deaktivieren
    world.stopDrawingClouds = true;

    // Spieler-Objekt unsichtbar machen (falls vorhanden)
    if (world.character) {
      world.character.y = 800; // Außerhalb des sichtbaren Bereichs verschieben
    }

    // Statusleisten ausblenden
    if (world.statusBars) {
      world.statusBars.forEach(bar => {
        if (bar && typeof bar.hide === "function") {
          bar.hide();
        }
      });
    }
  }

  // Restart-Button anzeigen
  document.getElementById("restartButton").style.display = "block";
}

// Funktioniert aktuell!
function restartGame() {
  // Hide the restart button
  document.getElementById("restartButton").style.display = "none";

  // Reset game state - set this FIRST to prevent any new game over triggers
  gameOver = false;

  // Clear ALL intervals in the page, not just ones we know about
  // This ensures any lingering timers are cleaned up
  const highestTimeoutId = setTimeout(() => {}, 0);
  for (let i = 0; i <= highestTimeoutId; i++) {
    clearTimeout(i);
  }

  // Stop all intervals too
  const highestIntervalId = setInterval(() => {}, 0);
  for (let i = 1; i <= highestIntervalId; i++) {
    clearInterval(i);
  }

  // Stop audio to prevent the AbortError
  if (gameMusic) {
    gameMusic.stop();
  }

  // Complete reset: destroy current world
  world = null;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Re-initialize level data explicitly
  initLevel();

  //ALT:
  // Start fresh game after a brief pause
  // setTimeout(() => {
  //   world = new World(canvas, keyboard);
  //   gameMusic.play();
  //   document.getElementById("startButton").style.display = "none";
  // }, 200); // Slightly longer timeout for stability

  // Start fresh game after a brief pause
  CHECK: setTimeout(() => {
    world = new World(canvas, keyboard);
    world.stopDrawingClouds = false; // Flag zurücksetzen
    gameMusic.play();
    document.getElementById("startButton").style.display = "none";
  }, 200);
}
