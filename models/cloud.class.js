class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;

  constructor() {
    super();
    this.images = [
      "img/5_background/layers/4_clouds/1.png",
      "img/5_background/layers/4_clouds/2.png",
      "img/5_background/layers/4_clouds/1.png",
      "img/5_background/layers/4_clouds/2.png",
    ];
    this.currentImageIndex = 0;
    this.loadImage(this.images[this.currentImageIndex]);

    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();

      if (this.x + this.width < 0) {
        this.x = canvas.width + Math.random() * 200; //Reset rechts außerhalb des Canvas
        this.y = 20 + Math.random() * 100; //Zufällige neue Y-Position
      }
    }, 1000 / 60); //60 FPS
  }
}
