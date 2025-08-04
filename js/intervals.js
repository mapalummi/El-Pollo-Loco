/**
 * Pauses all intervals and animations in the world and stores their state
 * @param {World} world - The game world object containing all intervals
 */
function pauseIntervals(world) {
  if (world._storedIntervals) return;
  world._storedIntervals = [];
  storeCoinBarInterval(world);
  pauseCharacterAnimation(world);
  pauseEnemyAnimations(world);
  pauseCloudAnimations(world);
  pauseGameLoopInterval(world);
}

/**
 * Resumes all previously paused intervals and animations from stored state
 * @param {World} world - The game world object containing stored intervals
 */
function resumeIntervals(world) {
  if (!world._storedIntervals) return;
  world._storedIntervals.forEach(item => resumeIntervalitem(world, item));
  world.run();
  world._storedIntervals = null;
}

/**
 * Stores the coin bar interval state and clears active coin bar timers
 * @param {World} world - The game world object containing the coin bar
 */
function storeCoinBarInterval(world) {
  if (!world.coinBar) return;
  world._storedIntervals.push({
    type: "coinBarHighlight",
    isHighlighted: world.coinBar.isHighlighted,
    allCoinsCollected: world.coinBar.allCoinsCollected,
    currentFrame: world.coinBar.currentHighlightFrame,
    remainingTime: world.coinBar.highlightTimeout
      ? Math.max(0, world.highlightDuration - (Date.now() - world._coinBarHighlightStartTime))
      : 0,
  });
  if (world.coinBar.highlightAnimationInterval) {
    clearInterval(world.coinBar.highlightAnimationInterval);
    world.coinBar.highlightAnimationInterval = null;
  }
  if (world.coinBar.highlightTimeout) {
    clearTimeout(world.coinBar.highlightTimeout);
    world.coinBar.highlightTimeout = null;
  }
}

/**
 * Pauses character animation and stores its current state
 * @param {World} world - The game world object containing the character
 */
function pauseCharacterAnimation(world) {
  if (world.character && world.character.animationInterval) {
    clearInterval(world.character.animationInterval);
    world._storedIntervals.push({
      type: "character",
      animation: world.character.currentAnimation,
    });
  }
}

/**
 * Pauses all enemy animations and stores their states
 * @param {World} world - The game world object containing enemies
 */
function pauseEnemyAnimations(world) {
  world.level.enemies.forEach((enemy, index) => {
    if (enemy.animationInterval) {
      clearInterval(enemy.animationInterval);
    }
    if (enemy.walkingAnimationInterval) {
      clearInterval(enemy.walkingAnimationInterval);
    }

    if (enemy instanceof Endboss) {
      const endbossState = {
        type: "endboss",
        index: index,
        wasHitRecently: enemy.wasHitRecently,
        isAttackOnCooldown: enemy.isAttackOnCooldown,
        isHurt: enemy.isHurt,
        isAttacking: enemy.isAttacking,
        isWalking: enemy.isWalking,
        isAlert: enemy.isAlert,
        isDead: enemy.isDead,
        hitCooldownRemaining: enemy.hitCooldownTimer ? Math.max(0, enemy.hitAlertDuration - (Date.now() - enemy.lastHit)) : 0,
        attackCooldownRemaining: enemy.isAttackOnCooldown
          ? Math.max(0, enemy.attackCooldownDuration - (Date.now() - enemy._lastAttackTime))
          : 0,
      };

      enemy.clearAllTimers();

      world._storedIntervals.push(endbossState);
    }

    world._storedIntervals.push({
      type: "enemy",
      index: index,
      object: enemy,
    });
  });
}

/**
 * Pauses all cloud animations and stores their states
 * @param {World} world - The game world object containing clouds
 */
function pauseCloudAnimations(world) {
  world.clouds.forEach((cloud, index) => {
    if (cloud.animationInterval) {
      clearInterval(cloud.animationInterval);
    }
    world._storedIntervals.push({
      type: "cloud",
      index: index,
      x: cloud.x,
      y: cloud.y,
    });
  });
}

/**
 * Pauses the main game loop interval
 * @param {World} world - The game world object containing the game loop interval
 */
function pauseGameLoopInterval(world) {
  if (world._gameLoopInterval) {
    clearInterval(world._gameLoopInterval);
  }
}

/**
 * Resumes a specific interval item based on its type
 * @param {World} world - The game world object
 * @param {Object} item - The stored interval item to resume
 */
function resumeIntervalitem(world, item) {
  switch (item.type) {
    case "character":
      resumeCharacterAnimation(world, item);
      break;
    case "enemy":
      resumeEnemyAnimation(world, item);
      break;
    case "endboss":
      resumeEndbossState(world, item);
      break;
    case "cloud":
      resumeCloudAnimation(world, item);
      break;
    case "coinBarHighlight":
      resumeCoinBarHighlight(world, item);
      break;
  }
}

