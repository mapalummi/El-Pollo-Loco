let canvas;
let ctx;
let world;
let gameOver = false;
let gameOverSoundPlayed = false;
let gamePaused = false;
const keyboard = new Keyboard();

// function init() {
//   initLevel();
//   canvas = document.getElementById("canvas");
//   ctx = canvas.getContext("2d");

//   // Always hide rotation message by default
//   document.getElementById("rotate-message").style.display = "none";

//   // Synchronize sound icon with AudioHub muted state
//   const soundIcon = document.getElementById("soundIcon");
//   if (AudioHub.isMuted) {
//     soundIcon.src = "icons/muted-1.png";
//     soundIcon.setAttribute("data-muted", "true");
//   } else {
//     soundIcon.src = "icons/unmuted-1.png";
//     soundIcon.setAttribute("data-muted", "false");
//   }

//   const startScreenImage = new Image();
//   startScreenImage.src = "img/9_intro_outro_screens/start/startscreen_1.png";
//   startScreenImage.onload = () => {
//     ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
//     document.getElementById("startButton").style.display = "block";
//     document.getElementById("homeButton").style.display = "none";
//     document.getElementById("restartButton").style.display = "none";
//   };

//   document.addEventListener("keydown", e => {
//     if (e.repeat) return;
//     // Skip keyboard input if game is paused, game is over or controls should be ignored
//     if (window.gamePaused || (gameOver && world && world.ignoreControls)) return;

//     if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
//       AudioHub.playWhileKeyPressed(AudioHub.WALK);
//     }
//   });

//   document.addEventListener("keyup", e => {
//     // Skip keyboard input if game is over with victory
//     if (gameOver && world && world.ignoreControls) return;

//     if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
//       AudioHub.stopKeySound();
//     }
//   });

//   // Add this new event listener to prevent Space from activating buttons
//   document.addEventListener(
//     "keydown",
//     e => {
//       // Prevent Space from activating focused buttons
//       if (e.key === " " || e.code === "Space") {
//         e.preventDefault();
//       }
//     },
//     true
//   );

//   addFullscreenListeners();
// }

function init() {
  initLevel();
  setupCanvas();
  hideRotatemessage();
  syncSoundIcon();
  drawStartScreen();
  addKeyboardListeners();
  preventSpaceOnButtons();
  addFullscreenListeners();
}

function setupCanvas() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
}

// Always hide rotation message by default
function hideRotatemessage() {
  document.getElementById("rotate-message").style.display = "none";
}

// Synchronize sound icon with AudioHub muted state
function syncSoundIcon() {
  const soundIcon = document.getElementById("soundIcon");
  if (AudioHub.isMuted) {
    soundIcon.src = "icons/muted-1.png";
    soundIcon.setAttribute("data-muted", "true");
  } else {
    soundIcon.src = "icons/unmuted-1.png";
    soundIcon.setAttribute("data-muted", "false");
  }
}

function drawStartScreen() {
  const startScreenImage = new Image();
  startScreenImage.src = "img/9_intro_outro_screens/start/startscreen_1.png";
  startScreenImage.onload = () => {
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
    document.getElementById("startButton").style.display = "block";
    document.getElementById("homeButton").style.display = "none";
    document.getElementById("restartButton").style.display = "none";
  };
}

function addKeyboardListeners() {
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keydup", handleKeyUp);
}

function handleKeyDown(e) {
  if (e.repeat) return;
  // Skip keyboard input if game is paused, game is over or controls should be ignored
  if (window.gamePaused || (gameOver && world && world.ignoreControls)) return;
  if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
    AudioHub.playWhileKeyPressed(AudioHub.WALK);
  }
}

function handleKeyUp(e) {
  // Skip keyboard input if game is over with victory
  if (gameOver && world && world.ignoreControls) return;
  if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
    AudioHub.stopKeySound();
  }
}

// Add this new event listener to prevent Space from activating buttons
function preventSpaceOnButtons() {
  document.addEventListener(
    "keydown",
    e => {
      // Prevent Space from activating focused buttons
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
      }
    },
    true
  );
}

//
//
//

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    AudioHub.muteAll();
  } else {
    AudioHub.unmuteAll();
  }
});

//
//
//

function startGame() {
  // Add orientation check listeners when game tries to start
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);
  document.getElementById("game-explanation").classList.add("d_none");
  document.getElementById("game-controls").classList.remove("d_none");
  // Set a flag that we want to start the game
  window.pendingGameStart = true;

  // Check if it's a mobile device
  const isMobileDevice =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth < 992 && "ontouchstart" in window);
  // Only on mobile devices, check orientation and show message if needed
  if (isMobileDevice) {
    const isLandscape = window.innerWidth > window.innerHeight;
    document.getElementById("rotate-message").style.display = isLandscape ? "none" : "flex";
  }

  toggleMobileControls(true);
  initMobileControls();
  checkOrientation();
}

