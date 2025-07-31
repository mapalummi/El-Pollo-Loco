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

    // Initialisierung Endboss-Zustand:
    const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    if (endboss) {
      this.endbossBar.setPercentage(endboss.energy);
      this.endbossBar.isVisible = false; // Hide the bar initially
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
      if (this.character.isColliding(enemy)) {
        if (
          enemy instanceof Chicken &&
          this.character.speedY < 0 &&
          this.character.y + this.character.height <= enemy.y + enemy.height * 0.8
        ) {
          // Spieler springt auf das Chicken
          enemy.die();
          AudioHub.playOne(AudioHub.CHICKEN);
          this.character.speedY = 20; // Spieler springt nach dem Treffer nach oben
        } else {
          // Spieler wird getroffen
          this.character.hit();
          this.healthBar.setPercentage(this.character.energy);
        }
      }
    });
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
    const endRegion = this.levelWidth - 800; // Define end region (800px from level end)
    const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);

    if (this.character.x > endRegion && endboss && !this.endbossTriggered) {
      this.triggerEndbossEntrance(endboss);
      this.endbossTriggered = true; // Flag to prevent repeated triggering
    }
  }

  triggerEndbossEntrance(endboss) {
    // Position the endboss just off-screen to the right
    endboss.x = this.levelWidth + 200;
    endboss.otherDirection = false;

    this.character.isLocked = true;
    this.character.currentImage = 0;

    endboss.startWalking();

    this.endbossBar.isVisible = true;

    AudioHub.playOne(AudioHub.ENDBOSS_SOUND);

    // console.log("Endboss entrance triggered!");

    // Unlock the character after a delay (e.g., 3 seconds)
    setTimeout(() => {
      this.character.isLocked = false;
      // console.log("Character unlocked!");
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
    //CHECK: Speed Endboss doppelt im Spiel??
    const speed = 20; //Speed Endboss im Spiel.
    // Set appropriate direction for rendering
    endboss.otherDirection = direction > 0;
    // Bewege den Endboss
    endboss.x += direction * speed;
  }

  pauseGame() {
    if (this.paused) return; // Already paused
    this.paused = true;

    // Record the time when the game was paused
    this._pauseStartTime = Date.now();

    // Store the current animation frame ID so we can cancel it
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Pause all intervals
    this.pauseIntervals();
  }

  resumeGame() {
    // Calculate how long the game was paused
    const pauseDuration = Date.now() - this._pauseStartTime;
    // Adjust character's lastMoveTime to account for pause duration
    if (this.character && pauseDuration) {
      this.character.lastMoveTime += pauseDuration;
    }
    this.paused = false;
    // Only restart animation loop if it's not already running
    if (!this.animationId) {
      this.animationId = requestAnimationFrame(() => this.draw());
    }
    // Resume all intervals
    this.resumeIntervals();
  }

  pauseIntervals() {
    if (this._storedIntervals) return;
    this._storedIntervals = [];
    this.storeCoinBarInterval();
    this.pauseCharacterAnimation();
    this.pauseEnemyAnimations();
    this.pauseCloudAnimations();
    this.pauseGameLoopInterval();
  }

  storeCoinBarInterval() {
    if (!this.coinBar) return;
    this._storedIntervals.push({
      type: "coinBarHighlight",
      isHighlighted: this.coinBar.isHighlighted,
      allCoinsCollected: this.coinBar.allCoinsCollected,
      currentFrame: this.coinBar.currentHighlightFrame,
      remainingTime: this.coinBar.highlightTimeout
        ? Math.max(0, this.highlightDuration - (Date.now() - this._coinBarHighlightStartTime))
        : 0,
    });
    if (this.coinBar.highlightAnimationInterval) {
      clearInterval(this.coinBar.highlightAnimationInterval);
      this.coinBar.highlightAnimationInterval = null;
    }
    if (this.coinBar.highlightTimeout) {
      clearTimeout(this.coinBar.highlightTimeout);
      this.coinBar.highlightTimeout = null;
    }
  }

  pauseCharacterAnimation() {
    if (this.character && this.character.animationInterval) {
      clearInterval(this.character.animationInterval);
      this._storedIntervals.push({
        type: "character",
        animation: this.character.currentAnimation,
      });
    }
  }

  pauseEnemyAnimations() {
    this.level.enemies.forEach((enemy, index) => {
      if (enemy.animationInterval) {
        clearInterval(enemy.animationInterval);
      }
      if (enemy.walkingAnimationInterval) {
        clearInterval(enemy.walkingAnimationInterval);
      }
      this._storedIntervals.push({
        type: "enemy",
        index: index,
        object: enemy,
      });
    });
  }

  pauseCloudAnimations() {
    this.clouds.forEach((cloud, index) => {
      if (cloud.animationInterval) {
        clearInterval(cloud.animationInterval);
      }
      this._storedIntervals.push({
        type: "cloud",
        index: index,
        x: cloud.x,
        y: cloud.y,
      });
    });
  }

  pauseGameLoopInterval() {
    if (this._gameLoopInterval) {
      clearInterval(this._gameLoopInterval);
    }
  }

  resumeIntervals() {
    if (!this._storedIntervals) return;
    this._storedIntervals.forEach(item => this.resumeIntervalitem(item));
    this.run();
    this._storedIntervals = null;
  }

  resumeIntervalitem(item) {
    switch (item.type) {
      case "character":
        this.resumeCharacterAnimation(item);
        break;
      case "enemy":
        this.resumeEnemyAnimation(item);
        break;
      case "cloud":
        this.resumeCloudAnimation(item);
        break;
      case "coinBarHighlight":
        this.resumeCoinBarHighlight(item);
        break;
    }
  }

  resumeCharacterAnimation(item) {
    if (this.character) {
      this.character.startAnimation(item.animation);
    }
  }

  resumeEnemyAnimation(item) {
    const enemy = this.level.enemies[item.index];
    if (enemy && typeof enemy.animate === "function") {
      enemy.animate();
    }
  }

  resumeCloudAnimation(item) {
    const cloud = this.clouds[item.index];
    if (cloud) {
      cloud.animate();
    }
  }

  resumeCoinBarHighlight(item) {
    if (item.isHighlighted) {
      this.coinBar.highlight();
    }
  }
}
