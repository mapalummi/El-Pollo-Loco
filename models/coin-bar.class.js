class CoinBar extends StatusBar {
  percentage = 0;
  isHighlighted = false;
  //CHECK:
  allCoinsCollected = false; // Neuer Status für "alle Münzen gesammelt"
  highlightDuration = 3000; // Animation für 3 Sekunden
  highlightTimeout = null;

  HIGHLIGHT_IMAGES = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png",
  ];

  //CHECK:
  currentHighlightFrame = 0;
  highlightAnimationInterval = null;
  animationFrameTime = 150; // milliseconds between frames

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
    this.loadImages(this.HIGHLIGHT_IMAGES); //NEU
  }

  //CHECK:
  /**
   * Highlights the coin bar when all coins are collected
   */
  highlight() {
    if (this.isHighlighted) return; // Already highlighted

    this.isHighlighted = true;
    this.allCoinsCollected = true;

    // Start the animation
    this.startHighlightAnimation();

    // Set a timeout to stop the animation after 3 seconds
    if (this.highlightTimeout) {
      clearTimeout(this.highlightTimeout);
    }

    this.highlightTimeout = setTimeout(() => {
      // Stop just the animation, but keep track that all coins are collected
      this.stopHighlightAnimation();
      this.isHighlighted = false;

      // But keep allCoinsCollected as true
      this.allCoinsCollected = true;
    }, this.highlightDuration);
  }

  /**
   * Removes highlight from the coin bar
   */
  removeHighlight() {
    if (!this.isHighlighted && !this.allCoinsCollected) return; // Not highlighted

    // Clear any pending timeout
    if (this.highlightTimeout) {
      clearTimeout(this.highlightTimeout);
      this.highlightTimeout = null;
    }

    this.isHighlighted = false;
    this.allCoinsCollected = false;
    this.stopHighlightAnimation();
  }

  /**
   * Starts the highlight animation
   */
  startHighlightAnimation() {
    // Clear any existing animation
    this.stopHighlightAnimation();

    // Start new animation interval
    this.highlightAnimationInterval = setInterval(() => {
      // Cycle through frames (0, 1, 2, 0, 1, 2, ...)
      this.currentHighlightFrame = (this.currentHighlightFrame + 1) % this.HIGHLIGHT_IMAGES.length;
    }, this.animationFrameTime);
  }

  /**
   * Stops the highlight animation
   */
  stopHighlightAnimation() {
    if (this.highlightAnimationInterval) {
      clearInterval(this.highlightAnimationInterval);
      this.highlightAnimationInterval = null;
    }
    this.currentHighlightFrame = 0;
  }

  /**
   * Overrides the draw method to render the highlight animation
   */
  draw(ctx) {
    // First draw the normal status bar
    super.draw(ctx);

    // Then draw the highlight animation frame if highlighted
    if (this.isHighlighted) {
      const highlightImg = this.imageCache[this.HIGHLIGHT_IMAGES[this.currentHighlightFrame]];
      if (highlightImg) {
        ctx.drawImage(highlightImg, this.x, this.y, this.width, this.height);
      }
    }
  }
}
