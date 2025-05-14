class Character extends MovableObject {
  x = 0;
  y = 20;
  width = 100;
  height = 220;
  speed = 10;
  facingRight = true;
  lastMoveTime = Date.now(); //Zeitstempel der letzten Bewegung
  idleTimeout = 100;
  sleepTimeout = 15000; //15 Sekunden
  isDeadAnimationComplete = false;

  isWalking = false;
  currentAnimation = null; //Trackt aktuell aktive Animation
  isFrozen = false; //Trackt den Frozen Zustand.

  jumpAnimationPlayed = false; //Neue Flag hinzufügen
  animationTimeout = null; //NEU

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

    this.crossImage = new Image();
    this.crossImage.src = "img/random_pics/skull-147188_640.png";

    this.applyGravity();
    this.animate();
  }

  getRealFrame() {
    this.rX = this.x + (this.offset?.left || 0);
    this.rY = this.y + (this.offset?.top || 0);
    this.rW = this.width - (this.offset?.left || 0) - (this.offset?.right || 0);
    this.rH = this.height - (this.offset?.top || 0) - (this.offset?.bottom || 0);
  }

  animate() {
    setInterval(() => {
      // Add check for frozen state along with death check
      if (this.isDead() || this.isFrozen) return; // Skip movement if frozen or dead

      // Reset walking state at the beginning of each frame
      this.isWalking = false;

      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        if (this.isLocked) {
          return; // Skip movement if locked
        }
        this.moveRight();
        this.otherDirection = false;
      }

      if (this.world.keyboard.LEFT && this.x > 0) {
        if (this.isLocked) {
          return; // Skip movement if locked
        }
        this.moveLeft();
        this.otherDirection = true;
      }

      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        // Check if character is locked before jumping
        if (this.isLocked) {
          return; // Skip jump if locked
        }
        this.jump();
      }

      this.world.camera_x = -this.x + 100; // Kamera folgt dem Charakter
      this.getRealFrame(); // Kollisionsbox wird ständig aktualisiert
    }, 1000 / 60);

    // Animation state management
    setInterval(() => {
      // Check for death first
      if (this.isDead()) {
        if (!this.isDeadAnimationComplete) {
          this.startAnimation("dead");
        }
        return;
      }

      // If frozen, keep current animation frame but don't switch animations
      if (this.isFrozen) return;

      if (this.isDeadAnimationComplete) return;

      if (this.isHurt()) {
        this.startAnimation("hurt");
      } else if (this.isAboveGround()) {
        if (!this.jumpAnimationPlayed) {
          // Nur einmal pro Sprung abspielen
          this.startAnimation("jumping");
          this.jumpAnimationPlayed = true;
        }
      } else {
        this.jumpAnimationPlayed = false; // Reset wenn auf dem Boden

        if (Date.now() - this.lastMoveTime > this.sleepTimeout) {
          this.startAnimation("sleep");
        } else if (Date.now() - this.lastMoveTime > this.idleTimeout) {
          this.startAnimation("idle");
        } else if (this.isWalking) {
          this.startAnimation("walking");
        }
      }
    }, 200);
  }

  startAnimation(animationType) {
    // If already running this animation, don't restart it
    if (this.currentAnimation === animationType) return;

    //NEU:
    // Check if we need to stop sleep sound when changing animations
    if (this.currentAnimation === "sleep") {
      AudioHub.stopOne(AudioHub.SLEEP);
    }

    // Clear any existing animation interval
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    //NEU
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }

    // Set current animation type
    this.currentAnimation = animationType;

    // Start the appropriate animation
    switch (animationType) {
      case "walking":
        this.walkingAnimation();
        break;
      case "jumping":
        AudioHub.playOne(AudioHub.JUMP);
        this.jumpingAnimation();
        break;
      case "hurt":
        AudioHub.playOne(AudioHub.HURT);
        this.hurtAnimation();
        break;
      case "idle":
        this.idleAnimation();
        break;
      case "sleep":
        AudioHub.playLoop(AudioHub.SLEEP);
        this.sleepAnimation();
        break;
      case "dead":
        AudioHub.playOne(AudioHub.DEAD);
        this.deadAnimation();
        break;
    }
  }

  walkingAnimation() {
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 1000 / 15);
  }

  // jumpingAnimation() {
  //   this.animationInterval = setInterval(() => {
  //     this.playAnimation(this.IMAGES_JUMPING);
  //   }, 1000 / 15);
  // }

  //NEU
  jumpingAnimation() {
    // Entferne das bestehende Intervall
    clearInterval(this.animationInterval);

    // Manueller, einmaliger Durchlauf der Sprungbilder
    let currentIndex = 0;

    // Funktion, die jedes Bild mit kurzer Verzögerung zeigt
    const playNextFrame = () => {
      if (currentIndex < this.IMAGES_JUMPING.length) {
        this.img = this.imageCache[this.IMAGES_JUMPING[currentIndex]];
        currentIndex++;

        // Nächstes Bild mit Verzögerung zeigen (66ms entspricht etwa 15fps)
        this.animationTimeout = setTimeout(playNextFrame, 66);
      }
    };

    // Animation starten
    playNextFrame();
  }

  hurtAnimation() {
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_HURT);
    }, 1000 / 15);
  }

  idleAnimation() {
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_IDLE);
    }, 1000 / 10);
  }

  sleepAnimation() {
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_SLEEP);
    }, 1000 / 5);
  }

  deadAnimation() {
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);

      // One-time handling for dead animation completion
      setTimeout(() => {
        clearInterval(this.animationInterval);
        this.img = this.crossImage; // Bild setzen
        this.width = 50; //Maße des Bildes
        this.height = 50; //Maße des Bildes
        this.y = 370; //Höhe des Bildes auf Y-Achse
        this.isDeadAnimationComplete = true; // Animation abgeschlossen
      }, this.IMAGES_DEAD.length * 100);
    }, 1000 / 10);
  }

  moveRight() {
    if (this.isDead()) return; // Bewegung verhindern, wenn der Charakter tot ist
    this.x += this.speed;
    this.facingRight = true; // Blickrichtung nach rechts
    this.otherDirection = false;
    this.lastMoveTime = Date.now(); // Timer zurücksetzen
    this.isWalking = true;
  }

  moveLeft() {
    if (this.isDead()) return;
    this.x -= this.speed;
    this.facingRight = false; // Blickrichtung nach links
    this.otherDirection = true;
    this.lastMoveTime = Date.now(); // Timer zurücksetzen
    this.isWalking = true;
  }

  //NEU
  jump() {
    super.jump();
    this.jumpAnimationPlayed = false; //Reset beim Start eines Sprungs
  }
}
