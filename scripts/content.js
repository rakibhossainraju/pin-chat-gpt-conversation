/**
 * Content script for the ChatGPT Pin Conversation extension
 * Initializes the chat history UI functionality
 */

import ChatHistoryUI from "./services/ChatHistoryUI.js";

/**
 * Main entry point for the extension
 * Initializes the ChatHistoryUI and handles any initialization errors
 * @function
 */
export function main() {
  try {
    new ChatHistoryUI();
    console.log("running the site");
  } catch (error) {
    console.log(error);
  }
}
