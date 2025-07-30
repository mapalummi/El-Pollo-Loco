/**
 * Toggles sound on/off
 */
function toggleSound() {
  const soundIcon = document.getElementById("soundIcon");
  let isMuted = soundIcon.getAttribute("data-muted") === "true";

  if (isMuted) {
    soundIcon.src = "icons/unmuted-1.png";
    soundIcon.setAttribute("data-muted", "false");
    AudioHub.unmuteAll();
    console.log("Sound unmuted");
  } else {
    soundIcon.src = "icons/muted-1.png";
    soundIcon.setAttribute("data-muted", "true");
    AudioHub.muteAll();
    console.log("Sound muted");
  }
  try {
    localStorage.setItem("elPolloLoco_soundMuted", AudioHub.isMuted);
  } catch (e) {
    console.warn("Could not save sound settings to localStorage");
  }
}
