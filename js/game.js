let canvas;
let ctx;
let world;
let gameOver = false;
let gameOverSoundPlayed = false;
let gamePaused = false;
const keyboard = new Keyboard();

/**
 * Initializes the game by coordinating setup functions
 */
function init() {
  hideRotatemessage();
  setupInitialUI();

  Promise.all([initLevel(), preloadCriticalAssets()]).then(() => {
    setupGameEnvironment();
    setupEventListeners();
    enableStartButtons();
  });
}

/**
 * Sets up the initial UI state before loading
 */
function setupInitialUI() {
  setupCanvas();
  showLoadingScreen();
  disableCornerButtons(true);
  disableStartButtons();
  document.getElementById("soundButton").classList.remove("disabled");
}

/**
 * Disables start buttons and changes text to "Loading..."
 */
function disableStartButtons() {
  const startButtons = document.querySelectorAll(".start-btn");
  startButtons.forEach(btn => {
    btn.disabled = true;
    btn.innerHTML = "Loading...";
  });
}

/**
 * Sets up the core game environment after assets are loaded
 */
function setupGameEnvironment() {
  checkInitialOrientation();
  syncSoundIcon();
  drawStartScreen();
}

/**
 * Sets up all required event listeners
 */
function setupEventListeners() {
  addKeyboardListeners();
  preventSpaceOnButtons();
  addFullscreenListeners();
  addVisibilityChangeListener();
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);
}

/**
 * Enables start buttons after loading is complete
 */
