class Coin extends MovableObject {
  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png", "img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  constructor(x, y) {
    super().loadImage(this.IMAGES_COIN[0]); //Erstes Bild laden
    this.loadImages(this.IMAGES_COIN); // Alle Animationsbilder laden
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_COIN);
    }, 400);
  }
}
