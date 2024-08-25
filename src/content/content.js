import siteConfigs from './sites/config.js'
import '../styles/button.css'
import { setupMessageListener, checkCurrentUrl } from './messageHandler.js'

// Global state
const state = {
	formatPreference: 'markdown',
	selectedStyle: 'dark', // Default style
	userSiteConfigs: {},
	currentConfig: null,
}

// Enable debug in development
if (!('update_url' in chrome.runtime.getManifest())) {
	console.log('QuickCite - verbose logging enabled')
	console.debug = console.log // Enable debug in development
} else {
	console.debug = function () {} // Disable in production
}

// Set up message listener
setupMessageListener(state, siteConfigs)

// Initial setup
checkCurrentUrl()
