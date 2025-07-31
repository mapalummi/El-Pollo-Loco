function detectMobileDevice() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth < 992 && "ontouchstart" in window)
  );
}

function cleanupGameState() {
  const highestTimeoutId = setTimeout(() => {}, 0);
  for (let i = 0; i <= highestTimeoutId; i++) {
    clearTimeout(i);
  }
  const highestIntervalId = setInterval(() => {}, 0);
  for (let i = 1; i <= highestIntervalId; i++) {
    clearInterval(i);
  }
}

function resetGameStateAndUI() {
  gameOver = false;
  gameOverSoundPlayed = false;
  resetKeyboardState();
  document.getElementById("game-controls").classList.add("d_none");
  document.getElementById("restartButton").style.display = "none";
  document.getElementById("homeButton").style.display = "none";
  document.getElementById("game-explanation").classList.remove("d_none");
  initLevel();
}





function getEndboss(level) {
  return level.enemies.find(enemy => enemy instanceof Endboss);
}

function ensureEndbossWorldReference(endboss, world) {
  if (!endboss.world) endboss.world = world;
}

function showEndbossBar(endbossBar) {
  endbossBar.isVisible = true;
}

function shouldSkipEnbossBehavior(endboss, levelWidth) {
  return endboss.x > levelWidth - 500 && !endboss.isHurt && !endboss.wasHitRecently;
}

function getDistanceToEndboss(character, endboss) {
  return Math.abs(character.x - endboss.x);
}

function shouldShowEndbossBar(distanceToEndboss, endbossTriggered) {
  return distanceToEndboss < 500 || endbossTriggered;
}

function triggerEndbossAlertIfNeeded(endboss) {
  if (!endboss.isAlert && !endboss.isAttacking && !endboss.isWalking && !endboss.isDead) {
    endboss.startAlert();
  }
}

function hideEndbossBarIfNotTriggered(endbossBar, endbossTriggered) {
  if (!endbossTriggered) {
    endbossBar.isVisible = false;
  }
}

function updateEndbossBehavior(endboss, distance) {
  if (distance < 300) {
    endboss.startAttacking();
  } else if (distance < 800) {
    endboss.startWalking();
  } else {
    endboss.startAlert();
  }
}

function showNoBottlesFeedback() {
  // Optional: Visuelles Feedback für den Spieler
  console.log("Keine Flaschen mehr verfügbar!");
}


