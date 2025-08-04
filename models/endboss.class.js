/**
 * Represents the final boss enemy in the game
 * Extends MovableObject to inherit movement, collision detection, and animation functionality
 * Features complex AI behavior including walking, alerting, attacking with jump mechanics, and death sequences
 */
class Endboss extends MovableObject {
  x = 0;
  y = -40;
  width = 300;
  height = 500;
  energy = 100;

  offset = {
    top: 190,
    right: 60,
    bottom: 50,
    left: 80,
  };

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  isHurt = false;
  isDead = false;
  isAttacking = false;
  isWalking = false;
  isAlert = false;
  isDeathAnimationComplete = false;
  wasHitRecently = false;
  hitCooldownTimer = null;
  hitAlertDuration = 3000;
  isAttackOnCooldown = false;
  attackCooldownDuration = 3000;

  JUMP_HEIGHT = 150;
  JUMP_DURATION = 1000;
  JUMP_SPEED = 15;

  /**
   * Creates a new endboss instance and initializes all animations and AI behavior
   * @param {World} world - The game world object that contains this endboss
   */
  constructor(world) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.world = world;

    if (world && world.level && world.level.level_end_x) {
      this.x = world.level.level_end_x - 100;
    } else {
      this.x = 4500;
    }
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
   * Plays the walking animation sequence for the endboss
   */
  endbossWalkAnimation() {
    this.playAnimation(this.IMAGES_WALKING);
  }

