class Coin extends MovableObject {
  constructor(imagePath, x, y) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
  }
}
