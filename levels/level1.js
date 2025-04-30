const level1 = new Level(
  [new Chicken(), new Chicken(), new Chicken(), new LittleChicken(), new Endboss()],

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
  ],
  [
    new Bottle("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 300, 370),
    new Bottle("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 320, 370),
    new Bottle("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 340, 370),
    new Bottle("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 500, 380),
    new Bottle("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 520, 380),
    new Bottle("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 540, 380),
  ],
  [
    new Coin("img/8_coin/coin_1.png", 400, 130),
    new Coin("img/8_coin/coin_2.png", 420, 140),
    new Coin("img/8_coin/coin_1.png", 440, 130),
    new Coin("img/8_coin/coin_2.png", 460, 140),
    new Coin("img/8_coin/coin_1.png", 480, 130),
  ]
);

level1.clouds[0].x = 50;
level1.clouds[1].x = 1000;
level1.clouds[2].x = 1500;
level1.clouds[3].x = 2000;
