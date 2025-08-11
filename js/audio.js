/**
 * Toggles sound on/off and updates the sound icon accordingly.
 * Also saves the sound state to localStorage.
 * Handles both mobile and desktop audio muting.
 */
function toggleSound() {
  const soundIcon = document.getElementById("soundIcon");
  if (!soundIcon) return;
  let isMuted = soundIcon.getAttribute("data-muted") === "true";
  const isMobile = detectMobileDevice();

  if (isMuted) {
    soundIcon.src = "ui-icons/unmuted.png";
    soundIcon.setAttribute("data-muted", "false");
    if (isMobile) {
      AudioHub.unmuteAllMobile && AudioHub.unmuteAllMobile();
    } else {
      AudioHub.unmuteAll && AudioHub.unmuteAll();
    }
  } else {
    soundIcon.src = "ui-icons/muted.png";
    soundIcon.setAttribute("data-muted", "true");
    if (isMobile) {
      AudioHub.muteAllMobile && AudioHub.muteAllMobile();
    } else {
      AudioHub.muteAll && AudioHub.muteAll();
    }
  }
  try {
    localStorage.setItem("elPolloLoco_soundMuted", !!AudioHub.isMuted);
  } catch (e) {
    console.warn("Could not save sound settings to localStorage");
  }
}

/**
 * Plays the appropriate audio based on game outcome.
 * @param {boolean} hasWon - Whether the player has won the game
 */
function handleGameOverAudio(hasWon) {
  const isMobile = detectMobileDevice();
  if (hasWon) {
    if (isMobile) {
      AudioHub.playOneMobile(AudioHub.WIN);
    } else {
      AudioHub.playOne(AudioHub.WIN);
    }
  } else {
    if (isMobile) {
      AudioHub.playOneMobile(AudioHub.GAMEOVER);
    } else {
      AudioHub.playOne(AudioHub.GAMEOVER);
    }
  }
}

/**
 * Stops all audio playback, hides dialogs and cleans up game state.
 * Handles both mobile and desktop audio pausing/stopping.
 */
function stopAllAudioAndDialog() {
  const isMobile = detectMobileDevice();
  if (isMobile) {
    AudioHub.pauseAllMobile();
  } else {
    AudioHub.stopAll();
  }
  hideDialog();
  cleanupGameState();
}

/**
 * Synchronizes the sound icon with the current mute state from AudioHub.
 * Updates the icon and data attribute to reflect the mute state.
 */
function syncSoundIcon() {
  const soundIcon = document.getElementById("soundIcon");
  if (!soundIcon) return;
  if (AudioHub.isMuted) {
    soundIcon.src = "ui-icons/muted.png";
    soundIcon.setAttribute("data-muted", "true");
  } else {
    soundIcon.src = "ui-icons/unmuted.png";
    soundIcon.setAttribute("data-muted", "false");
  }
}
