let canvas;
let world;
const keyboard = new Keyboard();

function init() {
  initLevel(); // Wird dann später mit dem Start-Button verknüpft!
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
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
