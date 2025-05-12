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

  isHurt = false; // Prüft ob die Hurt Animation abgespielt wird
  isDead = false;
  isAttacking = false;
  isWalking = false;
  isAlert = false;
  isDeathAnimationComplete = false;

  //NOTE: NEU
  wasHitRecently = false;
  hitCooldownTimer = null;
  hitAlertDuration = 2000;

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
      this.x = world.level.level_end_x - 200; // 200px vor Level-Ende
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
    // this.getRealFrame();
  }

  endbossHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
    // this.getRealFrame();
  }

  endbossAlertAnimation() {
    this.playAnimation(this.IMAGES_ALERT);
    // this.getRealFrame();
  }

  endbossAttackAnimation() {
    this.playAnimation(this.IMAGES_ATTACK);
    // this.getRealFrame();
  }

  animate() {
    // Animation-Intervall speichern, damit es nicht gelöscht werden kann
    this.animationInterval = setInterval(() => {
      this.getRealFrame();

      // STATE PRIORITY HIERARCHY (most important first)
      if (this.isDead) {
        if (!this.isDeathAnimationComplete) {
          // Animation noch läuft
          this.playAnimation(this.IMAGES_DEAD);
        }
        // Wenn Animation abgeschlossen ist, wird kein weiterer
        // Frame geladen - das Bild wurde bereits in die() gesetzt
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
    console.log("Starting walking mode");

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
    // Set the correct animation images
    this.playAnimation(this.IMAGES_ALERT);
    AudioHub.playOne(AudioHub.ENDBOSS);
  }

  //NEU:
  startAttacking() {
    if (!this.isDead && !this.isHurt && !this.isAttackOnCooldown) {
      this.isAttacking = true;
      this.isWalking = false;
      this.isAlert = false;
      AudioHub.playOne(AudioHub.ENDBOSS_ATTACK);

      // Set attack on cooldown immediately
      this.isAttackOnCooldown = true;

      // Store original position and calculate jump trajectory
      const originalY = this.y;
      const originalX = this.x;
      const jumpStartTime = new Date().getTime();

      // Determine direction to jump (toward character)
      let direction = 1; // Default: right
      if (this.world && this.world.character) {
        direction = this.world.character.x > this.x ? 1 : -1;
        this.otherDirection = direction < 0;
      }

      // Create jump interval
      const jumpInterval = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - jumpStartTime;

        // Calculate vertical position (parabolic trajectory)
        const jumpProgress = elapsedTime / this.JUMP_DURATION;

        if (jumpProgress <= 1) {
          // Parabola: y = 4h * (x - x²) where h is jump height
          const verticalOffset = 4 * this.JUMP_HEIGHT * (jumpProgress - jumpProgress * jumpProgress);
          this.y = originalY - verticalOffset;

          // Move horizontally toward character
          this.x += direction * this.JUMP_SPEED * (1 - Math.abs(jumpProgress - 0.5) * 2);
        } else {
          // Jump complete, clear interval and reset position
          clearInterval(jumpInterval);
          this.y = originalY;
        }
      }, 16); // ~60fps update

      // Animation duration timer
      setTimeout(() => {
        clearInterval(jumpInterval); // Ensure jump interval is cleared
        this.y = originalY; // Reset vertical position

        if (!this.isDead && !this.isHurt) {
          this.isAttacking = false;
          // Verhalten basierend auf Distanz neu evaluieren
          if (this.world) {
            const distanceToPlayer = Math.abs(this.world.character.x - this.x);
            this.world.updateEndbossBehavior(this, distanceToPlayer);
          } else {
            this.isAlert = true; // Fallback
          }
        }
      }, this.IMAGES_ATTACK.length * 100);

      // Reset cooldown after the specified duration
      setTimeout(() => {
        this.isAttackOnCooldown = false;
      }, this.attackCooldownDuration);
    }
  }

  hit(damage) {
    // Existing hit code
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    }

    this.lastHit = new Date().getTime();

    // Set hurt state
    this.isHurt = true;
    this.isAttacking = false;
    this.isWalking = false;

    // New code for maintaining alert mode after hit
    this.wasHitRecently = true;

    // Clear existing timer if there is one
    if (this.hitCooldownTimer) {
      clearTimeout(this.hitCooldownTimer);
    }

    // Create a timer to reset the hurt state after animation completes
    setTimeout(() => {
      this.isHurt = false;
      // console.log("Hurt animation complete, setting isAlert=true");

      // When hurt animation completes, go to alert state
      if (!this.isDead) {
        this.startAlert();
      }
    }, this.IMAGES_HURT.length * 100);

    // Set timer to reset wasHitRecently after specified duration
    this.hitCooldownTimer = setTimeout(() => {
      // console.log("wasHitRecently expired, setting to false");
      this.wasHitRecently = false;

      // Re-evaluate behavior based on current position and distance
      if (this.world && !this.isDead) {
        const distanceToPlayer = Math.abs(this.world.character.x - this.x);
        console.log("Re-evaluating endboss behavior after timer, distance:", distanceToPlayer);
        this.world.updateEndbossBehavior(this, distanceToPlayer);
      }
    }, this.hitAlertDuration);

    // Additional code for death check
    if (this.energy === 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.isHurt = false;
    this.isAttacking = false;
    this.isWalking = false;
    this.isAlert = false;
    this.isDeathAnimationComplete = false;

    console.log("Endboss stirbt - Animation wird gestartet"); // Debug

    // Die Animation wird durch animate() einmal gestartet
    setTimeout(() => {
      this.isDeathAnimationComplete = true;

      // Setze das letzte Bild EXPLIZIT
      const lastDeathImage = this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1];

      console.log("Setze letztes Bild:", lastDeathImage); // Debug

      // Doppelte Sicherheit: Explizit das Bild neu laden und setzen
      this.loadImage(lastDeathImage); //Alt

      // Zusätzlicher Check für den imageCache
      //Alt
      if (this.imageCache && this.imageCache[lastDeathImage]) {
        this.img = this.imageCache[lastDeathImage];
      }

      console.log("Endboss-Animation abgeschlossen"); // Debug
    }, this.IMAGES_DEAD.length * 200);
  }
}
