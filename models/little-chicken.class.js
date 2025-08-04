/**
 * Represents a small chicken enemy in the game that can walk, jump, and be defeated
 * Extends MovableObject to inherit movement, collision detection, and animation functionality
 * Features smaller size, faster movement, and random jumping behavior compared to regular chickens
 */
class LittleChicken extends MovableObject {
  x = 0;
  y = 390;
  width = 50;
  height = 60;
  isDead = false;
  jumpProbability = 0.02;
  isJumping = false;
  initialY = 390;
  speedY = 0;

  offset = {
    top: 5,
    right: 1,
    bottom: 5,
    left: 1,
  };

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /**
   * Creates a new little chicken enemy with random position and speed
   * Initializes walking animation and sets up random spawn location
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);

    this.x = 550 + Math.random() * 3000;
    this.speed = 0.25 + Math.random() * 0.3;

    this.animate();
  }

  /**
   * Calculates and sets the real collision frame based on offset values
   * Updates the collision boundaries (rX, rY, rW, rH) for accurate hit detection
   */
  getRealFrame() {
    this.rX = this.x + (this.offset?.left || 0);
    this.rY = this.y + (this.offset?.top || 0);
    this.rW = this.width - (this.offset?.left || 0) - (this.offset?.right || 0);
    this.rH = this.height - (this.offset?.top || 0) - (this.offset?.bottom || 0);
  }

  /**
   * Starts the animation loops for movement and walking sprites
   * Sets up 60 FPS movement with collision frame updates and 100ms walking animation
   */
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

  /**
   * Handles little chicken death by stopping movement, changing sprite, and removing from world
   * Automatically removes the chicken from the enemies array after 2 seconds
   */
  die() {
    this.isDead = true;
    this.loadImage("img/3_enemies_chicken/chicken_small/2_dead/dead.png");
    this.speed = 0;
    clearInterval(this.animationInterval);
    clearInterval(this.walkingAnimationInterval);

    setTimeout(() => {
      const index = world.level.enemies.indexOf(this);
      if (index > -1) {
        world.level.enemies.splice(index, 1);
      }
    }, 2000);
  }

  /**
   * Updates little chicken physics including jump mechanics and gravity simulation
   * Handles random jump probability and applies gravity with ground collision detection
   */
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

  /**
   * Initiates a jump by setting jump state and initial upward velocity
   * Records the initial Y position for accurate landing calculation
   */
  jump() {
    this.isJumping = true;
    this.speedY = 12; 
    if (!this.initialY || this.initialY > this.y) {
      this.initialY = this.y;
    }
  }
}
