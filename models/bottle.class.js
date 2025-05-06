class Bottle extends MovableObject {
  x;
  y;
  width = 50;
  height = 50;

  offset = {
    top: 10,
    right: 20,
    bottom: 5,
    left: 20,
  };

  constructor(imagePath, x, y) {
    super();
    this.loadImage(imagePath); // Bild laden
    this.x = x; // X-Position
    this.y = y; // Standard-Y-Position
    this.width = 50; // Breite der Flasche
    this.height = 50; // Höhe der Flasche
  }

  getRealFrame() {
    this.rX = this.x + (this.offset?.left || 0);
    this.rY = this.y + (this.offset?.top || 0);
    this.rW = this.width - (this.offset?.left || 0) - (this.offset?.right || 0);
    this.rH = this.height - (this.offset?.top || 0) - (this.offset?.bottom || 0);

    // Debugging-Logs
    // console.log("Coin Kollisionsrahmen:", {
    //   rX: this.rX,
    //   rY: this.rY,
    //   rW: this.rW,
    //   rH: this.rH,
    // });
  }
}
