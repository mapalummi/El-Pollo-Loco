/**
 * Initializes mobile controls based on device detection
 */
function initMobileControls() {
  const isMobileDevice = detectMobileDevice();
  const mobileButtons = document.getElementById("mobile-buttons");

  if (isMobileDevice) {
    mobileButtons.classList.remove("d_none");
    if (keyboard) {
      keyboard.initMobileButtons();
    }
  } else {
    mobileButtons.classList.add("d_none");
  }
}

/**
 * Detects if the current device is a mobile device
 * @returns {boolean} True if mobile device is detected
 */
function detectMobileDevice() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth < 992 && "ontouchstart" in window)
  );
}

/**
 * Toggles the visibility of mobile control buttons
 * @param {boolean} show - Whether to show or hide the mobile controls
 */
function toggleMobileControls(show) {
  const mobileButtons = document.getElementById("mobile-buttons");
  if (detectMobileDevice()) {
    mobileButtons.classList.toggle("d_none", !show);
  } else {
    mobileButtons.classList.add("d_none");
  }
}

/**
 * Controls visibility of gameover buttons based on game state and device
 * @param {boolean} show - Whether to show or hide the footer buttons
 */

function toggleGameoverButtons(show) {
  const isMobileDevice = detectMobileDevice();
  const isLandscape = window.innerWidth > window.innerHeight;
  const isMobileLandscape = isMobileDevice && window.innerWidth <= 991 && isLandscape;

  if (isMobileLandscape) {
    const mobileButtons = document.querySelector(".mobile-gameover-buttons");
    const desktopButtons = document.querySelector(".gameover-buttons");

    if (show) {
      mobileButtons.style.display = "flex";
      desktopButtons.style.display = "none";
    } else {
      mobileButtons.style.display = "none";
    }
  } else {
    const desktopButtons = document.querySelector(".gameover-buttons");
    const mobileButtons = document.querySelector(".mobile-gameover-buttons");

    if (show) {
      desktopButtons.style.display = "flex";
      mobileButtons.style.display = "none";

      document.getElementById("homeButton").style.display = "block";
      document.getElementById("restartButton").style.display = "block";
    } else {
      desktopButtons.style.display = "none";
      mobileButtons.style.display = "none";

      document.getElementById("homeButton").style.display = "none";
      document.getElementById("restartButton").style.display = "none";
    }
  }
}

/**
 * Shows the game dialog overlay with win/lose screen
 * @param {boolean} hasWon - Whether the player has won the game
 */
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

/**
 * Hides the game dialog overlay and restores body scroll
 */
function hideDialog() {
  document.getElementById("win_overlay").classList.add("d_none");
  document.body.style.overflow = "auto";
}

/**
 * Shows a modal dialog with the specified content type
 * @param {string} type - The type of modal content to display
 */
function showModal(type) {
  const modalContainer = document.getElementById("modal-container");
  modalContainer.style.display = "flex";
  modalContainer.classList.remove("modal-hidden");

  document.querySelectorAll(".modal-section").forEach(section => {
    section.classList.add("modal-hidden");
  });

  document.getElementById("modal-" + type).classList.remove("modal-hidden");

  if (typeof world !== "undefined" && world && !window.gamePaused) {
    togglePausePlay();
  }
}

/**
 * Closes the currently open modal dialog
 */
function closeModal() {
  const modalContainer = document.getElementById("modal-container");
  if (modalContainer) {
    modalContainer.style.display = "none";
    modalContainer.classList.add("modal-hidden");
    if (window.gamePaused && typeof togglePausePlay === "function") {
      togglePausePlay();
    }
  }
}

/**
 * Draws the start screen image on the canvas
 */
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

/**
 * Hides all status bars in the game world
 */
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

/**
 * Prepares the UI for game over state
 * @param {boolean} hasWon - Whether the player has won the game
 */
