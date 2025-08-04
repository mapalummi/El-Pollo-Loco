/**
 * Represents a chicken enemy in the game that can walk, jump, and be defeated
 * Extends MovableObject to inherit movement, collision detection, and animation functionality
 */
class Chicken extends MovableObject {
  x = 0;
  y = 350;
  width = 50;
  height = 80;
  
  isDead = false;
  jumpProbability = 0.01;
  isJumping = false;
  initialY = 370;
  speedY = 0;

  offset = {
    top: 10,
    right: 1,
    bottom: 10,
    left: 1,
  };

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /**
   * Creates a new chicken enemy with random position, speed, and starts animations
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);

    this.x = 900 + Math.random() * 3300;
    this.speed = 0.15 + Math.random() * 0.25;

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
   * Starts the main animation loops for movement and walking animation
   * Sets up intervals for 60 FPS movement and 200ms walking sprite animation
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
    }, 200);
  }

  /**
   * Handles chicken death by stopping movement, changing sprite, and removing from world
   * Automatically removes the chicken from the enemies array after 2 seconds
   */
  die() {
    this.isDead = true;
    this.loadImage("img/3_enemies_chicken/chicken_normal/2_dead/dead.png");
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
   * Updates chicken physics including jump mechanics and gravity simulation
   * Handles random jump probability and applies gravity when jumping
   */
  update() {
    if (!this.isJumping && !this.isDead && Math.random() < this.jumpProbability) {
      this.jump();
    }

    if (this.isJumping) {
      this.speedY -= 1;
    }

    this.y -= this.speedY;

    if (this.y >= this.initialY) {
      this.y = this.initialY;
      this.speedY = 0;
      this.isJumping = false;
    }
  }

  /**
   * Initiates a jump by setting jump state and initial upward velocity
   * Stores the initial Y position for landing calculation
   */
  jump() {
    this.isJumping = true;
    this.speedY = 15;

    if (!this.initialY || this.initialY > this.y) {
      this.initialY = this.y;
    }
  }

  /**
   * Calls the parent class move method for standard movement behavior
   * Inherited from MovableObject for consistent movement across all game objects
   */
  move() {
    super.move();
  }
}
