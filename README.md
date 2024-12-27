# TabNest Extension

A powerful Chromium extension to efficiently manage, save, and organize your tabs and browser windows.

## Features
- 📌 Save and restore tabs and browser windows effortlessly.
- 📂 Organize multiple tabs into manageable sessions.
- ⚡ Seamless support for both Chrome and Edge browsers.
- 🎨 Built with modern web technologies like TypeScript, TailwindCSS, and Webpack.


## Compatibility
- 🟢 Google Chrome
- 🟢 Microsoft Edge




## Installation Instructions

### Prerequisites
- A Chromium-based browser (Google Chrome or Microsoft Edge).
- Ensure Developer Mode is enabled in your browser settings.

### 📂 Steps to Install and Use the Extension
  - Clone the Repository or Download the ZIP file and extract it
  - Open your Chromium-based browser (Google Chrome or Microsoft Edge).
   - Navigate to the Extensions Management Page:
     - **Chrome**: `chrome://extensions/`
     - **Edge**: `edge://extensions/`
   - Enable Developer Mode (toggle located at the top-right corner).
   - Click **Load unpacked** and select the `dist` folder from the project directory.
   - Pin the extension on chrome browser or unhide on edge browser.


    
## Usage
Once the extension is loaded, you’ll see the TabNest icon in your browser's toolbar. Click the icon to access the extension and start managing and saving your browser tabs effortlessly.

## Development Setup
If you wish to contribute or make modifications:

1. Clone the repository as shown in the Installation Instructions.

2. Install all dependencies:
    ```bash
    npm install
    ```

3. Use the following commands for development:
   - Start Development Server:
        ```bash
        npm run watch
        ```
   - Build for Production:
        ```bash
        npm run build
        ```

The project uses Webpack for bundling and TailwindCSS for styling. Make modifications in the `src` folder, then rebuild the project to reflect changes.

## File Structure
```plaintext
TabNest-Extension/
├── dist/                   # Built extension files (used for browser installation)
├── src/                    # Source code for the extension
│   ├── components/         # UI components
│   ├── pages/              # Extension popup pages
│   └── utils/              # Utility functions
├── tailwind.config.js      # TailwindCSS configuration
├── tsconfig.json           # TypeScript configuration
├── webpack.*.js            # Webpack configurations
├── package.json            # Project metadata and dependencies
├── README.md               # Documentation
└── .gitignore              # Ignored files for Git
