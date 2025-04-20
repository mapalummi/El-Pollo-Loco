let canvas;
let ctx;
let character = new MovableObject();

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d"); //Tool zum hinzufügen auf die 2D-Koordinaten.

  console.log("My Character is", character);
}
