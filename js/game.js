let canvas;
let ctx;
let world;
let gameOver = false; // Spielstatus
let gameOverSoundPlayed = false;
let gamePaused = false; // NEU !
const keyboard = new Keyboard();

function init() {
  initLevel();
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  // Lade und zeige den Startscreen
  const startScreenImage = new Image();
  startScreenImage.src = "img/9_intro_outro_screens/start/startscreen_1.png";
  startScreenImage.onload = () => {
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
    drawStartText();
    document.getElementById("startButton").style.display = "block";
    document.getElementById("homeButton").style.display = "none";
    document.getElementById("restartButton").style.display = "none";
  };

  document.addEventListener("keydown", e => {
    if (e.repeat) return;

    // Skip keyboard input if game is over with victory
    if (gameOver && world && world.ignoreControls) return;

    if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
      AudioHub.playWhileKeyPressed(AudioHub.WALK);
    }
  });

  document.addEventListener("keyup", e => {
    // Skip keyboard input if game is over with victory
    if (gameOver && world && world.ignoreControls) return;

    if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
      AudioHub.stopKeySound();
    }
  });

  //NEU
  addFullscreenListeners();

  keyboard.initMobileButtons();
}

function drawStartText() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  const textYPosition = canvas.height - 25; // Abstand von der unteren Kante (25px)
  ctx.fillText("Drücke Start, um das Spiel zu beginnen!", canvas.width / 2, textYPosition);
}

function startGame() {
  world = new World(canvas, keyboard);
  AudioHub.playLoop(AudioHub.GAMEAUDIO);

  // Show keyboard controls
  document.getElementById("keyboard-controls").classList.remove("d_none");

  gameOver = false; // Gameover zurücksetzen
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("startButton").style.display = "none";
}

//NEU
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    AudioHub.muteAll();
  } else {
    AudioHub.unmuteAll();
  }
});

function showGameOverScreen(hasWon) {
  if (gameOver) return; // Prevent multiple game over screens

  gameOver = true;
  showDialog(hasWon);

  AudioHub.stopAll();

  // Hide keyboard controls
  document.getElementById("keyboard-controls").classList.add("d_none");

  if (!gameOverSoundPlayed) {
    gameOverSoundPlayed = true;
  }

  if (hasWon) {
    AudioHub.playOne(AudioHub.WIN);
    //TODO:
    // Freeze the character when the boss is defeated
    if (world && world.character) {
      world.character.isFrozen = true;

      // Disable keyboard controls
      keyboard.RIGHT = false;
      keyboard.LEFT = false;
      keyboard.UP = false;
      keyboard.DOWN = false;
      keyboard.SPACE = false;
      keyboard.D = false;

      // Additional flag to ignore new keyboard inputs
      world.ignoreControls = true;
    }
  } else {
    AudioHub.playOne(AudioHub.GAMEOVER);
  }

  // Behalte nur den Hintergrund, entferne alle anderen Objekte
  if (world) {
    world.level.clouds = [];
    world.level.coins = [];
    world.level.bottles = [];
    world.level.enemies = [];

    // Wolken-Rendering explizit deaktivieren
    world.stopDrawingClouds = true;

    // Hide each status bar individually
    if (world.healthBar && typeof world.healthBar.hide === "function") {
      world.healthBar.hide();
    }
    if (world.bottleBar && typeof world.bottleBar.hide === "function") {
      world.bottleBar.hide();
    }
    if (world.coinBar && typeof world.coinBar.hide === "function") {
      world.coinBar.hide();
    }
    if (world.endbossBar && typeof world.endbossBar.hide === "function") {
      world.endbossBar.hide();
    }
  }

  // Buttons wieder anzeigen
  document.getElementById("homeButton").style.display = "block";
  document.getElementById("restartButton").style.display = "block";
}

