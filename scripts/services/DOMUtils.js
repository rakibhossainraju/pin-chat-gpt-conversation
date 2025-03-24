import { DOMError } from "./errors.js";
import CONFIG from "../config.js";

/**
 * Utility class for DOM operations
 * Provides a unified interface for DOM manipulation and element creation
 */
class DOMUtils {
  /**
   * Creates a new DOM element with the specified tag name
   * @param {string} tagName - The HTML tag name
   * @returns {HTMLElement} The created element
   */
  static createElement(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Creates a button element with specified configuration
   * @param {Object} config - Button configuration
   * @param {string} config.className - CSS class name
   * @param {Object} [config.attributes] - Additional attributes
   * @param {string} [config.innerHTML] - Button content
   * @param {Function} [config.onClick] - Click event handler
   * @returns {HTMLButtonElement} The created button
   */
  static createButton({ className, attributes = {}, innerHTML, onClick }) {
    const button = this.createElement("div");
    button.className = className;

    Object.entries(attributes).forEach(([key, value]) => {
      button.setAttribute(key, value);
    });

    if (innerHTML) {
      button.innerHTML = innerHTML;
    }

    if (onClick) {
      button.addEventListener("click", onClick);
    }

    return button;
  }

  /**
   * Creates a section element with title and content area
   * @param {Object} config - Section configuration
   * @param {string} config.title - Section title
   * @param {string} config.id - Section ID
   * @returns {HTMLElement} The created section
   */
  static createSection({ title, id }) {
    const section = this.createElement("div");
    section.className = "relative mt-5 first:mt-0 last:mb-5";

    const header = this.createElement("div");
    header.className = "sticky bg-token-sidebar-surface-primary top-0 z-20";

    const titleSpan = this.createElement("span");
    titleSpan.className = "flex h-9 items-center";

    const titleElement = this.createElement("h3");
    titleElement.className =
      "px-2 text-xs font-semibold text-ellipsis overflow-hidden break-all pt-3 pb-2 text-token-text-primary";
    titleElement.textContent = title;

    const content = this.createElement("ol");
    content.id = id;

    titleSpan.appendChild(titleElement);
    header.appendChild(titleSpan);
    section.appendChild(header);
    section.appendChild(content);

    return section;
  }

  /**
   * Creates and appends a link element to load the pin button styles
   * Uses Chrome extension's runtime URL to load the stylesheet
   */
  static async createAndAppendPinButtonStyles() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = chrome.runtime.getURL("styles/style.css");
    document.head.appendChild(link);
    return link;
  }

  /**
   * Creates a link element with specified configuration
   * @param {Object} config - Link configuration
   * @param {string} config.href - Link URL
   * @param {Function} [config.onClick] - Click event handler
   * @returns {HTMLAnchorElement} The created link
   */
  static createLink({ href, onClick }) {
    const link = this.createElement("a");
    link.href = href;

    if (onClick) {
      link.addEventListener("click", onClick);
    }

    return link;
  }

  /**
   * Asynchronously waits for an element to be present in the DOM
   * @param {string} selector - CSS selector
   * @param {number} [timeout=30000] - Maximum time to wait in milliseconds
   * @returns {Promise<Element>} The found element
   * @throws {DOMError} If element is not found within timeout
   */
  static async waitForElement(
    selector,
    timeout = CONFIG.TIMEOUTS.ELEMENT_WAIT,
  ) {
    return new Promise((res, rej) => {
      const waitForChatItem = setInterval(() => {
        const desiredElement = document.querySelector(selector);
        if (desiredElement) {
          res(desiredElement);
          clearInterval(waitForChatItem);
        }
      }, CONFIG.TIMEOUTS.CHECK_INTERVAL);

      setTimeout(() => {
        rej(`Element not found: ${selector}`);
      }, timeout);
    });
  }

  /**
   * Updates the active state of elements within a container
   * @param {string} containerSelector - Container CSS selector
   * @param {string} targetSelector - Target elements CSS selector
   */
  static updateActiveState(containerSelector, targetSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Remove active class from all elements
    container
      .querySelectorAll(".active")
      .forEach((el) => el.classList.remove("active"));

    // Add active class to target elements
    container.querySelectorAll(targetSelector).forEach((el) => {
      el.parentNode.classList.add("active");
    });
  }

  /**
   * Clones an element and its children
   * @param {Element} element - Element to clone
   * @returns {Element} The cloned element
   */
  static cloneElement(element) {
    return element.cloneNode(true);
  }

  /**
   * Finds an element using a CSS selector
   * @param {string} selector - CSS selector
   * @returns {Element|null} The found element or null
   */
  static selector(selector) {
    return document.querySelector(selector);
  }

  /**
   * Finds all elements matching a CSS selector
   * @param {string} selector - CSS selector
   * @returns {NodeList} List of matching elements
   */
  static selectorAll(selector) {
    return document.querySelectorAll(selector);
  }
}

export default DOMUtils;
