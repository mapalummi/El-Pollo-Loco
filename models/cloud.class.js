/**
 * Represents a cloud object that moves across the game background
 * Extends MovableObject to inherit movement and animation functionality
 * Provides atmospheric background elements with continuous movement and respawning
 */
class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;

  /**
   * Creates a new cloud with random position and starts animation
   * @param {number} levelWidth - The width of the game level for positioning calculations
   */
  constructor(levelWidth) {
    super();
    this.levelWidth = levelWidth;
    this.images = [
      "img/5_background/layers/4_clouds/1.png",
      "img/5_background/layers/4_clouds/2.png",
      "img/5_background/layers/4_clouds/1.png",
      "img/5_background/layers/4_clouds/2.png",
    ];
    this.currentImageIndex = 0;
    this.loadImage(this.images[this.currentImageIndex]);

    this.x = Math.random() * this.levelWidth;
    this.y = 20 + Math.random() * 100;
    this.animate();
  }

  /**
   * Starts the cloud animation loop with continuous leftward movement
   * Handles cloud respawning when it moves off-screen and respects pause state
   * Runs at 60 FPS for smooth movement
   */
  animate() {
    this.animationInterval = setInterval(() => {
      if (!this.world || !this.world.paused) {
        this.moveLeft();

        if (this.x + this.width < 0) {
          this.x = this.levelWidth + Math.random() * 200;
          this.y = 20 + Math.random() * 100;
        }
      }
    }, 1000 / 60);
  }
}
