class World {
  // character = new Character();
  //NEU:
  character = new Character(this);
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  bottleBar = new BottleBar();
  healthBar = new HealthBar();
  coinBar = new CoinBar();

  throwableObjects = [];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();

    //Alt:
    // this.setWorld();

    this.run();

    // Debugging: Überprüfe die Inhalte der Arrays
    // console.log("Coins beim Start:", this.level.coins);
    // console.log("Bottles beim Start:", this.level.bottles);
    // console.log("Coins === Bottles:", this.level.coins === this.level.bottles); // Sollte `false` sein
  }

  //ALT:
  // setWorld() {
  //   this.character.world = this;
  // }

  //Startet einen Timer um Aktionen auszuführen:
  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
    }, 200); //Interval hier evtl. auf 50 verkleinern!
  }

  checkThrowObjects() {
    if (this.keyboard.B) {
      let offsetX = this.character.facingRight ? 50 : -10; // Nach rechts oder links werfen und Abstand der Flasche auf X-Achse
      let bottle = new ThrowableObject(this.character.x + offsetX, this.character.y + this.character.height / 2);
      bottle.throwDirection = this.character.facingRight ? 1 : -1; // 1 = rechts, -1 = links
      this.throwableObjects.push(bottle);
    }
  }

  //NOTE: Kollisionen
  checkCollisions() {
    // Die beiden Variablen könnte ich später noch gebrauchen!!!
    // let bottlesToRemove = [];
    // let enemiesToRemove = [];

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
          // Spieler wird getroffen
          this.character.hit();
          this.healthBar.setPercentage(this.character.energy);
        }
      }
    });

    // Prüfe Kollisionen zwischen Flaschen und Gegnern
    this.throwableObjects.forEach(bottle => {
      this.level.enemies.forEach(enemy => {
        if (bottle.isColliding(enemy)) {
          // Flasche trifft Gegner
          bottle.splash(); // Flasche zerplatzt
          // Nur Chicken und LittleChicken sterben, Endboss bleibt unberührt
          if (enemy instanceof LittleChicken || enemy instanceof Chicken) {
            enemy.die();
          } else if (enemy instanceof Endboss) {
            console.log("Endboss getroffen");
            //TODO:
            // enemy.takeDamage(20); // 20 Schadenspunkte zufügen
          }
        }
      });
    });

    //NOTE:
    this.level.coins = this.level.coins.filter(coin => {
      if (this.character.isColliding(coin)) {
        console.log("Coin eingesackt:", coin);
        return false; // Entferne den Coin
      }
      return true; // Behalte den Coin
    });

    this.level.bottles = this.level.bottles.filter(bottle => {
      if (this.character.isColliding(bottle)) {
        console.log("Bottle eingesackt:", bottle);
        return false; // Entferne Bottle
      }
      // console.log("Keine Kollision mit Bottle:", bottle);
      return true; // Behalte Bottle
    });
  }

  draw() {
    // Debugging: Überprüfe die Inhalte der Arrays
    // console.log("Coins vor dem Zeichnen:", this.level.coins);
    // console.log("Bottles vor dem Zeichnen:", this.level.bottles);

    // this.level.coins.forEach((coin, index) => {
    //   console.log(`Coin ${index} ist Coin:`, coin instanceof Coin);
    // });

    // this.level.bottles.forEach((bottle, index) => {
    //   console.log(`Bottle ${index} ist Bottle:`, bottle instanceof Bottle);
    // });

    // Löscht das verherige Canvas:
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);

    //NOTE:
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);

    this.ctx.translate(-this.camera_x, 0);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.clouds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);

    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.healthBar);

    //Kollisionen prüfen
    this.checkCollisions();

    // Draw() wird immer wieder aufgerufen:
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    // console.log("Zeichne Objekte:", objects); // Debugging-Log
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
}
