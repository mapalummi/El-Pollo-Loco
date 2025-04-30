class Bottle extends MovableObject {
  constructor(imagePath, x, y) {
    super();
    this.loadImage(imagePath); // Bild laden
    this.x = x; // X-Position
    this.y = y; // Standard-Y-Position
    this.width = 50; // Breite der Flasche
    this.height = 50; // Höhe der Flasche
  }
}
