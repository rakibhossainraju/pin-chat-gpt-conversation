import { DocumentManager } from "./DocumentManager.js";
import { ChatHistoryStorage } from "./ChatHistoryStorage.js";
import { URLTracker } from "./URLTracker.js";
import { PIN_ICON_SVG, UNPIN_ICON_SVG } from "./icons.js";

/**
 * Class responsible for managing the UI of chat history and pinned conversations
 * Extends DocumentManager to handle DOM operations
 * Manages the creation, display, and interaction with pinned conversations
 */
class ChatHistoryUI extends DocumentManager {
  /**
   * Creates a new ChatHistoryUI instance
   * Initializes storage manager and checks for existing history items
   */
  constructor() {
    super();
    this.storageManager = new ChatHistoryStorage();
    this.isHistoryItemExist();
  }

  /**
   * Checks for the existence of chat history items and initializes the UI when found
   * Uses an interval to wait for history items to load, with a timeout after 30 seconds
   * @private
   */
  isHistoryItemExist() {
    const waitForChatItem = setInterval(() => {
      const historyItem = document.querySelector("li[data-testid^='history']");
      if (historyItem) {
        this.chatContainer = this.selector(
          ".flex-col.flex-1.transition-opacity.duration-500.relative.overflow-y-auto",
        );
        try {
          this.initialize();
        } catch (e) {
          console.error(e);
        }
        clearInterval(waitForChatItem);
      }
    }, 10);
    setTimeout(() => {
      console.log("clearing the interval");
      clearInterval(waitForChatItem);
    }, 30 * 1000);
  }

  /**
   * Initializes the chat history UI
   * Sets up styles, templates, pinned section, event listeners, and URL tracking
   * @private
   */
  initialize() {
    this.createAndAppendPinButtonStyles();
    this.templateHistoryItem = this.cloneElement(this.getTemplateHistoryItem());
    this.createPinnedSection();
    this.setupEventListeners();
    this.setUpURLTracker();
    this.loadPinnedConversations();
  }

  /**
   * Sets up event listeners for chat container interactions and custom events
   * @private
   */
  setupEventListeners() {
    this.chatContainer.addEventListener(
      "mouseover",
      this.handleConversationHover,
    );
    window.addEventListener("pinConversation", this.handlePinConversation);
    window.addEventListener("unpinConversation", this.handleUnpinConversation);
  }

  /**
   * Retrieves all history items from the chat container
   * @returns {NodeList} List of history items
   * @private
   */
  getRawHistoryItems() {
    return this.chatContainer.querySelectorAll("li[data-testid^='history']");
  }

  /**
   * Gets a template history item for cloning
   * @returns {Element} A template history item element
   * @private
   */
  getTemplateHistoryItem() {
    const historyItems = this.getRawHistoryItems();
    const item = historyItems.length > 1 ? historyItems[1] : historyItems[0];
    item.firstElementChild.style = null;
    return item;
  }

  /**
   * Creates and appends the pinned conversations section to the sidebar
   * @private
   */
  createPinnedSection() {
    const sidebarPanel = this.chatContainer.querySelector(
      ".flex.flex-col.gap-2.text-token-text-primary.text-sm.false",
    );
    if (!sidebarPanel) return;

    const pinnedSectionHTML = `
      <div class="relative mt-5 first:mt-0 last:mb-5">
        <div class="sticky bg-token-sidebar-surface-primary top-0 z-20">
          <span class="flex h-9 items-center">
            <h3 class="px-2 text-xs font-semibold text-ellipsis overflow-hidden break-all pt-3 pb-2 text-token-text-primary">
              Pinned Conversations
            </h3>
          </span>
        </div>
        <ol id="pinned-conversations-list"></ol>
      </div>
    `;

    const sectionContainer = this.createElement("div");
    sectionContainer.innerHTML = pinnedSectionHTML;
    sidebarPanel.firstElementChild.prepend(sectionContainer);
  }

  /**
   * Handles the pin conversation event
   * @param {CustomEvent} event - The pin conversation event
   * @param {{title:string, conversationId: string}} event.detail - Event details containing conversationId and title
   * @private
   */
  handlePinConversation = ({ detail }) => {
    if (
      this.storageManager.pinConversation(detail.conversationId, detail.title)
    ) {
      this.addPinnedConversationToUI(detail);
      if (this.getURL() === detail.conversationId) {
        this.conversationChanged(detail.conversationId);
      }
    }
  };

  /**
   * Handles the unpin conversation event
   * @param {CustomEvent} event - The unpin conversation event
   * @param {Object} event.detail - Event details containing conversationId and title
   * @private
   */
  handleUnpinConversation = ({ detail }) => {
    if (this.storageManager.unpinConversation(detail.conversationId)) {
      this.removePinnedConversationFromUI(detail.conversationId);
      if (this.getURL() === detail.conversationId) {
        this.conversationChanged(detail.conversationId);
      }
    }
  };

