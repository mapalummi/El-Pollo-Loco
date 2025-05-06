class ThrowableObject extends MovableObject {
  x;
  y;
  width = 50;
  height = 60;

  throwDirection = 1; // Standardmäßig nach rechts
  isSplashing = false;
  //NEU
  hasHit = false;

  // NEU
  offset = {
    top: 10,
    right: 20,
    bottom: 10,
    left: 20,
  };

  IMAGES_THROW = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y) {
    super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.IMAGES_THROW); // Bilder vorladen
    this.loadImages(this.IMAGES_SPLASH); // Bilder fürs Zerplatzen vorladen
    this.x = x;
    this.y = y;

    this.height = 60;
    this.width = 50;
    this.getRealFrame();
    this.throw();
  }

  // NEU
  getRealFrame() {
    this.rX = this.x + this.offset.left;
    this.rY = this.y + this.offset.top;
    this.rW = this.width - this.offset.left - this.offset.right;
    this.rH = this.height - this.offset.top - this.offset.bottom;
  }

  throw() {
    this.speedY = 30; // Wurfhöhe
    this.applyGravity();

    // Bewegung der Flasche
    this.movementInterval = setInterval(() => {
      this.x += 10 * this.throwDirection; // Bewegt sich nach rechts oder links
      this.getRealFrame();
    }, 25);

    // Animation der Flasche!
    // Timer in Variable gespeichert:
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_THROW);
    }, 100);
  }

  // NEU:
  splash() {
    if (this.isSplashing) return; // Verhindert mehrfaches Aufrufen
    this.isSplashing = true;
    // console.log("Flasche zerplatzt", this);

    //NEU
    this.hasHit = true; //Flasche als getroffen markiert

    this.speedY = 0; // Stoppt die Bewegung
    this.speed = 0;

    clearInterval(this.movementInterval); // Stoppt die Bewegung
    clearInterval(this.animationInterval); // Stoppt die Rotationsanimation

    // Spielt die Zerplatzen-Animation ab
    let splashAnimationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_SPLASH);
    }, 50);

    // Entfernt die Flasche nach der Animation
    setTimeout(() => {
      clearInterval(splashAnimationInterval); // Stoppt die Animation
      const index = world.throwableObjects.indexOf(this);
      if (index > -1) {
        // console.log("Flasche aus Array entfernt:", this);
        world.throwableObjects.splice(index, 1);
      }
    }, this.IMAGES_SPLASH.length * 50); // Wartezeit basierend auf der Anzahl der Bilder
  }
}
