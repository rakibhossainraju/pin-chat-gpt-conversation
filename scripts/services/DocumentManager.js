/**
 * Abstract base class for managing DOM operations
 * Provides common DOM manipulation methods and utilities
 * @abstract
 */
export class DocumentManager {
  /**
   * Creates a new DocumentManager instance
   * @throws {Error} If attempting to instantiate DocumentManager directly, as it's an abstract class
   */
  constructor() {
    if (new.target === DocumentManager) {
      throw new Error("Cannot instantiate an abstract class");
    }
  }

  /**
   * Selects an element from the DOM using a CSS selector
   * @param {string} selector - The CSS selector to find the element
   * @returns {Element|null} The first element matching the selector, or null if no match is found
   */
  selector(selector) {
    return document.querySelector(selector);
  }

  /**
   * Creates a new DOM element with the specified tag name
   * @param {string} tagName - The HTML tag name for the new element
   * @returns {HTMLElement} The newly created DOM element
   */
  createElement(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Creates a deep copy of a DOM element
   * @param {Element} element - The DOM element to clone
   * @returns {Element} A deep copy of the specified element
   */
  cloneElement(element) {
    return element.cloneNode(true);
  }

  /**
   * Creates and appends a link element to load the pin button styles
   * Uses Chrome extension's runtime URL to load the stylesheet
   */
  createAndAppendPinButtonStyles() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = chrome.runtime.getURL("styles/style.css");
    document.head.appendChild(link);
  }
}
