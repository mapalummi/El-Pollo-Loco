/**
 * Manages keyboard and touch input for the game
 * Tracks key states and provides unified input handling for desktop and mobile devices
 */
class Keyboard {
  
  /**
   * Creates a new keyboard input manager and initializes all key states
   * Sets up event listeners for keyboard input handling
   */
  constructor() {
    this.RIGHT = false;
    this.LEFT = false;
    this.UP = false;
    this.DOWN = false;
    this.SPACE = false;
    this.B = false;

    this.initEventListeners();
  }

  /**
   * Initializes keyboard event listeners for keydown and keyup events
   * Sets up window-level event handlers for global key detection
   */
  initEventListeners() {
    window.addEventListener("keydown", e => this.handleKeyDown(e));
    window.addEventListener("keyup", e => this.handleKeyUp(e));
  }

  /**
   * Handles keydown events and updates corresponding key states
   * Respects game pause state and maps keys to movement/action flags
   * @param {KeyboardEvent} e - The keyboard event object containing key information
   */
  handleKeyDown(e) {
    if (window.gamePaused) return;

    switch (e.key) {
      case "ArrowRight":
        this.RIGHT = true;
        break;
      case "ArrowLeft":
        this.LEFT = true;
        break;
      case "ArrowUp":
        this.UP = true;
        break;
      case "ArrowDown":
        this.DOWN = true;
        break;
      case " ":
        this.SPACE = true;
        break;
      case "b":
        this.B = true;
        break;
    }
  }

  /**
   * Handles keyup events and resets corresponding key states
   * Respects game pause state and ensures proper key release detection
   * @param {KeyboardEvent} e - The keyboard event object containing key information
   */
  handleKeyUp(e) {
    if (window.gamePaused) return;

    switch (e.key) {
      case "ArrowRight":
        this.RIGHT = false;
        break;
      case "ArrowLeft":
        this.LEFT = false;
        break;
      case "ArrowUp":
        this.UP = false;
        break;
      case "ArrowDown":
        this.DOWN = false;
        break;
      case " ":
        this.SPACE = false;
        break;
      case "b":
        this.B = false;
        break;
    }
  }

  /**
   * Initializes touch event listeners for mobile control buttons
   * Maps touch events to corresponding keyboard states for unified input handling
   * Prevents default touch behavior to avoid scrolling and other mobile browser actions
   */
  initMobileButtons() {
    document.getElementById("moveLeftButton").addEventListener("touchstart", e => {
      e.preventDefault();
      this.LEFT = true;
    });
    document.getElementById("moveLeftButton").addEventListener("touchend", () => {
      this.LEFT = false;
    });
    document.getElementById("moveRightButton").addEventListener("touchstart", e => {
      e.preventDefault();
      this.RIGHT = true;
    });
    document.getElementById("moveRightButton").addEventListener("touchend", () => {
      this.RIGHT = false;
    });
    document.getElementById("jumpButton").addEventListener("touchstart", e => {
      e.preventDefault();
      this.SPACE = true;
    });
    document.getElementById("jumpButton").addEventListener("touchend", () => {
      this.SPACE = false;
    });
    document.getElementById("throwButton").addEventListener("touchstart", e => {
      e.preventDefault();
      this.B = true;
    });
    document.getElementById("throwButton").addEventListener("touchend", () => {
      this.B = false;
    });
  }
}