function launchGame() {
  world = new World(canvas, keyboard);
  AudioHub.playLoop(AudioHub.GAMEAUDIO);
  keyboard.initMobileButtons();

  // Hide Gameoverbuttons on mobile during gameplay
  toggleGameoverButtons(false);
  // Fill viewport on mobile in landscape mode
  fillViewportOnMobile();

  gameOver = false; // Gameover zurücksetzen
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("startButton").style.display = "none";
}

// function checkOrientation() {
//   const isLandscape = window.innerWidth > window.innerHeight;
//   const message = document.getElementById("rotate-message");
//   // Only consider showing/hiding rotation message on mobile devices
//   const isMobileDevice =
//     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
//     (window.innerWidth < 992 && "ontouchstart" in window);

//   if (isLandscape || !isMobileDevice) {
//     message.style.display = "none";

//     // Start game if it was pending
//     if (window.pendingGameStart) {
//       window.pendingGameStart = false;
//       launchGame();
//     } else if (world) {
//       // If game is already running, adjust canvas to fill viewport
//       fillViewportOnMobile();
//     }

//     // Resume game if it was paused due to orientation
//     if (window.pausedDueToOrientation && world) {
//       window.pausedDueToOrientation = false;
//       if (!window.gamePaused) {
//         // Only resume if not manually paused
//         world.resumeGame();
//         if (!AudioHub.isMuted) {
//           AudioHub.resumeAll();
//         }
//       }
//     }
//   } else if (isMobileDevice) {
//     message.style.display = "flex";
//     // Optional Spiel pausieren
//     if (world && !window.gamePaused) {
//       window.pausedDueToOrientation = true;
//       world.pauseGame();
//       AudioHub.pauseAll();
//     }
//   }
// }

// NEU:
function checkOrientation() {
  const isLandscape = window.innerWidth > window.innerHeight;
  const message = document.getElementById("rotate-message");
  // Only consider showing/hiding rotation message on mobile devices
  const isMobileDevice = detectMobileDevice();

  if (isLandscape || !isMobileDevice) {
    handleLandscapeMode(message);
  } else if (isMobileDevice) {
    handlePortraitMode(message);
  }
}

function detectMobileDevice() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth < 992 && "ontouchstart" in window)
  );
}

function handleLandscapeMode(message) {
  message.style.display = "none";
  // Start game if it was pending
  if (window.pendingGameStart) {
    window.pendingGameStart = false;
    launchGame();
  } else if (world) {
    // If game is already running, adjust canvas to fill viewport
    fillViewportOnMobile();
  }
  resumeGameIfPausedByOrientation();
}

function handlePortraitMode(message) {
  message.style.display = "flex";
  // Optional Spiel pausieren
  if (world && !window.gamePaused) {
    window.pausedDueToOrientation = true;
    world.pauseGame();
    AudioHub.pauseAll();
  }
}

// Resume game if it was paused due to orientation
function resumeGameIfPausedByOrientation() {
  if (window.pausedDueToOrientation && world) {
    window.pausedDueToOrientation = false;
    if (!window.gamePaused) {
      // Only resume if not manually paused
      world.resumeGame();
      if (!AudioHub.isMuted) {
        AudioHub.resumeAll();
      }
    }
  }
}

//
//
//

// function showGameOverScreen(hasWon) {
//   if (gameOver) return; // Prevent multiple game over screens
//   // Show Gameoverbuttons when game ends
//   toggleGameoverButtons(true);
//   gameOver = true;
//   showDialog(hasWon);
//   AudioHub.stopAll();
//   toggleMobileControls(false);
//   // Hide Game Explanations
//   document.getElementById("game-controls").classList.add("d_none");

//   if (!gameOverSoundPlayed) {
//     gameOverSoundPlayed = true;
//   }

//   if (hasWon) {
//     AudioHub.playOne(AudioHub.WIN);
//     // Freeze the character when the boss is defeated
//     if (world && world.character) {
//       world.character.isFrozen = true;

//       if (world.character.animationInterval) {
//         clearInterval(world.character.animationInterval);
//         world.character.animationInterval = null;
//       }
//       if (world.character.animationTimeout) {
//         clearTimeout(world.character.animationTimeout);
//         world.character.animationTimeout = null;
//       }

