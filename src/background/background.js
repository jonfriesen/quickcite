import siteConfigs from '../content/sites/config.js'

// Function to check if the URL matches any of our configured patterns
function getMatchingConfig(url, userSiteConfigs) {
	for (const [siteKey, siteConfig] of Object.entries(siteConfigs)) {
		// Skip disabled sites
		if (userSiteConfigs[siteKey]?.enabled === false) continue

		for (const [pageKey, pageConfig] of Object.entries(siteConfig.pages)) {
			if (pageConfig.urlPattern.test(url)) {
				return {
					siteKey,
					pageKey,
					buttonId: pageConfig.buttonId,
					prefix: userSiteConfigs[siteKey]?.prefix ?? siteConfig.prefix,
				}
			}
		}
	}
	return null
}

// Keep track of the last action for each tab
const tabActions = new Map()

// Function to send a message to the content script
function sendMessageToContentScript(tabId, action, config) {
	chrome.storage.sync.get({ formatPreference: 'markdown', buttonStyle: 'dark', siteConfigs: {} }, (items) => {
		chrome.tabs.sendMessage(
			tabId,
			{
				action: action,
				formatPreference: items.formatPreference,
				buttonStyle: items.buttonStyle,
				config: config,
				siteConfigs: items.siteConfigs,
			},
			(response) => {
				if (chrome.runtime.lastError) {
					console.log(chrome.runtime.lastError.message)
				}
			},
		)
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
			chrome.storage.sync.get({ siteConfigs: {} }, (items) => {
				const config = getMatchingConfig(tab.url, items.siteConfigs)
				const action = 'updateConfig'
				sendMessageToContentScript(details.tabId, action, config)
			})
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
		case 'updateSiteConfig':
			chrome.storage.sync.set(
				{
					[request.action === 'updatePreference' ? 'formatPreference' : request.action === 'updateStyle' ? 'buttonStyle' : 'siteConfigs']:
						request[request.action === 'updatePreference' ? 'formatPreference' : request.action === 'updateStyle' ? 'buttonStyle' : 'siteConfigs'],
				},
				() => {
					// Send update to all tabs
					chrome.tabs.query({}, (tabs) => {
						tabs.forEach((tab) => {
							chrome.storage.sync.get({ siteConfigs: {} }, (items) => {
								const config = getMatchingConfig(tab.url, items.siteConfigs)
								sendMessageToContentScript(tab.id, 'updateConfig', config)
							})
						})
					})
				},
			)
			break
	}
})

// Function to check current URL and update button
function checkCurrentUrlAndUpdateButton(tabId, url) {
	chrome.storage.sync.get({ siteConfigs: {} }, (items) => {
		const config = getMatchingConfig(url, items.siteConfigs)
		const action = config ? 'updateConfig' : 'removeButtons'
		sendMessageToContentScript(tabId, action, config)
	})
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete') {
		checkCurrentUrlAndUpdateButton(tabId, tab.url)
	}
})

// Enable debug in development
chrome.management.getSelf(function (info) {
	if (info.installType === 'development') {
		console.log('QuickCite - verbose logging enabled')
		console.debug = console.log // Enable debug in development
	} else {
		console.debug = function () { } // Disable in production
	}
})