  /**
   * Plays the hurt animation sequence for the endboss
   */
  endbossHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
  }

  /**
   * Plays the alert animation sequence for the endboss
   */
  endbossAlertAnimation() {
    this.playAnimation(this.IMAGES_ALERT);
  }

  /**
   * Plays the attack animation sequence for the endboss
   */
  endbossAttackAnimation() {
    this.playAnimation(this.IMAGES_ATTACK);
  }

  /**
   * Manages endboss animation states based on current conditions and behavior
   * Runs at 100ms intervals and prioritizes animations by state hierarchy
   */
  animate() {
    this.animationInterval = setInterval(() => {
      if (this.world && this.world.gameEnded && this.isDead && this.isDeathAnimationComplete) {
        clearInterval(this.animationInterval);
        return;
      }

      this.getRealFrame();

      if (this.isDead) {
        if (!this.isDeathAnimationComplete) {
          this.playAnimation(this.IMAGES_DEAD);
        }
      } else if (this.isHurt) {
        this.endbossHurtAnimation();
      } else if (this.wasHitRecently) {
        this.isAlert = true;
        this.isAttacking = false;
        this.isWalking = false;
        this.endbossAlertAnimation();
      } else if (this.isAttacking) {
        this.endbossAttackAnimation();
      } else if (this.isWalking) {
        this.endbossWalkAnimation();
      } else if (this.isAlert) {
        this.endbossAlertAnimation();
      }
    }, 100);
  }

  /**
   * Initiates walking behavior if conditions allow
   * Sets walking state and clears other conflicting states
   */
  startWalking() {
    if (this.wasHitRecently || this.isDead || this.isHurt) {
      return;
    }
    this.isWalking = true;
    this.isAlert = false;
    this.isAttacking = false;
  }

  /**
   * Initiates alert behavior with sound effects
   * Sets alert state and plays endboss alert sound
   */
  startAlert() {
    this.isAlert = true;
    this.isAttacking = false;
    this.isWalking = false;
    this.playAnimation(this.IMAGES_ALERT);

    if (!this.world || !this.world.gameEnded) {
      AudioHub.playOne(AudioHub.ENDBOSS);
    }
  }

  /**
   * Initiates attack sequence with jump mechanics if conditions allow
   * Manages attack cooldown and coordinates jump attack behavior
   */
  startAttacking() {
    if (this.canAttack()) {
      this.prepareAttack();
      const { originalY, jumpInterval } = this.startJump();
      this.finishAttack(jumpInterval, originalY);
      this.setAttackCooldown();
    }
  }

  /**
   * Checks if the endboss can perform an attack
   * @returns {boolean} True if attack is allowed (not dead, hurt, or on cooldown)
   */
  canAttack() {
    return !this.isDead && !this.isHurt && !this.isAttackOnCooldown;
  }

  /**
   * Prepares the endboss for attack by setting states and playing sound
   * Sets attack cooldown and clears conflicting behavior states
   */
  prepareAttack() {
    this.isAttacking = true;
    this.isWalking = false;
    this.isAlert = false;

    if (!this.world || !this.world.gameEnded) {
      AudioHub.playOne(AudioHub.ENDBOSS_ATTACK);
    }

    this.isAttackOnCooldown = true;
  }

  /**
   * Starts the jump attack sequence with physics simulation
   * @returns {Object} Object containing originalY position and jumpInterval reference
   */
  startJump() {
    const originalY = this.y;
    const direction = this.getJumpDirection();
    const jumpStartTime = Date.now();
    let hasHitPlayer = false;
    const jumpInterval = setInterval(() => {
      this.updateJumpPosition(jumpStartTime, originalY, direction, jumpInterval);
      if (!hasHitPlayer && this.checkJumpHitOnPlayer()) {
        hasHitPlayer = true;
      }
    }, 16);
    return { originalY, jumpInterval };
  }

  /**
   * Checks for collision with player during jump attack
   * @returns {boolean} True if player was hit during jump
   */
  checkJumpHitOnPlayer() {
    if (this.world && this.world.character && this.isColliding(this.world.character) && !this.world.character.isDead()) {
      this.world.character.hit();
      this.world.healthBar.setPercentage(this.world.character.energy);
      return true;
    }
    return false;
  }

  /**
   * Determines jump direction based on player position
   * @returns {number} Direction multiplier (1 for right, -1 for left)
   */
  getJumpDirection() {
    if (this.world && this.world.character) {
      const dir = this.world.character.x > this.x ? 1 : -1;
      this.otherDirection = dir > 0;
      return dir;
    }
    return 1;
  }

  /**
   * Updates endboss position during jump attack with parabolic trajectory
   * @param {number} jumpStartTime - Timestamp when jump started
   * @param {number} originalY - Original Y position before jump
   * @param {number} direction - Direction of jump (-1 or 1)
   * @param {number} jumpInterval - Interval reference for the jump animation
   */
  updateJumpPosition(jumpStartTime, originalY, direction, jumpInterval) {
    const elapsedTime = Date.now() - jumpStartTime;
    const jumpProgress = elapsedTime / this.JUMP_DURATION;

    if (jumpProgress <= 1) {
      const verticalOffset = 4 * this.JUMP_HEIGHT * (jumpProgress - jumpProgress * jumpProgress);
      this.y = originalY - verticalOffset;
      this.x += direction * this.JUMP_SPEED * (1 - Math.abs(jumpProgress - 0.5) * 2);
    }
  }

  /**
   * Completes the attack sequence and resets position
   * @param {number} jumpInterval - Interval reference to clear
   * @param {number} originalY - Original Y position to restore
   */
  finishAttack(jumpInterval, originalY) {
    setTimeout(() => {
      clearInterval(jumpInterval);
      this.y = originalY;
      if (!this.isDead && !this.isHurt) {
        this.isAttacking = false;
        this.evaluateBehaviourAfterAttack();
      }
    }, this.IMAGES_ATTACK.length * 100);
  }

  /**
   * Evaluates and sets appropriate behavior after attack completion
   * Uses distance-based AI decision making
   */
  evaluateBehaviourAfterAttack() {
    if (this.world) {
      const distanceToPlayer = Math.abs(this.world.character.x - this.x);
      updateEndbossBehavior(this, distanceToPlayer);
    } else {
      this.isAlert = true;
    }
  }

  /**
   * Sets attack cooldown timer to prevent spam attacks
   * Re-evaluates behavior when cooldown expires
   */
  setAttackCooldown() {
    setTimeout(() => {
      this.isAttackOnCooldown = false;
      if (this.world && this.world.character) {
        const distance = Math.abs(this.world.character.x - this.x);
        updateEndbossBehavior(this, distance);
      }
    }, this.attackCooldownDuration);
  }

  /**
   * Handles damage dealt to the endboss
   * @param {number} damage - Amount of damage to deal
   */
  hit(damage) {
    this.reduceEnergy(damage);
    this.setHurtState();
    this.handleHitTimers();
    this.checkDeath();
  }

  /**
   * Reduces endboss energy and updates hit timestamp
   * @param {number} damage - Amount of damage to subtract from energy
   */
  reduceEnergy(damage) {
    this.energy -= damage;
    if (this.energy < 0) this.energy = 0;
    this.lastHit = Date.now();
  }

  /**
   * Sets hurt state and clears conflicting behavior states
   */
  setHurtState() {
    this.isHurt = true;
    this.isAttacking = false;
    this.isWalking = false;
    this.wasHitRecently = true;
  }

  /**
   * Manages all timers related to being hit
   * Coordinates hurt animation and hit cooldown timers
   */
  handleHitTimers() {
    this.clearHitCooldownTimer();
    this.setHurtAnimationTimer();
    this.setHitCooldownTimer();
  }

  /**
   * Clears existing hit cooldown timer to prevent conflicts
   */
  clearHitCooldownTimer() {
    if (this.hitCooldownTimer) clearTimeout(this.hitCooldownTimer);
  }

  /**
   * Sets timer for hurt animation duration
   * Transitions to alert state after hurt animation completes
   */
  setHurtAnimationTimer() {
    setTimeout(() => {
      this.isHurt = false;
      if (!this.isDead) this.startAlert();
    }, this.IMAGES_HURT.length * 100);
  }

  /**
   * Sets timer for hit cooldown period
   * Re-evaluates behavior when cooldown expires
   */
  setHitCooldownTimer() {
    this.hitCooldownTimer = setTimeout(() => {
      this.wasHitRecently = false;
      this.reEvaluateBehaviour();
    }, this.hitAlertDuration);
  }

  /**
   * Re-evaluates endboss behavior based on current game state
   * Uses distance-based AI decision making if world exists
   */
  reEvaluateBehaviour() {
    if (this.world && !this.isDead) {
      const distanceToPlayer = Math.abs(this.world.character.x - this.x);
      updateEndbossBehavior(this, distanceToPlayer);
    }
  }

  /**
   * Checks if endboss should die based on energy level
   * Triggers death sequence if energy reaches zero
   */
  checkDeath() {
    if (this.energy === 0) this.die();
  }

  /**
   * Handles endboss death sequence with animation timing
   * Sets death state and manages death animation completion
   */
  die() {
    this.isDead = true;
    this.isHurt = false;
    this.isAttacking = false;
    this.isWalking = false;
    this.isAlert = false;
    this.isDeathAnimationComplete = false;

    setTimeout(() => {
      this.isDeathAnimationComplete = true;
      const lastDeathImage = this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1];
      if (this.imageCache && this.imageCache[lastDeathImage]) {
        this.img = this.imageCache[lastDeathImage];
      }
    }, this.IMAGES_DEAD.length * 200);
  }
}
