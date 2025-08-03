class World {
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
  bottleThrowCooldown = false;
  bottleThrowCooldownDuration = 500;

  bottleBar = new BottleBar();
  healthBar = new HealthBar();
  coinBar = new CoinBar();
  endbossBar = new EndbossBar();
  throwableObjects = [];

  constructor(canvas, keyboard) {
    this.levelWidth = 4314;
    this.clouds = this.createClouds();
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.totalCoins = this.level.coins.length; //Gesamtzahl Coins aus dem Level übernehmen
    this.collectedCoins = 0; //Zähler eingesammelte Coins
    this.totalBottles = this.level.bottles.length;
    this.collectedBottles = 0;
    this.endbossTriggered = false;
    this.gameEnded = false;
    this.paused = false;
    this.draw();
    this.run();

    const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    if (endboss) {
      this.endbossBar.setPercentage(endboss.energy);
      this.endbossBar.isVisible = false;
    }
  }

  createClouds() {
    const clouds = [];
    for (let i = 0; i < 10; i++) {
      //Erstellt 10 Wolken
      const cloud = new Cloud(this.levelWidth);
      cloud.world = this; // Add this line to give each cloud a reference to the world
      clouds.push(cloud);
    }
    return clouds;
  }

  run() {
    this.clearGameLoopInterval();
    this._gameLoopInterval = setInterval(() => this.gameLoop(), 50);
  }

  clearGameLoopInterval() {
    if (this._gameLoopInterval) {
      clearInterval(this._gameLoopInterval);
    }
  }

  gameLoop() {
    if (this.paused) return;
    this.checkGameEvents();
    this.updateEnemies();
    this.moveEndbossIfWalking();
  }

  checkGameEvents() {
    this.checkCollisions();
    this.checkThrowObjects();
    this.checkEndbossVisibility();
    this.checkLevelEndReached();
    this.checkGameStatus();
  }

  updateEnemies() {
    this.level.enemies.forEach(enemy => {
      if ((enemy instanceof Chicken || enemy instanceof LittleChicken) && !enemy.isDead && typeof enemy.update === "function") {
        enemy.update();
      }
    });
  }

  moveEndbossIfWalking() {
    const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    if (endboss && endboss.isWalking) {
      this.moveEndbossTowardsPlayer(endboss);
    }
  }

  checkThrowObjects() {
    if (this.canThrowBottle()) {
      if (this.collectedBottles > 0) {
        this.throwBottle();
      } else {
        showNoBottlesFeedback();
      }
    }
  }

  canThrowBottle() {
    return this.keyboard.B && !this.bottleThrowCooldown;
  }

  throwBottle() {
    this.bottleThrowCooldown = true;
    this.createAndAddBottle();
    this.collectedBottles--;
    updateBottleBar(this);
    setTimeout(() => {
      this.bottleThrowCooldown = false;
    }, this.bottleThrowCooldownDuration);
  }

  createAndAddBottle() {
    let offsetX = this.character.facingRight ? 50 : -10;
    let bottle = new ThrowableObject(this.character.x + offsetX, this.character.y + this.character.height / 2);
    bottle.throwDirection = this.character.facingRight ? 1 : -1;
    this.throwableObjects.push(bottle);
  }

  checkCollisions() {
    if (this.character.isDead()) return;
    this.checkEnemyCollisions();
    this.checkBottleEnemyCollisions();
    this.collectCoins();
    this.collectBottles();
    this.checkGameStatus();
  }

  checkEnemyCollisions() {
    this.level.enemies.forEach(enemy => {
      if (enemy.isDead) return;
      if (this.character.isColliding(enemy)) {
        if (this.isPlayerJumpingOnChicken(enemy)) {
          this.handleChickenDefeat(enemy);
        } else {
          this.handlePlayerHit();
        }
      }
    });
  }

  isPlayerJumpingOnChicken(enemy) {
    return (
      enemy instanceof Chicken && this.character.speedY < 0 && this.character.y + this.character.height <= enemy.y + enemy.height * 0.8
    );
  }

  handleChickenDefeat(enemy) {
    enemy.die();
    enemy.isDead = true;
    AudioHub.playOne(AudioHub.CHICKEN);
    this.character.speedY = 20; // Spieler springt nach dem Treffer nach oben
  }

  handlePlayerHit() {
    this.character.hit();
    this.healthBar.setPercentage(this.character.energy);
    console.log("Energieverlust");
  }

  checkBottleEnemyCollisions() {
    this.throwableObjects.forEach(bottle => {
      if (bottle.hasHit) return;
      this.level.enemies.forEach(enemy => {
        if (bottle.isColliding(enemy)) {
          bottle.splash();
          if (enemy instanceof Endboss) {
            enemy.hit(25);
            this.endbossBar.setPercentage(enemy.energy);
          } else if (enemy instanceof LittleChicken || enemy instanceof Chicken) {
            enemy.die();
            AudioHub.playOne(AudioHub.CHICKEN);
          }
        }
      });
      const groundLevel = 380;
      if (bottle.y >= groundLevel) {
        bottle.splash();
      }
    });
  }

  collectCoins() {
    this.collectedCoins = this.collectedCoins || 0;
    this.level.coins = this.level.coins.filter(coin => {
      if (this.character.isColliding(coin)) {
        this.collectedCoins++;
        updateCoinBar(this);
        AudioHub.playOne(AudioHub.COINS);
        return false; // Entferne den Coin
      }
      return true; // Behalte den Coin
    });
  }

  collectBottles() {
    this.collectedBottles = this.collectedBottles || 0;
    this.level.bottles = this.level.bottles.filter(bottle => {
      if (this.character.isColliding(bottle)) {
        this.collectedBottles++;
        updateBottleBar(this);
        AudioHub.playOne(AudioHub.BOTTLES);
        return false; // Entferne Bottle
      }
      return true; // Behalte Bottle
    });
  }

  checkGameStatus() {
    if (this.isGameLost()) {
      handleGameLost(this);
      return;
    }
    if (this.isGameWon()) {
      handleGameWon(this);
      return;
    }
  }

  isGameWon() {
    const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    return endboss && endboss.energy <= 0 && !this.gameEnded;
  }

  isGameLost() {
    return this.character.energy <= 0 && !this.gameEnded;
  }

  draw() {
    if (this.paused) return;
    updateCoinBarPulse(this);
    this.updateCamera();
    this.clearCanvas();
    this.drawBackground();
    this.drawClouds();
    this.drawCollectibles();
    this.drawCharacterAndEnemies();
    drawStatusBars(this);
    this.scheduleNextFrame();
  }

  updateCamera() {
    const cameraOffset = 300;
    this.camera_x = -Math.max(0, this.character.x - cameraOffset);
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackground() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
  }

  drawClouds() {
    if (!this.stopDrawingClouds && this.clouds && this.clouds.length) {
      this.clouds.forEach(cloud => this.addToMap(cloud));
    }
  }

  drawCollectibles() {
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.ctx.translate(-this.camera_x, 0);
    this.ctx.translate(this.camera_x, 0);
  }

  drawCharacterAndEnemies() {
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  scheduleNextFrame() {
    this.animationId = requestAnimationFrame(() => this.draw());
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

  checkLevelEndReached() {
    const endRegion = this.levelWidth - 800;
    const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);

    if (this.character.x > endRegion && endboss && !this.endbossTriggered) {
      this.triggerEndbossEntrance(endboss);
      this.endbossTriggered = true; // Flag to prevent repeated triggering
    }
  }

  triggerEndbossEntrance(endboss) {
    endboss.x = this.levelWidth + 200;
    endboss.otherDirection = false;
    this.character.isLocked = true;
    this.character.currentImage = 0;
    endboss.startWalking();
    this.endbossBar.isVisible = true;
    AudioHub.playOne(AudioHub.ENDBOSS_SOUND);
    // Unlock the character after a delay (e.g., 3 seconds)
    setTimeout(() => {
      this.character.isLocked = false;
    }, 3000); // Adjust time as needed
  }

  checkEndbossVisibility() {
    const endboss = getEndboss(this.level);
    if (!endboss) return;
    ensureEndbossWorldReference(endboss, this);
    if (this.endbossTriggered) {
      showEndbossBar(this.endbossBar);
      if (shouldSkipEnbossBehavior(endboss, this.levelWidth)) return;
    }
    const distanceToEndboss = getDistanceToEndboss(this.character, endboss);
    if (shouldShowEndbossBar(distanceToEndboss, this.endbossTriggered)) {
      showEndbossBar(this.endbossBar);
      triggerEndbossAlertIfNeeded(endboss);
      updateEndbossBehavior(endboss, distanceToEndboss);
    } else {
      hideEndbossBarIfNotTriggered(this.endbossBar, this.endbossTriggered);
    }
  }

  moveEndbossTowardsPlayer(endboss) {
    if (!endboss.isWalking) return;
    if (endboss.wasHitRecently) return;
    if (this.endbossTriggered && endboss.x > this.levelWidth - 100) {
      endboss.x -= 10; // Speed beim rein kommen.
      endboss.otherDirection = false;
      return;
    }
    const direction = this.character.x < endboss.x ? -1 : 1;
    const speed = 20; //Speed Endboss im Spiel.
    endboss.otherDirection = direction > 0;
    endboss.x += direction * speed;
  }

  pauseGame() {
    if (this.paused) return;
    this.paused = true;
    this._pauseStartTime = Date.now();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    pauseIntervals(this);
  }

  resumeGame() {
    const pauseDuration = Date.now() - this._pauseStartTime;

    if (this.character && pauseDuration) {
      this.character.lastMoveTime += pauseDuration;
    }
    this.paused = false;
    if (!this.animationId) {
      this.animationId = requestAnimationFrame(() => this.draw());
    }
    resumeIntervals(this);
  }
}
