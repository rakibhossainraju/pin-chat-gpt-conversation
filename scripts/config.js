/**
 * Configuration file for the ChatGPT Pin Conversation extension
 * Centralizes all constants and settings
 */

const CONFIG = {
  // DOM Selectors
  SELECTORS: Object.freeze({
    CHAT_CONTAINER:
      ".flex-col.flex-1.transition-opacity.duration-500.relative.overflow-y-auto",
    HISTORY_ITEM: "li[data-testid^='history']",
    SIDEBAR_PANEL: ".flex.flex-col.gap-2.text-token-text-primary.text-sm.false",
    PINNED_LIST: "#pinned-conversations-list",
    CONVERSATION_LINK: "a[href]",
  }),

  // CSS Classes
  CLASSES: Object.freeze({
    PIN_BUTTON: "pin-button-tooltip",
    UNPIN_BUTTON: "unpin-button-tooltip",
    ACTIVE: "active",
  }),

  // Storage Keys
  STORAGE: Object.freeze({
    PINNED_CONVERSATIONS: "pinnedConversations",
  }),

  // Timeouts
  TIMEOUTS: Object.freeze({
    ELEMENT_WAIT: 30000, // 10 seconds
    CHECK_INTERVAL: 50, // 50ms
  }),

  // URL Patterns
  URL: Object.freeze({
    PATTERN: /^\/c\/[a-f0-9-]+$/,
    BASE: "https://chat.openai.com",
  }),

  // Error Messages
  ERRORS: Object.freeze({
    ELEMENT_NOT_FOUND: "Required element not found in the DOM",
    INVALID_CONVERSATION: "Invalid conversation data provided",
    STORAGE_ERROR: "Error accessing local storage",
    URL_ERROR: "Invalid URL format",
  }),

  // UI Text
  UI: Object.freeze({
    PINNED_SECTION_TITLE: "Pinned Conversations",
  }),
};
export default Object.freeze(CONFIG);
