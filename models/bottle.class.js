class Bottle extends MovableObject {
  x;
  y;
  width;
  height;

  offset = {
    top: 15,
    right: 30,
    bottom: 10,
    left: 30,
  };

  constructor(imagePath, x, y) {
    super();
    this.loadImage(imagePath); // Bild laden
    this.x = x; // X-Position
    this.y = y; // Standard-Y-Position
    this.width = 70; // Breite der Flasche
    this.height = 70; // Höhe der Flasche
    this.getRealFrame(); // Kollisionsrahmen setzen
  }

  getRealFrame() {
    this.rX = this.x + (this.offset?.left || 0);
    this.rY = this.y + (this.offset?.top || 0);
    this.rW = this.width - (this.offset?.left || 0) - (this.offset?.right || 0);
    this.rH = this.height - (this.offset?.top || 0) - (this.offset?.bottom || 0);
  }
}
