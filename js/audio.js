/**
 * Toggles sound on/off
 */
function toggleSound() {
  const soundIcon = document.getElementById("soundIcon");
  let isMuted = soundIcon.getAttribute("data-muted") === "true";

  if (isMuted) {
    soundIcon.src = "icons/unmuted.png";
    soundIcon.setAttribute("data-muted", "false");
    AudioHub.unmuteAll();
    // console.log("Sound unmuted");
  } else {
    soundIcon.src = "icons/muted.png";
    soundIcon.setAttribute("data-muted", "true");
    AudioHub.muteAll();
    // console.log("Sound muted");
  }
  try {
    localStorage.setItem("elPolloLoco_soundMuted", AudioHub.isMuted);
  } catch (e) {
    console.warn("Could not save sound settings to localStorage");
  }
}

function handleGameOverAudio(hasWon) {
  if (hasWon) {
    AudioHub.playOne(AudioHub.WIN);
  } else {
    AudioHub.playOne(AudioHub.GAMEOVER);
  }
}

function stopAllAudioAndDialog() {
  AudioHub.stopAll();
  hideDialog();
  cleanupGameState();
}

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