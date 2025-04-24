class Character extends MovableObject {
  y = 210;
  height = 220;
  speed = 10;
  imagesWalking = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];
  world;

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.imagesWalking); // Warum hier this. ?

    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT) {
        this.x += this.speed;
        this.otherDirection = false;
      }

      if (this.world.keyboard.LEFT) {
        this.x -= this.speed;
        this.otherDirection = true;
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        // Walk animation
        let i = this.currentImage % this.imagesWalking.length; // let i = 5 % 6; => 0, Rest 5 (Modulo Operator)
        let path = this.imagesWalking[i];
        this.img = this.imageCache[path]; // Warum hier this. ??
        this.currentImage++; // Warum hier this. ??
      }
    }, 50);
  }

  jump() {}
}
