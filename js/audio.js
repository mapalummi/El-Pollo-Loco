/**
 * Toggles sound on/off
 */
function toggleSound() {
  const soundIcon = document.getElementById("soundIcon");
  // Keep track of mute state with a data attribute instead of trying to parse the image source
  let isMuted = soundIcon.getAttribute("data-muted") === "true";

  if (isMuted) {
    // Currently muted, so unmute
    soundIcon.src = "icons/unmuted-1.png"; // Change to sound-on icon
    soundIcon.setAttribute("data-muted", "false");
    AudioHub.unmuteAll();
    console.log("Sound unmuted");
  } else {
    // Currently unmuted, so mute
    soundIcon.src = "icons/muted-1.png"; // Change to muted icon
    soundIcon.setAttribute("data-muted", "true");
    AudioHub.muteAll();
    console.log("Sound muted");
  }
  // Save the current sound state to localStorage
  try {
    localStorage.setItem("elPolloLoco_soundMuted", AudioHub.isMuted);
  } catch (e) {
    console.warn("Could not save sound settings to localStorage");
  }
}