//       // Disable keyboard controls
//       keyboard.RIGHT = false;
//       keyboard.LEFT = false;
//       keyboard.UP = false;
//       keyboard.DOWN = false;
//       keyboard.SPACE = false;
//       keyboard.D = false;
//       // Additional flag to ignore new keyboard inputs
//       world.ignoreControls = true;
//     }
//   } else {
//     AudioHub.playOne(AudioHub.GAMEOVER);
//   }

//   // Nur den Hintergrund behalten, entfernt alle anderen Objekte
//   if (world) {
//     world.level.clouds = [];
//     world.level.coins = [];
//     world.level.bottles = [];
//     world.level.enemies = [];

//     // Wolken-Rendering deaktivieren
//     world.stopDrawingClouds = true;

//     // Hide status bars
//     if (world.healthBar && typeof world.healthBar.hide === "function") {
//       world.healthBar.hide();
//     }
//     if (world.bottleBar && typeof world.bottleBar.hide === "function") {
//       world.bottleBar.hide();
//     }
//     if (world.coinBar && typeof world.coinBar.hide === "function") {
//       world.coinBar.hide();
//     }
//     if (world.endbossBar && typeof world.endbossBar.hide === "function") {
//       world.endbossBar.hide();
//     }
//   }

//   document.getElementById("homeButton").style.display = "block";
//   document.getElementById("restartButton").style.display = "block";
// }

// NEU:
function showGameOverScreen(hasWon) {
  if (gameOver) return;
  prepareGameOverUI();
  handleGameOverAudio(hasWon);
  freezeCharacterIfWon(hasWon);
  clearWorldObjects();
  showGameOverButtons();
}

function prepareGameOverUI() {
  toggleGameoverButtons(true);
  gameOver = true;
  // showDialog(hasWon);
  showDialog(arguments[0]); // Warum???
  AudioHub.stopAll();
  toggleMobileControls(false);
  document.getElementById("game-controls").classList.add("d_none");
  if (!gameOverSoundPlayed) gameOverSoundPlayed = true;
}

function handleGameOverAudio(hasWon) {
  if (hasWon) {
    AudioHub.playOne(AudioHub.WIN);
  } else {
    AudioHub.playOne(AudioHub.GAMEOVER);
  }
}

function freezeCharacterIfWon(hasWon) {
  if (!hasWon || !world || !world.character) return;
  world.character.isFrozen = true;
  clearCharacterAnimation();
  disableKeyboardControls();
  world.ignoreControls = true;
}

function clearCharacterAnimation() {
  if (world.character.animationInterval) {
    clearInterval(world.character.animationInterval);
    world.character.animationInterval = null;
  }
  if (world.character.animationTimeout) {
    clearTimeout(world.character.animationTimeout);
    world.character.animationTimeout = null;
  }
}

function disableKeyboardControls() {
  keyboard.RIGHT = false;
  keyboard.LEFT = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.SPACE = false;
  keyboard.D = false;
}

function clearWorldObjects() {
  if (!world) return;
  world.level.clouds = [];
  world.level.coins = [];
  world.level.bottles = [];
  world.level.enemies = [];
  world.stopDrawingClouds = true;
  hideStatusBars();
}

