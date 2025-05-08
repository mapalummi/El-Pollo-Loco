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

  //NOTE: NEU TEST
  wasHitRecently = false;
  hitCooldownTimer = null;
  hitAlertDuration = 2000;

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

  //NOTE: NEU TEST
  animate() {
    setInterval(() => {
      this.getRealFrame();

      // STATE PRIORITY HIERARCHY (most important first)
      if (this.isDead) {
        if (!this.isDeathAnimationComplete) {
          this.playAnimation(this.IMAGES_DEAD);
        }
      } else if (this.isHurt) {
        this.endbossHurtAnimation();
      } else if (this.wasHitRecently) {
        // Ensure alert animation plays when recently hit, regardless of other states
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

  //NOTE: NEU TEST
  startWalking() {
    // Don't change state if recently hit - this is the key fix!
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

  //NOTE: NEU TEST
  startAlert() {
    this.isAlert = true;
    this.isAttacking = false;
    this.isWalking = false;
    // Set the correct animation images
    this.playAnimation(this.IMAGES_ALERT);
  }

  startAttacking() {
    if (!this.isDead && !this.isHurt) {
      this.isAttacking = true;
      this.isWalking = false;
      this.isAlert = false;

      setTimeout(() => {
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
    }
  }

  //NOTE: NEU TEST
  hit(damage) {
    console.log("Endboss hit at position:", this.x);
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
    console.log("wasHitRecently set to true");

    // Clear existing timer if there is one
    if (this.hitCooldownTimer) {
      clearTimeout(this.hitCooldownTimer);
    }

    // Create a timer to reset the hurt state after animation completes
    setTimeout(() => {
      this.isHurt = false;
      console.log("Hurt animation complete, setting isAlert=true");

      // When hurt animation completes, go to alert state
      if (!this.isDead) {
        this.startAlert();
      }
    }, this.IMAGES_HURT.length * 100); // Duration based on number of hurt animation frames

    // Set timer to reset wasHitRecently after specified duration
    this.hitCooldownTimer = setTimeout(() => {
      console.log("wasHitRecently expired, setting to false");
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

    // Die Animation wird durch animate() einmal gestartet
    // Nach der Dauer der Animation setzen wir isDeathAnimationComplete
    setTimeout(() => {
      this.isDeathAnimationComplete = true;

      // Setze das letzte Bild manuell
      this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
    }, this.IMAGES_DEAD.length * 200); // Etwas mehr Zeit für ein deutlicheres Abspielen
  }
}
