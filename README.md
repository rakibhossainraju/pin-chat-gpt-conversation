# ChatGPT Pin Conversation Extension

A Chrome extension that allows you to pin important ChatGPT conversations for quick access.

## Features

- Pin/unpin ChatGPT conversations
- Pinned conversations appear at the top of the sidebar
- Quick navigation to pinned conversations
- Persistent storage of pinned conversations
- Modern and intuitive UI
- Efficient DOM operations and event handling
- Robust error handling

## Architecture

The extension is built with a modular architecture using modern JavaScript practices:

### Core Services

1. **ChatHistoryUI**
    - Manages the UI for pinned conversations
    - Handles user interactions and visual updates
    - Integrates with storage and event management

2. **ChatHistoryStorage**
    - Manages persistent storage of pinned conversations
    - Handles data validation and integrity
    - Uses Chrome's storage API

3. **URLTracker**
    - Monitors URL changes for conversation navigation
    - Handles URL validation and pattern matching
    - Manages navigation state

4. **EventManager**
    - Centralized event handling system
    - Custom event types for better communication
    - Event cleanup and resource management

5. **DOMUtils**
    - Utility class for DOM operations
    - Efficient element creation and manipulation
    - Non-blocking element observation
    - Consistent DOM interaction patterns

### Error Handling

The extension implements a robust error handling system:

- Custom error classes for different scenarios:
    - `ExtensionError`: Base error class
    - `StorageError`: Storage-related errors
    - `DOMError`: DOM manipulation errors
    - `ValidationError`: Data validation errors
    - `URLError`: URL-related errors

### Configuration

Centralized configuration management:

- UI constants and selectors
- Timeout values
- Error messages
- CSS classes and styles

## Installation

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory

## Usage

1. Navigate to any ChatGPT conversation
2. Hover over the conversation in the sidebar
3. Click the pin icon to pin/unpin the conversation
4. Pinned conversations will appear at the top of the sidebar
5. Click on a pinned conversation to navigate to it

## Development

### Project Structure

```
extension/
├── manifest.json
├── images/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── styles/
│   └── style.css
└── scripts/
    ├── config.js
    ├── content.js
    ├── content-loader.js
    └── services/
        ├── ChatHistoryUI.js
        ├── ChatHistoryStorage.js
        ├── URLTracker.js
        ├── EventManager.js
        ├── DOMUtils.js
        └── errors.js
```

### Key Components

1. **manifest.json**
    - Extension configuration
    - Permissions and content scripts
    - Resource declarations
    - Icon definitions

2. **images/**
    - Extension icons in different sizes
    - Used for Chrome Web Store and browser UI
    - Supports multiple resolutions (16x16, 48x48, 128x128)

3. **content.js**
    - Main extension logic
    - Service initialization
    - Event handling

4. **services/**
    - Modular service classes
    - Separation of concerns
    - Reusable utilities

### Best Practices

- Use `EventManager` for custom events
- Implement proper error handling with custom error classes
- Use `DOMUtils` for DOM operations
- Follow the established configuration patterns
- Maintain clean separation of concerns

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- ChatGPT for providing the base interface
- Chrome Extension APIs
- Contributors and maintainers

## Support

For support, please:

1. Check the existing issues
2. Create a new issue if needed
3. Provide detailed information about the problem

## Roadmap

- [ ] Add drag-and-drop reordering of pinned conversations
- [ ] Implement categories for pinned conversations
- [ ] Add search functionality for pinned conversations
- [ ] Support for multiple pinned sections
- [ ] Keyboard shortcuts for pin/unpin operations

## Version History

- v1.0.0
    - Initial release
    - Basic pin/unpin functionality
    - Persistent storage
    - UI integration with ChatGPT

## Security

- No data is sent to external servers
- All data is stored locally in the browser
- Uses Chrome's secure extension APIs
- Follows Chrome's extension security best practices

## Browser Support

- Chrome (primary)
- Other Chromium-based browsers (may work with modifications) 