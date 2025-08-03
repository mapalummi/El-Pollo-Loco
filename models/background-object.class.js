/**
 * Represents a background object in the game world
 * Extends MovableObject to inherit basic positioning and image functionality
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Creates a new background object with specified image and position
   * @param {string} imagePath - The path to the background image file
   * @param {number} x - The horizontal position of the background object
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
