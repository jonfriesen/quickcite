# QuickCite

QuickCite is a Chrome extension designed to enhance productivity by allowing users to quickly copy formatted information from various websites, including GitHub, LinkedIn, and Instagram.

<h2 style="font-size: 1.5em; font-weight: normal;">✨ <a href="https://chromewebstore.google.com/detail/quickcite/bdkbkefnpcenapogkehakcgmffjbbkif">Add to Chrome</a> ✨</h2>

## Features

- Customizable button styles (dark, light, retro)
- Option to copy in Markdown or plain text format
- Configurable site-specific prefixes
- Enable/disable functionality for specific sites

### Supported Websites

Want support for more sites? Please [submit an issue](https://github.com/jonfriesen/quickcite/issues) to request additional website support!

| Website       | Sub-page          |
| ------------- | ----------------- |
| **GitHub**    |                   |
|               | Pull Request      |
|               | Issue             |
|               | Discussion        |
|               | Repository        |
|               | User/Organization |
|               | Release           |
| **Instagram** |                   |
|               | Profile           |
| **LinkedIn**  |                   |
|               | Profile           |
|               | Company           |
|               | Pulse Article     |

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/jonfriesen/quickcite.git
   ```
2. Navigate to the project directory:
   ```
   cd quickcite
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

After installation, the QuickCite button will appear on supported pages. Click the button to copy the formatted information to your clipboard.

For frequently asked questions and user support, please refer to our [FAQ document](docs/FAQ.md).

### Development

To run the extension in development mode:

```
npm run dev
```

This will start the Vite development server and watch for file changes.

**Note:** Hot Module Reload (HMR) in this project is inconsistent and often only works for the content and popup sections. You may need to manually refresh the extension or the page to see changes in other parts of the extension.

### Building

To build the extension for production:

```
npm run build
```

This will create a production-ready build in the `dist` directory.

### Installing the Unpacked Extension in Chrome

After building the extension, follow these steps to install it as an unpacked extension in Chrome:

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable "**Developer mode**" by toggling the switch in the top right corner.
3. Click on the "**Load unpacked**" button that appears after enabling Developer mode.
4. Navigate to the `dist` directory in your QuickCite project folder and select it.
5. The QuickCite extension should now be installed and visible in your Chrome extensions.

**Note:** When you make changes to the extension, you'll need to rebuild it and then click the "**Reload**" button on the extension card in `chrome://extensions/` to update the installed version.

### Releasing

To release a new version of the extension, run the following command:

```
npm run release -- [ <newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease ]
```

example:

```
npm run release -- patch
```

This will bump the version in `package.json` and `src/manifest.json`, create a new Git tag, and push the changes to the remote repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. However, please note that this project is unlicensed and private. While contributions are appreciated, the project owner maintains ownership of all use of the codebase.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

By submitting a pull request, you acknowledge that your contributions will be subject to the project's private and unlicensed status.

## License

This project is private and unlicensed. All rights reserved.

## Contact

Jon Friesen - jon@quickcite.link

Project Link: [https://github.com/jonfriesen/quickcite](https://github.com/jonfriesen/quickcite)

---

For more information, visit [https://quickcite.link](https://quickcite.link)
