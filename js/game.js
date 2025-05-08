let canvas;
let world;
let gameMusic;
const keyboard = new Keyboard();

function init() {
  initLevel(); // Wird dann später mit dem Start-Button verknüpft!
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  gameMusic = new sound("audio/fast-rocky-loop-1.mp3");
  gameMusic.play();
}

//TODO: Später anlegen:
// function startGame() {
//   canvas = document.getElementById("canvas");
//   world = new World(canvas, keyboard);
// }

// Debugging
// window.addEventListener("keydown", e => {
//   console.log(`Taste gedrückt: ${e.key}`);
// });

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}

//CHECK:
// function enableLoop() {
//   gameMusic.loop = true;
//   gameMusic.load();
// }

window.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowRight":
      keyboard.RIGHT = true;
      break;
    case "ArrowLeft":
      keyboard.LEFT = true;
      break;
    case "ArrowUp":
      keyboard.UP = true;
      break;
    case "ArrowDown":
      keyboard.DOWN = true;
      break;
    case " ":
      keyboard.SPACE = true;
      break;
    case "b":
      keyboard.B = true;
      break;
  }
  // console.log("KeyDown:", keyboard);
});

window.addEventListener("keyup", e => {
  switch (e.key) {
    case "ArrowRight":
      keyboard.RIGHT = false;
      break;
    case "ArrowLeft":
      keyboard.LEFT = false;
      break;
    case "ArrowUp":
      keyboard.UP = false;
      break;
    case "ArrowDown":
      keyboard.DOWN = false;
      break;
    case " ":
      keyboard.SPACE = false;
      break;
    case "b":
      keyboard.B = false;
      break;
  }
  // console.log("KeyUp:", keyboard);
});
