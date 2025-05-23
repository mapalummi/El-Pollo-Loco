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

  isColliding(mo) {
    const collision = this.rX + this.rW > mo.rX && this.rY + this.rH > mo.rY && this.rX < mo.rX + mo.rW && this.rY < mo.rY + mo.rH;
    return collision;
  }

  hit() {
    let now = new Date().getTime();
    if (now - this.lastHit < 1000) return; // Verhindert mehrfaches Aufrufen innerhalb 1 Sekunde

    this.energy -= 15;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = now; //Zeitpunkt des letzten Treffers aktualisieren
    }
    // console.log(this.energy);
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // Unterschied in ms
    return timepassed < 1000;
  }

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
    if (this.isDead()) return; // Springen verhindern, wenn der Charakter tot ist
    if (!this.isAboveGround()) {
      this.speedY = 30; // Sprunggeschwindigkeit
    }
  }

  takeDamage(amount) {
    this.energy -= amount;
    if (this.energy < 0) {
      this.energy = 0; // Energie kann nicht negativ sein
    }
    // console.log(`${this.constructor.name} Energie: ${this.energy}`);
    if (this instanceof Endboss) {
      world.endbossBar.setPercentage(this.energy); // Endboss-Bar aktualisieren
    }
  }

  playAnimation(images) {
    if (!this.img) return; // Animation stoppen, wenn kein Bild vorhanden ist
    let i = this.currentImage % images.length; // Zyklisches Wechseln der Bilder
    this.img = this.imageCache[images[i]]; // Bild aus dem Cache laden
    this.currentImage++;
  }
}
