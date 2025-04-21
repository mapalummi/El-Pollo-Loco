class MovableObject {
  x = 120;
  y = 250;
  img;
  width = 100;
  height = 150;

  // loadImage('img/test.png');
  loadImage(path) {
    this.img = new Image(); // this.img = document.getElementById('image') <img id="image" src>
    this.img.src = path;
  }

  moveRight() {
    console.log("Moving right");
  }

  moveLeft() {}
}
