/**
 * Represents a collectible coin object in the game
 * Extends MovableObject to inherit basic positioning, animation, and collision functionality
 */
class Coin extends MovableObject {
  x;
  y;
  width;
  height;

  offset = {
    top: 45,
    right: 45,
    bottom: 45,
    left: 45,
  };

  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png", "img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  /**
   * Creates a new coin object with specified position and starts animation
   * @param {number} x - The horizontal position of the coin
   * @param {number} y - The vertical position of the coin
   */
  constructor(x, y) {
    super().loadImage(this.IMAGES_COIN[0]);
    this.loadImages(this.IMAGES_COIN);
    this.x = x;
    this.y = y;
    this.width = 120;
    this.height = 120;
    this.animate();
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

  /**
   * Starts the coin animation loop with continuous sprite cycling
   * Updates collision frame and plays coin rotation animation every 400ms
   */
  animate() {
    setInterval(() => {
      this.getRealFrame();
      this.playAnimation(this.IMAGES_COIN);
    }, 400);
  }
}
