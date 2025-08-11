/**
 * Represents the main player character in the game
 * Extends MovableObject to inherit movement, collision detection, and animation functionality
 */
class Character extends MovableObject {
  x = 0;
  y = 20;
  width = 100;
  height = 220;
  speed = 10;
  facingRight = true;
  lastMoveTime = Date.now();
  idleTimeout = 100;
  sleepTimeout = 15000;
  isDeadAnimationComplete = false;
  isWalking = false;
  currentAnimation = null;
  isFrozen = false;
  jumpAnimationPlayed = false;
  animationTimeout = null;

  lastHurtSound = 0; // NEU

  offset = {
    top: 100,
    right: 30,
    bottom: 10,
    left: 30,
  };

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];
  IMAGES_SLEEP = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];
  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];
  IMAGES_HURT = ["img/2_character_pepe/4_hurt/H-41.png", "img/2_character_pepe/4_hurt/H-42.png", "img/2_character_pepe/4_hurt/H-43.png"];
  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];
  world;

  /**
   * Creates a new character instance and initializes all animations and properties
   * @param {World} world - The game world object that contains this character
   */
  constructor(world) {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SLEEP);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.world = world;
    this.isLocked = false;
    this.deadImage = new Image();
    this.deadImage.src = "img/random_pics/skull-147188_640.png";
    this.walkSoundPlaying = false;

    this.applyGravity();
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
   * Starts the main animation loops for movement and animation state handling
   */
  animate() {
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => this.handleAnimationState(), 200);
  }

  /**
   * Handles character movement input and updates position at 60 FPS
   */
  handleMovement() {
    if (this.isDead() || this.isFrozen) return;

    this.isWalking = false;
    const wasMoving = this.processMovementInput();
    this.handleWalkSoundState(wasMoving);
    this.handleJumpInput();
    this.updateCameraAndFrame();
  }

  /**
   * Processes keyboard input for left and right movement
   * @returns {boolean} True if any movement was processed
   */
  processMovementInput() {
    let wasMoving = false;

    if (this.shouldMoveRight()) {
      this.moveRight();
      wasMoving = true;
    }

    if (this.shouldMoveLeft()) {
      this.moveLeft();
      wasMoving = true;
    }

    return wasMoving;
  }

  /**
   * Determines if the character should move right based on input and boundaries
   * @returns {boolean} True if right movement is allowed
   */
  shouldMoveRight() {
    return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x && !this.isLocked;
  }

  /**
   * Determines if the character should move left based on input and boundaries
   * @returns {boolean} True if left movement is allowed
   */
  shouldMoveLeft() {
    return this.world.keyboard.LEFT && this.x > 0 && !this.isLocked;
  }

  /**
   * Manages walk sound playback state based on movement
   * @param {boolean} wasMoving - Whether the character was moving this frame
   */
  handleWalkSoundState(wasMoving) {
    if (!wasMoving && this.walkSoundPlaying) {
      AudioHub.stopKeySound();
      this.walkSoundPlaying = false;
    }
  }

  /**
   * Handles jump input and triggers jump if conditions are met
   */
  handleJumpInput() {
    if (this.world.keyboard.SPACE && !this.isAboveGround() && !this.isLocked) {
      this.jump();
    }
  }

  /**
   * Updates camera position and collision frame
   */
  updateCameraAndFrame() {
    this.world.camera_x = -this.x + 100;
    this.getRealFrame();
  }

  /**
   * Manages character animation states based on current conditions
   */
  handleAnimationState() {
    if (this.isDead()) {
      if (!this.isDeadAnimationComplete) {
        this.startAnimation("dead");
      }
      return;
    }

    if (this.isFrozen || (this.world && this.world.paused)) return;
    if (this.isDeadAnimationComplete) return;

    if (this.isHurt()) {
      this.startAnimation("hurt");
    } else if (this.isAboveGround()) {
      if (!this.jumpAnimationPlayed) {
        this.startAnimation("jumping");
        this.jumpAnimationPlayed = true;
      }
    } else {
      this.jumpAnimationPlayed = false;
      this.handleIdleOrWalking();
    }
  }

  /**
   * Handles idle and walking animation states based on movement timing
   */
  handleIdleOrWalking() {
    const now = Date.now();
    if (now - this.lastMoveTime > this.sleepTimeout) {
      this.startAnimation("sleep");
    } else if (now - this.lastMoveTime > this.idleTimeout) {
      this.startAnimation("idle");
    } else if (this.isWalking) {
      this.startAnimation("walking");
    }
  }

  /**
   * Starts a specific animation type with proper cleanup and state management
   * @param {string} animationType - The type of animation to start (walking, jumping, hurt, idle, sleep, dead)
   */
  startAnimation(animationType) {
    if (this.isFrozen || this.currentAnimation === animationType) return;
    this.stopSleepSoundIfNeeded();
    this.clearAnimationTimers();
    this.currentAnimation = animationType;
    this.runAnimationByType(animationType);
  }

  /**
   * Stops sleep sound if currently playing
   */
  stopSleepSoundIfNeeded() {
    if (this.currentAnimation === "sleep") {
      AudioHub.stopOne("SLEEP");
    }
  }

  /**
   * Clears all active animation timers and intervals
   */
  clearAnimationTimers() {
    if (this.animationInterval) clearInterval(this.animationInterval);
    if (this.animationTimeout) clearTimeout(this.animationTimeout);
  }

  /**
   * Executes the appropriate animation method based on type
   * @param {string} type - The animation type to run
   */
  runAnimationByType(type) {
    const now = new Date().getTime();

    switch (type) {
      case "walking":
        this.walkingAnimation();
        break;
      case "jumping":
        AudioHub.playOne("JUMP");
        this.jumpingAnimation();
        break;
      case "hurt":
        // Sound nur alle 800ms spielen
        if (now - this.lastHurtSound > 800) {
          AudioHub.playOne("HURT");
          this.lastHurtSound = now;
        }
        this.hurtAnimation();
        break;
      case "idle":
        this.idleAnimation();
        break;
      case "sleep":
        AudioHub.playLoop("SLEEP");
        this.sleepAnimation();
        break;
      case "dead":
        AudioHub.playOne("DEAD");
        this.deadAnimation();
        break;
    }
  }

  /**
   * Starts the walking animation loop
   */
  walkingAnimation() {
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 1000 / 15);
  }

  /**
   * Starts the jumping animation sequence with frame-by-frame control
   */
  jumpingAnimation() {
    clearInterval(this.animationInterval);
    let currentIndex = 0;
    const playNextFrame = () => {
      if (currentIndex < this.IMAGES_JUMPING.length) {
        this.img = this.imageCache[this.IMAGES_JUMPING[currentIndex]];
        currentIndex++;
        this.animationTimeout = setTimeout(playNextFrame, 66);
      }
    };
    playNextFrame();
  }

  /**
   * Starts the hurt animation loop
   */
  hurtAnimation() {
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_HURT);
    }, 1000 / 15);
  }

  /**
   * Starts the idle animation loop
   */
  idleAnimation() {
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_IDLE);
    }, 1000 / 10);
  }

  /**
   * Starts the sleep animation loop with audio
   */
  sleepAnimation() {
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_SLEEP);
    }, 1000 / 5);
  }

  /**
   * Starts the death animation sequence and handles completion state
   */
  deadAnimation() {
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
      setTimeout(() => {
        clearInterval(this.animationInterval);
        this.img = this.deadImage;
        this.width = 50;
        this.height = 50;
        this.y = 370;
        this.isDeadAnimationComplete = true;
      }, this.IMAGES_DEAD.length * 100);
    }, 1000 / 10);
  }

  /**
   * Moves the character to the right with sound and animation updates
   */
  moveRight() {
    if (this.isDead()) return;
    this.x += this.speed;
    this.facingRight = true;
    this.otherDirection = false;
    this.lastMoveTime = Date.now();
    this.isWalking = true;

    this.startAnimation("walking");

    if (!this.walkSoundPlaying) {
      AudioHub.playWhileKeyPressed("WALK");
      this.walkSoundPlaying = true;
    }
  }

  /**
   * Moves the character to the left with sound and animation updates
   */
  moveLeft() {
    if (this.isDead()) return;
    this.x -= this.speed;
    this.facingRight = false;
    this.otherDirection = true;
    this.lastMoveTime = Date.now();
    this.isWalking = true;

    this.startAnimation("walking");

    if (!this.walkSoundPlaying) {
      AudioHub.playWhileKeyPressed("WALK");
      this.walkSoundPlaying = true;
    }
  }

  /**
   * Initiates a jump and resets jump animation state
   */
  jump() {
    super.jump();
    this.jumpAnimationPlayed = false;
  }
}
