/**
 * Base class for all status bars in the game UI
 * Extends DrawableObject to provide visual status indicators with percentage-based image selection
 * Manages visibility state and provides common functionality for health, coin, bottle, and endboss bars
 */
class StatusBar extends DrawableObject {
  IMAGES = [];
  percentage = 100;
  isVisible = true;

  /**
   * Creates a new status bar with specified images and positioning
   * @param {string[]} images - Array of image paths for different percentage states (0-100%)
   * @param {number} x - The horizontal position of the status bar
   * @param {number} y - The vertical position of the status bar
   */
  constructor(images, x, y) {
    super();
    this.IMAGES = images;
    this.loadImages(this.IMAGES);
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 55;
    this.setPercentage(100);
  }

  /**
   * Updates the status bar percentage and changes the displayed image accordingly
   * @param {number} percentage - The new percentage value (0-100)
   */
  setPercentage(percentage) {
    this.percentage = percentage; 
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the appropriate image index based on current percentage
   * Maps percentage ranges to specific image indices for visual progression
   * @returns {number} Image index (0-5) corresponding to the current percentage range
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Hides the status bar by setting visibility flag to false
   * Used to temporarily remove status bars from display without destroying them
   */
  hide() {
    this.isVisible = false;
  }

  /**
   * Shows the status bar by setting visibility flag to true
   * Used to display previously hidden status bars
   */
  show() {
    this.isVisible = true;
  }
}