function enableStartButtons() {
  const startButtons = document.querySelectorAll(".start-btn");
  startButtons.forEach(btn => {
    btn.disabled = false;
    btn.innerHTML = btn.id === "startButton" ? "Start Game" : "🎮 Spiel starten";
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
 * @returns {Promise} Promise that resolves when all assets are loaded
 */
function preloadCriticalAssets() {
  const criticalImages = ["img/9_intro_outro_screens/start/startscreen_1.png"];

  if (criticalImages.length === 0) {
    return Promise.resolve();
  }

  return loadImageBatch(criticalImages);
}

/**
 * Loads a batch of images and returns a promise
 * @param {string[]} imageUrls - Array of image URLs to load
 * @returns {Promise} Promise that resolves when all images are loaded
 */
function loadImageBatch(imageUrls) {
  return new Promise(resolve => {
    let loadedCount = 0;
    const totalImages = imageUrls.length;

    imageUrls.forEach(src => {
      loadSingleImage(src, () => checkAllImagesLoaded(++loadedCount, totalImages, resolve));
    });
  });
}

/**
 * Loads a single image and calls the callback when done
 * @param {string} src - Image source URL
 * @param {Function} callback - Function to call when image loads or errors
 */
function loadSingleImage(src, callback) {
  const img = new Image();
  img.onload = callback;
  img.onerror = callback;
  img.src = src;
}

/**
 * Checks if all images are loaded and resolves the promise if true
 * @param {number} loadedCount - Number of images loaded
 * @param {number} totalImages - Total number of images to load
 * @param {Function} resolve - Promise resolve function
 */
function checkAllImagesLoaded(loadedCount, totalImages, resolve) {
  if (loadedCount === totalImages) {
    resolve();
  }
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
 * Enables or disables the corner buttons
 * @param {boolean} disabled - Whether the buttons should be disabled
 */
function disableCornerButtons(disabled) {
  const buttons = [
    document.getElementById("pausePlayButton"),
    document.getElementById("soundButton"),
    document.getElementById("fullscreenButton"),
  ];

  buttons.forEach(button => {
    if (disabled) {
      button.classList.add("disabled");
    } else {
      button.classList.remove("disabled");
    }
  });
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
  if (!AudioHub.audioContext) {
    AudioHub.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    setupGlobalAudioUnlock();
  }

  createAudioObjects();
  syncMuteStateWithAudioObjects();

  AudioHub.stopOne(AudioHub.MENU_AUDIO);

  AudioHub.GAMEAUDIO.load();
  AudioHub.GAMEAUDIO.currentTime = 0;
  AudioHub.playLoop(AudioHub.GAMEAUDIO);

  document.getElementById("game-explanation").classList.add("d_none");
  document.getElementById("game-controls").classList.remove("d_none");
  window.pendingGameStart = true;
  window.gameStarted = true;
  window.pendingGameStart = false;

  disableCornerButtons(false);
  launchGame();
}

function createAudioObjects() {
  if (AudioHub.MENU_AUDIO instanceof Audio) {
    return;
  }

  AudioHub.MENU_AUDIO = new Audio(AudioHub.MENU_AUDIO_SRC);
  AudioHub.GAMEAUDIO = new Audio(AudioHub.GAMEAUDIO_SRC);
  AudioHub.SLEEP = new Audio(AudioHub.SLEEP_SRC);
  AudioHub.WALK = new Audio(AudioHub.WALK_SRC);
  AudioHub.JUMP = new Audio(AudioHub.JUMP_SRC);
  AudioHub.HURT = new Audio(AudioHub.HURT_SRC);
  AudioHub.DEAD = new Audio(AudioHub.DEAD_SRC);
  AudioHub.THROW = new Audio(AudioHub.THROW_SRC);
  AudioHub.SPLASH = new Audio(AudioHub.SPLASH_SRC);
  AudioHub.COINS = new Audio(AudioHub.COINS_SRC);
  AudioHub.BOTTLES = new Audio(AudioHub.BOTTLES_SRC);
  AudioHub.CHICKEN = new Audio(AudioHub.CHICKEN_SRC);
  AudioHub.ENDBOSS = new Audio(AudioHub.ENDBOSS_SRC);
  AudioHub.ENDBOSS_ATTACK = new Audio(AudioHub.ENDBOSS_ATTACK_SRC);
  AudioHub.ENDBOSS_SOUND = new Audio(AudioHub.ENDBOSS_SOUND_SRC);
  AudioHub.WIN = new Audio(AudioHub.WIN_SRC);
  AudioHub.LOST = new Audio(AudioHub.LOST_SRC);
  AudioHub.GAMEOVER = new Audio(AudioHub.GAMEOVER_SRC);
  AudioHub.COINS_COMPLETE = new Audio(AudioHub.COINS_COMPLETE_SRC);

  AudioHub.allMobileSounds = [
    AudioHub.MENU_AUDIO,
    AudioHub.GAMEAUDIO,
    AudioHub.SLEEP,
    AudioHub.WALK,
    AudioHub.JUMP,
    AudioHub.HURT,
    AudioHub.DEAD,
    AudioHub.THROW,
    AudioHub.SPLASH,
    AudioHub.COINS,
    AudioHub.BOTTLES,
    AudioHub.CHICKEN,
    AudioHub.ENDBOSS,
    AudioHub.ENDBOSS_ATTACK,
    AudioHub.ENDBOSS_SOUND,
    AudioHub.WIN,
    AudioHub.LOST,
    AudioHub.GAMEOVER,
    AudioHub.COINS_COMPLETE,
  ];

  // TODO: Auslagern!
  // NEU: Desktop-Sounds-Array ebenfalls aktualisieren!
  AudioHub.allSounds = [
    AudioHub.MENU_AUDIO,
    AudioHub.GAMEAUDIO,
    AudioHub.SLEEP,
    AudioHub.WALK,
    AudioHub.JUMP,
    AudioHub.HURT,
    AudioHub.DEAD,
    AudioHub.THROW,
    AudioHub.SPLASH,
    AudioHub.COINS,
    AudioHub.BOTTLES,
    AudioHub.CHICKEN,
    AudioHub.ENDBOSS,
    AudioHub.ENDBOSS_ATTACK,
    AudioHub.ENDBOSS_SOUND,
    AudioHub.WIN,
    AudioHub.LOST,
    AudioHub.GAMEOVER,
    AudioHub.COINS_COMPLETE,
  ];
}

function resetAudioObjects() {
  AudioHub.MENU_AUDIO = null;
  AudioHub.GAMEAUDIO = null;
  AudioHub.SLEEP = null;
  AudioHub.WALK = null;
  AudioHub.JUMP = null;
  AudioHub.HURT = null;
  AudioHub.DEAD = null;
  AudioHub.THROW = null;
  AudioHub.SPLASH = null;
  AudioHub.COINS = null;
  AudioHub.BOTTLES = null;
  AudioHub.CHICKEN = null;
  AudioHub.ENDBOSS = null;
  AudioHub.ENDBOSS_ATTACK = null;
  AudioHub.ENDBOSS_SOUND = null;
  AudioHub.WIN = null;
  AudioHub.LOST = null;
  AudioHub.GAMEOVER = null;
  AudioHub.COINS_COMPLETE = null;
}

/**
 * Starts the mobile game with mobile-specific controls and orientation handling
 */
function startMobileGame() {
  createAudioObjects();
  syncMuteStateWithAudioObjects();
  AudioHub.stopOne(AudioHub.MENU_AUDIO);

  if (!canvas || !ctx) {
    console.warn("Game resources not fully loaded yet. Please wait a moment.");
    return;
  }

  document.getElementById("mobile-game-explanation").classList.add("d_none");
  document.getElementById("game-controls").classList.remove("d_none");
  window.pendingGameStart = true;
  window.gameStarted = true;

  const isMobileDevice = detectMobileDevice();

  disableCornerButtons(false);

  AudioHub.playLoopMobile(AudioHub.GAMEAUDIO);

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
  if (!isCanvasReady()) return;

  try {
    initGameWorld();
    setupGameAudio();
    configureGameUI();
    resetGameState();
  } catch (error) {
    handleGameLaunchError(error);
  }
}

/**
 * Checks if canvas is ready for game launch
 * @returns {boolean} Whether canvas is ready
 */
function isCanvasReady() {
  if (!canvas || !ctx) {
    console.warn("Canvas not ready. Please try again.");
    return false;
  }
  return true;
}

/**
 * Initializes the game world and enemy animations
 */
function initGameWorld() {
  MovableObject.animationsEnabled = true;
  world = new World(canvas, keyboard);
  animateEnemies();
}

/**
 * Starts animation for chicken enemies
 */
function animateEnemies() {
  world.level.enemies.forEach(enemy => {
    if (enemy instanceof Chicken || enemy instanceof LittleChicken) {
      enemy.animate();
    }
  });
}

/**
 * Sets up game audio for gameplay
 */
function setupGameAudio() {
  // AudioHub.playLoop(AudioHub.GAMEAUDIO);
  keyboard.initMobileButtons();
}

/**
 * Configures game UI elements
 */
function configureGameUI() {
  toggleGameoverButtons(false);
  fillViewportOnMobile();
  document.getElementById("startButton").style.display = "none";
}

/**
 * Resets game state and clears canvas
 */
function resetGameState() {
  gameOver = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Handles errors during game launch
 * @param {Error} error - The error that occurred
 */
function handleGameLaunchError(error) {
  console.error("Error launching game:", error);
  alert("Game couldn't be started. Please reload the page and try again.");
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
  const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(navigator.userAgent);

  const isTouchDevice = window.innerWidth <= 1024 && "ontouchstart" in window;

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
  cleanupGameResources();
  resetUIState();
  setupAudioAndControls();
  configureExplanationScreens();
  finalizeMainWindowSetup();
}

/**
 * Cleans up game resources when returning to main menu
 */
function cleanupGameResources() {
  hideGameOverUI();
  stopAllAudioAndDialog();
  cancelAllAnimations();
  destroyWorldAndCanvas();
  resetAudioObjects(); // <--- NEU
}

/**
 * Resets UI state for main menu
 */
function resetUIState() {
  resetGameStateAndUI();
  drawStartScreenOnFreshCanvas();
}

/**
 * Sets up audio and controls for main menu
 */
function setupAudioAndControls() {
  createAudioObjects(); // Audio-Objekte wiederherstellen! NEU
  syncMuteStateWithAudioObjects(); // NEUER
  AudioHub.playLoop(AudioHub.MENU_AUDIO);
  disableCornerButtons(true);
  document.getElementById("soundButton").classList.remove("disabled");
}

/**
 * Configures which explanation screen to show based on device type
 */
function configureExplanationScreens() {
  const isMobileDevice = detectMobileDevice();
  const isLandscape = window.innerWidth > window.innerHeight;
  const isMobileLandscape = isMobileDevice && window.innerWidth <= 991 && isLandscape;

  toggleExplanationScreen(isMobileLandscape);
}

/**
 * Toggles between mobile and desktop explanation screens
 * @param {boolean} isMobileLandscape - Whether the device is in mobile landscape mode
 */
function toggleExplanationScreen(isMobileLandscape) {
  const mobileExplanation = document.getElementById("mobile-game-explanation");
  const desktopExplanation = document.getElementById("game-explanation");

  if (isMobileLandscape) {
    mobileExplanation.classList.remove("d_none");
    desktopExplanation.classList.add("d_none");
  } else {
    desktopExplanation.classList.remove("d_none");
    mobileExplanation.classList.add("d_none");
  }
}

/**
 * Finalizes main window setup by resetting remaining flags
 */
function finalizeMainWindowSetup() {
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
  disableCornerButtons(true);
  toggleGameoverButtons(false);
  resetGameOverAndPause();
  showControlsForRestart();
  cleanupGameState();
  destroyWorldAndClearCanvas();
  resetAudioObjects(); // <--- NEU
  createAudioObjects(); // Audio-Objekte neu erzeugen!
  syncMuteStateWithAudioObjects();
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

    disableCornerButtons(false);
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
  pausePlayIcon.src = "ui-icons/play.png";
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
  pausePlayIcon.src = "ui-icons/pause.png";
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

// NEU:
/**
 * Synchronizes the mute state with all audio objects (Desktop & Mobile)
 */
function syncMuteStateWithAudioObjects() {
  if (AudioHub.isMuted) {
    AudioHub.muteAll();
    AudioHub.muteAllMobile && AudioHub.muteAllMobile();
  } else {
    AudioHub.unmuteAll();
    AudioHub.unmuteAllMobile && AudioHub.unmuteAllMobile();
  }
}
