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
    case "cloud":
      resumeCloudAnimation(world, item);
      break;
    case "coinBarHighlight":
      resumeCoinBarHighlight(world, item);
      break;
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