function prepareGameOverUI(hasWon) {
  AudioHub.stopAll(); // NEU

  toggleGameoverButtons(true);
  showDialog(hasWon);
  toggleMobileControls(false);
  document.getElementById("game-controls").classList.add("d_none");

  if (!gameOverSoundPlayed) gameOverSoundPlayed = true;
}

/**
 * Draws the start screen image on a fresh canvas
 */
function drawStartScreenOnFreshCanvas() {
  const startScreenImage = new Image();
  startScreenImage.src = "img/9_intro_outro_screens/start/startscreen_1.png";
  startScreenImage.onload = () => {
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
    document.getElementById("startButton").style.display = "block";
  };
}

/**
 * Shows game controls appropriate for restart scenario
 */
function showControlsForRestart() {
  document.getElementById("restartButton").style.display = "none";
  document.getElementById("homeButton").style.display = "none";
  document.getElementById("game-controls").classList.remove("d_none");
}

/**
 * Displays the game over screen with appropriate win/lose state
 * @param {boolean} hasWon - Whether the player has won the game
 */
function showGameOverScreen(hasWon) {
  if (gameOver) return;
  gameOver = true;

  AudioHub.stopAll();

  prepareGameOverUI(hasWon);
  handleGameOverAudio(hasWon);
  freezeCharacterIfWon(hasWon);
  clearWorldObjects();
}

/**
 * Handles the game won scenario with delayed screen transition
 * @param {World} world - The game world object
 */
function handleGameWon(world) {
  world.gameEnded = true;

  const endboss = world.level.enemies.find(enemy => enemy instanceof Endboss);
  const animationDuration = endboss.IMAGES_DEAD.length * 200;
  setTimeout(() => {
    showGameOverScreen(true);
  }, animationDuration);
}

/**
 * Handles the game lost scenario with delayed screen transition
 * @param {World} world - The game world object
 */
function handleGameLost(world) {
  world.gameEnded = true;

  const animationDuration = world.character.IMAGES_DEAD.length * 100;
  setTimeout(() => {
    showGameOverScreen(false);
  }, animationDuration);
}

/**
 * Updates the coin collection status bar and handles completion effects
 * @param {World} world - The game world object containing coin data
 */
function updateCoinBar(world) {
  world.percentageCoins = (world.collectedCoins / world.totalCoins) * 100;
  world.coinBar.setPercentage(world.percentageCoins);

  if (world.percentageCoins >= 100) {
    world.coinBar.highlight();
    if (!world.allCoinsCollectedSoundPlayed) {
      AudioHub.playOne("COINS_COMPLETE");
      world.allCoinsCollectedSoundPlayed = true;
    }
  } else {
    world.coinBar.removeHighlight();
    world.allCoinsCollectedSoundPlayed = false;
  }
}

/**
 * Updates the bottle collection status bar based on collected bottles
 * @param {World} world - The game world object containing bottle data
 */
function updateBottleBar(world) {
  world.percentageBottles = (world.collectedBottles / world.totalBottles) * 100;
  world.bottleBar.setPercentage(world.percentageBottles);
}

/**
 * Updates the pulsing animation effect for highlighted coin bar
 * @param {World} world - The game world object containing coin bar data
 */
function updateCoinBarPulse(world) {
  if (world.coinBar.isHighlighted) {
    world.highlightPulse += 0.05 * world.highlightDirection;
    if (world.highlightPulse >= 1) {
      world.highlightDirection = -1;
    } else if (world.highlightPulse <= 0) {
      world.highlightDirection = 1;
    }
    world.coinBar.pulseValue = world.highlightPulse;
  }
}

/**
 * Draws all visible status bars to the game canvas
 * @param {World} world - The game world object containing all status bars
 */
function drawStatusBars(world) {
  if (world.bottleBar.isVisible) {
    world.addToMap(world.bottleBar);
  }
  if (world.coinBar.isVisible) {
    world.addToMap(world.coinBar);
  }
  if (world.healthBar.isVisible) {
    world.addToMap(world.healthBar);
  }
  if (world.endbossBar.isVisible) {
    world.addToMap(world.endbossBar);
  }
}
