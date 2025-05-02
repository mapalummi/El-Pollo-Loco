class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  healthBar = new HealthBar();
  coinBar = new CoinBar();
  bottleBar = new BottleBar();

  throwableObjects = [];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  // ALT:
  // checkThrowObjects() {
  //   if (this.keyboard.D) {
  //     let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
  //     this.throwableObjects.push(bottle);
  //   }
  // }

  checkThrowObjects() {
    if (this.keyboard.D) {
      let offsetX = this.character.facingRight ? 50 : -10; // Nach rechts oder links werfen und Abstand der Flasche auf X-Achse
      let bottle = new ThrowableObject(this.character.x + offsetX, this.character.y + this.character.height / 2);
      bottle.throwDirection = this.character.facingRight ? 1 : -1; // 1 = rechts, -1 = links
      this.throwableObjects.push(bottle);
    }
  }

  //NOTE: Kollisionen
  // checkCollisions() {
  //   this.level.enemies.forEach(enemy => {
  //     if (this.character.isColliding(enemy)) {
  //       this.character.hit();
  //       this.healthBar.setPercentage(this.character.energy);
  //     }
  //   });
  // }

  // TODO: NEU
  checkCollisions() {
    let bottlesToRemove = [];
    let enemiesToRemove = [];

    // Alte Version:
    // this.level.enemies.forEach(enemy => {
    //   if (this.character.isColliding(enemy)) {
    //     if (enemy instanceof LittleChicken || (enemy instanceof Chicken && this.character.speedY < 0)) {
    //       // Spieler springt auf das Chicken
    //       enemy.die();
    //       this.character.speedY = 20; // Spieler springt nach dem Treffer nach oben
    //     } else {
    //       // Spieler wird getroffen
    //       this.character.hit();
    //       this.healthBar.setPercentage(this.character.energy);
    //     }
    //   }
    // });

    // Prüfe Kollisionen zwischen Charakter und Gegnern
    this.level.enemies.forEach(enemy => {
      if (this.character.isColliding(enemy)) {
        // Prüfen, ob der Charakter von oben kommt
        if (this.character.speedY > 0 && this.character.y + this.character.height <= enemy.y + enemy.height / 2) {
          // Spieler springt auf das Chicken
          console.log("Charakter springt auf Gegner:", enemy); // Debugging-Log
          enemy.die();
          this.character.speedY = 20; // Spieler springt nach dem Treffer nach oben
        } else {
          // Spieler wird getroffen
          console.log("Charakter wird getroffen von Gegner:", enemy); // Debugging-Log
          this.character.hit();
          this.healthBar.setPercentage(this.character.energy);
        }
      }
    });

    //TODO:
    // Prüfe Kollisionen zwischen Flaschen und Gegnern
    this.throwableObjects.forEach(bottle => {
      this.level.enemies.forEach(enemy => {
        if (bottle.isColliding(enemy)) {
          // console.log("Flasche trifft Gegner:", bottle, enemy); // Debugging-Log
          bottle.splash(); // Flasche zerplatzt
        }
      });
    });
  }

  draw() {
    // Löscht das verherige Canvas:
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles); // Flaschen hinzufügen

    this.ctx.translate(-this.camera_x, 0);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.clouds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);

    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

    //NOTE:Bleibt die Anzeige im Vordergrund?
    this.addToMap(this.healthBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);

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
    // Wird in drawable-object-class aufgerufen:
    // mo.drawFrame(this.ctx);

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
