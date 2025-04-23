class Character extends MovableObject {
  y = 210;
  height = 220;
  imagesWalking = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];
  currentImage = 0;

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.imagesWalking);

    this.animate();
  }

  animate() {
    setInterval(() => {
      let i = this.currentImage % this.imagesWalking.length; // Modulo Operator
      let path = this.imagesWalking[this.currentImage];
      this.img = this.imageCache[path]; // Warum hier this. ??
      this.currentImage++;
    }, 1000);
  }

  jump() {}
}
