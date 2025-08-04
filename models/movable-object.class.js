/**
 * Base class for all movable objects in the game
 * Extends DrawableObject to add physics, collision detection, health, and animation functionality
 * Provides fundamental movement, gravity, damage, and state management for game entities
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  static animationsEnabled = false;

  /**
   * Applies gravity physics to the object at 25 FPS
   * Updates vertical position and velocity, respects ground collision and splash state
   */
  applyGravity() {
    setInterval(() => {
      if ((!this.isSplashing && this.isAboveGround()) || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Determines if the object is above ground level
   * @returns {boolean} True if object is above ground (y < 210) or is a throwable object
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 210;
    }
  }

  /**
   * Checks collision between this object and another movable object
   * Uses real collision frames (rX, rY, rW, rH) for accurate detection
   * @param {MovableObject} mo - The other movable object to check collision with
   * @returns {boolean} True if objects are colliding
   */
  isColliding(mo) {
    const collision = this.rX + this.rW > mo.rX && this.rY + this.rH > mo.rY && this.rX < mo.rX + mo.rW && this.rY < mo.rY + mo.rH;
    return collision;
  }

  /**
   * Handles damage to the object with hit cooldown protection
   * Reduces energy by 15 points and prevents multiple hits within 1 second
   */
  hit() {
    let now = new Date().getTime();
    if (now - this.lastHit < 1000) return;

    this.energy -= 15;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = now;
    }
    // console.log(this.energy);
  }

  /**
   * Determines if the object is currently in hurt state
   * @returns {boolean} True if less than 1 second has passed since last hit
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    return timepassed < 1000;
  }

  /**
   * Determines if the object is dead based on energy level
   * @returns {boolean} True if energy has reached zero
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Moves the object to the right by its speed value
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left by its speed value
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Initiates a jump if conditions allow
   * Sets upward velocity to 30 if object is on ground and not dead
   */
  jump() {
    if (this.isDead()) return;
    if (!this.isAboveGround()) {
      this.speedY = 30;
    }
  }

  /**
   * Deals specific amount of damage to the object
   * Updates endboss health bar if object is an Endboss instance
   * @param {number} amount - Amount of damage to deal
   */
  takeDamage(amount) {
    this.energy -= amount;
    if (this.energy < 0) {
      this.energy = 0;
    }
    if (this instanceof Endboss) {
      world.endbossBar.setPercentage(this.energy);
    }
  }

  /**
   * Plays animation by cycling through provided image array
   * Updates current image from cache and advances animation frame counter
   * @param {string[]} images - Array of image paths for the animation sequence
   */
  playAnimation(images) {
    if (!this.img) return;
    let i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
    this.currentImage++;
  }
}
