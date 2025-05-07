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

  //NEU
  isHurt = false; // Prüft ob die Hurt Animation abgespielt wird
  isDead = false;
  isAttacking = false;
  isWalking = false;
  isAlert = false;

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 3990;
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
    this.getRealFrame();
  }

  //TEST
  endbossHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
    this.getRealFrame(); // Update collision box during hurt
  }

  endbossAlertAnimation() {
    this.playAnimation(this.IMAGES_ALERT);
    this.getRealFrame();
  }

  endbossAttackAnimation() {
    if (!this.isAttacking) {
      this.isAttacking = true;
      // Stop other animations
      this.isAlert = false;
      this.isWalking = false;

      this.playAnimation(this.IMAGES_ATTACK); // Fixed typo in variable name
      this.getRealFrame();

      // Return to alert state after attack animation
      setTimeout(() => {
        this.isAttacking = false;
        this.isAlert = true;
      }, this.IMAGES_ATTACK.length * 100);
    }
  }

  endbossDeadAnimation() {
    this.isDead = true;
    // Stop all other animations
    this.isHurt = false;
    this.isAlert = false;
    this.isWalking = false;
    this.isAttacking = false;

    console.log("Endboss DEAD Animation started");
    this.playAnimation(this.IMAGES_DEAD);
    this.getRealFrame();
  }

  animate() {
    setInterval(() => {
      this.getRealFrame();

      if (this.isDead) {
        if (!this.isDeathAnimationComplete) {
          this.playAnimation(this.IMAGES_DEAD);
        }
        // When animation is complete, do nothing - last frame stays
      } else if (this.isHurt) {
        this.endbossHurtAnimation();
      } else if (this.isAttacking) {
        this.endbossAttackAnimation();
      } else if (this.isWalking) {
        this.endbossWalkAnimation();
      } else if (this.isAlert) {
        this.endbossAlertAnimation();
      }
    }, 100);
  }

  //TEST - NEU
  startWalking() {
    if (!this.isDead && !this.isHurt) {
      this.isWalking = true;
      this.isAlert = false;
      this.isAttacking = false;
    }
  }

  startAlert() {
    if (!this.isDead && !this.isHurt && !this.isAttacking) {
      this.isAlert = true;
      this.isWalking = false;
    }
  }

  startAttacking() {
    if (!this.isDead && !this.isHurt) {
      this.isAttacking = true;
      this.isWalking = false;
      this.isAlert = false;

      setTimeout(() => {
        if (!this.isDead && !this.isHurt) {
          this.isAttacking = false;
          this.isAlert = true;
        }
      }, this.IMAGES_ATTACK.length * 100);
    }
  }

  hit(damage = 20) {
    // Only proceed if the boss isn't already dead
    if (!this.isDead) {
      this.energy -= damage;

      if (this.energy <= 0) {
        this.energy = 0;
        this.die();
      } else {
        // Clear any existing hurt timeout
        if (this.hurtTimeout) {
          clearTimeout(this.hurtTimeout);
        }

        // Set up the hurt state
        this.isHurt = true;
        this.isAttacking = false;
        this.isWalking = false;
        this.isAlert = false;

        // Set timeout to go back to alert state
        this.hurtTimeout = setTimeout(() => {
          if (!this.isDead) {
            this.isHurt = false;
            this.isAlert = true;
          }
        }, this.IMAGES_HURT.length * 100);
      }
    }
  }

  die() {
    this.isDead = true;
    this.isHurt = false;
    this.isAttacking = false;
    this.isWalking = false;
    this.isAlert = false;

    // Spiele die Todesanimation einmal ab
    console.log("Endboss death sequence started");

    // Die Animation wird durch animate() einmal gestartet
    // Nach der Dauer der Animation setzen wir isDeathAnimationComplete
    setTimeout(() => {
      this.isDeathAnimationComplete = true;
      console.log("Endboss death animation complete - showing final frame");

      // Setze das letzte Bild manuell
      this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
    }, this.IMAGES_DEAD.length * 200); // Etwas mehr Zeit für ein deutlicheres Abspielen
  }
}