//CHECK: - CODE viel zu lang! Kürzen!
function mainWindow() {
  console.log("Resetting to start screen with full reset...");

  // Stop all sounds immediately
  AudioHub.stopAll();

  // Hide dialog overlay
  hideDialog();

  //NOTE: Erklären lassen:
  // Clear ALL intervals and timeouts
  const highestTimeoutId = setTimeout(() => {}, 0);
  for (let i = 0; i <= highestTimeoutId; i++) {
    clearTimeout(i);
  }

  const highestIntervalId = setInterval(() => {}, 0);
  for (let i = 1; i <= highestIntervalId; i++) {
    clearInterval(i);
  }

  // Cancel ALL animation frames
  if (window.requestAnimationFrame) {
    const cancelAnim = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;
    // If world has an animation ID, cancel it
    if (cancelAnim && world && world.animationId) {
      cancelAnim(world.animationId);
    }
    // Also try to cancel any other potential animation frames
    for (let i = 0; i < 100; i++) {
      cancelAnim(i);
    }
  }

  // Destroy world completely
  world = null;

  // RECREATE THE CANVAS - this is the key change
  const canvasContainer = document.getElementById("canvas").parentElement;
  const oldCanvas = document.getElementById("canvas");
  const newCanvas = document.createElement("canvas");
  newCanvas.id = "canvas";
  newCanvas.width = oldCanvas.width;
  newCanvas.height = oldCanvas.height;
  canvasContainer.removeChild(oldCanvas);
  canvasContainer.appendChild(newCanvas);

  // Get the new canvas context
  canvas = newCanvas;
  ctx = canvas.getContext("2d");

  // Reset all game state
  gameOver = false;
  gameOverSoundPlayed = false;

  // Reset keyboard state
  if (keyboard) {
    keyboard.RIGHT = false;
    keyboard.LEFT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;
  }

  // Hide all game UI elements
  document.getElementById("keyboard-controls").classList.add("d_none");
  document.getElementById("restartButton").style.display = "none";
  document.getElementById("homeButton").style.display = "none";

  // Re-initialize level data
  initLevel();

  // Draw the start screen on the fresh canvas
  const startScreenImage = new Image();
  startScreenImage.src = "img/9_intro_outro_screens/start/startscreen_1.png";
  startScreenImage.onload = () => {
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
    drawStartText();
    document.getElementById("startButton").style.display = "block";
  };
}

function restartGame() {
  gameOverSoundPlayed = false;
  hideDialog(); // NEU
  document.getElementById("restartButton").style.display = "none";
  document.getElementById("homeButton").style.display = "none";

  // Reset game state - to prevent any new game over triggers
  gameOver = false;

  // Show keyboard controls again if they should be visible during gameplay
  document.getElementById("keyboard-controls").classList.remove("d_none");

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

  // Complete reset: destroy current world
  world = null;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Re-initialize level data explicitly
  initLevel();

  // Start fresh game after a brief pause
  setTimeout(() => {
    world = new World(canvas, keyboard);
    world.stopDrawingClouds = false; // Flag zurücksetzen
    AudioHub.playLoop(AudioHub.GAMEAUDIO);
    document.getElementById("startButton").style.display = "none";
  }, 200);
}

function showDialog(hasWon) {
  const overlay = document.getElementById("win_overlay");
  const gameOverImage = document.getElementById("game_over_image");

  if (hasWon) {
    gameOverImage.src = "img/You won, you lost/You Win A.png";
  } else {
    gameOverImage.src = "img/You won, you lost/Game Over.png";
  }

  overlay.classList.remove("d_none");
  document.body.style.overflow = "hidden";
}

function hideDialog() {
  document.getElementById("win_overlay").classList.add("d_none");
  document.body.style.overflow = "auto"; // Re-enable scrolling
}

/**
 * Toggles sound on/off
 */
function toggleSound() {
  const soundIcon = document.getElementById("soundIcon");

  // Keep track of mute state with a data attribute instead of trying to parse the image source
  let isMuted = soundIcon.getAttribute("data-muted") === "true";

  if (isMuted) {
    // Currently muted, so unmute
    soundIcon.src = "icons/unmuted-1.png"; // Change to sound-on icon
    soundIcon.setAttribute("data-muted", "false");
    AudioHub.unmuteAll();
    console.log("Sound unmuted");
  } else {
    // Currently unmuted, so mute
    soundIcon.src = "icons/muted-1.png"; // Change to muted icon
    soundIcon.setAttribute("data-muted", "true");
    AudioHub.muteAll();
    console.log("Sound muted");
  }
}

