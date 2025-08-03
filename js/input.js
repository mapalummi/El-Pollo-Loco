/**
 * Adds keyboard event listeners for keydown and keyup events
 */
function addKeyboardListeners() {
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
}

/**
 * Handles keydown events and updates keyboard state
 * @param {KeyboardEvent} e - The keyboard event object
 */
function handleKeyDown(e) {
  if (e.repeat) return;
  if (window.gamePaused || (gameOver && world && world.ignoreControls)) return;
}

/**
 * Handles keyup events and resets keyboard state
 * @param {KeyboardEvent} e - The keyboard event object
 */
function handleKeyUp(e) {
  if (gameOver && world && world.ignoreControls) return;
  if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
    AudioHub.stopKeySound();
    if (world && world.character) {
      world.character.walkSoundPlaying = false;
    }
  }
}

/**
 * Prevents spacebar from triggering button clicks by default
 */
function preventSpaceOnButtons() {
  document.addEventListener(
    "keydown",
    e => {
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
      }
    },
    true
  );
}

/**
 * Resets all keyboard state flags to false
 */
function resetKeyboardState() {
  if (!keyboard) return;
  keyboard.RIGHT = false;
  keyboard.LEFT = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.SPACE = false;
  keyboard.D = false;
}
