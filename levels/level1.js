/**
 * Global variable to store the first level instance
 * @type {Level}
 */
let level1;

/**
 * Initializes the first level with all enemies, environment objects, and collectibles
 * Creates a complete game level with:
 * - 6 regular chickens and 8 little chickens as enemies
 * - 1 endboss as the final challenge
 * - 4 clouds for atmospheric background effects
 * - Layered background objects creating parallax scrolling effect across 6 sections
 * - 12 collectible bottles positioned in 4 groups of 3
 * - 10 collectible coins arranged in 2 groups forming collection challenges
 */
function initLevel() {
  level1 = new Level(
    [
      // Enemy configuration: 6 chickens, 8 little chickens, 1 endboss
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new LittleChicken(),
      new LittleChicken(),
      new LittleChicken(),
      new LittleChicken(),
      new LittleChicken(),
      new LittleChicken(),
      new LittleChicken(),
      new LittleChicken(),
      new Endboss(),
    ],

    // Atmospheric clouds for background movement
    [new Cloud(), new Cloud(), new Cloud(), new Cloud()],

    [
      // Background layers creating parallax effect across 6 sections (719px width each)
      // Section 1 (-719px to 0px)
      new BackgroundObject("img/5_background/layers/air.png", -719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -719),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),

      // Section 2 (0px to 719px)
      new BackgroundObject("img/5_background/layers/air.png", 0),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),

      // Section 3 (719px to 1438px)
      new BackgroundObject("img/5_background/layers/air.png", 719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),

      // Section 4 (1438px to 2157px)
      new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),

      // Section 5 (2157px to 2876px)
      new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3),

      // Section 6 (2876px to 3595px)
      new BackgroundObject("img/5_background/layers/air.png", 719 * 4),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 4),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 4),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 4),

      // Section 7 (3595px to 4314px)
      new BackgroundObject("img/5_background/layers/air.png", 719 * 5),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 5),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 5),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 5),
    ],
    [
      // Collectible bottles arranged in 4 groups of 3 bottles each
      // Group 1: Around x=300-360
      new Bottle("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 300, 350),
      new Bottle("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 330, 360),
      new Bottle("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 360, 350),
      // Group 2: Around x=700-760
      new Bottle("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 700, 390),
      new Bottle("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 730, 380),
      new Bottle("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 760, 390),
      // Group 3: Around x=1200-1260
      new Bottle("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 1200, 360),
      new Bottle("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 1230, 370),
      new Bottle("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 1260, 360),
      // Group 4: Around x=1500-1560
      new Bottle("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 1500, 380),
      new Bottle("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 1530, 370),
      new Bottle("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 1560, 380),
    ],
    [
      // Collectible coins arranged in 2 arc-shaped groups for collection challenges
      // Group 1: Arc formation from x=390-550, varying heights y=130-160
      new Coin(390, 160),
      new Coin(430, 140),
      new Coin(470, 130),
      new Coin(510, 140),
      new Coin(550, 160),
      // Group 2: Arc formation from x=800-960, varying heights y=100-130
      new Coin(800, 130),
      new Coin(840, 110),
      new Coin(880, 100),
      new Coin(920, 110),
      new Coin(960, 130),
    ]
  );
}
