class Chicken extends MovableObject {
  y = 350;
  width = 50;
  height = 80;
  imagesWalking = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.imagesWalking);

    this.x = 200 + Math.random() * 500; //Zahl zwischen 200 und 700
    this.animate();
  }

  animate() {
    setInterval(() => {
      let i = this.currentImage % this.imagesWalking.length;
      let path = this.imagesWalking[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 200);
  }
}
