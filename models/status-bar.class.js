class StatusBar extends DrawableObject {
  IMAGES = [];
  percentage = 100;
  isVisible = true;

  //NEU
  constructor(images, x, y) {
    super();
    this.IMAGES = images;
    this.loadImages(this.IMAGES);
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 55;
    this.setPercentage(100);
  }

  //setPercentage(50);
  setPercentage(percentage) {
    this.percentage = percentage; // => 0 ... 5
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }

  hide() {
    this.isVisible = false;
  }
}
