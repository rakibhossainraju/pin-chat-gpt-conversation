# ChatGPT Pin Conversation Extension

A Chrome extension that enhances ChatGPT's interface by allowing users to pin important conversations for quick access. This extension adds a pinning system to ChatGPT's sidebar, making it easier to organize and access frequently used conversations.

## Features

- **Pin Conversations**: Pin important conversations to keep them easily accessible
- **Pinned Section**: Dedicated section in the sidebar for pinned conversations
- **Quick Navigation**: Direct access to pinned conversations
- **Persistent Storage**: Pinned conversations persist across sessions
- **Visual Indicators**: Clear visual feedback for pinned and active conversations
- **Hover Actions**: Pin/unpin functionality available on hover over conversations

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Navigate to ChatGPT in your browser
2. Hover over any conversation in the sidebar to reveal the pin button
3. Click the pin button to pin a conversation
4. Pinned conversations will appear in a dedicated "Pinned Conversations" section at the top of the sidebar
5. Click the unpin button on a pinned conversation to remove it from the pinned section

## Project Structure

```
├── scripts/
│   ├── services/
│   │   ├── ChatHistoryUI.js      # Main UI management class
│   │   ├── ChatHistoryStorage.js # Local storage management
│   │   ├── DocumentManager.js    # DOM manipulation utilities
│   │   ├── URLTracker.js         # URL change tracking
│   │   └── icons.js              # SVG icons for pin/unpin buttons
│   ├── content.js                # Main content script
│   └── content-loader.js         # Dynamic content script loader
├── styles/
│   └── style.css                 # Extension styles
└── manifest.json                 # Extension configuration
```

## Technical Details

### Core Components

#### ChatHistoryUI
- Manages the UI elements and interactions
- Handles pin/unpin button creation and placement
- Manages the pinned conversations section
- Tracks active conversations

#### ChatHistoryStorage
- Manages local storage operations
- Handles persistence of pinned conversations
- Provides methods for pin/unpin operations

#### DocumentManager
- Provides DOM manipulation utilities
- Handles element creation and modification
- Manages style injection

#### URLTracker
- Monitors URL changes in the ChatGPT interface
- Triggers UI updates when conversations change
- Ensures proper active state management

### Implementation Details

- Uses Chrome's extension APIs for content script injection
- Implements a custom event system for communication
- Utilizes localStorage for data persistence
- Employs MutationObserver for dynamic content monitoring
- Uses modern JavaScript features (async/await, ES modules)

## Development

### Prerequisites
- Chrome browser
- Basic understanding of Chrome extension development
- JavaScript knowledge

### Setup
1. Clone the repository
2. Install dependencies (if any)
3. Load the extension in Chrome
4. Make changes and test in the browser

### Building
The extension is built using vanilla JavaScript and doesn't require a build process. However, you may want to:
1. Minify the JavaScript files
2. Optimize the CSS
3. Package the extension for distribution

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