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
    saveOriginalCanvasStyles(canvas);
    setFullscreenCanvasStyles(canvas, gameContainer);
    updateFullscreenIcon(true);
  } else {
    restoreCanvasStyles(canvas, gameContainer);
    updateFullscreenIcon(false);
  }
  // redrawWorldIfExists();
  adjustWorldToResize();
}

function saveOriginalCanvasStyles(canvas) {
  if (!canvas.dataset.originalWidth) {
    canvas.dataset.originalWidth = canvas.width;
    canvas.dataset.originalHeight = canvas.height;
    canvas.dataset.originalStyleWidth = canvas.style.width || "";
    canvas.dataset.originalStyleHeight = canvas.style.height || "";
  }
}

function setFullscreenCanvasStyles(canvas, gameContainer) {
  canvas.style.width = "90vw";
  canvas.style.height = "60vh";
  canvas.style.display = "block";
  canvas.style.margin = "auto";
  gameContainer.style.display = "flex";
  gameContainer.style.justifyContent = "center";
  gameContainer.style.alignItems = "center";
}

function restoreCanvasStyles(canvas, gameContainer) {
  canvas.style.width = canvas.dataset.originalStyleWidth;
  canvas.style.height = canvas.dataset.originalStyleHeight;
  canvas.style.margin = "";
  gameContainer.style.display = "";
  gameContainer.style.justifyContent = "";
  gameContainer.style.alignItems = "";
}

function updateFullscreenIcon(isFullscreen) {
  const fullscreenIcon = document.getElementById("fullscreenIcon");
  if (isFullscreen) {
    fullscreenIcon.src = "icons/exit-fullscreen.png"; // Icon für Fullscreen verlassen
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

function hideMobileElements() {
  const gameExplanation = document.getElementById("game-explanation");
  const gameControls = document.getElementById("game-controls");
  const footer = document.querySelector("footer");

  if (gameExplanation) gameExplanation.style.display = "none";
  if (gameControls) gameControls.style.display = "none";
  if (footer) footer.style.display = "none";
}

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

function repositionMobileControls() {
  const mobileButtons = document.getElementById("mobile-buttons");
  if (mobileButtons) {
    mobileButtons.style.position = "absolute";
    mobileButtons.style.bottom = "10px";
  }
}

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
