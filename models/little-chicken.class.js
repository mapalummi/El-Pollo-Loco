class LittleChicken extends MovableObject {
  x = 0;
  y = 390;
  width = 50;
  height = 60;
  isDead = false;

  //NEU
  jumpProbability = 0.02; // 2% chance (more jumpy than regular chickens)
  isJumping = false;
  initialY = 390; // Adjust based on little chicken's height
  speedY = 0;

  offset = {
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
  };

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);

    this.x = 550 + Math.random() * 3000;
    this.speed = 0.25 + Math.random() * 0.3;

    this.animate();
  }

  getRealFrame() {
    this.rX = this.x + (this.offset?.left || 0);
    this.rY = this.y + (this.offset?.top || 0);
    this.rW = this.width - (this.offset?.left || 0) - (this.offset?.right || 0);
    this.rH = this.height - (this.offset?.top || 0) - (this.offset?.bottom || 0);
  }

  // NEU:
  animate() {
    this.animationInterval = setInterval(() => {
      if (!this.isDead) {
        this.getRealFrame();
        this.moveLeft();
      }
    }, 1000 / 60);

    this.walkingAnimationInterval = setInterval(() => {
      if (!this.isDead) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);
  }

  die() {
    this.isDead = true;
    this.loadImage("img/3_enemies_chicken/chicken_small/2_dead/dead.png");
    this.speed = 0;
    clearInterval(this.animationInterval); // Stoppt die Bewegung
    clearInterval(this.walkingAnimationInterval); // Stoppt die Animation

    // Entfernt das LittleChicken nach 2 Sekunden
    setTimeout(() => {
      const index = world.level.enemies.indexOf(this);
      if (index > -1) {
        world.level.enemies.splice(index, 1); // Entfernt LittleChicken aus dem Array
      }
    }, 2000);
  }

  //NEU
  update() {
    if (!this.isJumping && !this.isDead && Math.random() < this.jumpProbability) {
      this.jump();
    }

    if (this.isJumping) {
      this.speedY -= 1;
      this.y -= this.speedY;

      if (this.y >= this.initialY) {
        this.y = this.initialY;
        this.speedY = 0;
        this.isJumping = false;
      }
    }
  }

  // Add the jump method
  jump() {
    this.isJumping = true;
    this.speedY = 12; // Smaller jump for little chickens

    if (!this.initialY || this.initialY > this.y) {
      this.initialY = this.y;
    }
  }
}
