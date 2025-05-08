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
}
