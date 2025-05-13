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
      clouds.push(new Cloud(this.levelWidth));
    }
    return clouds;
  }

  // Timer um Aktionen auszuführen:
  run() {
    // NEU:
    if (this._gameLoopInterval) {
      clearInterval(this._gameLoopInterval);
    }

    // setInterval(() => {
    //   this.checkCollisions();
    //   this.checkThrowObjects();
    //   this.checkEndbossVisibility();
    //   this.checkLevelEndReached();
    //   this.checkGameStatus();

    // NEU:
    this._gameLoopInterval = setInterval(() => {
      if (this.paused) return;

      this.checkCollisions();
      this.checkThrowObjects();
      this.checkEndbossVisibility();
      this.checkLevelEndReached();
      this.checkGameStatus();

      this.level.enemies.forEach(enemy => {
        if ((enemy instanceof Chicken || enemy instanceof LittleChicken) && !enemy.isDead && typeof enemy.update === "function") {
          //Checkt ob updates existieren
          enemy.update();
        }
      });

      // Bewege den Endboss, wenn er im Walking-Modus ist
      const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
      if (endboss && endboss.isWalking) {
        this.moveEndbossTowardsPlayer(endboss);
      }
    }, 100); //Interval hier evtl. auf 50 verkleinern!?
  }

  //BottleThrow - Feedback für Spieler (evtl. Sound)?
  checkThrowObjects() {
    if (this.keyboard.B && !this.bottleThrowCooldown) {
      if (this.collectedBottles > 0) {
        this.bottleThrowCooldown = true;

        let offsetX = this.character.facingRight ? 50 : -10;
        let bottle = new ThrowableObject(this.character.x + offsetX, this.character.y + this.character.height / 2);
        bottle.throwDirection = this.character.facingRight ? 1 : -1;
        this.throwableObjects.push(bottle);

        this.collectedBottles--;
        this.updateBottleBar();

        setTimeout(() => {
          this.bottleThrowCooldown = false;
        }, this.bottleThrowCooldownDuration);
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
          AudioHub.playOne(AudioHub.CHICKEN);
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
      if (bottle.hasHit) return; //Flaschen, die bereits getroffen haben überspringen

      this.level.enemies.forEach(enemy => {
        if (bottle.isColliding(enemy)) {
          bottle.splash(); // Flasche zerplatzt
          if (enemy instanceof Endboss) {
            console.log("Endboss getroffen");
            enemy.hit(25);
            this.endbossBar.setPercentage(enemy.energy);
          } else if (enemy instanceof LittleChicken || enemy instanceof Chicken) {
            enemy.die();
            AudioHub.playOne(AudioHub.CHICKEN);
          }
        }
      });

      // Bodenkollision
      const groundLevel = 380;
      if (bottle.y >= groundLevel) {
        bottle.splash();
      }
    });

    // Coins und Flaschen
    this.collectedCoins = this.collectedCoins || 0; //Sicherstellen, dass Zähler existiert.

    this.level.coins = this.level.coins.filter(coin => {
      if (this.character.isColliding(coin)) {
        // console.log("Coin eingesackt:", coin);

        this.collectedCoins++;
        this.updateCoinBar();

        AudioHub.playOne(AudioHub.COINS);

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
        AudioHub.playOne(AudioHub.BOTTLES);

        return false; // Entferne Bottle
      }
      // console.log("Keine Kollision mit Bottle:", bottle);
      return true; // Behalte Bottle
    });

    this.checkGameStatus(); // NEU !!!
  }

  updateCoinBar() {
    this.percentageCoins = (this.collectedCoins / this.totalCoins) * 100; //Prozentualer Fortschritt
    this.coinBar.setPercentage(this.percentageCoins); //Fortschritt an die Coinbar übergeben
    // console.log(`Aktueller Fortschritt Coins: ${this.percentageCoins}%`);
  }

  updateBottleBar() {
    this.percentageBottles = (this.collectedBottles / this.totalBottles) * 100;
    this.bottleBar.setPercentage(this.percentageBottles);
    // console.log(`Aktueller Fortschritt Bottles: ${this.percentageBottles}%`);
  }

  checkGameStatus() {
    // Verlust-Bedingung: Character ist tot
    if (this.character.energy <= 0 && !this.gameEnded) {
      this.gameEnded = true; // Prevent multiple triggers

      // Wait for death animation to complete
      const animationDuration = this.character.IMAGES_DEAD.length * 100;
      setTimeout(() => {
        showGameOverScreen(false); // Verloren
      }, animationDuration);
      return;
    }

    // Gewinn-Bedingung: Endboss besiegt
    const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);

    // Wenn Endboss existiert und seine Energie aufgebraucht ist
    if (endboss && endboss.energy <= 0 && !this.gameEnded) {
      console.log("Endboss wurde besiegt!", endboss);
      this.gameEnded = true; // Verhindert mehrfaches Auslösen

      // Warten auf Abschluss der Todesanimation, bevor GameOver gezeigt wird
      const animationDuration = endboss.IMAGES_DEAD.length * 200; // Gleiche Zeit wie in die()
      setTimeout(() => {
        showGameOverScreen(true); // Gewonnen
      }, animationDuration);

      return;
    }
  }

  draw() {
    // NEU:
    // Only proceed if not paused
    if (this.paused) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);

    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);

    this.ctx.translate(-this.camera_x, 0);

    this.ctx.translate(this.camera_x, 0);
    // Wolken nur zeichnen, wenn nicht gestoppt
    if (!this.stopDrawingClouds) {
      // Verwende BEIDE Wolkenarten
      if (this.clouds && this.clouds.length) {
        this.clouds.forEach(cloud => {
          this.addToMap(cloud);
        });
      }

      if (this.level.clouds && this.level.clouds.length) {
        this.level.clouds.forEach(cloud => {
          this.addToMap(cloud);
        });
      }
    }
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);

    // this.addToMap(this.bottleBar);
    // this.addToMap(this.coinBar);
    // this.addToMap(this.healthBar);
    // if (this.endbossBar.isVisible) {
    //   this.addToMap(this.endbossBar);
    // }

    // NEU - Only draw status bars if they're visible
    if (this.bottleBar.isVisible) {
      this.addToMap(this.bottleBar);
    }
    if (this.coinBar.isVisible) {
      this.addToMap(this.coinBar);
    }
    if (this.healthBar.isVisible) {
      this.addToMap(this.healthBar);
    }
    if (this.endbossBar.isVisible) {
      this.addToMap(this.endbossBar);
    }

    //Kollisionen prüfen
    this.checkCollisions();

    // Prüfen des Spielstatus, wenn das Spiel noch läuft
    if (!this.gameEnded) {
      this.checkGameStatus();
    }

    // Draw() wird immer wieder aufgerufen:
    // let self = this;
    // requestAnimationFrame(function () {
    //   self.draw();
    // });

    // NEU:
    // Store the animation ID
    let self = this;
    this.animationId = requestAnimationFrame(function () {
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

    console.log("Endboss entrance triggered!");

    // Unlock the character after a delay (e.g., 3 seconds)
    setTimeout(() => {
      this.character.isLocked = false;
      console.log("Character unlocked!");
    }, 5000); // Adjust time as needed
  }

  checkEndbossVisibility() {
    const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    if (!endboss) return;

    if (!endboss.world) {
      endboss.world = this;
    }

    // Nach dem Triggern immer die Healthbar anzeigen
    if (this.endbossTriggered) {
      this.endbossBar.isVisible = true;

      if (endboss.x > this.levelWidth - 500 && !endboss.isHurt && !endboss.wasHitRecently) {
        return;
      }
    }

    const distanceToEndboss = Math.abs(this.character.x - endboss.x);

    // Standard-Verhalten basierend auf Distanz
    if (distanceToEndboss < 500 || this.endbossTriggered) {
      this.endbossBar.isVisible = true;

      // Alert-Animation, wenn der Endboss den Spieler zum ersten Mal sieht
      if (!endboss.isAlert && !endboss.isAttacking && !endboss.isWalking && !endboss.isDead) {
        endboss.startAlert();
      }

      // Aktualisiere das Endboss-Verhalten basierend auf der Distanz
      this.updateEndbossBehavior(endboss, distanceToEndboss);
    } else {
      // Nur verstecken wenn nicht getriggert
      if (!this.endbossTriggered) {
        this.endbossBar.isVisible = false;
      }
    }
  }

  //ALT (kann evtl. raus):
  // updateEndbossBehavior(endboss, distance) {
  //   // Überspringe, wenn Endboss bereits tot ist oder gerade getroffen wurde
  //   if (endboss.isDead || endboss.isHurt) return;

  //   if (endboss.wasHitRecently) {
  //     console.log("Endboss recently hit, forcing alert mode");
  //     if (!endboss.isAlert) {
  //       endboss.startAlert();
  //     }
  //     return; // Don't proceed with other behavior checks
  //   }

  //   if (this.endbossTriggered && endboss.x > this.levelWidth - 500) {
  //     console.log("Endboss in entrance zone, walking");
  //     if (!endboss.isWalking) {
  //       endboss.startWalking();
  //     }
  //     return;
  //   }

  //   console.log(`Distance-based behavior: ${distance}`);

  //   // Distance-based behavior (only if not in entrance zone and not recently hit)
  //   if (distance < 300) {
  //     if (!endboss.isAttacking) {
  //       endboss.startAttacking();
  //     }
  //   } else if (distance < 900) {
  //     if (!endboss.isWalking) {
  //       endboss.startWalking();
  //       this.moveEndbossTowardsPlayer(endboss);
  //     }
  //   } else {
  //     if (!endboss.isAlert) {
  //       endboss.startAlert();
  //     }
  //   }
  // }

  //NEU (kompakter als vorher))
  updateEndbossBehavior(endboss, distance) {
    if (distance < 300) {
      endboss.startAttacking();
    } else if (distance < 800) {
      endboss.startWalking();
    } else {
      endboss.startAlert();
    }
  }

  moveEndbossTowardsPlayer(endboss) {
    // Don't move if not in walking state
    if (!endboss.isWalking) return;

    // Don't move if recently hit
    if (endboss.wasHitRecently) return;

    // If endboss is entering from right side of level
    if (this.endbossTriggered && endboss.x > this.levelWidth - 100) {
      endboss.x -= 10; // Speed beim rein kommen.
      endboss.otherDirection = false;
      return;
    }

    // Regular behavior when near the player
    const direction = this.character.x < endboss.x ? -1 : 1;
    const speed = 20; //Speed Endboss im Spiel.

    // Set appropriate direction for rendering
    endboss.otherDirection = direction > 0;
    // Bewege den Endboss
    endboss.x += direction * speed;

    //NEU
    if (this.world) {
      const distanceToPlayer = Math.abs(this.world.character.x - this.x);
      this.world.updateEndbossBehavior(this, distanceToPlayer);
    }
  }

  // NEU:
  pauseGame() {
    this.paused = true;

    // Store the current animation frame ID so we can cancel it
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Pause all intervals
    this.pauseIntervals();
  }

  resumeGame() {
    this.paused = false;

    // Resume the animation loop
    this.draw();

    // Resume all intervals
    this.resumeIntervals();
  }

  pauseIntervals() {
    // Store all active intervals
    if (!this._storedIntervals) {
      this._storedIntervals = [];

      // Handle character animations
      if (this.character && this.character.animationInterval) {
        clearInterval(this.character.animationInterval);
        this._storedIntervals.push({
          type: "character",
          animation: this.character.currentAnimation,
        });
      }

      // Handle enemy animations and movement
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

      // Handle cloud animations
      this.clouds.forEach((cloud, index) => {
        // Store cloud state
        this._storedIntervals.push({
          type: "cloud",
          index: index,
          x: cloud.x,
          y: cloud.y,
        });
      });

      // Pause the main game loop interval
      if (this._gameLoopInterval) {
        clearInterval(this._gameLoopInterval);
      }
    }
  }

  resumeIntervals() {
    // Restore all active intervals
    if (this._storedIntervals) {
      this._storedIntervals.forEach(item => {
        if (item.type === "character") {
          // Restart character animation
          if (this.character) {
            this.character.startAnimation(item.animation);
          }
        } else if (item.type === "enemy") {
          // Restart enemy animations
          const enemy = this.level.enemies[item.index];
          if (enemy && typeof enemy.animate === "function") {
            enemy.animate();
          }
        }
      });

      // Start the main game loop again
      this.run();

      // Clear stored intervals
      this._storedIntervals = null;
    }
  }
}
