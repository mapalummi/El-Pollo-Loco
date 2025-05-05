class Character extends MovableObject {
  x = 0;
  y = 20;
  width = 100;
  height = 220;
  speed = 10;
  facingRight = true;
  lastMoveTime = Date.now(); //Zeitstempel der letzten Bewegung
  idleTimeout = 3000; // 3 Sekunden
  sleepTimeout = 9000; // 15 Sekunden

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

  constructor() {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SLEEP);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.applyGravity();
    this.animate();
  }

  getRealFrame() {
    this.rX = this.x + (this.offset?.left || 0);
    this.rY = this.y + (this.offset?.top || 0);
    this.rW = this.width - (this.offset?.left || 0) - (this.offset?.right || 0);
    this.rH = this.height - (this.offset?.top || 0) - (this.offset?.bottom || 0);
  }

  //ORIGINAL:
  // animate() {
  //   setInterval(() => {
  //     if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
  //       this.moveRight();
  //       this.otherDirection = false;
  //     }

  //     if (this.world.keyboard.LEFT && this.x > 0) {
  //       this.moveLeft();
  //       this.otherDirection = true;
  //     }

  //     if (this.world.keyboard.SPACE && !this.isAboveGround()) {
  //       this.jump();
  //     }

  //     this.world.camera_x = -this.x + 100;
  //     this.getRealFrame(); //Kollisionsbox wird ständig aktualisiert
  //   }, 1000 / 60);

  //   setInterval(() => {
  //     if (this.isDead()) {
  //       this.playAnimation(this.IMAGES_DEAD);
  //     } else if (this.isHurt()) {
  //       this.playAnimation(this.IMAGES_HURT);
  //     } else if (this.isAboveGround()) {
  //       this.playAnimation(this.IMAGES_JUMPING);
  //       // Character länger im Leerlauf
  //     } else if (Date.now() - this.lastMoveTime > this.sleepTimeout) {
  //       this.playAnimation(this.IMAGES_SLEEP);
  //       // Character im Leerlauf
  //     } else if (Date.now() - this.lastMoveTime > this.idleTimeout) {
  //       this.playAnimation(this.IMAGES_IDLE);
  //     } else {
  //       if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
  //         this.playAnimation(this.IMAGES_WALKING);
  //       }
  //     }
  //   }, 100);
  // }

  //NOTE: NEU
  animate() {
    // Bewegung und Kamera-Logik
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false;
      }

      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
      }

      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
      }

      this.world.camera_x = -this.x + 100; // Kamera folgt dem Charakter
      this.getRealFrame(); // Kollisionsbox wird ständig aktualisiert
    }, 1000 / 60);

    // Animationen basierend auf dem Zustand
    setInterval(() => {
      if (this.isDead()) {
        // Animation für "dead" einmal abspielen und dann ausblenden
        this.playAnimation(this.IMAGES_DEAD);
        setTimeout(() => {
          this.img = null; // Charakter ausblenden/entfernen
        }, this.IMAGES_DEAD.length * 100); // Wartezeit basierend auf der Anzahl der Bilder
        return; // Beende weitere Animationen
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else if (Date.now() - this.lastMoveTime > this.sleepTimeout) {
        this.playAnimation(this.IMAGES_SLEEP); // Charakter schläft
      } else if (Date.now() - this.lastMoveTime > this.idleTimeout) {
        this.playAnimation(this.IMAGES_IDLE); // Charakter ist im Leerlauf
      } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING); // Charakter läuft
        }
      }
    }, 100);
  }

  moveRight() {
    this.x += this.speed;
    this.facingRight = true; // Blickrichtung nach rechts
    // console.log(this.facingRight);
    this.lastMoveTime = Date.now(); //Timer zurücksetzen
  }

  moveLeft() {
    this.x -= this.speed;
    this.facingRight = false; // Blickrichtung nach links
    // console.log(this.facingRight);
    this.lastMoveTime = Date.now(); //Timer zurücksetzen
  }
}