/**
 * Resumes the endboss state by restoring all its properties and behaviors
 * @param {World} world - The game world object containing the endboss
 * @param {Object} item - The stored endboss state data
 */
function resumeEndbossState(world, item) {
  const endboss = getEndbossFromItem(world, item);
  if (!endboss) return;
  
  restoreEndbossBasicState(endboss, item);
  handleEndbossAlertState(endboss, item);
  restoreHitCooldown(endboss, item);
  restoreAttackCooldown(endboss, item);
  restartEndbossAnimation(endboss);
}

/**
 * Retrieves the endboss object from the stored item reference
 * @param {World} world - The game world object containing enemies
 * @param {Object} item - The stored endboss state with index reference
 * @returns {Endboss|null} The endboss object or null if not found
 */
function getEndbossFromItem(world, item) {
  const endboss = world.level.enemies[item.index];
  if (!endboss || !(endboss instanceof Endboss)) return null;
  return endboss;
}

/**
 * Restores the basic state properties of the endboss
 * @param {Endboss} endboss - The endboss object to restore state to
 * @param {Object} item - The stored endboss state data
 */
function restoreEndbossBasicState(endboss, item) {
  endboss.wasHitRecently = item.wasHitRecently;
  endboss.isAttackOnCooldown = item.isAttackOnCooldown;
  endboss.isHurt = item.isHurt;
  endboss.isAttacking = item.isAttacking;
  endboss.isWalking = item.isWalking;
  endboss.isAlert = item.isAlert;
}

/**
 * Handles the alert state of the endboss to prevent rapid re-triggering
 * @param {Endboss} endboss - The endboss object to set alert state on
 * @param {Object} item - The stored endboss state data
 */
function handleEndbossAlertState(endboss, item) {
  if (endboss.isAlert) {
    endboss._lastAlertTime = Date.now();
  }
}

/**
 * Restores hit cooldown timer for the endboss if it was active
 * @param {Endboss} endboss - The endboss object to restore cooldown to
 * @param {Object} item - The stored endboss state with cooldown data
 */
function restoreHitCooldown(endboss, item) {
  if (item.hitCooldownRemaining <= 0 || !item.wasHitRecently) return;
  
  endboss.hitCooldownTimer = endboss.trackTimer(
    setTimeout(() => {
      endboss.wasHitRecently = false;
      endboss.reEvaluateBehaviour();
    }, item.hitCooldownRemaining)
  );
}

/**
 * Restores attack cooldown timer for the endboss if it was active
 * @param {Endboss} endboss - The endboss object to restore cooldown to
 * @param {Object} item - The stored endboss state with cooldown data
 */
function restoreAttackCooldown(endboss, item) {
  if (item.attackCooldownRemaining <= 0 || !item.isAttackOnCooldown) return;
  
  endboss.trackTimer(
    setTimeout(() => {
      endboss.isAttackOnCooldown = false;
      updateEndbossBehaviorAfterCooldown(endboss);
    }, item.attackCooldownRemaining)
  );
}

/**
 * Updates endboss behavior after attack cooldown expires
 * @param {Endboss} endboss - The endboss object to update behavior for
 */
function updateEndbossBehaviorAfterCooldown(endboss) {
  if (endboss.world && endboss.world.character) {
    const distance = Math.abs(endboss.world.character.x - endboss.x);
    updateEndbossBehavior(endboss, distance);
  }
}

/**
 * Restarts the animation for the endboss
 * @param {Endboss} endboss - The endboss object to restart animation for
 */
function restartEndbossAnimation(endboss) {
  if (typeof endboss.animate === "function") {
    endboss.animate();
  }
}

/**
 * Resumes character animation from stored state
 * @param {World} world - The game world object containing the character
 * @param {Object} item - The stored character animation data
 */
function resumeCharacterAnimation(world, item) {
  if (world.character) {
    world.character.startAnimation(item.animation);
  }
}

/**
 * Resumes enemy animation from stored state
 * @param {World} world - The game world object containing enemies
 * @param {Object} item - The stored enemy animation data with index reference
 */
function resumeEnemyAnimation(world, item) {
  const enemy = world.level.enemies[item.index];
  if (enemy && typeof enemy.animate === "function") {
    enemy.animate();
  }
}

/**
 * Resumes cloud animation from stored state
 * @param {World} world - The game world object containing clouds
 * @param {Object} item - The stored cloud animation data with index reference
 */
function resumeCloudAnimation(world, item) {
  const cloud = world.clouds[item.index];
  if (cloud) {
    cloud.animate();
  }
}

/**
 * Resumes coin bar highlight animation from stored state
 * @param {World} world - The game world object containing the coin bar
 * @param {Object} item - The stored coin bar highlight data
 */
function resumeCoinBarHighlight(world, item) {
  if (item.isHighlighted) {
    world.coinBar.highlight();
  }
}
