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

  // Always hide rotation message by default
  document.getElementById("rotate-message").style.display = "none";

  //NEU (kann später raus)
  // Debug info for mobile detection
  if (window.innerWidth < 768 || "ontouchstart" in window) {
    console.log("Mobile device detected, width:", window.innerWidth);

    // Create a small debug element
    const debugEl = document.createElement("div");
    debugEl.style.position = "fixed";
    debugEl.style.bottom = "5px";
    debugEl.style.left = "5px";
    debugEl.style.background = "rgba(0,0,0,0.5)";
    debugEl.style.color = "white";
    debugEl.style.padding = "5px";
    debugEl.style.fontSize = "10px";
    debugEl.style.zIndex = "9999";
    debugEl.textContent = "Mobile: " + window.innerWidth + "px";
    document.body.appendChild(debugEl);
  }

  //NEU Local Storage
  // Synchronize sound icon with AudioHub muted state
  const soundIcon = document.getElementById("soundIcon");
  if (AudioHub.isMuted) {
    soundIcon.src = "icons/muted-1.png";
    soundIcon.setAttribute("data-muted", "true");
  } else {
    soundIcon.src = "icons/unmuted-1.png";
    soundIcon.setAttribute("data-muted", "false");
  }

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

  addFullscreenListeners();
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    AudioHub.muteAll();
  } else {
    AudioHub.unmuteAll();
  }
});

function drawStartText() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  const textYPosition = canvas.height - 25; // Abstand von der unteren Kante (25px)
  ctx.fillText("Drücke Start, um das Spiel zu beginnen!", canvas.width / 2, textYPosition);
}

//NEU:
function startGame() {
  // Add orientation check listeners when game tries to start
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);

  // Set a flag that we want to start the game
  window.pendingGameStart = true;

  //NEU
  // Check if it's a mobile device
  const isMobileDevice =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth < 992 && "ontouchstart" in window);

  // Only on mobile devices, check orientation and show message if needed
  if (isMobileDevice) {
    const isLandscape = window.innerWidth > window.innerHeight;
    document.getElementById("rotate-message").style.display = isLandscape ? "none" : "flex";
  }

  //NEU
  toggleMobileControls(true);
  initMobileControls();

  // Check orientation before starting the game
  checkOrientation();
}

function launchGame() {
  world = new World(canvas, keyboard);
  AudioHub.playLoop(AudioHub.GAMEAUDIO);
  keyboard.initMobileButtons();

  // Show keyboard controls
  document.getElementById("keyboard-controls").classList.remove("d_none");

  // Hide footer buttons on mobile during gameplay
  toggleFooterButtons(false);

  //NEU
  // Fill viewport on mobile in landscape mode
  fillViewportOnMobile();

  gameOver = false; // Gameover zurücksetzen
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("startButton").style.display = "none";
}

function checkOrientation() {
  const isLandscape = window.innerWidth > window.innerHeight;
  const message = document.getElementById("rotate-message");

  // Only consider showing/hiding rotation message on mobile devices
  const isMobileDevice =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth < 992 && "ontouchstart" in window);

  if (isLandscape || !isMobileDevice) {
    message.style.display = "none";

    // Start game if it was pending
    if (window.pendingGameStart) {
      window.pendingGameStart = false;
      launchGame();
    } else if (world) {
      // If game is already running, adjust canvas to fill viewport
      fillViewportOnMobile();
    }

    // Resume game if it was paused due to orientation
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
  } else if (isMobileDevice) {
    message.style.display = "flex";
    // Optional Spiel pausieren
    if (world && !window.gamePaused) {
      window.pausedDueToOrientation = true;
      world.pauseGame();
      AudioHub.pauseAll();
    }
  }
}

function initMobileControls() {
  // Better mobile detection that combines screen size AND touch as primary input
  const isMobileDevice =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth < 992 && "ontouchstart" in window);

  if (isMobileDevice) {
    console.log("True mobile device detected, initializing mobile controls");
    document.getElementById("mobile-buttons").classList.remove("d_none");

    if (keyboard) {
      keyboard.initMobileButtons();
    } else {
      console.error("Keyboard not initialized yet");
    }
  } else {
    // Hide controls on desktop/larger devices
    document.getElementById("mobile-buttons").classList.add("d_none");
    console.log("Desktop device detected, hiding mobile controls");
  }
}

function toggleMobileControls(show) {
  const mobileButtons = document.getElementById("mobile-buttons");

  // Better mobile detection that combines screen size AND touch as primary input
  const isMobileDevice =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth < 992 && "ontouchstart" in window);

  if (isMobileDevice) {
    if (show) {
      mobileButtons.classList.remove("d_none");
    } else {
      mobileButtons.classList.add("d_none");
    }
  } else {
    // Always hide on desktop
    mobileButtons.classList.add("d_none");
  }
}

/**
 * Controls visibility of footer buttons based on game state and device
 * @param {boolean} show - Whether to show or hide the footer buttons
 */
