/**
 * Class responsible for tracking URL changes in the browser
 * Uses MutationObserver to monitor URL changes and execute callbacks when matching patterns
 */
export class URLTracker {
  /**
   * Creates a new URLTracker instance
   * @param {RegExp} pattern - The regular expression pattern to match against URLs
   */
  constructor(pattern) {
    this.pattern = pattern;
    this.onChangeCallback = null;
    this.init();
  }

  /**
   * Initializes the URL tracking functionality
   * Sets up a MutationObserver to monitor changes in the document title
   * which indicates URL changes in single-page applications
   * @private
   */
  init() {
    const observer = new MutationObserver(() => {
      const url = location.pathname;
      this.checkUrlChange(url);
    });

    const titleElement = document.querySelector("title");

    if (titleElement) {
      observer.observe(titleElement, { childList: true });
    }
  }

  /**
   * Sets up a callback function to be executed when URL changes match the pattern
   * @param {Function} callback - The function to be called when URL changes match the pattern
   * @param {string} callback.url - The new URL that triggered the callback
   */
  setupOnChangeCallback(callback) {
    this.onChangeCallback = callback;
  }

  /**
   * Checks if the current URL matches the pattern and triggers the callback if it does
   * @param {string} url - The URL to check against the pattern
   * @private
   */
  checkUrlChange(url) {
    if (this.pattern.test(url)) {
      if (this.onChangeCallback) {
        this.onChangeCallback(url);
      }
    }
  }
}
