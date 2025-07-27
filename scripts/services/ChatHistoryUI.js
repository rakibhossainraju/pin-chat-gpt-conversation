import { ChatHistoryStorage } from "./ChatHistoryStorage.js";
import { URLTracker } from "./URLTracker.js";
import { EventManager, EVENT_TYPES } from "./EventManager.js";
import DOMUtils from "./DOMUtils.js";
import { PIN_ICON_SVG, UNPIN_ICON_SVG } from "./icons.js";
import CONFIG from "../config.js";
import { DOMError } from "./errors.js";

/**
 * Class responsible for managing the UI of chat history and pinned conversations
 * Manages the creation, display, and interaction with pinned conversations
 */
class ChatHistoryUI {
  /**
   * Creates a new ChatHistoryUI instance
   * Initializes storage manager and checks for existing history items
   */
  constructor() {
    this.storageManager = new ChatHistoryStorage();
    this.eventManager = new EventManager();
    this.urlTracker = null;
    this.chatContainer = null;
    this.sidebarPanel = null;
    this.templateHistoryItem = null;
    this.init();
  }

  /**
   * Initializes the chat history UI
   * @private
   */
  async init() {
    try {
      await this.waitForChatContainer();
      await DOMUtils.createAndAppendPinButtonStyles();
      await this.createPinnedSection();
      this.setupEventListeners();
      // this.setUpURLTracker();
      this.loadPinnedConversations();
    } catch (error) {
      console.error("Failed to initialize ChatHistoryUI:", error);
    }
  }

  /**
   * Waits for the chat container to be available
   * @private
   */
  async waitForChatContainer() {
    try {
      this.chatContainer = await DOMUtils.waitForElement(
        CONFIG.SELECTORS.CHAT_CONTAINER,
      );
      this.templateHistoryItem = await DOMUtils.createTemplateHistoryItem();
      this.templateHistoryItem = DOMUtils.cloneElement(
        this.templateHistoryItem,
      );
    } catch (error) {
      throw new DOMError("Failed to find required chat elements", {
        originalError: error,
      });
    }
  }

  /**
   * Sets up event listeners for chat container interactions
   * @private
   */
  setupEventListeners() {
    this.chatContainer.addEventListener(
      "mouseover",
      this.handleConversationHover,
    );

    // Use EventManager for custom events
    this.eventManager.on(
      EVENT_TYPES.PIN_CONVERSATION,
      this.handlePinConversation,
    );
    this.eventManager.on(
      EVENT_TYPES.UNPIN_CONVERSATION,
      this.handleUnpinConversation,
    );
  }

  /**
   * Creates and appends the pinned conversations section to the sidebar
   * @private
   */
  async createPinnedSection() {
    this.sidebarPanel = this.chatContainer.querySelector(
      CONFIG.SELECTORS.SIDEBAR_PANEL,
    );
    if (!this.sidebarPanel) {
      this.sidebarPanel = await DOMUtils.waitForElement(
        CONFIG.SELECTORS.SIDEBAR_PANEL,
      );
      this.chatContainer = await DOMUtils.waitForElement(
        CONFIG.SELECTORS.CHAT_CONTAINER,
      );
      if (!this.sidebarPanel) {
        throw new DOMError("Sidebar panel not found");
      }
    }

    const pinnedSection = DOMUtils.createPinnedSection();

    this.sidebarPanel.prepend(pinnedSection);
    return Promise.resolve(this.sidebarPanel);
  }

  /**
   * Handles the pin conversation event
   * @param {{conversationId: string, title: string}} detail - Event data
   * @private
   */
  handlePinConversation = async (detail) => {
    try {
      if (
        this.storageManager.pinConversation(detail.conversationId, detail.title)
      ) {
        this.addPinnedConversationToUI(detail);
        if (this.getURL() === detail.conversationId) {
          this.conversationChanged(detail.conversationId);
        }
      }
    } catch (error) {
      console.error("Failed to pin conversation:", error);
    }
  };

  /**
   * Handles the unpin conversation event
   * @param {{conversationId: string}} detail - Event data
   * @private
   */
  handleUnpinConversation = async (detail) => {
    try {
      if (this.storageManager.unpinConversation(detail.conversationId)) {
        this.removePinnedConversationFromUI(detail.conversationId);
        if (this.getURL() === detail.conversationId) {
          this.conversationChanged(detail.conversationId);
        }
      }
    } catch (error) {
      console.error("Failed to unpin conversation:", error);
    }
  };

  /**
   * Removes a pinned conversation from the UI
   * @param {string} conversationId - The conversation ID
   * @private
   */
  removePinnedConversationFromUI(conversationId) {
    const pinnedList = this.chatContainer.querySelector(
      CONFIG.SELECTORS.PINNED_LIST,
    );
    const conversationItem = pinnedList.querySelector(
      `li:has(a[chatLink="${conversationId}"])`,
    );
    if (conversationItem) {
      conversationItem.remove();
    }
  }

  /**
   * Adds a pinned conversation to the UI
   * @param {Object} data - Conversation data
   * @param {string} data.title - The conversation title
   * @param {string} data.conversationId - The conversation ID
   * @param {boolean} [data.isActiveConversation] - Whether this is the active conversation (optional)
   * @private
   */
  addPinnedConversationToUI({
    title,
    conversationId,
    isActiveConversation = false,
  }) {
    const conversationItem = DOMUtils.cloneElement(this.templateHistoryItem);
    const conversationText = conversationItem.querySelector("span.item-title");
    // if (isActiveConversation) {
    //   conversationItem.firstChild.classList.add(CONFIG.CLASSES.ACTIVE);
    // }
    conversationText.setAttribute("title", title);
    conversationText.innerHTML = title;

    conversationItem.removeAttribute("href");
    conversationItem.setAttribute("chatLink", conversationId);
    conversationItem.setAttribute("data-processed", "true");
    conversationItem.setAttribute("data-discover", "true");
    conversationItem.addEventListener("click", this.handleNavigation);

    // conversationItem.appendChild(
    //   this.createUnpinButton({
    //     title,
    //     conversationId,
    //   }),
    // );

    this.sidebarPanel.appendChild(conversationItem);
  }

