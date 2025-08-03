/**
 * Toggles sound on/off and updates the sound icon accordingly.
 * Also saves the sound state to localStorage.
 */
function toggleSound() {
  const soundIcon = document.getElementById("soundIcon");
  let isMuted = soundIcon.getAttribute("data-muted") === "true";

  if (isMuted) {
    soundIcon.src = "icons/unmuted.png";
    soundIcon.setAttribute("data-muted", "false");
    AudioHub.unmuteAll();
  } else {
    soundIcon.src = "icons/muted.png";
    soundIcon.setAttribute("data-muted", "true");
    AudioHub.muteAll();
  }
  try {
    localStorage.setItem("elPolloLoco_soundMuted", AudioHub.isMuted);
  } catch (e) {
    console.warn("Could not save sound settings to localStorage");
  }
}

/**
 * Plays the appropriate audio based on game outcome.
 * @param {boolean} hasWon - Whether the player has won the game
 */
function handleGameOverAudio(hasWon) {
  if (hasWon) {
    AudioHub.playOne(AudioHub.WIN);
  } else {
    AudioHub.playOne(AudioHub.GAMEOVER);
  }
}

/**
 * Stops all audio playback, hides dialogs and cleans up game state.
 */
function stopAllAudioAndDialog() {
  AudioHub.stopAll();
  hideDialog();
  cleanupGameState();
}

/**
 * Synchronizes the sound icon with the current mute state from AudioHub.
 */
function syncSoundIcon() {
  const soundIcon = document.getElementById("soundIcon");
  if (AudioHub.isMuted) {
    soundIcon.src = "icons/muted.png";
    soundIcon.setAttribute("data-muted", "true");
  } else {
    soundIcon.src = "icons/unmuted.png";
    soundIcon.setAttribute("data-muted", "false");
  }
}