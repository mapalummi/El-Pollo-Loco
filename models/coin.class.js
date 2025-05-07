class Coin extends MovableObject {
  x;
  y;
  width;
  height;

  offset = {
    top: 45,
    right: 45,
    bottom: 45,
    left: 45,
  };

  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png", "img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  constructor(x, y) {
    super().loadImage(this.IMAGES_COIN[0]); //Erstes Bild laden
    this.loadImages(this.IMAGES_COIN); // Alle Animationsbilder laden
    this.x = x;
    this.y = y;
    this.width = 120;
    this.height = 120;
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
      this.getRealFrame();
      this.playAnimation(this.IMAGES_COIN);
      // this.getRealFrame();
    }, 400);
  }
}
