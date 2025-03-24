import { URLError } from "./errors.js";

/**
 * Class responsible for tracking URL changes in the browser
 * Uses MutationObserver to monitor URL changes and execute callbacks when matching patterns
 */
export class URLTracker {
  /**
   * Creates a new URLTracker instance
   * @param {RegExp} pattern - The regular expression pattern to match against URLs
   * @throws {URLError} If the pattern is invalid
   */
  constructor(pattern) {
    if (!(pattern instanceof RegExp)) {
      throw new URLError("Invalid URL pattern provided");
    }
    this.pattern = pattern;
    this.onChangeCallback = null;
    this.observer = null;
    this.init();
  }

  /**
   * Initializes the URL tracking functionality
   * Sets up a MutationObserver to monitor changes in the document title
   * @private
   * @throws {URLError} If initialization fails
   */
  init() {
    try {
      this.observer = new MutationObserver(() => {
        const url = location.pathname;
        this.checkUrlChange(url);
      });

      const titleElement = document.querySelector("title");
      if (!titleElement) {
        throw new URLError("Title element not found");
      }

      this.observer.observe(titleElement, { childList: true });
    } catch (error) {
      throw new URLError("Failed to initialize URL tracker", {
        originalError: error,
      });
    }
  }

  /**
   * Sets up a callback function to be executed when URL changes match the pattern
   * @param {Function} callback - The function to be called when URL changes match the pattern
   * @param {string} callback.url - The new URL that triggered the callback
   * @throws {URLError} If the callback is invalid
   */
  setupOnChangeCallback(callback) {
    if (typeof callback !== "function") {
      throw new URLError("Invalid callback provided");
    }
    this.onChangeCallback = callback;
  }

  /**
   * Validates a URL against the pattern
   * @param {string} url - The URL to validate
   * @returns {boolean} Whether the URL matches the pattern
   * @private
   */
  isValidUrl(url) {
    return this.pattern.test(url);
  }

  /**
   * Checks if the current URL matches the pattern and triggers the callback if it does
   * @param {string} url - The URL to check against the pattern
   * @private
   */
  checkUrlChange(url) {
    if (this.isValidUrl(url) && this.onChangeCallback) {
      this.onChangeCallback(url);
    }
  }

  /**
   * Disconnects the URL tracker and cleans up resources
   */
  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.onChangeCallback = null;
  }
}
