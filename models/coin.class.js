class Coin extends MovableObject {
  x;
  y;
  width = 100;
  height = 100;

  offset = {
    top: 35,
    right: 35,
    bottom: 35,
    left: 35,
  };

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

  getRealFrame() {
    this.rX = this.x + (this.offset?.left || 0);
    this.rY = this.y + (this.offset?.top || 0);
    this.rW = this.width - (this.offset?.left || 0) - (this.offset?.right || 0);
    this.rH = this.height - (this.offset?.top || 0) - (this.offset?.bottom || 0);

    // Debugging-Logs
    // console.log("Coin Kollisionsrahmen:", {
    //   rX: this.rX,
    //   rY: this.rY,
    //   rW: this.rW,
    //   rH: this.rH,
    // });
  }

  animate() {
    setInterval(() => {
      this.getRealFrame();
      this.playAnimation(this.IMAGES_COIN);
      // this.getRealFrame();
    }, 400);
  }
}
