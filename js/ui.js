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

function detectMobileDevice() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth < 992 && "ontouchstart" in window)
  );
}

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
    // Mobile Landscape - Mobile-Buttons verwenden
    const mobileButtons = document.querySelector(".mobile-gameover-buttons");
    const desktopButtons = document.querySelector(".gameover-buttons");

    if (show) {
      mobileButtons.style.display = "flex";
      desktopButtons.style.display = "none";
    } else {
      mobileButtons.style.display = "none";
    }
  } else {
    // Desktop oder Mobile Portrait - Desktop-Buttons verwenden
    const desktopButtons = document.querySelector(".gameover-buttons");
    const mobileButtons = document.querySelector(".mobile-gameover-buttons");

    if (show) {
      desktopButtons.style.display = "flex";
      mobileButtons.style.display = "none";

      // Einzelne Buttons auch einblenden (wichtig!)
      document.getElementById("homeButton").style.display = "block";
      document.getElementById("restartButton").style.display = "block";
    } else {
      desktopButtons.style.display = "none";
      mobileButtons.style.display = "none";

      // Einzelne Buttons auch ausblenden
      document.getElementById("homeButton").style.display = "none";
      document.getElementById("restartButton").style.display = "none";
    }
  }
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
 * Zeigt ein Modal mit dem angegebenen Inhaltstyp an
 */
function showModal(type) {
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
  const modalContainer = document.getElementById("modal-container");
  if (modalContainer) {
    modalContainer.style.display = "none";
    modalContainer.classList.add("modal-hidden");
    // Ggf. Spiel fortsetzen
    if (window.gamePaused && typeof togglePausePlay === "function") {
      togglePausePlay();
    }
  }
}

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

function prepareGameOverUI(hasWon) {
  toggleGameoverButtons(true);
  showDialog(hasWon);
  AudioHub.stopAll();
  toggleMobileControls(false);
  document.getElementById("game-controls").classList.add("d_none");
  if (!gameOverSoundPlayed) gameOverSoundPlayed = true;
}

function drawStartScreenOnFreshCanvas() {
  const startScreenImage = new Image();
  startScreenImage.src = "img/9_intro_outro_screens/start/startscreen_1.png";
  startScreenImage.onload = () => {
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
    document.getElementById("startButton").style.display = "block";
  };
}

function showControlsForRestart() {
  document.getElementById("restartButton").style.display = "none";
  document.getElementById("homeButton").style.display = "none";
  document.getElementById("game-controls").classList.remove("d_none");
}

function showGameOverScreen(hasWon) {
  if (gameOver) return;
  gameOver = true;

  prepareGameOverUI(hasWon);
  handleGameOverAudio(hasWon);
  freezeCharacterIfWon(hasWon);
  clearWorldObjects();
  // showGameOverButtons();
}

function handleGameWon(world) {
  world.gameEnded = true;
  const endboss = world.level.enemies.find(enemy => enemy instanceof Endboss);
  const animationDuration = endboss.IMAGES_DEAD.length * 200;
  setTimeout(() => {
    showGameOverScreen(true);
  }, animationDuration);
}

function handleGameLost(world) {
  world.gameEnded = true;
  const animationDuration = world.character.IMAGES_DEAD.length * 100;
  setTimeout(() => {
    showGameOverScreen(false);
  }, animationDuration);
}

function updateCoinBar(world) {
  world.percentageCoins = (world.collectedCoins / world.totalCoins) * 100;
  //Fortschritt an die Coinbar übergeben
  world.coinBar.setPercentage(world.percentageCoins);

  // Check if all coins are collected
  if (world.percentageCoins >= 100) {
    world.coinBar.highlight(); // Highlight the coin bar
    if (!world.allCoinsCollectedSoundPlayed) {
      AudioHub.playOne(AudioHub.COINS_COMPLETE);
      world.allCoinsCollectedSoundPlayed = true;
    }
  } else {
    world.coinBar.removeHighlight();
    world.allCoinsCollectedSoundPlayed = false;
  }
}

function updateBottleBar(world) {
  world.percentageBottles = (world.collectedBottles / world.totalBottles) * 100;
  world.bottleBar.setPercentage(world.percentageBottles);
}

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
