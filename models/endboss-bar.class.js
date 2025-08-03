/**
 * Represents the endboss health status bar in the game UI
 * Extends StatusBar to display endboss health with color progression from orange to blue
 * Initially hidden and becomes visible when the endboss encounter is triggered
 */
class EndbossBar extends StatusBar {
  
  /**
   * Creates a new endboss status bar with predefined images and positioning
   * Initializes with orange, green, and blue health bar images based on health percentage
   * Sets initial state to hidden and full health (100%)
   */
  constructor() {
    super(
      [
        "img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
        "img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
        "img/7_statusbars/2_statusbar_endboss/green/green40.png",
        "img/7_statusbars/2_statusbar_endboss/green/green60.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
      ],
      490,
      10
    );
    this.isVisible = false;
    this.setPercentage(100);
  }
}
