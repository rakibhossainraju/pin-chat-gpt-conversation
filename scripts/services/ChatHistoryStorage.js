import CONFIG from "../config.js";
import { StorageError, ValidationError } from "./errors.js";

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
   * @returns {Object} An object containing pinned conversations
   * @throws {StorageError} If there's an error accessing localStorage
   */
  loadPinnedConversations() {
    try {
      const data = localStorage.getItem(CONFIG.STORAGE.PINNED_CONVERSATIONS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      throw new StorageError(CONFIG.ERRORS.STORAGE_ERROR, {
        originalError: error,
      });
    }
  }

  /**
   * Saves pinned conversations to localStorage
   * @throws {StorageError} If there's an error saving to localStorage
   */
  savePinnedConversations() {
    try {
      localStorage.setItem(
        CONFIG.STORAGE.PINNED_CONVERSATIONS,
        JSON.stringify(this.pinnedConversations),
      );
    } catch (error) {
      throw new StorageError(CONFIG.ERRORS.STORAGE_ERROR, {
        originalError: error,
      });
    }
  }

  /**
   * Validates conversation data
   * @param {string} conversationId - The conversation ID
   * @param {string} title - The conversation title
   * @throws {ValidationError} If the data is invalid
   */
  validateConversationData(conversationId, title) {
    if (!conversationId || typeof conversationId !== "string") {
      throw new ValidationError("Invalid conversation ID");
    }
    if (!title || typeof title !== "string") {
      throw new ValidationError("Invalid conversation title");
    }
    if (this.isConversationPinned(conversationId)) {
      throw new ValidationError("Conversation is already pinned");
    }
  }

  /**
   * Pins a conversation with the given ID and title
   * @param {string} conversationId - The unique identifier of the conversation
   * @param {string} title - The title of the conversation
   * @returns {boolean} True if the conversation was successfully pinned
   * @throws {ValidationError} If the conversation data is invalid
   * @throws {StorageError} If there's an error saving to storage
   */
  pinConversation(conversationId, title) {
    try {
      this.validateConversationData(conversationId, title);
      this.pinnedConversations[conversationId] = title;
      this.savePinnedConversations();
      return true;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new StorageError(CONFIG.ERRORS.STORAGE_ERROR, {
        originalError: error,
      });
    }
  }

  /**
   * Unpins a conversation with the given ID
   * @param {string} conversationId - The unique identifier of the conversation
   * @returns {boolean} True if the conversation was successfully unpinned
   * @throws {ValidationError} If the conversation ID is invalid or not pinned
   * @throws {StorageError} If there's an error saving to storage
   */
  unpinConversation(conversationId) {
    try {
      if (!conversationId || typeof conversationId !== "string") {
        throw new ValidationError("Invalid conversation ID");
      }
      if (!this.isConversationPinned(conversationId)) {
        throw new ValidationError("Conversation is not pinned");
      }

      delete this.pinnedConversations[conversationId];
      this.savePinnedConversations();
      return true;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new StorageError(CONFIG.ERRORS.STORAGE_ERROR, {
        originalError: error,
      });
    }
  }

  /**
   * Retrieves all pinned conversations
   * @returns {Object} An object containing all pinned conversations
   */
  getPinnedConversations() {
    return { ...this.pinnedConversations };
  }

  /**
   * Checks if a conversation is currently pinned
   * @param {string} conversationId - The unique identifier of the conversation
   * @returns {boolean} True if the conversation is pinned
   * @throws {ValidationError} If the conversation ID is invalid
   */
  isConversationPinned(conversationId) {
    if (!conversationId || typeof conversationId !== "string") {
      throw new ValidationError("Invalid conversation ID");
    }
    return conversationId in this.pinnedConversations;
  }
}
