//NEU TEST
// const levelWidth = 4000; // Breite des Levels

// // Funktion zur Gruppenerstellung
// function createGroup(baseX, baseY, count, offsetX, offsetY, createObject) {
//   const group = [];
//   for (let i = 0; i < count; i++) {
//     const x = baseX + Math.random() * offsetX;
//     const y = baseY + Math.random() * offsetY;
//     group.push(createObject(x, y));
//   }
//   return group;
// }

// // Gruppierte Coins erstellen
// const coins = [];
// for (let i = 0; i < 10; i++) {
//   // 10 Gruppen
//   const baseX = Math.random() * levelWidth;
//   const baseY = 100 + Math.random() * 200;
//   const group = createGroup(baseX, baseY, 4, 50, 20, (x, y) => new Coin(x, y));
//   coins.push(...group);
// }

// // Gruppierte Bottles erstellen
// const bottles = [];
// for (let i = 0; i < 5; i++) {
//   // 5 Gruppen
//   const baseX = Math.random() * levelWidth;
//   const baseY = 300 + Math.random() * 100;
//   const group = createGroup(baseX, baseY, 3, 30, 10, (x, y) => new Bottle("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", x, y));
//   bottles.push(...group);
// }

//Level definieren:
const level1 = new Level(
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
  [new Coin(390, 160), new Coin(430, 140), new Coin(470, 130), new Coin(510, 140), new Coin(550, 160)]

  //NEU TEST
  // bottles, // Zufällig generierte Bottles
  // coins // Zufällig generierte Coins
);

level1.clouds[0].x = 50;
level1.clouds[1].x = 1000;
level1.clouds[2].x = 1500;
level1.clouds[3].x = 2000;

//NOTE: Kann das raus genommen werden!?
level1.totalCoins = level1.coins.length; // Gesamtzahl Coins berechnen!
level1.totalBottles = level1.bottles.length;
