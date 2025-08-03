/**
 * Represents the player health status bar in the game UI
 * Extends StatusBar to display player health with color progression from orange to blue
 * Shows health levels from 0% (orange) to 100% (blue) with intermediate green states
 */
class HealthBar extends StatusBar {
  
  /**
   * Creates a new health status bar with predefined images and positioning
   * Initializes with orange, green, and blue health bar images based on health percentage
   * Positioned at the top-left area of the screen below other UI elements
   */
  constructor() {
    super(
      [
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
      ],
      30,
      72
    );
    this.setPercentage(100);
  }
}
