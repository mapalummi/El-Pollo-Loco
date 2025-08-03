/**
 * Represents a throwable bottle object that can be launched and create splash effects
 * Extends MovableObject to inherit physics, collision detection, and animation functionality
 * Features parabolic flight trajectory, rotation animation, and splash effects on impact
 */
class ThrowableObject extends MovableObject {
  x;
  y;
  width = 50;
  height = 60;
  throwDirection = 1;
  isSplashing = false;
  hasHit = false;

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

  /**
   * Creates a new throwable object and initiates throwing sequence
   * @param {number} x - The initial horizontal position of the bottle
   * @param {number} y - The initial vertical position of the bottle
   */
  constructor(x, y) {
    super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.IMAGES_THROW);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;

    this.height = 60;
    this.width = 50;
    this.getRealFrame();
    this.throw();
  }

  /**
   * Calculates and sets the real collision frame based on offset values
   * Updates the collision boundaries (rX, rY, rW, rH) for accurate hit detection
   */
  getRealFrame() {
    this.rX = this.x + this.offset.left;
    this.rY = this.y + this.offset.top;
    this.rW = this.width - this.offset.left - this.offset.right;
    this.rH = this.height - this.offset.top - this.offset.bottom;
  }

  /**
   * Initiates the throwing sequence with physics and animations
   * Sets initial velocity, applies gravity, plays throw sound, and starts movement/rotation
   */
  throw() {
    this.speedY = 30;
    this.applyGravity();
    AudioHub.playOne(AudioHub.THROW);
    
    this.movementInterval = setInterval(() => {
      this.x += 10 * this.throwDirection;
      this.getRealFrame();
    }, 25);

    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_THROW);
    }, 100);
  }

  /**
   * Handles bottle impact by transitioning to splash state
   * Prevents multiple splash triggers and coordinates splash sequence
   */
  splash() {
    if (this.isSplashing) return;
    this.setSpashState();
    this.stopMovementAndAnimation();
    this.playSplashSound();
    this.startSplashAnimation();
  }

  /**
   * Sets the bottle to splash state and stops all movement
   * Updates flags to prevent further physics calculations
   */
  setSpashState() {
    this.isSplashing = true;
    this.hasHit = true;
    this.speedY = 0;
    this.speed = 0;
  }

  /**
   * Stops movement and rotation animation intervals
   * Clears active timers to prevent continued updates
   */
  stopMovementAndAnimation() {
    clearInterval(this.movementInterval);
    clearInterval(this.animationInterval);
  }

  /**
   * Plays the splash sound effect when bottle impacts
   */
  playSplashSound() {
    AudioHub.playOne(AudioHub.SPLASH);
  }

  /**
   * Starts the splash animation sequence and handles cleanup
   * Plays splash frames at 50ms intervals and removes object after completion
   */
  startSplashAnimation() {
    let splashAnimationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_SPLASH);
    }, 50);

    setTimeout(() => {
      clearInterval(splashAnimationInterval);
      this.removeFromWorld();
    }, this.IMAGES_SPLASH.length * 50);
  }

  /**
   * Removes the throwable object from the world's throwable objects array
   * Cleans up object references to prevent memory leaks
   */
  removeFromWorld() {
    const index = world.throwableObjects.indexOf(this);
    if (index > -1) {
      world.throwableObjects.splice(index, 1);
    }
  }
}
