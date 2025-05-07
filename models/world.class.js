class World {
  // character = new Character();
  character = new Character(this);
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  totalCoins;
  collectedCoins;
  percentageCoins;

  totalBottles;
  collectedBottles; //auch als Limit für das Werfen!
  percentageBottles;

  bottleBar = new BottleBar();
  healthBar = new HealthBar();
  coinBar = new CoinBar();
  endbossBar = new EndbossBar();

  throwableObjects = [];

  constructor(canvas, keyboard) {
    //NEU
    this.levelWidth = 4314;
    this.clouds = this.createClouds();

    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.totalCoins = this.level.coins.length; //Gesamtzahl Coins aus dem Level übernehmen
    this.collectedCoins = 0; //Zähler eingesammelte Coins

    this.totalBottles = this.level.bottles.length;
    this.collectedBottles = 0;

    this.draw();
    this.run();
    //Alt:
    // this.setWorld();
  }

  //ALT:
  // setWorld() {
  //   this.character.world = this;
  // }

  //NEU
  createClouds() {
    const clouds = [];
    for (let i = 0; i < 10; i++) {
      //Erstellt 10 Wolken
      clouds.push(new Cloud(this.levelWidth));
    }
    return clouds;
  }

  //Startet einen Timer um Aktionen auszuführen:
  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkEndbossVisibility();
    }, 200); //Interval hier evtl. auf 50 verkleinern!
  }

  //NEU mit Feedback für Spieler (evtl. Sound)
  checkThrowObjects() {
    if (this.keyboard.B) {
      if (this.collectedBottles > 0) {
        let offsetX = this.character.facingRight ? 50 : -10;
        let bottle = new ThrowableObject(this.character.x + offsetX, this.character.y + this.character.height / 2);
        bottle.throwDirection = this.character.facingRight ? 1 : -1;
        this.throwableObjects.push(bottle);

        this.collectedBottles--;
        this.updateBottleBar();
      } else {
        console.log("Keine Flaschen mehr verfügbar!");
        // Optional: Visuelles Feedback für den Spieler
      }
    }
  }

  checkCollisions() {
    if (this.character.isDead()) return; //Keine Kollision wenn Character tot ist!

    this.level.enemies.forEach(enemy => {
      if (this.character.isColliding(enemy)) {
        if (
          enemy instanceof LittleChicken ||
          (enemy instanceof Chicken &&
            this.character.speedY < 0 &&
            this.character.y + this.character.height <= enemy.y + enemy.height * 0.75)
        ) {
          // Spieler springt auf das Chicken
          enemy.die();
          //TODO:
          this.character.speedY = 20; // Spieler springt nach dem Treffer nach oben
        } else {
          //NOTE: Spieler wird getroffen
          this.character.hit();
          this.healthBar.setPercentage(this.character.energy);
        }
      }
    });

    // Prüfe Kollisionen zwischen Flaschen und Gegnern
    this.throwableObjects.forEach(bottle => {
      if (bottle.hasHit) return; //Flaschen, die bereits getroffen haben überspringen

      this.level.enemies.forEach(enemy => {
        if (bottle.isColliding(enemy)) {
          bottle.splash(); // Flasche zerplatzt
          if (enemy instanceof Endboss) {
            console.log("Endboss getroffen");
            //TODO:
            enemy.takeDamage(10); // Schadenspunkte
            enemy.playHurtAnimation();
            // enemy.playAnimation(enemy.IMAGES_HURT);
            if (enemy.isDead()) {
              console.log("Endboss besiegt!");
              // Optional: Logik für das Besiegen des Endbosses
            }
          } else if (enemy instanceof LittleChicken || enemy instanceof Chicken) {
            enemy.die();
          }
        }
      });
    });

    //NOTE: Coins und Flaschen
    this.collectedCoins = this.collectedCoins || 0; //Sicherstellem, dass Zähler existiert.

    this.level.coins = this.level.coins.filter(coin => {
      if (this.character.isColliding(coin)) {
        // console.log("Coin eingesackt:", coin);

        this.collectedCoins++;
        this.updateCoinBar();

        //TODO:
        //Soundeffekt (später)
        // this.playCoinSound();

        return false; // Entferne den Coin
      }
      return true; // Behalte den Coin
    });

    // console.log(`Eingesammelte Coins ${this.collectedCoins}`);

    this.collectedBottles = this.collectedBottles || 0;

    this.level.bottles = this.level.bottles.filter(bottle => {
      if (this.character.isColliding(bottle)) {
        // console.log("Bottle eingesackt:", bottle);

        this.collectedBottles++;
        this.updateBottleBar();

        //TODO:
        //Soundeffekt (später)
        // this.playBottleSound();

        return false; // Entferne Bottle
      }
      // console.log("Keine Kollision mit Bottle:", bottle);
      return true; // Behalte Bottle
    });
  }

  updateCoinBar() {
    this.percentageCoins = (this.collectedCoins / this.totalCoins) * 100; //Prozentualer Fortschritt
    this.coinBar.setPercentage(this.percentageCoins); //Fortschritt an die Coinbar übergeben
    console.log(`Aktueller Fortschritt Coins: ${this.percentageCoins}%`);
  }

  updateBottleBar() {
    this.percentageBottles = (this.collectedBottles / this.totalBottles) * 100;
    this.bottleBar.setPercentage(this.percentageBottles);
    console.log(`Aktueller Fortschritt Bottles: ${this.percentageBottles}%`);
  }

  draw() {
    this.clouds.forEach(cloud => cloud.draw(this.ctx));
    // Löscht das verherige Canvas:
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);

    //NOTE:
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);

    this.ctx.translate(-this.camera_x, 0);

    this.ctx.translate(this.camera_x, 0);
    // this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.clouds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);

    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.healthBar);
    if (this.endbossBar.isVisible) {
      this.addToMap(this.endbossBar);
    }

    //Kollisionen prüfen
    this.checkCollisions();

    // Draw() wird immer wieder aufgerufen:
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach(o => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  //NOTE: Erklären lassen!
  checkEndbossVisibility() {
    const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    if (endboss && Math.abs(this.character.x - endboss.x) < 500) {
      this.endbossBar.isVisible = true;
    } else {
      this.endbossBar.isVisible = false;
    }
  }
}
