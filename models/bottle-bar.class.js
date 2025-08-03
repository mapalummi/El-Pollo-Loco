/**
 * Represents the bottle collection status bar in the game UI
 * Extends StatusBar to display bottle collection progress with different colors
 */
class BottleBar extends StatusBar {
  percentage = 0;

  /**
   * Creates a new bottle status bar with predefined images and positioning
   * Initializes with orange, green, and blue bottle bar images based on collection progress
   */
  constructor() {
    super(
      [
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
      ],
      30,
      0
    );
    this.setPercentage(0);
  }
}
