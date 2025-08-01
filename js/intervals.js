function pauseIntervals(world) {
  if (world._storedIntervals) return;
  world._storedIntervals = [];
  storeCoinBarInterval(world);
  pauseCharacterAnimation(world);
  pauseEnemyAnimations(world);
  pauseCloudAnimations(world);
  pauseGameLoopInterval(world);
}

function resumeIntervals(world) {
  if (!world._storedIntervals) return;
  world._storedIntervals.forEach(item => resumeIntervalitem(world, item));
  world.run();
  world._storedIntervals = null;
}

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

function pauseCharacterAnimation(world) {
  if (world.character && world.character.animationInterval) {
    clearInterval(world.character.animationInterval);
    world._storedIntervals.push({
      type: "character",
      animation: world.character.currentAnimation,
    });
  }
}

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

function pauseGameLoopInterval(world) {
  if (world._gameLoopInterval) {
    clearInterval(world._gameLoopInterval);
  }
}

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

function resumeCharacterAnimation(world, item) {
  if (world.character) {
    world.character.startAnimation(item.animation);
  }
}

function resumeEnemyAnimation(world, item) {
  const enemy = world.level.enemies[item.index];
  if (enemy && typeof enemy.animate === "function") {
    enemy.animate();
  }
}

function resumeCloudAnimation(world, item) {
  const cloud = world.clouds[item.index];
  if (cloud) {
    cloud.animate();
  }
}

function resumeCoinBarHighlight(world, item) {
  if (item.isHighlighted) {
    world.coinBar.highlight();
  }
}
