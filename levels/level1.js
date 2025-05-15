let level1;

function initLevel() {
  level1 = new Level(
    [
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

    [new Cloud(), new Cloud(), new Cloud(), new Cloud()],

    [
      new BackgroundObject("img/5_background/layers/air.png", -719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -719),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),

      new BackgroundObject("img/5_background/layers/air.png", 0),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),

      new BackgroundObject("img/5_background/layers/air.png", 719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),

      new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),

      new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3),

      new BackgroundObject("img/5_background/layers/air.png", 719 * 4),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 4),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 4),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 4),

      new BackgroundObject("img/5_background/layers/air.png", 719 * 5),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 5),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 5),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 5),
    ],
    [
      new Bottle("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 300, 350),
      new Bottle("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 330, 350),
      new Bottle("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 360, 350),
      new Bottle("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 500, 390),
      new Bottle("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 530, 390),
      new Bottle("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 560, 390),
    ],
    [
      new Coin(390, 160),
      new Coin(430, 140),
      new Coin(470, 130),
      new Coin(510, 140),
      new Coin(550, 160),
      new Coin(800, 130),
      new Coin(840, 110),
      new Coin(880, 100),
      new Coin(920, 110),
      new Coin(960, 130),
    ]
  );
}
