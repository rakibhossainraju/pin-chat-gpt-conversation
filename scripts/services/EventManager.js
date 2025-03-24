import CONFIG from "../config.js";

/**
 * Event types for the ChatGPT Pin Conversation extension
 */
export const EVENT_TYPES = Object.freeze({
  PIN_CONVERSATION: "pinConversation",
  UNPIN_CONVERSATION: "unpinConversation",
  CONVERSATION_CHANGED: "conversationChanged",
});

/**
 * Class responsible for managing custom events
 * Provides a centralized event handling system
 */
export class EventManager {
  constructor() {
    this.eventHandlers = new Map();
  }

  /**
   * Registers an event handler
   * @param {string} eventType - The type of event to handle
   * @param {Function} handler - The event handler function
   * @param {Object} options - Event handler options
   * @param {boolean} options.once - Whether the handler should only fire once
   */
  on(eventType, handler, options = {}) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }

    this.eventHandlers.get(eventType).add({
      handler,
      once: options.once || false,
    });
  }

  /**
   * Removes an event handler
   * @param {string} eventType - The type of event
   * @param {Function} handler - The handler to remove
   */
  off(eventType, handler) {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach(({ handler: h }) => {
        if (h === handler) {
          handlers.delete({ handler: h });
        }
      });
    }
  }

  /**
   * Emits an event with the specified data
   * @param {string} eventType - The type of event to emit
   * @param {Object} data - The event data
   */
  emit(eventType, data) {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach(({ handler, once }) => {
        try {
          handler(data);
          if (once) {
            this.off(eventType, handler);
          }
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Creates a promise that resolves when an event is emitted
   * @param {string} eventType - The type of event to wait for
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<Object>} Promise that resolves with event data
   */
  waitForEvent(eventType, timeout = CONFIG.TIMEOUTS.ELEMENT_WAIT) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.off(eventType, handler);
        reject(new Error(`Timeout waiting for event: ${eventType}`));
      }, timeout);

      const handler = (data) => {
        clearTimeout(timeoutId);
        resolve(data);
      };

      this.on(eventType, handler, { once: true });
    });
  }

  /**
   * Cleans up all event handlers
   */
  cleanup() {
    this.eventHandlers.clear();
  }
}
