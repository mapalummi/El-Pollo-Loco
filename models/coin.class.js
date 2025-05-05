class Coin extends MovableObject {
  x;
  y;
  width = 100;
  height = 100;

  offset = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40,
  };

  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png", "img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  constructor(x, y) {
    super().loadImage(this.IMAGES_COIN[0]); //Erstes Bild laden
    this.loadImages(this.IMAGES_COIN); // Alle Animationsbilder laden
    this.x = x;
    this.y = y;
    this.width;
    this.height;
    this.animate();
  }

  getRealFrame() {
    this.rX = this.x + (this.offset?.left || 0);
    this.rY = this.y + (this.offset?.top || 0);
    this.rW = this.width - (this.offset?.left || 0) - (this.offset?.right || 0);
    this.rH = this.height - (this.offset?.top || 0) - (this.offset?.bottom || 0);
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_COIN);
      this.getRealFrame();
    }, 400);
  }
}
