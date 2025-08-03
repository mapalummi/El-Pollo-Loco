/**
 * Toggles fullscreen mode (Desktop only) - hides browser UI but keeps page layout
 */
// function toggleFullscreen() {
//   // Check if device is mobile - if so, do nothing
//   if (detectMobileDevice()) {
//     return;
//   }

//   const fullscreenIcon = document.getElementById("fullscreenIcon");

//   if (!document.fullscreenElement) {
//     // Fullscreen auf das ganze Document anwenden
//     if (document.documentElement.requestFullscreen) {
//       document.documentElement.requestFullscreen();
//     } else if (document.documentElement.webkitRequestFullscreen) {
//       document.documentElement.webkitRequestFullscreen();
//     } else if (document.documentElement.msRequestFullscreen) {
//       document.documentElement.msRequestFullscreen();
//     }
//     updateFullscreenIcon(true);
//   } else {
//     if (document.exitFullscreen) {
//       document.exitFullscreen();
//     } else if (document.webkitExitFullscreen) {
//       document.webkitExitFullscreen();
//     } else if (document.msExitFullscreen) {
//       document.msExitFullscreen();
//     }
//     updateFullscreenIcon(false);
//   }
// }

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
// function handleFullscreenChange() {
//   // Double check - only handle if not mobile
//   if (detectMobileDevice()) {
//     return;
//   }

//   const fullscreenIcon = document.getElementById("fullscreenIcon");

//   if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
//     updateFullscreenIcon(true);
//     // Optional: Kleinere Anpassungen für bessere Darstellung
//     document.body.style.margin = "0";
//     document.body.style.padding = "0";
//   } else {
//     updateFullscreenIcon(false);
//     // Zurücksetzen
//     document.body.style.margin = "";
//     document.body.style.padding = "";
//   }

//   // Canvas neu zeichnen falls nötig
//   adjustWorldToResize();
// }

// function handleFullscreenChange() {
//   if (detectMobileDevice()) {
//     return;
//   }

//   const canvas = document.getElementById("canvas");
//   const gameContainer = document.querySelector(".game-container");

//   if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
//     // Fullscreen aktiv
//     document.body.style.margin = "0";
//     document.body.style.padding = "0";
//     document.body.style.backgroundColor = "#000";

//     // Canvas optimal positionieren
//     gameContainer.style.display = "flex";
//     gameContainer.style.justifyContent = "center";
//     gameContainer.style.alignItems = "center";
//     gameContainer.style.height = "100vh";
//     gameContainer.style.margin = "0";
//     gameContainer.style.padding = "0";

//     // Canvas maximale Größe bei Beibehaltung des Seitenverhältnisses
//     const aspectRatio = 720 / 480; // Original Canvas Verhältnis
//     const screenWidth = window.innerWidth;
//     const screenHeight = window.innerHeight;
//     const screenRatio = screenWidth / screenHeight;

//     if (screenRatio > aspectRatio) {
//       // Bildschirm ist breiter - Höhe begrenzt
//       canvas.style.height = "70vh";
//       canvas.style.width = `${70 * aspectRatio}vh`;
//     } else {
//       // Bildschirm ist höher - Breite begrenzt
//       canvas.style.width = "70vw";
//       canvas.style.height = `${70 / aspectRatio}vw`;
//     }

//     updateFullscreenIcon(true);
//   } else {
//     // Fullscreen verlassen - alles zurücksetzen
//     document.body.style.margin = "";
//     document.body.style.padding = "";
//     document.body.style.backgroundColor = "";

//     gameContainer.style.display = "";
//     gameContainer.style.justifyContent = "";
//     gameContainer.style.alignItems = "";
//     gameContainer.style.height = "";
//     gameContainer.style.margin = "";
//     gameContainer.style.padding = "";

//     canvas.style.width = "";
//     canvas.style.height = "";

//     updateFullscreenIcon(false);
//   }

//   adjustWorldToResize();
// }


function handleFullscreenChange() {
  if (detectMobileDevice()) {
    return;
  }

  const canvas = document.getElementById("canvas");
  const gameContainer = document.querySelector(".game-container");
  const cornerButtons = document.getElementById("corner-buttons");

  if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
    // Fullscreen aktiv
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#000";
    document.body.style.overflow = "hidden"; // Scrollen deaktivieren
    document.documentElement.style.overflow = "hidden"; // Auch für HTML Element

    // Canvas optimal positionieren
    gameContainer.style.display = "flex";
    gameContainer.style.justifyContent = "center";
    gameContainer.style.alignItems = "center";
    gameContainer.style.height = "100vh";
    gameContainer.style.width = "100vw"; // Vollständige Breite
    gameContainer.style.margin = "0";
    gameContainer.style.padding = "0";
    gameContainer.style.position = "fixed"; // Fixed positioning
    gameContainer.style.top = "0";
    gameContainer.style.left = "0";
    gameContainer.style.zIndex = "9999"; // Über anderen Elementen

    // Corner-Buttons sichtbar halten
    cornerButtons.style.position = "fixed";
    cornerButtons.style.top = "20px";
    cornerButtons.style.right = "20px";
    cornerButtons.style.zIndex = "10000"; // Über dem gameContainer

    // Canvas maximale Größe bei Beibehaltung des Seitenverhältnisses
    const aspectRatio = 720 / 480; // Original Canvas Verhältnis
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const screenRatio = screenWidth / screenHeight;

    if (screenRatio > aspectRatio) {
      // Bildschirm ist breiter - Höhe begrenzt
      canvas.style.height = "70vh";
      canvas.style.width = `${70 * aspectRatio}vh`;
    } else {
      // Bildschirm ist höher - Breite begrenzt
      canvas.style.width = "70vw";
      canvas.style.height = `${70 / aspectRatio}vw`;
    }

    updateFullscreenIcon(true);
  } else {
    // Fullscreen verlassen - alles zurücksetzen
    document.body.style.margin = "";
    document.body.style.padding = "";
    document.body.style.backgroundColor = "";
    document.body.style.overflow = ""; // Scrollen wieder aktivieren
    document.documentElement.style.overflow = ""; // Auch für HTML Element

    gameContainer.style.display = "";
    gameContainer.style.justifyContent = "";
    gameContainer.style.alignItems = "";
    gameContainer.style.height = "";
    gameContainer.style.width = "";
    gameContainer.style.margin = "";
    gameContainer.style.padding = "";
    gameContainer.style.position = "";
    gameContainer.style.top = "";
    gameContainer.style.left = "";
    gameContainer.style.zIndex = "";

    // Corner-Buttons zurücksetzen
    cornerButtons.style.position = "";
    cornerButtons.style.top = "";
    cornerButtons.style.right = "";
    cornerButtons.style.zIndex = "";

    canvas.style.width = "";
    canvas.style.height = "";

    updateFullscreenIcon(false);
  }

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
