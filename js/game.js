let canvas;
let world;
let gameMusic;
const keyboard = new Keyboard();

function init() {
  initLevel(); // Wird dann später mit dem Start-Button verknüpft!?
  canvas = document.getElementById("canvas");
  gameMusic = new sound("audio/fast-rocky-loop-1.mp3");
  gameMusic.enableLoop();
  console.log("Audio geladen", gameMusic.sound.src);
}

function startGame() {
  world = new World(canvas, keyboard);
  gameMusic.play();
  console.log("Audio geladen", gameMusic.sound.src);

  document.getElementById("startButton").style.display = "none";
}

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

  //Methode zum Abspielen
  this.play = function () {
    this.sound.play();
  };

  //Methode zum Stoppen
  this.stop = function () {
    this.sound.pause();
  };

  this.enableLoop = function () {
    this.sound.loop = true;
    this.sound.load();
  };
}

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
