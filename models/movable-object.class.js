class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  applyGravity() {
    setInterval(() => {
      if ((!this.isSplashing && this.isAboveGround()) || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      //Throwable object should always fall.
      return true;
    } else {
      return this.y < 210;
    }
  }

  // Kollisionen
  // isColliding(mo) {
  //   return this.x + this.width > mo.x && this.y + this.height > mo.y && this.x < mo.x && this.y < mo.y + mo.height;
  // }

  //NOTE: NEU!!!
  isColliding(mo) {
    return this.rX + this.rW > mo.rX && this.rY + this.rH > mo.rY && this.rX < mo.rX + mo.rW && this.rY < mo.rY + mo.rH;
  }

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
    timepassed = timepassed / 1000; // Difference in s
    // console.log(timepassed);
    return timepassed < 1;
  }

  //TODO:
  isDead() {
    return this.energy == 0;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
  }

  // Alt:
  // playAnimation(images) {
  //   let i = this.currentImage % images.length; // Zyklisches Wechseln der Bilder
  //   let path = images[i]; // Bild aus dem Cache laden
  //   this.img = this.imageCache[path];
  //   this.currentImage++;
  // }

  // NEU:
  playAnimation(images) {
    let i = this.currentImage % images.length; // Zyklisches Wechseln der Bilder
    this.img = this.imageCache[images[i]]; // Bild aus dem Cache laden
    this.currentImage++;
  }
}
