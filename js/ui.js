function initMobileControls() {
  // Better mobile detection that combines screen size AND touch as primary input
  const isMobileDevice =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth < 992 && "ontouchstart" in window);

  if (isMobileDevice) {
    document.getElementById("mobile-buttons").classList.remove("d_none");

    if (keyboard) {
      keyboard.initMobileButtons();
    } else {
      console.error("Keyboard not initialized yet");
    }
  } else {
    // Hide controls on desktop/larger devices
    document.getElementById("mobile-buttons").classList.add("d_none");
  }
}


function toggleMobileControls(show) {
  const mobileButtons = document.getElementById("mobile-buttons");

  // Better mobile detection that combines screen size AND touch as primary input
  const isMobileDevice =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth < 992 && "ontouchstart" in window);

  if (isMobileDevice) {
    if (show) {
      mobileButtons.classList.remove("d_none");
    } else {
      mobileButtons.classList.add("d_none");
    }
  } else {
    // Always hide on desktop
    mobileButtons.classList.add("d_none");
  }
}


/**
 * Controls visibility of footer buttons based on game state and device
 * @param {boolean} show - Whether to show or hide the footer buttons
 */
function toggleFooterButtons(show) {
  const footerButtons = document.querySelector(".footer-buttons");
  // Only hide on mobile devices during gameplay
  const isMobileDevice =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth < 992 && "ontouchstart" in window);

  if (isMobileDevice) {
    if (show) {
      footerButtons.style.display = "";
    } else {
      footerButtons.style.display = "none";
    }
  } else {
    // Always show on desktop
    footerButtons.style.display = "";
  }
}


function showDialog(hasWon) {
  const overlay = document.getElementById("win_overlay");
  const gameOverImage = document.getElementById("game_over_image");

  if (hasWon) {
    gameOverImage.src = "img/You won, you lost/You Win A.png";
  } else {
    gameOverImage.src = "img/You won, you lost/Game Over.png";
  }

  overlay.classList.remove("d_none");
  document.body.style.overflow = "hidden";
}


function hideDialog() {
  document.getElementById("win_overlay").classList.add("d_none");
  document.body.style.overflow = "auto"; // Re-enable scrolling
}


/**
 * Toggle mobile controls
 * @param {boolean} show - Whether to show or hide the controls
 */
function toggleMobileControls(show) {
  const mobileButtons = document.getElementById("mobile-buttons");

  if (window.innerWidth < 768) {
    if (show) {
      mobileButtons.classList.remove("d_none");
    } else {
      mobileButtons.classList.add("d_none");
    }
  }
}


/**
 * Zeigt ein Modal mit dem angegebenen Inhaltstyp an
 */
function showModal(type) {
  const modalContainer = document.getElementById("modal-container");
  modalContainer.style.display = "flex"; // Wichtig: display auf flex setzen
  modalContainer.classList.remove("modal-hidden");

  // Alle Modal-Inhalte verstecken
  document.querySelectorAll(".modal-section").forEach(section => {
    section.classList.add("modal-hidden");
  });

  // Gewünschten Inhalt anzeigen
  document.getElementById("modal-" + type).classList.remove("modal-hidden");

  // Spiel pausieren, wenn es läuft
  if (typeof world !== "undefined" && world && !window.gamePaused) {
    togglePausePlay();
  }
}


/**
 * Schließt das Modal
 */
function closeModal() {
  const modalContainer = document.getElementById("modal-container");

  if (modalContainer) {
    // Beide Methoden zum Verstecken anwenden
    modalContainer.style.display = "none";
    modalContainer.classList.add("modal-hidden");

    // Ggf. Spiel fortsetzen
    if (window.gamePaused && typeof togglePausePlay === "function") {
      togglePausePlay();
    }
  }
}
