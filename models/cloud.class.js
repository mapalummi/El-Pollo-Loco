class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;

  // constructor() {
  //   super().loadImage("img/5_background/layers/4_clouds/1.png");

  //   this.x = Math.random() * 500;
  //   this.animate();
  // }

  constructor() {
    super();
    this.images = ["img/5_background/layers/4_clouds/1.png", "img/5_background/layers/4_clouds/2.png"];
    this.currentImageIndex = 0;
    this.loadImage(this.images[this.currentImageIndex]);

    this.x = Math.random() * 500;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }
}
