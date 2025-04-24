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
    this.speed = 0.15 + Math.random() * 0.25; //Minimalster Wert ist 0.15

    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      this.playAnimation(this.imagesWalking);
    }, 200);
  }
}
