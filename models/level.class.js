class Level {
  enemies;
  clouds;
  backgroundObjects;
  bottles; //NEU
  coins; //NEU

  level_end_x = 3690;

  constructor(enemies, clouds, backgroundObjects, bottles, coins) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.bottles = bottles; // initialisierung Flaschen
    this.coins = coins;
  }
}
