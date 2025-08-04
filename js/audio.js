/**
 * Toggles sound on/off and updates the sound icon accordingly.
 * Also saves the sound state to localStorage.
 */
function toggleSound() {
  const soundIcon = document.getElementById("soundIcon");
  let isMuted = soundIcon.getAttribute("data-muted") === "true";

  if (isMuted) {
    soundIcon.src = "ui-icons/unmuted.png";
    soundIcon.setAttribute("data-muted", "false");
    AudioHub.unmuteAll();
  } else {
    soundIcon.src = "ui-icons/muted.png";
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
    soundIcon.src = "ui-icons/muted.png";
    soundIcon.setAttribute("data-muted", "true");
  } else {
    soundIcon.src = "ui-icons/unmuted.png";
    soundIcon.setAttribute("data-muted", "false");
  }
}

// TEST SECTION WEGEN AUDIOPROBLEMEN SMARTPHONE

/**
 * Initializes audio after user interaction to comply with mobile autoplay policies
 */
function initAudioOnUserInteraction() {
  document.addEventListener('touchstart', function initAudio() {
    // Preload and unlock audio context
    AudioHub.unlockAudioContext();
    document.removeEventListener('touchstart', initAudio);
  }, { once: true });
}

/**
 * Unlocks audio context for mobile devices
 */
function unlockAudioForMobile() {
  if (AudioHub.audioContext && AudioHub.audioContext.state === 'suspended') {
    AudioHub.audioContext.resume().then(() => {
      console.log('Audio context resumed for mobile');
    });
  }
}

/**
 * Checks if device might be in silent mode
 */
function checkSilentMode() {
  // Test with a short audio to detect silent mode
  const testAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcgBzmU2fPNeSsFJHfH8N2QQAoUXrTr7LJUDwg9nNvrzHAGIzJ0ztKGKQ8ObbbpuFJPDwg9nNvrzHAGIz');
  testAudio.play().catch(() => {
    console.warn('Audio might be blocked or device in silent mode');
  });
}

/**
 * Diagnoses audio issues on mobile devices
 */
function diagnoseAudioIssues() {
  const issues = [];
  
  // Check if on mobile
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) issues.push('Mobile device detected');
  
  // Check AudioContext state
  if (AudioHub.audioContext) {
    issues.push(`AudioContext state: ${AudioHub.audioContext.state}`);
  }
  
  // Check if user has interacted
  if (!document.hasStoredUserActivation) {
    issues.push('No user interaction detected');
  }
  
  console.log('Audio diagnosis:', issues);
  return issues;
}