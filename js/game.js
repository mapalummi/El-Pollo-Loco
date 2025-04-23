let canvas;
let world;
let Keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas);
}

window.addEventListener("keypress", e => {
  console.log(e);
});
