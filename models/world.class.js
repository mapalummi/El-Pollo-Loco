/**
 * Main game world class that manages all game entities, physics, rendering, and game state
 * Coordinates interactions between character, enemies, collectibles, and UI elements
 * Handles collision detection, game loop, camera system, and pause/resume functionality
 */
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
  collectedBottles;
  percentageBottles;
  bottleThrowCooldown = false;
  bottleThrowCooldownDuration = 500;

  bottleBar = new BottleBar();
  healthBar = new HealthBar();
  coinBar = new CoinBar();
  endbossBar = new EndbossBar();
  throwableObjects = [];

  /**
   * Creates a new game world with canvas, keyboard input, and initializes all game systems
   * @param {HTMLCanvasElement} canvas - The HTML5 canvas element for rendering
   * @param {Keyboard} keyboard - The keyboard input handler instance
   */
  constructor(canvas, keyboard) {
    this.levelWidth = 4314;
    this.clouds = this.createClouds();
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.totalCoins = this.level.coins.length;
    this.collectedCoins = 0;
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

  /**
   * Creates and initializes cloud objects for atmospheric background effects
   * @returns {Cloud[]} Array of cloud objects positioned across the level width
   */
  createClouds() {
    const clouds = [];
    for (let i = 0; i < 10; i++) {
      const cloud = new Cloud(this.levelWidth);
      cloud.world = this;
      clouds.push(cloud);
    }
    return clouds;
  }

  /**
   * Starts the main game loop at 50ms intervals (20 FPS)
   * Clears any existing intervals before starting new one
   */
  run() {
    this.clearGameLoopInterval();
    this._gameLoopInterval = setInterval(() => this.gameLoop(), 50);
  }

  /**
   * Clears the game loop interval to prevent multiple running loops
   */
  clearGameLoopInterval() {
    if (this._gameLoopInterval) {
      clearInterval(this._gameLoopInterval);
    }
  }

  /**
   * Main game loop that processes all game logic when not paused
   * Handles collisions, enemy updates, endboss movement, and game events
   */
  gameLoop() {
    if (this.paused) return;
    this.checkGameEvents();
    this.updateEnemies();
    this.moveEndbossIfWalking();
  }

  /**
   * Checks all game events including collisions, throwing, endboss visibility, and win/lose conditions
   */
  checkGameEvents() {
    this.checkCollisions();
    this.checkThrowObjects();
    this.checkEndbossVisibility();
    this.checkLevelEndReached();
    this.checkGameStatus();
  }

  /**
   * Updates physics and behavior for all chicken enemies
   * Calls update method for living Chicken and LittleChicken instances
   */
  updateEnemies() {
    this.level.enemies.forEach(enemy => {
      if ((enemy instanceof Chicken || enemy instanceof LittleChicken) && !enemy.isDead && typeof enemy.update === "function") {
        enemy.update();
      }
    });
  }

  /**
   * Moves the endboss towards the player if endboss is in walking state
   */
  moveEndbossIfWalking() {
    const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    if (endboss && endboss.isWalking) {
      this.moveEndbossTowardsPlayer(endboss);
    }
  }

  /**
   * Handles bottle throwing input and cooldown management
   * Provides feedback when no bottles are available
   */
  checkThrowObjects() {
    if (this.canThrowBottle()) {
      if (this.collectedBottles > 0) {
        this.throwBottle();
      } else {
        showNoBottlesFeedback();
      }
    }
  }

  /**
   * Determines if a bottle can be thrown based on input and cooldown state
   * @returns {boolean} True if bottle throwing is allowed
   */
  canThrowBottle() {
    return this.keyboard.B && !this.bottleThrowCooldown;
  }

  /**
   * Executes bottle throwing sequence with cooldown and inventory management
   * Creates throwable object, updates UI, and manages throw cooldown
   */
  throwBottle() {
    this.bottleThrowCooldown = true;
    this.createAndAddBottle();
    this.collectedBottles--;
    updateBottleBar(this);
    setTimeout(() => {
      this.bottleThrowCooldown = false;
    }, this.bottleThrowCooldownDuration);
  }

  /**
   * Creates a new throwable bottle object and adds it to the world
   * Handles direction-based positioning and throw direction
   */
  createAndAddBottle() {
    let offsetX = this.character.facingRight ? 50 : -10;
    let bottle = new ThrowableObject(this.character.x + offsetX, this.character.y + this.character.height / 2);
    bottle.throwDirection = this.character.facingRight ? 1 : -1;
    this.throwableObjects.push(bottle);
  }

  /**
   * Checks all collision types: enemies, bottles vs enemies, and collectibles
   * Skips collision checking if character is dead
   */
  checkCollisions() {
    if (this.character.isDead()) return;
    this.checkEnemyCollisions();
    this.checkBottleEnemyCollisions();
    this.collectCoins();
    this.collectBottles();
    this.checkGameStatus();
  }

  /**
   * Handles collisions between character and enemies
   * Differentiates between jump attacks on chickens and damage-dealing collisions
   */
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

  /**
   * Determines if player is performing a jump attack on a chicken
   * @param {MovableObject} enemy - The enemy object to check
   * @returns {boolean} True if player is jumping on chicken from above
   */
  isPlayerJumpingOnChicken(enemy) {
    return (
      enemy instanceof Chicken && this.character.speedY < 0 && this.character.y + this.character.height <= enemy.y + enemy.height * 0.8
    );
  }

  /**
   * Handles successful chicken defeat by jump attack
   * @param {Chicken|LittleChicken} enemy - The chicken enemy to defeat
   */
  handleChickenDefeat(enemy) {
    enemy.die();
    enemy.isDead = true;
    AudioHub.playOne("CHICKEN");
    this.character.speedY = 20;
  }

  /**
   * Handles player taking damage from enemy collision
   * Reduces health and updates health bar display
   */
  handlePlayerHit() {
    this.character.hit();
    this.healthBar.setPercentage(this.character.energy);
    // console.log("Energieverlust");
  }

  /**
   * Checks collisions between thrown bottles and enemies or ground
   * Handles different damage amounts for different enemy types
   */
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
            AudioHub.playOne("CHICKEN");
          }
        }
      });
      const groundLevel = 380;
      if (bottle.y >= groundLevel) {
        bottle.splash();
      }
    });
  }

  /**
   * Handles coin collection with collision detection and UI updates
   * Removes collected coins from level and plays collection sound
   */
  collectCoins() {
    this.collectedCoins = this.collectedCoins || 0;
    this.level.coins = this.level.coins.filter(coin => {
      if (this.character.isColliding(coin)) {
        this.collectedCoins++;
        updateCoinBar(this);
        AudioHub.playOne("COINS");
        return false;
      }
      return true;
    });
  }

  /**
   * Handles bottle collection with collision detection and UI updates
   * Removes collected bottles from level and plays collection sound
   */
  collectBottles() {
    this.collectedBottles = this.collectedBottles || 0;
    this.level.bottles = this.level.bottles.filter(bottle => {
      if (this.character.isColliding(bottle)) {
        this.collectedBottles++;
        updateBottleBar(this);
        AudioHub.playOne("BOTTLES");
        return false;
      }
      return true;
    });
  }

  /**
   * Checks current game status and handles win/lose conditions
   * Triggers appropriate game ending sequences
   */
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

  /**
   * Determines if the game is won based on endboss defeat
   * @returns {boolean} True if endboss is defeated and game hasn't ended yet
   */
  isGameWon() {
    const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    return endboss && endboss.energy <= 0 && !this.gameEnded;
  }

  /**
   * Determines if the game is lost based on character death
   * @returns {boolean} True if character energy is zero and game hasn't ended yet
   */
  isGameLost() {
    return this.character.energy <= 0 && !this.gameEnded;
  }

  /**
   * Main rendering method that draws all game objects to canvas
   * Handles camera updates, layer ordering, and animation frame scheduling
   */
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

  /**
   * Updates camera position to follow character with offset
   * Prevents camera from going beyond level boundaries
   */
  updateCamera() {
    const cameraOffset = 300;
    this.camera_x = -Math.max(0, this.character.x - cameraOffset);
  }

  /**
   * Clears the entire canvas for the next frame
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws background objects with camera translation
   */
  drawBackground() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
  }

  /**
   * Draws cloud objects for atmospheric background effects
   * Respects stopDrawingClouds flag for performance optimization
   */
  drawClouds() {
    if (!this.stopDrawingClouds && this.clouds && this.clouds.length) {
      this.clouds.forEach(cloud => this.addToMap(cloud));
    }
  }

  /**
   * Draws collectible items (coins and bottles) with proper camera handling
   */
  drawCollectibles() {
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.ctx.translate(-this.camera_x, 0);
    this.ctx.translate(this.camera_x, 0);
  }

  /**
   * Draws character, enemies, and throwable objects with camera translation
   */
  drawCharacterAndEnemies() {
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Schedules the next animation frame for continuous rendering
   */
  scheduleNextFrame() {
    this.animationId = requestAnimationFrame(() => this.draw());
  }

  /**
   * Renders an array of objects to the canvas
   * @param {DrawableObject[]} objects - Array of drawable objects to render
   */
  addObjectsToMap(objects) {
    objects.forEach(o => {
      this.addToMap(o);
    });
  }

  /**
   * Renders a single movable object to the canvas with direction handling
   * @param {MovableObject} mo - The movable object to render
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the canvas context for rendering objects facing left
   * @param {MovableObject} mo - The object to flip
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores canvas context after flipping an object
   * @param {MovableObject} mo - The object to restore
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Checks if character has reached the level end and triggers endboss entrance
   * Manages endboss triggering state to prevent multiple activations
   */
  checkLevelEndReached() {
    const endRegion = this.levelWidth - 800;
    const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);

    if (this.character.x > endRegion && endboss && !this.endbossTriggered) {
      this.triggerEndbossEntrance(endboss);
      this.endbossTriggered = true;
    }
  }

  /**
   * Triggers the endboss entrance sequence with dramatic effects
   * @param {Endboss} endboss - The endboss object to trigger
   */
  triggerEndbossEntrance(endboss) {
    endboss.x = this.levelWidth + 200;
    endboss.otherDirection = false;
    this.character.isLocked = true;
    this.character.currentImage = 0;
    endboss.startWalking();
    this.endbossBar.isVisible = true;
    AudioHub.playOne("ENDBOSS_SOUND");

    setTimeout(() => {
      this.character.isLocked = false;
    }, 3000);
  }

  /**
   * Manages endboss visibility and behavior based on player proximity
   * Handles endboss bar display and AI behavior updates
   */
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

  /**
   * Moves endboss towards player during walking phase
   * @param {Endboss} endboss - The endboss object to move
   */
  moveEndbossTowardsPlayer(endboss) {
    if (!endboss.isWalking) return;
    if (endboss.wasHitRecently) return;
    if (this.endbossTriggered && endboss.x > this.levelWidth - 100) {
      endboss.x -= 10;
      endboss.otherDirection = false;
      return;
    }
    const direction = this.character.x < endboss.x ? -1 : 1;
    const speed = 20;
    endboss.otherDirection = direction > 0;
    endboss.x += direction * speed;
  }

  /**
   * Pauses the game by stopping animation frames and intervals
   * Records pause start time for duration calculations
   */
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

  /**
   * Resumes the game and adjusts timing-dependent values
   * Compensates for pause duration in character movement timing
   */
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
