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

    // TEST NEU
    this.gameEnded = false;
    this.paused = false;

    this.draw();
    this.run();

    // Initialisiere den Endboss-Zustand
    const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    if (endboss) {
      this.endbossBar.setPercentage(endboss.energy);
      this.endbossBar.isVisible = false; // Hide the bar initially
    }
  }

  //NEU
  createClouds() {
    const clouds = [];
    for (let i = 0; i < 10; i++) {
      //Erstellt 10 Wolken
      clouds.push(new Cloud(this.levelWidth));
    }
    return clouds;
  }

  //Startet Timer um Aktionen auszuführen:
  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkEndbossVisibility();
      this.checkLevelEndReached();
      this.checkGameStatus(); // NEU !!!

      // Bewege den Endboss, wenn er im Walking-Modus ist
      const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
      if (endboss && endboss.isWalking) {
        this.moveEndbossTowardsPlayer(endboss);
      }
    }, 100); //Interval hier evtl. auf 50 verkleinern!?
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
          }
        }
      });
    });

    // Coins und Flaschen
    this.collectedCoins = this.collectedCoins || 0; //Sicherstellen, dass Zähler existiert.

    this.level.coins = this.level.coins.filter(coin => {
      if (this.character.isColliding(coin)) {
        // console.log("Coin eingesackt:", coin);

        this.collectedCoins++;
        this.updateCoinBar();

        //TODO:
        //Soundeffekt (später)

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
    console.log(`Aktueller Fortschritt Coins: ${this.percentageCoins}%`);
  }

  updateBottleBar() {
    this.percentageBottles = (this.collectedBottles / this.totalBottles) * 100;
    this.bottleBar.setPercentage(this.percentageBottles);
    console.log(`Aktueller Fortschritt Bottles: ${this.percentageBottles}%`);
  }

  // ALT:
  // checkGameStatus() {
  //   if (this.character.isDead()) {
  //     showGameOverScreen(false); // Spieler hat verloren
  //     return;
  //   }

  //   // //NOTE: Endboss-Tod prüfen
  //   const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);

  //   // // Prüfe zuerst, ob der Endboss existiert
  //   if (!endboss) return;

  //   // Überprüfe die Gesundheit des Endbosses statt isDead aufzurufen
  //   if (endboss.energy <= 0 && !this.gameEnded) {
  //     console.log("Endboss wurde besiegt!", endboss);
  //     this.gameEnded = true;
  //     showGameOverScreen(true);
  //   }
  // }

  // NEU!
  checkGameStatus() {
    // Verlust-Bedingung: Character ist tot
    if (this.character.energy <= 0) {
      showGameOverScreen(false); // Verloren
      return;
    }

    //Hierbei wird die "DIE-Animation" abgespielt aber Musik läft weiter...
    // Gewinn-Bedingung: Endboss besiegt
    // if (this.level.endboss && this.level.endboss.isDead()) {
    //   showGameOverScreen(true); // Gewonnen
    //   return;
    // }

    // Gewinn-Bedingung: Endboss besiegt
    // Erst den Endboss in der Feindeliste suchen
    const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);

    // Wenn Endboss existiert und seine Energie aufgebraucht ist
    if (endboss && endboss.energy <= 0 && !this.gameEnded) {
      console.log("Endboss wurde besiegt!", endboss);
      this.gameEnded = true; // Verhindert mehrfaches Auslösen
      showGameOverScreen(true); // Gewonnen
      return;
    }
  }

  // ORIGINAL:
  draw() {
    // this.clouds.forEach(cloud => cloud.draw(this.ctx)); //Kann das weg!?

    // Löscht das verherige Canvas:
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);

    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);

    this.ctx.translate(-this.camera_x, 0);

    this.ctx.translate(this.camera_x, 0);
    // this.addObjectsToMap(this.clouds); //Kann das raus!?
    //CHECK:
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

    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.healthBar);
    if (this.endbossBar.isVisible) {
      this.addToMap(this.endbossBar);
    }

    //Kollisionen prüfen
    this.checkCollisions();

    //NEU !!!
    // Prüfen des Spielstatus, wenn das Spiel noch läuft
    if (!gameOver) {
      this.checkGameStatus();
    }

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

    // Make the endboss visible if it wasn't before
    // endboss.isVisible = true;
    endboss.otherDirection = false;

    // Start walking mode
    endboss.startWalking();

    // Show the endboss health bar
    this.endbossBar.isVisible = true;

    console.log("Endboss entrance triggered!");
  }

  checkEndbossVisibility() {
    const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    if (!endboss) return;

    //CHECK: Ensure the endboss has a reference to the world
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

      // Löse Alert-Animation aus, wenn der Endboss den Spieler zum ersten Mal sieht
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

  updateEndbossBehavior(endboss, distance) {
    // Überspringe, wenn der Endboss bereits tot ist oder gerade getroffen wurde
    if (endboss.isDead || endboss.isHurt) return;

    // FIRST CHECK: Recently hit should always have highest priority
    if (endboss.wasHitRecently) {
      console.log("Endboss recently hit, forcing alert mode");
      if (!endboss.isAlert) {
        endboss.startAlert();
      }
      return; // Don't proceed with other behavior checks
    }

    // SECOND CHECK: Level entrance behavior (only if not recently hit)
    if (this.endbossTriggered && endboss.x > this.levelWidth - 500) {
      console.log("Endboss in entrance zone, walking");
      if (!endboss.isWalking) {
        endboss.startWalking();
      }
      return;
    }

    console.log(`Distance-based behavior: ${distance}`);

    // Distance-based behavior (only if not in entrance zone and not recently hit)
    if (distance < 100) {
      if (!endboss.isAttacking) {
        endboss.startAttacking();
      }
    } else if (distance < 700) {
      if (!endboss.isWalking) {
        endboss.startWalking();
        this.moveEndbossTowardsPlayer(endboss);
      }
    } else {
      if (!endboss.isAlert) {
        endboss.startAlert();
      }
    }
  }

  moveEndbossTowardsPlayer(endboss) {
    // Don't move if not in walking state
    if (!endboss.isWalking) return;

    // Don't move if recently hit
    if (endboss.wasHitRecently) return;

    // If endboss is entering from right side of level
    if (this.endbossTriggered && endboss.x > this.levelWidth - 200) {
      endboss.x -= 10; // Speed beim rein kommen
      endboss.otherDirection = false;
      return;
    }

    // Regular behavior when near the player
    const direction = this.character.x < endboss.x ? -1 : 1;
    const speed = 5; //Speed im Spiel

    // Set appropriate direction for rendering
    endboss.otherDirection = direction > 0;
    // Bewege den Endboss
    endboss.x += direction * speed;
  }

  clearAllObjects() {
    // Leere alle Arrays/Objekte
    this.level.enemies = [];
    this.level.clouds = [];
    this.level.coins = [];
    this.level.bottles = [];

    //CHECK:
    this.level.endboss = null;

    if (this.character) {
      this.character.x = -1000; // Außerhalb des sichtbaren bereichs platzieren
    }
  }
}
