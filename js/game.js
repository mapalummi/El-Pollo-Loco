let canvas;
let ctx;
let world;
let gameOver = false;
let gameOverSoundPlayed = false;
let gamePaused = false;
const keyboard = new Keyboard();

function init() {
  initLevel();
  setupCanvas();
  checkInitialOrientation();
  syncSoundIcon();
  drawStartScreen();
  addKeyboardListeners();
  preventSpaceOnButtons();
  addFullscreenListeners();

  // Event Listener für Orientierungsänderungen bereits beim Laden hinzufügen
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);
}

function checkInitialOrientation() {
  const isMobileDevice = detectMobileDevice();
  const isLandscape = window.innerWidth > window.innerHeight;

  if (isMobileDevice && !isLandscape) {
    // Auf Mobilgeräten im Hochformat: rotate-message anzeigen
    document.getElementById("rotate-message").style.display = "flex";
  } else {
    // Auf Desktop oder Mobilgeräten im Querformat: verstecken
    document.getElementById("rotate-message").style.display = "none";
  }
}

function hideRotatemessage() {
  document.getElementById("rotate-message").style.display = "none";
}

function setupCanvas() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    AudioHub.muteAll();
  } else {
    AudioHub.unmuteAll();
  }
});

function startGame() {
  document.getElementById("game-explanation").classList.add("d_none");
  document.getElementById("game-controls").classList.remove("d_none");
  window.pendingGameStart = true;
  window.gameStarted = true;

  const isMobileDevice = detectMobileDevice();

  if (!isMobileDevice) {
    // Auf Desktop: Spiel direkt starten
    window.pendingGameStart = false;
    launchGame();
  } else {
    // Auf Mobile: erst Orientierung prüfen
    toggleMobileControls(true);
    initMobileControls();
    checkOrientation();
  }
}

function launchGame() {
  world = new World(canvas, keyboard);
  AudioHub.playLoop(AudioHub.GAMEAUDIO);
  keyboard.initMobileButtons();

  // Hide Gameoverbuttons on mobile during gameplay
  toggleGameoverButtons(false);
  fillViewportOnMobile();

  gameOver = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("startButton").style.display = "none";
}

function checkOrientation() {
  const isLandscape = window.innerWidth > window.innerHeight;
  const message = document.getElementById("rotate-message");
  const isMobileDevice = detectMobileDevice();

  // Orientierungsprüfung für Mobilgeräte (auch vor Spielstart)
  if (isMobileDevice) {
    if (isLandscape) {
      handleLandscapeMode(message);
    } else {
      handlePortraitMode(message);
    }
  } else {
    // Auf Desktop: immer verstecken
    message.style.display = "none";
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
    fillViewportOnMobile();
  }
  resumeGameIfPausedByOrientation();
}

function handlePortraitMode(message) {
  message.style.display = "flex";
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

function mainWindow() {
  showGameOverUIOnMain();
  stopAllAudioAndDialog();
  cancelAllAnimations();
  destroyWorldAndCanvas();
  resetGameStateAndUI();
  drawStartScreenOnFreshCanvas();

  // Game-Started Flag zurücksetzen
  window.gameStarted = false;
  document.getElementById("rotate-message").style.display = "none";
}

function showGameOverUIOnMain() {
  toggleGameoverButtons(true);
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
  world = null;
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

function restartGame() {
  resetGameOverAndPause();
  showControlsForRestart();
  cleanupGameState();
  destroyWorldAndClearCanvas();
  reinitLevelAndMobile();
  startFreshGameAfterDelay();
}

function resetGameOverAndPause() {
  gameOverSoundPlayed = false;
  gameOver = false;
  window.gamePaused = false;
// Reset world game state if it exists
  if (world) {
    world.gameEnded = false;
    world.endbossTriggered = false;
    world.paused = false;
  }
  hideDialog();
  resetPauseIcon();
}

function destroyWorldAndClearCanvas() {
  // Additional cleanup before destroying world
  if (world) {
    world.clearGameLoopInterval();
    if (world.animationId) {
      cancelAnimationFrame(world.animationId);
      world.animationId = null;
    }
  }
  world = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function reinitLevelAndMobile() {
  initLevel();
  initMobileControls();
}

function startFreshGameAfterDelay() {
  setTimeout(() => {
    world = new World(canvas, keyboard);
    world.stopDrawingClouds = false;
    // Ensure completely fresh game state
    world.gameEnded = false;
    world.endbossTriggered = false;
    AudioHub.playLoop(AudioHub.GAMEAUDIO);
    document.getElementById("startButton").style.display = "none";
  }, 200);
}

/**
 * Toggles pause/play
 */
function togglePausePlay() {
  const pausePlayIcon = document.getElementById("pausePlayIcon");
  if (!window.gamePaused) {
    pauseGame(pausePlayIcon);
  } else {
    resumeGame(pausePlayIcon);
  }
}

function pauseGame(pausePlayIcon) {
  window.gamePaused = true;
  pausePlayIcon.src = "icons/play-1.png";
  AudioHub.pauseAll();
  if (world) {
    world.lastAnimationId = world.animationId;
    stopAnimationLoop();
    world.pauseGame();
  }

  function stopAnimationLoop() {
    if (world.animationId) {
      cancelAnimationFrame(world.animationId);
      world.animationId = null;
    }
  }
}

function resumeGame(pausePlayIcon) {
  window.gamePaused = false;
  pausePlayIcon.src = "icons/pause-1.png";
  if (!AudioHub.isMuted) {
    AudioHub.resumeAll();
  }
  if (world) {
    world.resumeGame();
    restartAnimationLoop();
  }
}

function restartAnimationLoop() {
  if (!world.animationId) {
    world.animationId = requestAnimationFrame(() => world.draw());
  }
}
