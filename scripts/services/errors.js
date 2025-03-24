/**
 * Custom error class for the ChatGPT Pin Conversation extension
 */

export class ExtensionError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = "ExtensionError";
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, ExtensionError);
  }
}

export class StorageError extends ExtensionError {
  constructor(message, details = {}) {
    super(message, "STORAGE_ERROR", details);
    this.name = "StorageError";
  }
}

export class DOMError extends ExtensionError {
  constructor(message, details = {}) {
    super(message, "DOM_ERROR", details);
    this.name = "DOMError";
  }
}

export class ValidationError extends ExtensionError {
  constructor(message, details = {}) {
    super(message, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class URLError extends ExtensionError {
  constructor(message, details = {}) {
    super(message, "URL_ERROR", details);
    this.name = "URLError";
  }
}
