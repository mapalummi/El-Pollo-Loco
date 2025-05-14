class Keyboard {
  constructor() {
    this.RIGHT = false;
    this.LEFT = false;
    this.UP = false;
    this.DOWN = false;
    this.SPACE = false;
    this.B = false;

    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener("keydown", e => this.handleKeyDown(e));
    window.addEventListener("keyup", e => this.handleKeyUp(e));
  }

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
