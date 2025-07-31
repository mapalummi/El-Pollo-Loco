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
  isAttackCooldown = false;
  attackCooldownDuration = 3000;

  JUMP_HEIGHT = 150;
  JUMP_DURATION = 1000;
  JUMP_SPEED = 15;

  constructor(world) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.world = world;

    // Positioniere den Endboss am rechten Rand des Levels
    if (world && world.level && world.level.level_end_x) {
      this.x = world.level.level_end_x - 100;
    } else {
      this.x = 4500; // Fallback
    }

    this.animate();
  }

  getRealFrame() {
    this.rX = this.x + (this.offset?.left || 0);
    this.rY = this.y + (this.offset?.top || 0);
    this.rW = this.width - (this.offset?.left || 0) - (this.offset?.right || 0);
    this.rH = this.height - (this.offset?.top || 0) - (this.offset?.bottom || 0);
  }

  endbossWalkAnimation() {
    this.playAnimation(this.IMAGES_WALKING);
  }

  endbossHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
  }

  endbossAlertAnimation() {
    this.playAnimation(this.IMAGES_ALERT);
  }

  endbossAttackAnimation() {
    this.playAnimation(this.IMAGES_ATTACK);
  }

  animate() {
    // Animation-Intervall speichern, damit es nicht gelöscht werden kann
    this.animationInterval = setInterval(() => {
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

  startWalking() {
    if (this.wasHitRecently) {
      console.log("Blocking walking mode because wasHitRecently=true");
      return;
    }
    if (!this.isDead && !this.isHurt) {
      this.isWalking = true;
      this.isAlert = false;
      this.isAttacking = false;
    }
  }

  startAlert() {
    this.isAlert = true;
    this.isAttacking = false;
    this.isWalking = false;
    this.playAnimation(this.IMAGES_ALERT);
    AudioHub.playOne(AudioHub.ENDBOSS);
  }

  startAttacking() {
    if (this.canAttack()) {
      this.prepareAttack();
      const { originalY, jumpInterval } = this.startJump();
      this.finishAttack(jumpInterval, originalY);
      this.setAttackCooldown();
    }
  }

  canAttack() {
    return !this.isDead && !this.isHurt && !this.isAttackOnCooldown;
  }

  prepareAttack() {
    this.isAttacking = true;
    this.isWalking = false;
    this.isAlert = false;
    AudioHub.playOne(AudioHub.ENDBOSS_ATTACK);
    this.isAttackOnCooldown = true;
  }

  startJump() {
    const originalY = this.y;
    const direction = this.getJumpDirection();
    const jumpStartTime = Date.now();
    const jumpInterval = setInterval(() => {
      this.updateJumpPosition(jumpStartTime, originalY, direction, jumpInterval);
    }, 16);
    return { originalY, jumpInterval };
  }

  getJumpDirection() {
    if (this.world && this.world.character) {
      const dir = this.world.character.x > this.x ? 1 : -1;
      this.otherDirection = dir > 0;
      return dir;
    }
    return 1;
  }

  updateJumpPosition(jumpStartTime, originalY, direction, jumpInterval) {
    const elapsedTime = Date.now() - jumpStartTime;
    const jumpProgress = elapsedTime / this.JUMP_DURATION;
    if (jumpProgress <= 1) {
      const verticalOffset = 4 * this.JUMP_HEIGHT * (jumpProgress - jumpProgress * jumpProgress);
      this.y = originalY - verticalOffset;
      this.x += direction * this.JUMP_SPEED * (1 - Math.abs(jumpProgress - 0.5) * 2);
    } else {
      clearInterval(jumpInterval);
      this.y = originalY;
    }
  }

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

  evaluateBehaviourAfterAttack() {
    if (this.world) {
      const distanceToPlayer = Math.abs(this.world.character.x - this.x);
      this.world.updateEndbossBehavior(this, distanceToPlayer);
    } else {
      this.isAlert = true;
    }
  }

  setAttackCooldown() {
    setTimeout(() => {
      this.isAttackOnCooldown = false;
    }, this.attackCooldownDuration);
  }

  hit(damage) {
    this.reduceEnergy(damage);
    this.setHurtState();
    this.handleHitTimers();
    this.checkDeath();
  }

  reduceEnergy(damage) {
    this.energy -= damage;
    if (this.energy < 0) this.energy = 0;
    this.lastHit = Date.now();
  }

  setHurtState() {
    this.isHurt = true;
    this.isAttacking = false;
    this.isWalking = false;
    this.wasHitRecently = true;
  }

  handleHitTimers() {
    this.clearHitCooldownTimer();
    this.setHurtAnimationTimer();
    this.setHitCooldownTimer();
  }

  clearHitCooldownTimer() {
    if (this.hitCooldownTimer) clearTimeout(this.hitCooldownTimer);
  }

  setHurtAnimationTimer() {
    setTimeout(() => {
      this.isHurt = false;
      if (!this.isDead) this.startAlert();
    }, this.IMAGES_HURT.length * 100);
  }

  setHitCooldownTimer() {
    this.hitCooldownTimer = setTimeout(() => {
      this.wasHitRecently = false;
      this.reEvaluateBehaviour();
    }, this.hitAlertDuration);
  }

  reEvaluateBehaviour() {
    if (this.world && !this.isDead) {
      const distanceToPlayer = Math.abs(this.world.character.x - this.x);
      this.world.updateEndbossBehavior(this, distanceToPlayer);
    }
  }

  checkDeath() {
    if (this.energy === 0) this.die();
  }

  die() {
    this.isDead = true;
    this.isHurt = false;
    this.isAttacking = false;
    this.isWalking = false;
    this.isAlert = false;
    this.isDeathAnimationComplete = false;

    // Die Animation wird durch animate() einmal gestartet
    setTimeout(() => {
      this.isDeathAnimationComplete = true;
      // Setze das letzte Bild EXPLIZIT
      const lastDeathImage = this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1];
      // Doppelte Sicherheit: Explizit das Bild neu laden und setzen
      this.loadImage(lastDeathImage); //Alt
      // Zusätzlicher Check für den imageCache
      if (this.imageCache && this.imageCache[lastDeathImage]) {
        this.img = this.imageCache[lastDeathImage];
      }
    }, this.IMAGES_DEAD.length * 200);
  }
}
