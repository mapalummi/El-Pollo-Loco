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

  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);
}

function checkInitialOrientation() {
  const isMobileDevice = detectMobileDevice();
  const isLandscape = window.innerWidth > window.innerHeight;

  if (isMobileDevice && !isLandscape) {
    document.getElementById("rotate-message").style.display = "flex";
  } else {
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

// ALT:
// document.addEventListener("visibilitychange", () => {
//   if (document.hidden) {
//     AudioHub.muteAll();
//   } else {
//     AudioHub.unmuteAll();
//   }
// });

// NEU:
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // MENU_AUDIO komplett stoppen (spart Ressourcen)
    AudioHub.stopOne(AudioHub.MENU_AUDIO);
    // Spielsounds pausieren (für nahtlose Fortsetzung)
    AudioHub.pauseAll();
  } else {
    if (!window.gameStarted) {
      // Menu-Musik neu starten
      AudioHub.playLoop(AudioHub.MENU_AUDIO);
    } else {
      // Spielsounds fortsetzen
      AudioHub.resumeAll();
    }
  }
});

function startGame() {
  AudioHub.stopOne(AudioHub.MENU_AUDIO);

  document.getElementById("game-explanation").classList.add("d_none");
  document.getElementById("game-controls").classList.remove("d_none");
  window.pendingGameStart = true;
  window.gameStarted = true;
  window.pendingGameStart = false;
  launchGame();
}

function startMobileGame() {
  AudioHub.stopOne(AudioHub.MENU_AUDIO);

  document.getElementById("mobile-game-explanation").classList.add("d_none");
  document.getElementById("game-controls").classList.remove("d_none");
  window.pendingGameStart = true;
  window.gameStarted = true;

  const isMobileDevice = detectMobileDevice();

  if (!isMobileDevice) {
    window.pendingGameStart = false;
    launchGame();
  } else {
    toggleMobileControls(true);
    initMobileControls();
    checkOrientation();
  }
}

function launchGame() {
  world = new World(canvas, keyboard);
  AudioHub.playLoop(AudioHub.GAMEAUDIO);
  keyboard.initMobileButtons();

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

  if (isMobileDevice) {
    if (isLandscape) {
      handleLandscapeMode(message);
    } else {
      handlePortraitMode(message);
    }
  } else {
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

  if (detectMobileDevice()) {
    fillViewportOnMobile();
  }

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

  if (detectMobileDevice()) {
    const canvas = document.getElementById("canvas");
    const gameContainer = document.querySelector(".game-container");
    restoreMobileStyles(canvas, gameContainer);
    showMobileElements();
  }

  if (world && !window.gamePaused) {
    window.pausedDueToOrientation = true;
    world.pauseGame();
    AudioHub.pauseAll();
  }
}

function setMobileFullscreenStyles(canvas, gameContainer) {
  canvas.style.width = "100vw";
  canvas.style.height = "calc(100vh - 60px)";
  canvas.style.margin = "0";
  canvas.style.display = "block";
  canvas.style.objectFit = "contain";
  canvas.style.maxWidth = "none";
  canvas.style.maxHeight = "none";

  gameContainer.style.margin = "0";
  gameContainer.style.padding = "0";
  gameContainer.style.width = "100vw";
  gameContainer.style.height = "calc(100vh - 60px)";
  gameContainer.style.display = "flex";
  gameContainer.style.justifyContent = "center";
  gameContainer.style.alignItems = "center";
  gameContainer.style.position = "relative";

  document.body.style.overflow = "hidden";

  canvas.style.zIndex = "1";
}

function resumeGameIfPausedByOrientation() {
  if (window.pausedDueToOrientation && world) {
    window.pausedDueToOrientation = false;
    if (!window.gamePaused) {
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
  hideGameOverUI();
  stopAllAudioAndDialog();
  cancelAllAnimations();
  destroyWorldAndCanvas();
  resetGameStateAndUI();
  drawStartScreenOnFreshCanvas();

  AudioHub.playLoop(AudioHub.MENU_AUDIO);

  const isMobileDevice = detectMobileDevice();
  const isLandscape = window.innerWidth > window.innerHeight;
  const isMobileLandscape = isMobileDevice && window.innerWidth <= 991 && isLandscape;

  if (isMobileLandscape) {
    document.getElementById("mobile-game-explanation").classList.remove("d_none");
    document.getElementById("game-explanation").classList.add("d_none");
  } else {
    document.getElementById("game-explanation").classList.remove("d_none");
    document.getElementById("mobile-game-explanation").classList.add("d_none");
  }

  window.gameStarted = false;
  document.getElementById("rotate-message").style.display = "none";
}

function hideGameOverUI() {
  toggleGameoverButtons(false);
}

function cancelAllAnimations() {
  if (!window.requestAnimationFrame) return;
  const cancelAnim = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;
  if (cancelAnim && world && world.animationId) {
    cancelAnim(world.animationId);
  }
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

// function restartGame() {
//   toggleGameoverButtons(false);
//   resetGameOverAndPause();
//   showControlsForRestart();
//   cleanupGameState();
//   destroyWorldAndClearCanvas();
//   reinitLevelAndMobile();
//   startFreshGameAfterDelay();
// }

function restartGame() {
  toggleGameoverButtons(false);
  resetGameOverAndPause();
  showControlsForRestart();
  cleanupGameState();
  // Zurück zur ursprünglichen Methode
  destroyWorldAndClearCanvas();
  reinitLevelAndMobile();
  startFreshGameAfterDelay();
}

function resetGameOverAndPause() {
  gameOverSoundPlayed = false;
  gameOver = false;
  window.gamePaused = false;
  if (world) {
    world.gameEnded = false;
    world.endbossTriggered = false;
    world.paused = false;
  }
  hideDialog();
}

// function destroyWorldAndClearCanvas() {
//   if (world) {
//     world.clearGameLoopInterval();
//     if (world.animationId) {
//       cancelAnimationFrame(world.animationId);
//       world.animationId = null;
//     }
//   }
//   world = null;
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
// }

function destroyWorldAndClearCanvas() {
  if (world) {
    world.clearGameLoopInterval();
    if (world.animationId) {
      cancelAnimationFrame(world.animationId);
      world.animationId = null;
    }
  }
  world = null;
  // Canvas komplett leeren und zurücksetzen
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save(); // Canvas-Zustand speichern
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Transform zurücksetzen
  ctx.restore(); // Canvas-Zustand wiederherstellen
}

function reinitLevelAndMobile() {
  initLevel();
  initMobileControls();
}

function startFreshGameAfterDelay() {
  setTimeout(() => {
    world = new World(canvas, keyboard);
    world.stopDrawingClouds = false;
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
  pausePlayIcon.src = "icons/play.png";
  AudioHub.pauseAll();
  if (world) {
    world.lastAnimationId = world.animationId;
    stopAnimationLoop();
    world.pauseGame();
  }
}

function stopAnimationLoop() {
  if (world.animationId) {
    cancelAnimationFrame(world.animationId);
    world.animationId = null;
  }
}

function resumeGame(pausePlayIcon) {
  window.gamePaused = false;
  pausePlayIcon.src = "icons/pause.png";
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
