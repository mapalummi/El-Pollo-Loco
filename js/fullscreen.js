/**
 * Toggles fullscreen mode (Desktop only) - hides browser UI but keeps page layout
 */
function toggleFullscreen() {
  // Check if device is mobile - if so, do nothing
  if (detectMobileDevice()) {
    return;
  }

  if (!document.fullscreenElement) {
    // Fullscreen aktivieren
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  } else {
    // Fullscreen verlassen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

/**
 * Adds event listeners for fullscreen changes (Desktop only)
 */
function addFullscreenListeners() {
  // Only add listeners for desktop devices
  if (!detectMobileDevice()) {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
  }
}

/**
 * Handles fullscreen change events (Desktop only)
 */
function handleFullscreenChange() {
  if (detectMobileDevice()) {
    return;
  }

  const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

  if (isFullscreen) {
    applyFullscreenStyles();
  } else {
    restoreNormalStyles();
  }

  adjustWorldToResize();
}

/**
 * Applies all necessary styles when entering fullscreen mode
 */
function applyFullscreenStyles() {
  setBodyFullscreenStyles();
  setGameContainerFullscreenStyles();
  setCornerButtonsFullscreenStyles();
  setOverlayFullscreenStyles();
  setCanvasFullscreenSize();
  updateFullscreenIcon(true);
}

/**
 * Restores all styles when exiting fullscreen mode
 */
function restoreNormalStyles() {
  resetBodyStyles();
  resetGameContainerStyles();
  resetCornerButtonsStyles();
  resetOverlayStyles();
  resetCanvasStyles();
  updateFullscreenIcon(false);
}

/**
 * Sets body styles for fullscreen mode
 */
function setBodyFullscreenStyles() {
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.backgroundColor = "#000";
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
}

/**
 * Sets game container styles for fullscreen mode
 */
function setGameContainerFullscreenStyles() {
  const gameContainer = document.querySelector(".game-container");
  gameContainer.style.display = "flex";
  gameContainer.style.justifyContent = "center";
  gameContainer.style.alignItems = "center";
  gameContainer.style.height = "100vh";
  gameContainer.style.width = "100vw";
  gameContainer.style.margin = "0";
  gameContainer.style.padding = "0";
  gameContainer.style.position = "fixed";
  gameContainer.style.top = "0";
  gameContainer.style.left = "0";
  gameContainer.style.zIndex = "9999";
}

/**
 * Sets corner buttons styles for fullscreen mode
 */
function setCornerButtonsFullscreenStyles() {
  const cornerButtons = document.getElementById("corner-buttons");
  cornerButtons.style.position = "fixed";
  cornerButtons.style.top = "20px";
  cornerButtons.style.right = "20px";
  cornerButtons.style.zIndex = "10000";
}

/**
 * Sets overlay styles for fullscreen mode
 */
function setOverlayFullscreenStyles() {
  const winOverlay = document.getElementById("win_overlay");
  if (winOverlay) {
    winOverlay.style.position = "fixed";
    winOverlay.style.top = "0";
    winOverlay.style.left = "0";
    winOverlay.style.width = "100vw";
    winOverlay.style.height = "100vh";
    winOverlay.style.zIndex = "10001";
  }
}

/**
 * Sets canvas size for fullscreen mode with aspect ratio preservation
 */
function setCanvasFullscreenSize() {
  const canvas = document.getElementById("canvas");
  const aspectRatio = 720 / 480;
  const screenRatio = window.innerWidth / window.innerHeight;

  if (screenRatio > aspectRatio) {
    canvas.style.height = "70vh";
    canvas.style.width = `${70 * aspectRatio}vh`;
  } else {
    canvas.style.width = "70vw";
    canvas.style.height = `${70 / aspectRatio}vw`;
  }
}

/**
 * Resets body styles to default
 */
function resetBodyStyles() {
  document.body.style.margin = "";
  document.body.style.padding = "";
  document.body.style.backgroundColor = "";
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}

/**
 * Resets game container styles to default
 */
function resetGameContainerStyles() {
  const gameContainer = document.querySelector(".game-container");
  const properties = [
    "display",
    "justifyContent",
    "alignItems",
    "height",
    "width",
    "margin",
    "padding",
    "position",
    "top",
    "left",
    "zIndex",
  ];
  properties.forEach(prop => (gameContainer.style[prop] = ""));
}

/**
 * Resets corner buttons styles to default
 */
function resetCornerButtonsStyles() {
  const cornerButtons = document.getElementById("corner-buttons");
  cornerButtons.style.position = "";
  cornerButtons.style.top = "";
  cornerButtons.style.right = "";
  cornerButtons.style.zIndex = "";
}

/**
 * Resets overlay styles to default
 */
function resetOverlayStyles() {
  const winOverlay = document.getElementById("win_overlay");
  const gameoverButtons = document.querySelector(".gameover-buttons");

  if (winOverlay) {
    const properties = ["position", "top", "left", "width", "height", "zIndex"];
    properties.forEach(prop => (winOverlay.style[prop] = ""));
  }

  if (gameoverButtons) {
    gameoverButtons.style.position = "";
    gameoverButtons.style.zIndex = "";
  }
}

/**
 * Resets canvas styles to default
 */
function resetCanvasStyles() {
  const canvas = document.getElementById("canvas");
  canvas.style.width = "";
  canvas.style.height = "";
}

/**
 * Saves original canvas styles as data attributes for later restoration
 * @param {HTMLCanvasElement} canvas - The canvas element to save styles for
 */
function saveOriginalCanvasStyles(canvas) {
  if (!canvas.dataset.originalWidth) {
    canvas.dataset.originalWidth = canvas.width;
    canvas.dataset.originalHeight = canvas.height;
    canvas.dataset.originalStyleWidth = canvas.style.width || "";
    canvas.dataset.originalStyleHeight = canvas.style.height || "";
  }
}

/**
 * Sets canvas and game container styles for fullscreen mode
 * @param {HTMLCanvasElement} canvas - The canvas element to style
 * @param {HTMLElement} gameContainer - The game container element to style
 */
function setFullscreenCanvasStyles(canvas, gameContainer) {
  canvas.style.width = "90vw";
  canvas.style.height = "60vh";
  canvas.style.display = "block";
  canvas.style.margin = "auto";
  gameContainer.style.display = "flex";
  gameContainer.style.justifyContent = "center";
  gameContainer.style.alignItems = "center";
}

/**
 * Restores canvas and game container styles from saved data attributes
 * @param {HTMLCanvasElement} canvas - The canvas element to restore
 * @param {HTMLElement} gameContainer - The game container element to restore
 */
function restoreCanvasStyles(canvas, gameContainer) {
  canvas.style.width = canvas.dataset.originalStyleWidth;
  canvas.style.height = canvas.dataset.originalStyleHeight;
  canvas.style.margin = "";
  gameContainer.style.display = "";
  gameContainer.style.justifyContent = "";
  gameContainer.style.alignItems = "";
}

/**
 * Updates the fullscreen icon based on current fullscreen state
 * @param {boolean} isFullscreen - Whether the application is currently in fullscreen mode
 */
function updateFullscreenIcon(isFullscreen) {
  const fullscreenIcon = document.getElementById("fullscreenIcon");
  if (isFullscreen) {
    fullscreenIcon.src = "icons/fullscreen.png"; // Icon für Fullscreen verlassen
  } else {
    fullscreenIcon.src = "icons/fullscreen.png"; // Icon für Fullscreen aktivieren
  }
}

/**
 * Adjusts world elements to the new canvas size
 */
function adjustWorldToResize() {
  if (world) {
    world.draw();
  }
}

/**
 * Handles mobile viewport optimization for landscape/portrait orientation
 */
function fillViewportOnMobile() {
  const canvas = document.getElementById("canvas");
  const gameContainer = document.querySelector(".game-container");
  const isMobileDevice = detectMobileDevice();
  const isLandscape = window.innerWidth > window.innerHeight;

  if (isMobileDevice && isLandscape) {
    saveOriginalCanvasStyles(canvas);
    setMobileFullscreenStyles(canvas, gameContainer);
    repositionMobileControls();
    hideMobileElements();
  } else if (isMobileDevice) {
    // Portrait mode on mobile - restore but keep mobile optimizations
    restoreMobileStyles(canvas, gameContainer);
    showMobileElements();
  } else {
    // Desktop - restore everything
    restoreMobileStyles(canvas, gameContainer);
    showMobileElements();
  }
  adjustWorldToResize();
}

/**
 * Sets mobile-specific fullscreen styles for canvas and game container
 * @param {HTMLCanvasElement} canvas - The canvas element to style
 * @param {HTMLElement} gameContainer - The game container element to style
 */
function setMobileFullscreenStyles(canvas, gameContainer) {
  // Force fullscreen on mobile landscape
  canvas.style.width = "100vw";
  canvas.style.height = "calc(100vh - 60px)";
  canvas.style.margin = "0";
  canvas.style.display = "block";
  canvas.style.objectFit = "cover";

  gameContainer.style.margin = "0";
  gameContainer.style.padding = "0";
  gameContainer.style.width = "100vw";
  gameContainer.style.height = "calc(100vh - 60px)";
  gameContainer.style.display = "flex";
  gameContainer.style.justifyContent = "center";
  gameContainer.style.alignItems = "center";

  // Hide scroll bars
  document.body.style.overflow = "hidden";
}

/**
 * Hides mobile-specific elements when in fullscreen landscape mode
 */
function hideMobileElements() {
  const gameExplanation = document.getElementById("game-explanation");
  const gameControls = document.getElementById("game-controls");
  const footer = document.querySelector("footer");

  if (gameExplanation) gameExplanation.style.display = "none";
  if (gameControls) gameControls.style.display = "none";
  if (footer) footer.style.display = "none";
}

/**
 * Shows mobile-specific elements when exiting fullscreen landscape mode
 */
function showMobileElements() {
  const gameExplanation = document.getElementById("game-explanation");
  const gameControls = document.getElementById("game-controls");
  const footer = document.querySelector("footer");

  if (gameExplanation && !gameExplanation.classList.contains("d_none")) {
    gameExplanation.style.display = "";
  }
  if (gameControls && !gameControls.classList.contains("d_none")) {
    gameControls.style.display = "";
  }
  if (footer) footer.style.display = "";

  // Restore scroll
  document.body.style.overflow = "";
}

/**
 * Repositions mobile control buttons for fullscreen landscape mode
 */
function repositionMobileControls() {
  const mobileButtons = document.getElementById("mobile-buttons");
  if (mobileButtons) {
    mobileButtons.style.position = "absolute";
    mobileButtons.style.bottom = "10px";
  }
}

/**
 * Restores mobile styles and elements to their original state
 * @param {HTMLCanvasElement} canvas - The canvas element to restore
 * @param {HTMLElement} gameContainer - The game container element to restore
 */
function restoreMobileStyles(canvas, gameContainer) {
  if (canvas.dataset.originalStyleWidth !== undefined) {
    canvas.style.width = canvas.dataset.originalStyleWidth;
    canvas.style.height = canvas.dataset.originalStyleHeight;
    canvas.style.margin = "";
    canvas.style.objectFit = "";
    canvas.style.maxWidth = "";
    canvas.style.maxHeight = "";
    canvas.style.zIndex = "";
  }

  gameContainer.style.margin = "";
  gameContainer.style.padding = "";
  gameContainer.style.width = "";
  gameContainer.style.height = "";
  gameContainer.style.display = "";
  gameContainer.style.justifyContent = "";
  gameContainer.style.alignItems = "";
  gameContainer.style.position = "";

  // Restore scroll
  document.body.style.overflow = "";
}
