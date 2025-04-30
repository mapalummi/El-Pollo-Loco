class Chicken extends MovableObject {
  x = 0;
  y = 350;
  width = 50;
  height = 80;
  isDead = false;

  offset = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  };

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);

    this.x = 200 + Math.random() * 500; //Zahl zwischen 200 und 700
    this.speed = 0.15 + Math.random() * 0.25; //Minimalster Wert ist 0.15

    this.animate();
  }

  getRealFrame() {
    this.rX = this.x + this.offset.left;
    this.rY = this.y + this.offset.top;
    this.rW = this.width - this.offset.left - this.offset.right;
    this.rH = this.height - this.offset.top - this.offset.bottom;
  }

  // animate() {
  //   setInterval(() => {
  //     this.getRealFrame(); //Kollisionsbox wird ständig aktualisiert
  //     this.moveLeft();
  //   }, 1000 / 60);

  //   setInterval(() => {
  //     this.playAnimation(this.IMAGES_WALKING);
  //   }, 200);
  // }

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
    }, 200);
  }

  die() {
    this.isDead = true;
    this.loadImage("img/3_enemies_chicken/chicken_normal/2_dead/dead.png");
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
}
