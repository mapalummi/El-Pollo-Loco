function addKeyboardListeners() {
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
}

// function handleKeyDown(e) {
//   if (e.repeat) return;
//   // Skip keyboard input if game is paused, game is over or controls should be ignored
//   if (window.gamePaused || (gameOver && world && world.ignoreControls)) return;
//   if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
//     AudioHub.playWhileKeyPressed(AudioHub.WALK);
//   }
// }

function handleKeyDown(e) {
  if (e.repeat) return;
  if (window.gamePaused || (gameOver && world && world.ignoreControls)) return;
}

// function handleKeyUp(e) {
//   // Skip keyboard input if game is over with victory
//   if (gameOver && world && world.ignoreControls) return;
//   if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
//     AudioHub.stopKeySound();
//   }
// }

function handleKeyUp(e) {
  if (gameOver && world && world.ignoreControls) return;
  if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
    AudioHub.stopKeySound(); // ✅ Stop sound bei Taste loslassen
    if (world && world.character) {
      world.character.walkSoundPlaying = false;
    }
  }
}

function preventSpaceOnButtons() {
  document.addEventListener(
    "keydown",
    e => {
      // Prevent Space from activating focused buttons
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
      }
    },
    true
  );
}

function resetKeyboardState() {
  if (!keyboard) return;
  keyboard.RIGHT = false;
  keyboard.LEFT = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.SPACE = false;
  keyboard.D = false;
}