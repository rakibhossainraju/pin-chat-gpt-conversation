/**
 * Class responsible for managing pinned conversations in local storage
 */
export class ChatHistoryStorage {
  /**
   * Initializes a new ChatHistoryStorage instance
   * Loads pinned conversations from localStorage on construction
   */
  constructor() {
    this.pinnedConversations = this.loadPinnedConversations();
  }

  /**
   * Loads pinned conversations from localStorage
   * @returns {Object} An object containing pinned conversations with conversation IDs as keys and titles as values
   * @private
   */
  loadPinnedConversations() {
    return JSON.parse(localStorage.getItem("pinnedConversations")) ?? {};
  }

  /**
   * Saves the current pinned conversations to localStorage
   */
  savePinnedConversations() {
    localStorage.setItem(
      "pinnedConversations",
      JSON.stringify(this.pinnedConversations),
    );
  }

  /**
   * Pins a conversation with the given ID and title
   * @param {string} conversationId - The unique identifier of the conversation to pin
   * @param {string} title - The title of the conversation to pin
   * @returns {boolean} True if the conversation was successfully pinned, false otherwise
   */
  pinConversation(conversationId, title) {
    if (!conversationId || !title || this.isConversationPinned(conversationId))
      return false;
    this.pinnedConversations[conversationId] = title;
    this.savePinnedConversations();
    return true;
  }

  /**
   * Unpins a conversation with the given ID
   * @param {string} conversationId - The unique identifier of the conversation to unpin
   * @returns {boolean} True if the conversation was successfully unpinned, false otherwise
   */
  unpinConversation(conversationId) {
    if (!conversationId || !this.isConversationPinned(conversationId)) {
      return false;
    }
    delete this.pinnedConversations[conversationId];
    this.savePinnedConversations();
    return true;
  }

  /**
   * Retrieves all pinned conversations
   * @returns {Object} An object containing all pinned conversations with conversation IDs as keys and titles as values
   */
  getPinnedConversations() {
    return this.pinnedConversations;
  }

  /**
   * Checks if a conversation is currently pinned
   * @param {string} conversationId - The unique identifier of the conversation to check
   * @returns {boolean} True if the conversation is pinned, false otherwise
   */
  isConversationPinned(conversationId) {
    return conversationId in this.pinnedConversations;
  }
}
