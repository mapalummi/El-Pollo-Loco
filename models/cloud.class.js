class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;

  constructor(levelWidth) {
    super();
    this.levelWidth = levelWidth; // Speichere levelWidth als Instanzvariable
    this.images = [
      "img/5_background/layers/4_clouds/1.png",
      "img/5_background/layers/4_clouds/2.png",
      "img/5_background/layers/4_clouds/1.png",
      "img/5_background/layers/4_clouds/2.png",
    ];
    this.currentImageIndex = 0;
    this.loadImage(this.images[this.currentImageIndex]);

    // Positioniere die Wolke zufällig im gesamten Level
    this.x = Math.random() * this.levelWidth; // Zufällige X-Position im Level
    this.y = 20 + Math.random() * 100; // Zufällige Y-Position
    this.animate();
  }

  animate() {
    this.animationInterval = setInterval(() => {
      // Only move clouds if the world is not paused
      if (!this.world || !this.world.paused) {
        this.moveLeft();

        // Wenn die Wolke aus dem Level verschwindet, setze sie rechts neu
        if (this.x + this.width < 0) {
          this.x = this.levelWidth + Math.random() * 200; // Reset rechts außerhalb des Levels
          this.y = 20 + Math.random() * 100; // Zufällige neue Y-Position
        }
      }
    }, 1000 / 60); // 60 FPS
  }
}