function toggleFooterButtons(show) {
  const footerButtons = document.querySelector(".footer-buttons");

  // Only hide on mobile devices during gameplay
  const isMobileDevice =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth < 992 && "ontouchstart" in window);

  if (isMobileDevice) {
    if (show) {
      footerButtons.style.display = "";
    } else {
      footerButtons.style.display = "none";
    }
  } else {
    // Always show on desktop
    footerButtons.style.display = "";
  }
}

function showGameOverScreen(hasWon) {
  if (gameOver) return; // Prevent multiple game over screens

  //NEU
  // Show footer buttons when game ends
  toggleFooterButtons(true);

  gameOver = true;
  showDialog(hasWon);

  AudioHub.stopAll();

  //NEU:
  toggleMobileControls(false);

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

  //NEU
  // Show footer buttons when returning to main window
  toggleFooterButtons(true);

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

  //NEU
  initMobileControls();

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

  //NEU Local Storage
  // Save the current sound state to localStorage
  try {
    localStorage.setItem("elPolloLoco_soundMuted", AudioHub.isMuted);
  } catch (e) {
    console.warn("Could not save sound settings to localStorage");
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

/**
 * Toggle mobile controls
 * @param {boolean} show - Whether to show or hide the controls
 */
function toggleMobileControls(show) {
  const mobileButtons = document.getElementById("mobile-buttons");

  if (window.innerWidth < 768) {
    if (show) {
      mobileButtons.classList.remove("d_none");
    } else {
      mobileButtons.classList.add("d_none");
    }
  }
}

/**
 * Adds event listeners for fullscreen changes
 */
function addFullscreenListeners() {
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("mozfullscreenchange", handleFullscreenChange);
  document.addEventListener("MSFullscreenChange", handleFullscreenChange);
}

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
    canvas.style.width = "90vw"; // Fast die gesamte Bildschirmbreite
    canvas.style.height = "60vh"; // Fast die gesamte Bildschirmhöhe
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

/**
 * Zeigt ein Modal mit dem angegebenen Inhaltstyp an
 */
function showModal(type) {
  console.log("Opening modal:", type);
  // Modal anzeigen
  const modalContainer = document.getElementById("modal-container");
  modalContainer.style.display = "flex"; // Wichtig: display auf flex setzen
  modalContainer.classList.remove("modal-hidden");

  // Alle Modal-Inhalte verstecken
  document.querySelectorAll(".modal-section").forEach(section => {
    section.classList.add("modal-hidden");
  });

  // Gewünschten Inhalt anzeigen
  document.getElementById("modal-" + type).classList.remove("modal-hidden");

  // Spiel pausieren, wenn es läuft
  if (typeof world !== "undefined" && world && !window.gamePaused) {
    togglePausePlay();
  }
}

/**
 * Schließt das Modal
 */
function closeModal() {
  console.log("Modal wird geschlossen");
  const modalContainer = document.getElementById("modal-container");

  if (modalContainer) {
    // Beide Methoden zum Verstecken anwenden
    modalContainer.style.display = "none";
    modalContainer.classList.add("modal-hidden");

    // Ggf. Spiel fortsetzen
    if (window.gamePaused && typeof togglePausePlay === "function") {
      togglePausePlay();
    }
  }
}

//NEU
function fillViewportOnMobile() {
  const canvas = document.getElementById("canvas");
  const gameContainer = document.querySelector(".game-container");

  // Better mobile detection
  const isMobileDevice =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth < 992 && "ontouchstart" in window);

  const isLandscape = window.innerWidth > window.innerHeight;

  if (isMobileDevice && isLandscape) {
    // Save original dimensions if not already saved
    if (!canvas.dataset.originalWidth) {
      canvas.dataset.originalWidth = canvas.width;
      canvas.dataset.originalHeight = canvas.height;
      canvas.dataset.originalStyleWidth = canvas.style.width || "";
      canvas.dataset.originalStyleHeight = canvas.style.height || "";
    }

    // Fill entire viewport
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.margin = "0";
    canvas.style.display = "block";

    // Ensure the container also fills the viewport
    gameContainer.style.margin = "0";
    gameContainer.style.padding = "0";
    gameContainer.style.width = "100vw";
    gameContainer.style.height = "100vh";

    // Reposition mobile controls if needed
    const mobileButtons = document.getElementById("mobile-buttons");
    if (mobileButtons) {
      mobileButtons.style.position = "absolute";
      mobileButtons.style.bottom = "10px";
    }
  } else {
    // Use regular sizing for desktop or portrait mode
    if (canvas.dataset.originalStyleWidth) {
      canvas.style.width = canvas.dataset.originalStyleWidth;
      canvas.style.height = canvas.dataset.originalStyleHeight;
      canvas.style.margin = "";
    }

    gameContainer.style.margin = "";
    gameContainer.style.padding = "";
    gameContainer.style.width = "";
    gameContainer.style.height = "";
  }

  // If world exists, redraw to adjust to new display size
  if (world) {
    world.draw();
  }
}
