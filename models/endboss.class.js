class Endboss extends MovableObject {
  x = 0;
  y = -40;
  width = 300;
  height = 500;
  energy = 100;

  offset = {
    top: 190,
    right: 60,
    bottom: 50,
    left: 80,
  };

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 2200;
    this.animate();
  }

  getRealFrame() {
    this.rX = this.x + (this.offset?.left || 0);
    this.rY = this.y + (this.offset?.top || 0);
    this.rW = this.width - (this.offset?.left || 0) - (this.offset?.right || 0);
    this.rH = this.height - (this.offset?.top || 0) - (this.offset?.bottom || 0);
  }

  animate() {
    setInterval(() => {
      this.getRealFrame();
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }

  //NEU
  takeDamage(amount) {
    this.energy -= amount;
    if (this.energy < 0) {
      this.energy = 0; //Energie kann nicht negativ sein
    }
    console.log(`Endboss Energie: ${this.energy}`);
    world.endbossBar.setPercentage(this.energy);
  }

  //NEU
  // isDead() {
  //   return this.energy <= 0;
  // }
}
