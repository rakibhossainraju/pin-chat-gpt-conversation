/**
 * Content script loader for the ChatGPT Pin Conversation extension
 * Dynamically imports and initializes the main content script
 * This file serves as the entry point for the extension's content script
 */

/**
 * Immediately invoked async function that loads and initializes the content script
 * Uses Chrome's runtime API to get the URL of the main content script
 * @async
 * @function
 */
(async () => {
  try {
    const src = chrome.runtime.getURL("scripts/content.js");
    const contentMain = await import(src);
    contentMain.main();
  } catch (e) {
    console.error("Could not start the script", e);
  }
})();
