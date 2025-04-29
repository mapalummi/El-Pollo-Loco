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

  checkThrowObjects() {
    if (this.keyboard.D) {
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      this.throwableObjects.push(bottle);
    }
  }

  checkCollisions() {
    this.level.enemies.forEach(enemy => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.healthBar.setPercentage(this.character.energy);
      }
    });
  }

  draw() {
    // Löscht das verherige Canvas:
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);

    //TODO:
    // this.addObjectsToMap(this.level.bottles);

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
    mo.drawFrame(this.ctx);

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