  /**
   * Removes a pinned conversation from the UI
   * @param {string} conversationId - The ID of the conversation to remove
   * @private
   */
  removePinnedConversationFromUI(conversationId) {
    const pinnedList = this.chatContainer.querySelector(
      "#pinned-conversations-list",
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
   * @param {Object} data - The conversation data
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
    const pinnedList = this.chatContainer.querySelector(
      "#pinned-conversations-list",
    );
    const conversationItem = this.cloneElement(this.templateHistoryItem);
    const conversationLink = conversationItem.querySelector("a");
    const conversationText = conversationLink.querySelector("div[title]");
    if (isActiveConversation) {
      conversationItem.firstChild.classList.add("active");
    }
    conversationText.setAttribute("title", title);
    conversationText.innerHTML = title;

    conversationLink.removeAttribute("href");
    conversationLink.setAttribute("chatLink", conversationId);
    conversationLink.setAttribute("data-processed", true);
    conversationLink.setAttribute("data-discover", true);
    conversationLink.addEventListener("click", this.handleNavigation);

    conversationItem.appendChild(
      this.createUnpinButton({
        title,
        conversationId,
      }),
    );

    pinnedList.appendChild(conversationItem);
  }

  /**
   * Handles hover events on conversation items
   * @param {MouseEvent} event - The mouseover event
   * @private
   */
  handleConversationHover = ({ target }) => {
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
   * @param {Element} target - The target element to validate
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
    let currentUrl = window.location.href.split("/c/")[1];
    if (currentUrl) {
      currentUrl = "/c/" + currentUrl;
      return currentUrl;
    }
    return "";
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
    const buttonContainer = this.createElement("div");
    buttonContainer.classList.add("pin-button-tooltip");
    buttonContainer.setAttribute("data-conversation-id", data.conversationId);
    buttonContainer.setAttribute(
      "data-conversation-title",
      data.conversationTitle,
    );
    buttonContainer.addEventListener("click", this.handlePinButtonClick);
    buttonContainer.innerHTML = PIN_ICON_SVG;
    return buttonContainer;
  }

  /**
   * Creates an unpin button element
   * @param {Object} data - The conversation data
   * @returns {Element} The created unpin button element
   * @private
   */
  createUnpinButton(data) {
    const buttonContainer = this.createElement("div");
    buttonContainer.classList.add("unpin-button-tooltip");
    buttonContainer.setAttribute("data-conversation-id", data.conversationId);
    buttonContainer.setAttribute(
      "data-conversation-title",
      data.conversationTitle,
    );
    buttonContainer.addEventListener("click", this.handleUnpinButtonClick);
    buttonContainer.innerHTML = UNPIN_ICON_SVG;
    return buttonContainer;
  }

  /**
   * Loads all pinned conversations from storage and displays them in the UI
   * @private
   */
  loadPinnedConversations() {
    const pinnedConversations = this.storageManager.getPinnedConversations();
    Object.entries(pinnedConversations).forEach(([conversationId, title]) => {
      let isActiveConversation = false;
      if (this.getURL() === conversationId) isActiveConversation = true;
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

    const event = new CustomEvent("pinConversation", {
      detail: { conversationId, title },
    });
    window.dispatchEvent(event);
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
    const title = e.currentTarget.getAttribute("data-conversation-title");

    if (!conversationId || !title) return;

    const event = new CustomEvent("unpinConversation", {
      detail: { conversationId, title },
    });
    window.dispatchEvent(event);
  };

  /**
   * Updates the active state of conversations when the URL changes
   * @param {string} url - The new URL
   * @private
   */
  conversationChanged(url) {
    const addCLass = (url) => {
      const a =
        this.selector(`#pinned-conversations-list a[href="${url}"]`) ??
        this.selector(`#pinned-conversations-list a[chatLink="${url}"]`);
      if (a) a.parentNode.classList.add("active");
    };

    document
      .querySelectorAll("#pinned-conversations-list .active")
      .forEach((el) => el.classList.remove("active"));
    if (this.storageManager.isConversationPinned(url)) {
      addCLass(url);
    }
  }

  /**
   * Sets up URL tracking for conversation changes
   * @private
   */
  setUpURLTracker() {
    const urlPattern = /^\/c\/[a-f0-9-]+$/;
    const tracker = new URLTracker(urlPattern);
    tracker.setupOnChangeCallback((url) => {
      this.conversationChanged(url);
    });
  }

  /**
   * Handles navigation to a conversation
   * @param {MouseEvent} event - The click event
   * @private
   */
  handleNavigation = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const conversationLink = e.target.closest("a");
    const conversationId = conversationLink.attributes.chatLink.value;

    const allConversationLinks = this.chatContainer.querySelectorAll("a[href]");
    const originalConversation = Array.from(allConversationLinks).find(
      (link) => link.getAttribute("href") === conversationId,
    );

    if (originalConversation) {
      originalConversation.click();
    } else {
      const conversationLink = document.createElement("a");
      conversationLink.setAttribute("href", conversationId);
      conversationLink.click();
    }
  };
}

export default ChatHistoryUI;
