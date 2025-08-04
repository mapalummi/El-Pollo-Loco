let canvas;
let ctx;
let world;
let gameOver = false;
let gameOverSoundPlayed = false;
let gamePaused = false;
const keyboard = new Keyboard();

/**
 * Initializes the game by setting up canvas, orientation checks, and event listeners
 */
function init() {
  document.getElementById("rotate-message").style.display = "none";

  setupCanvas();
  showLoadingScreen();

  Promise.all([initLevel(), preloadCriticalAssets()]).then(() => {
    checkInitialOrientation();
    syncSoundIcon();
    drawStartScreen();
    addKeyboardListeners();
    preventSpaceOnButtons();
    addFullscreenListeners();
    addVisibilityChangeListener();

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
  });
}

/**
 * Shows a loading screen on the canvas immediately
 */
function showLoadingScreen() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Loading...", canvas.width / 2, canvas.height / 2);
}

/**
 * Preloads critical assets to speed up initial display
 */
function preloadCriticalAssets() {
  return new Promise(resolve => {
    const criticalImages = ["img/9_intro_outro_screens/start/startscreen_1.png"];

    let loadedCount = 0;
    const totalImages = criticalImages.length;

    if (totalImages === 0) {
      resolve();
      return;
    }

    criticalImages.forEach(src => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          resolve();
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          resolve();
        }
      };
      img.src = src;
    });
  });
}

/**
 * Adds event listener for page visibility changes to handle audio pause/resume
 */
function addVisibilityChangeListener() {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      AudioHub.stopOne(AudioHub.MENU_AUDIO);
      AudioHub.pauseAll();
    } else {
      if (!window.gameStarted) {
        AudioHub.playLoop(AudioHub.MENU_AUDIO);
      } else {
        AudioHub.resumeAll();
      }
    }
  });
}

/**
 * Checks the initial device orientation and shows rotation message if needed on mobile
 */
function checkInitialOrientation() {
  const isMobileDevice = detectMobileDevice();
  const isLandscape = window.innerWidth > window.innerHeight;

  if (isMobileDevice && !isLandscape) {
    document.getElementById("rotate-message").style.display = "flex";
  } else {
    document.getElementById("rotate-message").style.display = "none";
  }
}

/**
 * Hides the rotation message overlay
 */
function hideRotatemessage() {
  document.getElementById("rotate-message").style.display = "none";
}

/**
 * Sets up the canvas element and 2D rendering context
 */
function setupCanvas() {
  canvas = document.getElementById("canvas");

  canvas.style.display = "block";
  canvas.style.visibility = "visible";

  ctx = canvas.getContext("2d", {
    alpha: false,
    desynchronized: true,
    powerPreference: "high-performance",
  });

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Starts the game by hiding menu and launching the game world
 */
function startGame() {
  AudioHub.stopOne(AudioHub.MENU_AUDIO);

  document.getElementById("game-explanation").classList.add("d_none");
  document.getElementById("game-controls").classList.remove("d_none");
  window.pendingGameStart = true;
  window.gameStarted = true;
  window.pendingGameStart = false;
  launchGame();
}

/**
 * Starts the mobile game with mobile-specific controls and orientation handling
 */
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

/**
 * Launches the game world and initializes all game components
 */
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

/**
 * Checks device orientation and handles landscape/portrait mode changes
 */
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

/**
 * Detects if the current device is a mobile device or tablet
 * @returns {boolean} True if mobile device or tablet is detected
 */
function detectMobileDevice() {
  // User agent detection for mobile devices and tablets
  const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(navigator.userAgent);

  // Screen size and touch detection for tablets and mobile devices
  const isTouchDevice = window.innerWidth <= 1024 && "ontouchstart" in window;

  // Additional tablet-specific detection
  const isTablet =
    /iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent) ||
    (window.innerWidth >= 768 && window.innerWidth <= 1024 && "ontouchstart" in window);

  return mobileUserAgent || isTouchDevice || isTablet;
}

/**
 * Handles landscape mode on mobile devices
 * @param {HTMLElement} message - The rotation message element
 */
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

/**
 * Handles portrait mode on mobile devices
 * @param {HTMLElement} message - The rotation message element
 */
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

/**
 * Sets mobile-specific fullscreen styles for canvas and game container
 * @param {HTMLCanvasElement} canvas - The canvas element to style
 * @param {HTMLElement} gameContainer - The game container element to style
 */
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

/**
 * Resumes the game if it was paused due to orientation change
 */
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

/**
 * Freezes character movement and animation when the game is won
 * @param {boolean} hasWon - Whether the player has won the game
 */
function freezeCharacterIfWon(hasWon) {
  if (!hasWon || !world || !world.character) return;
  world.character.isFrozen = true;
  clearCharacterAnimation();
  disableKeyboardControls();
  world.ignoreControls = true;
}

/**
 * Clears all character animation intervals and timeouts
 */
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

/**
 * Disables all keyboard controls by setting them to false
 */
function disableKeyboardControls() {
  keyboard.RIGHT = false;
  keyboard.LEFT = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.SPACE = false;
  keyboard.D = false;
}

/**
 * Clears all world objects and hides status bars
 */
function clearWorldObjects() {
  if (!world) return;
  world.level.clouds = [];
  world.level.coins = [];
  world.level.bottles = [];
  world.level.enemies = [];
  world.stopDrawingClouds = true;
  hideStatusBars();
}

/**
 * Returns to the main menu screen and resets the game state
 */
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

/**
 * Hides the game over UI elements
 */
function hideGameOverUI() {
  toggleGameoverButtons(false);
}

/**
 * Cancels all active animation frames
 */
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

/**
 * Destroys the current world and recreates a fresh canvas
 */
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

/**
 * Restarts the game with a fresh world and reset state
 */
function restartGame() {
  toggleGameoverButtons(false);
  resetGameOverAndPause();
  showControlsForRestart();
  cleanupGameState();
  destroyWorldAndClearCanvas();
  reinitLevelAndMobile();
  startFreshGameAfterDelay();
}

/**
 * Resets game over and pause states
 */
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

/**
 * Destroys the world and clears the canvas completely
 */
function destroyWorldAndClearCanvas() {
  if (world) {
    world.clearGameLoopInterval();
    if (world.animationId) {
      cancelAnimationFrame(world.animationId);
      world.animationId = null;
    }
  }
  world = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.restore();
}

/**
 * Reinitializes the level and mobile controls
 */
function reinitLevelAndMobile() {
  initLevel();
  initMobileControls();
}

/**
 * Starts a fresh game after a short delay
 */
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
 * Toggles between pause and play states
 */
function togglePausePlay() {
  const pausePlayIcon = document.getElementById("pausePlayIcon");
  if (!window.gamePaused) {
    pauseGame(pausePlayIcon);
  } else {
    resumeGame(pausePlayIcon);
  }
}

/**
 * Pauses the game and updates the UI
 * @param {HTMLElement} pausePlayIcon - The pause/play icon element
 */
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

/**
 * Stops the animation loop by canceling the animation frame
 */
function stopAnimationLoop() {
  if (world.animationId) {
    cancelAnimationFrame(world.animationId);
    world.animationId = null;
  }
}

/**
 * Resumes the game and updates the UI
 * @param {HTMLElement} pausePlayIcon - The pause/play icon element
 */
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

/**
 * Restarts the animation loop with a new animation frame request
 */
function restartAnimationLoop() {
  if (!world.animationId) {
    world.animationId = requestAnimationFrame(() => world.draw());
  }
}
