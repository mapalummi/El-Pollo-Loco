/**
 * Toggles sound on/off and updates the sound icon accordingly.
 * Also saves the sound state to localStorage.
 */
// function toggleSound() {
//   const soundIcon = document.getElementById("soundIcon");
//   let isMuted = soundIcon.getAttribute("data-muted") === "true";

//   if (isMuted) {
//     soundIcon.src = "ui-icons/unmuted.png";
//     soundIcon.setAttribute("data-muted", "false");
//     AudioHub.unmuteAll();
//   } else {
//     soundIcon.src = "ui-icons/muted.png";
//     soundIcon.setAttribute("data-muted", "true");
//     AudioHub.muteAll();
//   }
//   try {
//     localStorage.setItem("elPolloLoco_soundMuted", AudioHub.isMuted);
//   } catch (e) {
//     console.warn("Could not save sound settings to localStorage");
//   }
// }

function toggleSound() {
  const soundIcon = document.getElementById("soundIcon");
  let isMuted = soundIcon.getAttribute("data-muted") === "true";
  const isMobile = detectMobileDevice();

  if (isMuted) {
    soundIcon.src = "ui-icons/unmuted.png";
    soundIcon.setAttribute("data-muted", "false");
    if (isMobile) {
      AudioHub.unmuteAllMobile();
    } else {
      AudioHub.unmuteAll();
    }
  } else {
    soundIcon.src = "ui-icons/muted.png";
    soundIcon.setAttribute("data-muted", "true");
    if (isMobile) {
      AudioHub.muteAllMobile();
    } else {
      AudioHub.muteAll();
    }
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
// function handleGameOverAudio(hasWon) {
//   if (hasWon) {
//     AudioHub.playOne(AudioHub.WIN);
//   } else {
//     AudioHub.playOne(AudioHub.GAMEOVER);
//   }
// }

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
 */
// function stopAllAudioAndDialog() {
//   AudioHub.stopAll();
//   hideDialog();
//   cleanupGameState();
// }

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
 */
function syncSoundIcon() {
  const soundIcon = document.getElementById("soundIcon");
  if (AudioHub.isMuted) {
    soundIcon.src = "ui-icons/muted.png";
    soundIcon.setAttribute("data-muted", "true");
  } else {
    soundIcon.src = "ui-icons/unmuted.png";
    soundIcon.setAttribute("data-muted", "false");
  }
}