function hideStatusBars() {
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

function showGameOverButtons() {
  document.getElementById("homeButton").style.display = "block";
  document.getElementById("restartButton").style.display = "block";
}

//
//
//

// function mainWindow() {
//   // Show Gameoverbuttons when returning to main window
//   toggleGameoverButtons(true);
//   AudioHub.stopAll();

//   // Hide dialog overlay
//   hideDialog();
//   cleanupGameState();

//   // Cancel ALL animation frames
//   if (window.requestAnimationFrame) {
//     const cancelAnim = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;
//     // If world has an animation ID, cancel it
//     if (cancelAnim && world && world.animationId) {
//       cancelAnim(world.animationId);
//     }
//     // Also try to cancel any other potential animation frames
//     for (let i = 0; i < 100; i++) {
//       cancelAnim(i);
//     }
//   }

//   // Destroy world completely
//   world = null;

//   // RECREATE THE CANVAS - this is the key change
//   const canvasContainer = document.getElementById("canvas").parentElement;
//   const oldCanvas = document.getElementById("canvas");
//   const newCanvas = document.createElement("canvas");
//   newCanvas.id = "canvas";
//   newCanvas.width = oldCanvas.width;
//   newCanvas.height = oldCanvas.height;
//   canvasContainer.removeChild(oldCanvas);
//   canvasContainer.appendChild(newCanvas);

//   // Get the new canvas context
//   canvas = newCanvas;
//   ctx = canvas.getContext("2d");

//   // Reset all game state
//   gameOver = false;
//   gameOverSoundPlayed = false;

//   // Reset keyboard state
//   if (keyboard) {
//     keyboard.RIGHT = false;
//     keyboard.LEFT = false;
//     keyboard.UP = false;
//     keyboard.DOWN = false;
//     keyboard.SPACE = false;
//     keyboard.D = false;
//   }

//   // Hide/show all game UI elements
//   document.getElementById("game-controls").classList.add("d_none");
//   document.getElementById("restartButton").style.display = "none";
//   document.getElementById("homeButton").style.display = "none";
//   document.getElementById("game-explanation").classList.remove("d_none");

//   initLevel();

//   // Draw the start screen on the fresh canvas
//   const startScreenImage = new Image();
//   startScreenImage.src = "img/9_intro_outro_screens/start/startscreen_1.png";
//   startScreenImage.onload = () => {
//     ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
//     document.getElementById("startButton").style.display = "block";
//   };
// }

function mainWindow() {
  showGameOverUIOnMain();
  stopAllAudioAndDialog();
  cancelAllAnimations();
  destroyWorldAndCanvas();
  resetGameStateAndUI();
  drawStartScreenOnFreshCanvas();
}

function showGameOverUIOnMain() {
  toggleGameoverButtons(true);
}

function stopAllAudioAndDialog() {
  AudioHub.stopAll();
  hideDialog();
  cleanupGameState();
}

function cancelAllAnimations() {
  if (!window.requestAnimationFrame) return;
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

function destroyWorldAndCanvas() {
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
  canvas = newCanvas;
  ctx = canvas.getContext("2d");
}

function resetGameStateAndUI() {
  // Reset all game state
  gameOver = false;
  gameOverSoundPlayed = false;
  resetKeyboardState();
  document.getElementById("game-controls").classList.add("d_none");
  document.getElementById("restartButton").style.display = "none";
  document.getElementById("homeButton").style.display = "none";
  document.getElementById("game-explanation").classList.remove("d_none");
  initLevel();
}

function resetKeyboardState() {
  if (!keyboard) return;
  keyboard.RIGHT = false;
  keyboard.LEFT = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.SPACE = false;
  keyboard.D = false;
}

function drawStartScreenOnFreshCanvas() {
  const startScreenImage = new Image();
  startScreenImage.src = "img/9_intro_outro_screens/start/startscreen_1.png";
  startScreenImage.onload = () => {
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
    document.getElementById("startButton").style.display = "block";
  };
}

//
//
//

function restartGame() {
  gameOverSoundPlayed = false;
  hideDialog();
  document.getElementById("restartButton").style.display = "none";
  document.getElementById("homeButton").style.display = "none";

  // Reset game state - to prevent any new game over triggers
  gameOver = false;

  // Reset pause state explicitly
  window.gamePaused = false;
  const pausePlayIcon = document.getElementById("pausePlayIcon");
  if (pausePlayIcon) {
    pausePlayIcon.src = "icons/pause-1.png"; // Reset to pause icon
  }

  // Show keyboard controls again if they should be visible during gameplay
  document.getElementById("game-controls").classList.remove("d_none");
  cleanupGameState();

  // Complete reset: destroy current world
  world = null;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Re-initialize level data explicitly
  initLevel();
  initMobileControls();

  // Start fresh game after a brief pause
  setTimeout(() => {
    world = new World(canvas, keyboard);
    world.stopDrawingClouds = false; // Flag zurücksetzen
    AudioHub.playLoop(AudioHub.GAMEAUDIO);
    document.getElementById("startButton").style.display = "none";
  }, 200);
}

// Clear ALL intervals in the page
function cleanupGameState() {
  const highestTimeoutId = setTimeout(() => {}, 0);
  for (let i = 0; i <= highestTimeoutId; i++) {
    clearTimeout(i);
  }

  // Stop all intervals too
  const highestIntervalId = setInterval(() => {}, 0);
  for (let i = 1; i <= highestIntervalId; i++) {
    clearInterval(i);
  }
}

/**
 * Toggles pause/play
 */
function togglePausePlay() {
  const pausePlayIcon = document.getElementById("pausePlayIcon");

  if (!window.gamePaused) {
    window.gamePaused = true;
    pausePlayIcon.src = "icons/play-1.png"; // Change to play icon
    AudioHub.pauseAll();

    // Pause world and animations
    if (world) {
      // Store the current animation ID before pausing
      world.lastAnimationId = world.animationId;

      // Stop the animation loop
      if (world.animationId) {
        cancelAnimationFrame(world.animationId);
        world.animationId = null;
      }

      // Pause the game logic
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
      // Resume the game logic
      world.resumeGame();

      // Restart the animation loop if not already running
      if (!world.animationId) {
        world.animationId = requestAnimationFrame(() => world.draw());
      }
    }
  }
}
