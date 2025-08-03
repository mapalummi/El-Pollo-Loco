/**
 * Represents a game level containing all game objects and environment elements
 * Manages enemies, clouds, background objects, collectible items, and level boundaries
 */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  bottles;
  coins;

  level_end_x = 3690;

  /**
   * Creates a new level with all specified game objects and elements
   * @param {Array} enemies - Array of enemy objects (chickens, little chickens, endboss)
   * @param {Array} clouds - Array of cloud objects for atmospheric background
   * @param {Array} backgroundObjects - Array of background image objects for scenery
   * @param {Array} bottles - Array of collectible bottle objects
   * @param {Array} coins - Array of collectible coin objects
   */
  constructor(enemies, clouds, backgroundObjects, bottles, coins) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.bottles = bottles;
    this.coins = coins;
  }
}
