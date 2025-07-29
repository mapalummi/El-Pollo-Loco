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