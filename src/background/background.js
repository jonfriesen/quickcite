import siteConfigs from '../content/config.js'

// Function to check if the URL matches any of our configured patterns
function getMatchingConfig(url) {
	for (const [siteKey, siteConfig] of Object.entries(siteConfigs)) {
		for (const [pageKey, pageConfig] of Object.entries(siteConfig.pages)) {
			if (pageConfig.urlPattern.test(url)) {
				return { siteKey, pageKey, buttonId: pageConfig.buttonId }
			}
		}
	}
	return null
}

// Keep track of the last action for each tab
const tabActions = new Map()

// Function to send a message to the content script
function sendMessageToContentScript(tabId, action, config) {
	// Get the current preferences and send them along with the action
	chrome.storage.sync.get({ formatPreference: 'markdown', buttonStyle: 'dark' }, (items) => {
		if (tabActions.get(tabId) !== action) {
			chrome.tabs.sendMessage(
				tabId,
				{
					action: action,
					formatPreference: items.formatPreference,
					buttonStyle: items.buttonStyle,
					config: config,
				},
				(response) => {
					if (chrome.runtime.lastError) {
						console.log(chrome.runtime.lastError.message)
					} else {
						tabActions.set(tabId, action)
					}
				},
			)
		}
	})
}

// Debounce function to limit how often handleNavigation is called
function debounce(func, wait) {
	let timeout
	return function (...args) {
		clearTimeout(timeout)
		timeout = setTimeout(() => func.apply(this, args), wait)
	}
}

// Function to handle navigation events
const handleNavigation = debounce((details) => {
	if (details.frameId === 0) {
		chrome.tabs.get(details.tabId, (tab) => {
			if (chrome.runtime.lastError) {
				console.log(chrome.runtime.lastError.message)
				return
			}
			const config = getMatchingConfig(tab.url)
			const action = config ? 'injectButton' : 'removeButtons'
			sendMessageToContentScript(details.tabId, action, config)
		})
	}
}, 250)

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete') {
		handleNavigation({ tabId, frameId: 0 })
	}
})

// Listen for history state updates (for SPAs)
chrome.webNavigation.onHistoryStateUpdated.addListener(handleNavigation)

// Listen for completed navigations
chrome.webNavigation.onCompleted.addListener(handleNavigation)

// Listen for fragment changes
chrome.webNavigation.onReferenceFragmentUpdated.addListener(handleNavigation)

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	switch (request.action) {
		case 'updatePreference':
		case 'updateStyle':
			chrome.storage.sync.set(
				{ [request.action === 'updatePreference' ? 'formatPreference' : 'buttonStyle']: request[request.action === 'updatePreference' ? 'formatPreference' : 'buttonStyle'] },
				() => {
					chrome.tabs.query({}, (tabs) => {
						tabs.forEach((tab) => {
							const config = getMatchingConfig(tab.url)
							if (config) {
								sendMessageToContentScript(tab.id, request.action, config)
							}
						})
					})
				},
			)
			break
	}
})
