/**
 * Base class for all drawable objects in the game
 * Provides fundamental image loading, caching, and rendering functionality
 */
class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 230;
  width = 100;
  height = 200;

  /**
   * Loads a single image from the specified path with error handling
   * @param {string} path - The file path to the image to be loaded
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
    this.img.onerror = () => {
      console.error(`Bild konnte nicht geladen werden: ${path}`);
    };
  }

  /**
   * Renders the object's current image to the canvas at its position
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for drawing
   */
  draw(ctx) {
    if (this.img) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    // KOLLISIONSRAHMEN ZEICHNEN:
    this.drawOffsetFrame(ctx);
  }

  /**
   * Draws blue collision frame around Character and Chicken objects for debugging
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for drawing
   */
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

  /**
   * Draws red offset-based collision frame for various game objects for debugging
   * Uses object's offset properties to show actual collision boundaries
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for drawing
   */
  drawOffsetFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof LittleChicken ||
      this instanceof Endboss ||
      this instanceof ThrowableObject ||
      this instanceof Coin ||
      this instanceof Bottle
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

  /**
   * Preloads multiple images into the image cache for animation purposes
   * @param {string[]} arr - Array of image file paths to be cached
   */
  loadImages(arr) {
    arr.forEach(path => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
