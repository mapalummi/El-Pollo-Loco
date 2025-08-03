/**
 * Cleans up the current game state by clearing all timeouts and intervals
 */
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

/**
 * Resets game state and UI elements to initial values
 */
function resetGameStateAndUI() {
  gameOver = false;
  gameOverSoundPlayed = false;
  resetKeyboardState();
  document.getElementById("game-controls").classList.add("d_none");
  document.getElementById("restartButton").style.display = "none";
  document.getElementById("homeButton").style.display = "none";
  document.getElementById("game-explanation").classList.remove("d_none");
  document.getElementById("rotate-message").style.display = "none";
  window.gameStarted = false;
  initLevel();
}

/**
 * Finds and returns the endboss enemy from the level
 * @param {Level} level - The game level containing enemies
 * @returns {Endboss|undefined} The endboss enemy or undefined if not found
 */
function getEndboss(level) {
  return level.enemies.find(enemy => enemy instanceof Endboss);
}

/**
 * Ensures the endboss has a reference to the world object
 * @param {Endboss} endboss - The endboss enemy object
 * @param {World} world - The game world object
 */
function ensureEndbossWorldReference(endboss, world) {
  if (!endboss.world) endboss.world = world;
}

/**
 * Makes the endboss health bar visible
 * @param {StatusBar} endbossBar - The endboss health bar object
 */
function showEndbossBar(endbossBar) {
  endbossBar.isVisible = true;
}

/**
 * Determines if endboss behavior should be skipped based on position and state
 * @param {Endboss} endboss - The endboss enemy object
 * @param {number} levelWidth - The width of the game level
 * @returns {boolean} True if endboss behavior should be skipped
 */
function shouldSkipEnbossBehavior(endboss, levelWidth) {
  return endboss.x > levelWidth - 500 && !endboss.isHurt && !endboss.wasHitRecently;
}

/**
 * Calculates the distance between character and endboss
 * @param {Character} character - The player character object
 * @param {Endboss} endboss - The endboss enemy object
 * @returns {number} The absolute distance between character and endboss
 */
function getDistanceToEndboss(character, endboss) {
  return Math.abs(character.x - endboss.x);
}

/**
 * Determines if the endboss health bar should be shown
 * @param {number} distanceToEndboss - The distance between character and endboss
 * @param {boolean} endbossTriggered - Whether the endboss encounter has been triggered
 * @returns {boolean} True if the endboss bar should be shown
 */
function shouldShowEndbossBar(distanceToEndboss, endbossTriggered) {
  return distanceToEndboss < 500 || endbossTriggered;
}

/**
 * Triggers endboss alert state if conditions are met
 * @param {Endboss} endboss - The endboss enemy object
 */
function triggerEndbossAlertIfNeeded(endboss) {
  if (!endboss.isAlert && !endboss.isAttacking && !endboss.isWalking && !endboss.isDead) {
    endboss.startAlert();
  }
}

/**
 * Hides the endboss health bar if the encounter hasn't been triggered
 * @param {StatusBar} endbossBar - The endboss health bar object
 * @param {boolean} endbossTriggered - Whether the endboss encounter has been triggered
 */
function hideEndbossBarIfNotTriggered(endbossBar, endbossTriggered) {
  if (!endbossTriggered) {
    endbossBar.isVisible = false;
  }
}

/**
 * Updates endboss behavior based on distance to character
 * @param {Endboss} endboss - The endboss enemy object
 * @param {number} distance - The distance between character and endboss
 */
function updateEndbossBehavior(endboss, distance) {
  if (distance < 500) {
    endboss.startAttacking();
  } else if (distance < 800) {
    endboss.startWalking();
  } else {
    endboss.startAlert();
  }
}

/**
 * Shows feedback to the player when no bottles are available
 */
function showNoBottlesFeedback() {
  // Optional: Visuelles Feedback für den Spieler
  console.log("Keine Flaschen mehr verfügbar!");
}
