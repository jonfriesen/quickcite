// Function to check if the URL matches our pattern
function isMatchingUrl(url) {
	const pattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/\d+/
	return pattern.test(url)
}

// Keep track of the last action for each tab
const tabActions = new Map()

// Function to send a message to the content script
function sendMessageToContentScript(tabId, action) {
	// Get the current preferences and send them along with the action
	chrome.storage.sync.get({ formatPreference: 'markdown', prefix: ':github:' }, (items) => {
		if (tabActions.get(tabId) !== action) {
			chrome.tabs.sendMessage(
				tabId,
				{
					action: action,
					formatPreference: items.formatPreference,
					prefix: items.prefix,
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
			const action = isMatchingUrl(tab.url) ? 'injectButton' : 'removeButton'
			sendMessageToContentScript(details.tabId, action)
		})
	}
}, 250)

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete' && tab.url?.startsWith('https://github.com')) {
		handleNavigation({ tabId, frameId: 0 })
	}
})

// Listen for history state updates (for SPAs like GitHub)
chrome.webNavigation.onHistoryStateUpdated.addListener(handleNavigation, {
	url: [{ hostEquals: 'github.com' }],
})

// Listen for completed navigations
chrome.webNavigation.onCompleted.addListener(handleNavigation, {
	url: [{ hostEquals: 'github.com' }],
})

// Listen for fragment changes (react to changes in the # part of a URL)
chrome.webNavigation.onReferenceFragmentUpdated.addListener(handleNavigation, {
	url: [{ hostEquals: 'github.com' }],
})

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'updatePreference') {
		chrome.storage.sync.set({ formatPreference: request.formatPreference }, () => {
			// Notify all tabs to update the button
			chrome.tabs.query({ url: 'https://github.com/*' }, (tabs) => {
				tabs.forEach((tab) => {
					sendMessageToContentScript(tab.id, 'updatePreference')
				})
			})
		})
	} else if (request.action === 'updatePrefix') {
		chrome.storage.sync.set({ prefix: request.prefix }, () => {
			// Notify all tabs to update the button
			chrome.tabs.query({ url: 'https://github.com/*' }, (tabs) => {
				tabs.forEach((tab) => {
					sendMessageToContentScript(tab.id, 'updatePrefix')
				})
			})
		})
	}
})
