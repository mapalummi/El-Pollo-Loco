class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 230;
  width = 100;
  height = 200;

  // loadImage('img/test.png');
  loadImage(path) {
    this.img = new Image(); // this.img = document.getElementById('image') <img id="image" src>
    this.img.src = path;
    this.img.onerror = () => {
      console.error(`Bild konnte nicht geladen werden: ${path}`);
    };
  }

  draw(ctx) {
    if (this.img) {
      // Überprüfen, ob ein Bild vorhanden ist
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    this.drawOffsetFrame(ctx); // Kollisionsrahmen zeichnen (optional)
  }

  //NOTE: Kollisionsrahmen blau:
  // drawFrame(ctx) {
  //   if (this instanceof Character || this instanceof Chicken) {
  //     //Quadrate zeichnen für collision detection:
  //     ctx.beginPath();
  //     ctx.lineWidth = "2";
  //     ctx.strokeStyle = "blue";
  //     ctx.rect(this.x, this.y, this.width, this.height);
  //     ctx.stroke();
  //   }
  // }

  drawOffsetFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof LittleChicken ||
      this instanceof Endboss ||
      this instanceof ThrowableObject ||
      this instanceof Coin
    ) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "red";
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.left - this.offset.right,
        this.height - this.offset.top - this.offset.bottom
      );
      ctx.stroke();
    }
  }

  //
  // @param {Array} arr - ['img/image1.png', 'img/image2.png', ...]
  //
  loadImages(arr) {
    arr.forEach(path => {
      let img = new Image();
      img.src = path;
      // img.onload = () => console.log(`Bild geladen: ${path}`);
      // img.onerror = () => console.error(`Fehler beim Laden des Bildes: ${path}`);
      this.imageCache[path] = img; // Bild im Cache speichern
    });
  }
}
