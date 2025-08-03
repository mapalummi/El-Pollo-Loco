/**
 * Represents a collectible bottle object in the game
 * Extends MovableObject to inherit basic positioning and image functionality
 */
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

  /**
   * Creates a new bottle object with specified image and position
   * @param {string} imagePath - The path to the bottle image file
   * @param {number} x - The horizontal position of the bottle
   * @param {number} y - The vertical position of the bottle
   */
  constructor(imagePath, x, y) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 70;
    this.getRealFrame();
  }

  /**
   * Calculates and sets the real collision frame based on offset values
   * Updates the collision boundaries (rX, rY, rW, rH) for accurate hit detection
   */
  getRealFrame() {
    this.rX = this.x + (this.offset?.left || 0);
    this.rY = this.y + (this.offset?.top || 0);
    this.rW = this.width - (this.offset?.left || 0) - (this.offset?.right || 0);
    this.rH = this.height - (this.offset?.top || 0) - (this.offset?.bottom || 0);
  }
}