/**
 * Toggles fullscreen mode
 */
function toggleFullscreen() {
  const gameContainer = document.querySelector(".game-container");
  const fullscreenIcon = document.getElementById("fullscreenIcon");

  if (!document.fullscreenElement) {
    if (gameContainer.requestFullscreen) {
      gameContainer.requestFullscreen();
      fullscreenIcon.src = "icons/icons8-vollbild.png"; //Icon Fullscreen verlassen
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      fullscreenIcon.src = "";
    }
  }
}

//NEU
/**
 * Adds event listeners for fullscreen changes
 */
function addFullscreenListeners() {
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("mozfullscreenchange", handleFullscreenChange);
  document.addEventListener("MSFullscreenChange", handleFullscreenChange);
}
//NEU
/**
 * Handles fullscreen change events
 */
function handleFullscreenChange() {
  const canvas = document.getElementById("canvas");
  const gameContainer = document.querySelector(".game-container");

  if (document.fullscreenElement) {
    // Save original dimensions if not already saved
    if (!canvas.dataset.originalWidth) {
      canvas.dataset.originalWidth = canvas.width;
      canvas.dataset.originalHeight = canvas.height;
      canvas.dataset.originalStyleWidth = canvas.style.width || "";
      canvas.dataset.originalStyleHeight = canvas.style.height || "";
    }

    // Don't change the canvas width/height (keeps game logic the same)
    // Instead only adjust the display size with CSS
    canvas.style.width = "80vw"; // Fast die gesamte Bildschirmbreite
    canvas.style.height = "80vh"; // Fast die gesamte Bildschirmhöhe
    canvas.style.display = "block";
    canvas.style.margin = "auto";

    // Center the canvas in fullscreen mode
    gameContainer.style.display = "flex";
    gameContainer.style.justifyContent = "center";
    gameContainer.style.alignItems = "center";

    // Update fullscreen icon
    const fullscreenIcon = document.getElementById("fullscreenIcon");
    fullscreenIcon.src = "icons/icons8-vollbild.png";
  } else {
    // Restore original styles
    canvas.style.width = canvas.dataset.originalStyleWidth;
    canvas.style.height = canvas.dataset.originalStyleHeight;
    canvas.style.margin = "";

    // Reset container styles
    gameContainer.style.display = "";
    gameContainer.style.justifyContent = "";
    gameContainer.style.alignItems = "";

    // Reset fullscreen icon
    const fullscreenIcon = document.getElementById("fullscreenIcon");
    fullscreenIcon.src = "icons/icons8-vollbild.png";
  }

  // If world exists, redraw to adjust to new display size
  if (world) {
    world.draw();
  }
}
//NEU
/**
 * Adjusts world elements to the new canvas size
 */
function adjustWorldToResize() {
  // Redraw the current frame
  if (world) {
    world.draw();
  }
}

/**
 * Toggles pause/play
 */
function togglePausePlay() {
  const pausePlayIcon = document.getElementById("pausePlayIcon");

  if (!window.gamePaused) {
    // Pause the game
    window.gamePaused = true;
    pausePlayIcon.src = "icons/play-1.png"; // Change to play icon

    // Pause all audio
    AudioHub.pauseAll();

    // Pause world and animations
    if (world) {
      world.pauseGame();
    }
  } else {
    // Resume the game
    window.gamePaused = false;
    pausePlayIcon.src = "icons/pause-1.png"; // Change to pause icon

    // Resume audio if it wasn't muted
    if (!AudioHub.isMuted) {
      AudioHub.resumeAll();
    }

    // Resume world and animations
    if (world) {
      world.resumeGame();
    }
  }
}
