/**
 * Represents the coin collection status bar in the game UI with highlight animation
 * Extends StatusBar to display coin collection progress with color changes and special effects
 */
class CoinBar extends StatusBar {
  percentage = 0;
  isHighlighted = false;
  allCoinsCollected = false;
  highlightDuration = 3000;
  highlightTimeout = null;

  HIGHLIGHT_IMAGES = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png",
  ];

  currentHighlightFrame = 0;
  highlightAnimationInterval = null;
  animationFrameTime = 150;

  /**
   * Creates a new coin status bar with predefined images and positioning
   * Initializes with orange, green, and blue coin bar images based on collection progress
   * Sets up highlight animation images for completion celebration
   */
  constructor() {
    super(
      [
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
      ],
      30,
      37
    );
    this.setPercentage(0);
    this.loadImages(this.HIGHLIGHT_IMAGES);
  }

  /**
   * Activates highlight animation when all coins are collected
   * Prevents duplicate highlighting and sets automatic timeout for highlight removal
   */
  highlight() {
    if (this.isHighlighted) return;

    this.isHighlighted = true;
    this.allCoinsCollected = true;

    this.startHighlightAnimation();

    if (this.highlightTimeout) {
      clearTimeout(this.highlightTimeout);
    }

    this.highlightTimeout = setTimeout(() => {
      this.stopHighlightAnimation();
      this.isHighlighted = false;

      this.allCoinsCollected = true;
    }, this.highlightDuration);
  }

  /**
   * Removes highlight animation and resets coin collection state
   * Clears all highlight-related timers and intervals
   */
  removeHighlight() {
    if (!this.isHighlighted && !this.allCoinsCollected) return;

    if (this.highlightTimeout) {
      clearTimeout(this.highlightTimeout);
      this.highlightTimeout = null;
    }

    this.isHighlighted = false;
    this.allCoinsCollected = false;
    this.stopHighlightAnimation();
  }

  /**
   * Starts the cycling highlight animation using color frames
   * Clears any existing animation before starting new one
   */
  startHighlightAnimation() {
    this.stopHighlightAnimation();

    this.highlightAnimationInterval = setInterval(() => {
      this.currentHighlightFrame = (this.currentHighlightFrame + 1) % this.HIGHLIGHT_IMAGES.length;
    }, this.animationFrameTime);
  }

  /**
   * Stops the highlight animation and resets frame counter
   * Clears the animation interval to prevent memory leaks
   */
  stopHighlightAnimation() {
    if (this.highlightAnimationInterval) {
      clearInterval(this.highlightAnimationInterval);
      this.highlightAnimationInterval = null;
    }
    this.currentHighlightFrame = 0;
  }

  /**
   * Renders the coin bar and overlay highlight animation if active
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for drawing
   */
  draw(ctx) {
    super.draw(ctx);

    if (this.isHighlighted) {
      const highlightImg = this.imageCache[this.HIGHLIGHT_IMAGES[this.currentHighlightFrame]];
      if (highlightImg) {
        ctx.drawImage(highlightImg, this.x, this.y, this.width, this.height);
      }
    }
  }
}