  /**
   * Handles hover events on conversation items
   * @param {MouseEvent} event - The mouseover event
   * @private
   */
  handleConversationHover = ({ target }) => {
    chrome.runtime.sendMessage({
      type: "FROM_CONTENT",
      payload: { message: "Hey popup, something happened!" },
    });
    console.log("MESSAGE SENT");
    if (!this.isValidConversationTarget(target)) return;

    const conversationId = target.getAttribute("href");
    const conversationTitle = target?.firstElementChild?.textContent;

    if (!conversationId || !conversationTitle) return;

    target.setAttribute("data-processed", true);
    this.addPinButtonToConversation(target, {
      conversationId,
      conversationTitle,
    });
  };

  /**
   * Validates if a target element is a valid conversation target
   * @param {Element} target - The target element
   * @returns {boolean} Whether the target is valid
   * @private
   */
  isValidConversationTarget(target) {
    return (
      target &&
      target.getAttribute("data-discover") &&
      !target.getAttribute("data-processed")
    );
  }

  /**
   * Gets the current conversation URL
   * @returns {string} The current conversation URL
   * @private
   */
  getURL() {
    return location.pathname ?? "";
  }

  /**
   * Adds a pin button to a conversation element
   * @param {Element} target - The target conversation element
   * @param {Object} data - The conversation data
   * @private
   */
  addPinButtonToConversation(target, data) {
    const pinButton = this.createPinButton(data);
    target.appendChild(pinButton);
  }

  /**
   * Creates a pin button element
   * @param {Object} data - The conversation data
   * @returns {Element} The created pin button element
   * @private
   */
  createPinButton(data) {
    return DOMUtils.createButton({
      className: CONFIG.CLASSES.PIN_BUTTON,
      attributes: {
        "data-conversation-id": data.conversationId,
        "data-conversation-title": data.conversationTitle,
      },
      innerHTML: PIN_ICON_SVG,
      onClick: this.handlePinButtonClick,
    });
  }

  /**
   * Creates an unpin button element
   * @param {Object} data - The conversation data
   * @returns {Element} The created unpin button element
   * @private
   */
  createUnpinButton(data) {
    return DOMUtils.createButton({
      className: CONFIG.CLASSES.UNPIN_BUTTON,
      attributes: {
        "data-conversation-id": data.conversationId,
        "data-conversation-title": data.conversationTitle,
      },
      innerHTML: UNPIN_ICON_SVG,
      onClick: this.handleUnpinButtonClick,
    });
  }

  /**
   * Loads all pinned conversations from storage and displays them in the UI
   * @private
   */
  loadPinnedConversations() {
    const pinnedConversations = this.storageManager.getPinnedConversations();
    Object.entries(pinnedConversations).forEach(([conversationId, title]) => {
      const isActiveConversation = this.getURL() === conversationId;
      this.addPinnedConversationToUI({
        title,
        conversationId,
        isActiveConversation,
      });
    });
  }

  /**
   * Handles click events on pin buttons
   * @param {MouseEvent} event - The click event
   * @private
   */
  handlePinButtonClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const conversationId = e.currentTarget.getAttribute("data-conversation-id");
    const title = e.currentTarget.getAttribute("data-conversation-title");

    if (!conversationId || !title) return;

    this.eventManager.emit(EVENT_TYPES.PIN_CONVERSATION, {
      conversationId,
      title,
    });
  };

  /**
   * Handles click events on unpin buttons
   * @param {MouseEvent} event - The click event
   * @private
   */
  handleUnpinButtonClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const conversationId = e.currentTarget.getAttribute("data-conversation-id");
    if (!conversationId) return;

    this.eventManager.emit(EVENT_TYPES.UNPIN_CONVERSATION, {
      conversationId,
    });
  };

  /**
   * Updates the active state of conversations when the URL changes
   * @param {string} url - The new URL
   * @private
   */
  conversationChanged(url) {
    DOMUtils.updateActiveState(
      CONFIG.SELECTORS.PINNED_LIST,
      `a[href="${url}"], a[chatLink="${url}"]`,
    );
  }

  /**
   * Sets up URL tracking for conversation changes
   * @private
   */
  setUpURLTracker() {
    this.urlTracker = new URLTracker(CONFIG.URL.PATTERN);
    this.urlTracker.setupOnChangeCallback((url) => {
      this.conversationChanged(url);
    });
  }

  /**
   * Handles navigation to a conversation
   * @param {MouseEvent} e - The click event
   * @private
   */
  handleNavigation = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const conversationLink = e.target.closest("a");
    const conversationId = conversationLink.attributes.chatLink.value;

    const allConversationLinks = this.chatContainer.querySelectorAll(
      CONFIG.SELECTORS.HISTORY_ITEM,
    );
    const originalConversation = Array.from(allConversationLinks).find(
      (link) => link.getAttribute("href") === conversationId,
    );

    if (originalConversation) {
      originalConversation.click();
    } else {
      const link = DOMUtils.createLink({
        href: conversationId,
      });
      link.click();
    }
  };

  /**
   * Cleans up resources and event listeners
   */
  cleanup() {
    if (this.urlTracker.observer) {
      this.urlTracker.disconnect();
    }
    this.eventManager.cleanup();
    this.chatContainer.removeEventListener(
      "mouseover",
      this.handleConversationHover,
    );
  }
}

export default ChatHistoryUI;
