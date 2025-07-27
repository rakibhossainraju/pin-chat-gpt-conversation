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
  static createPinnedSection() {
    const section = this.createElement("section");
    section.className = "relative mt-5 first:mt-0 last:mb-5";
    section.innerHTML = `
    <h3 class="px-2 text-xs font-semibold text-ellipsis overflow-hidden break-all pt-3 pb-2 text-token-text-primary">${CONFIG.UI.PINNED_SECTION_TITLE}</h3>
    <div id=${CONFIG.SELECTORS.PINNED_LIST.slice(1)}></div>
    `;

    return section;
  }

  static async createTemplateHistoryItem() {
    const a = this.createElement("a");
    a.className = "group __menu-item hoverable";
    a.href = "#";
    a.draggable = false;
    a["data-discover"] = false;
    a["data-fill"] = false;
    a.innerHTML = `
      <div class="flex min-w-0 grow items-center gap-2.5">
        <div class="truncate">
          <span class="item-title" dir="auto">Place Holder Text</span>
        </div>
      </div>
    `;
    return a;
  }

  /**
   * Creates and appends a link element to load the pin button styles
   * Uses Chrome extension's runtime URL to load the stylesheet
   */
  static async createAndAppendPinButtonStyles() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.id = "pin-button-styles";
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
