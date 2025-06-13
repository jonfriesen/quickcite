import { injectOrUpdateButton, removeButtons } from './button.js'

// Helper function to merge default and user site configurations
function getAllConfigs(defaultSiteConfigs, userSiteConfigs) {
	const allConfigs = { ...defaultSiteConfigs };
	for (const siteKey in userSiteConfigs) {
		if (allConfigs[siteKey]) {
			// Merge user config into the default config for the site
			allConfigs[siteKey] = {
				...allConfigs[siteKey],
				...userSiteConfigs[siteKey],
				// Ensure pages are also merged if they exist
				pages: {
					...(allConfigs[siteKey].pages || {}),
					...(userSiteConfigs[siteKey].pages || {})
				}
			};
		} else {
			// This case should ideally not happen if userSiteConfigs are based on defaultSiteConfigs
			allConfigs[siteKey] = userSiteConfigs[siteKey];
		}
	}
	return allConfigs;
}

export function setupMessageListener(state, siteConfigs) {
	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		switch (request.action) {
			case 'updateConfig':
				state.formatPreference = request.formatPreference
				state.selectedStyle = request.buttonStyle
				state.userSiteConfigs = request.siteConfigs
				state.currentConfig = request.config
				if (state.currentConfig) {
					injectOrUpdateButton(state.currentConfig, state.formatPreference, state.selectedStyle, getAllConfigs(siteConfigs, state.userSiteConfigs))
				} else {
					removeButtons()
				}
				break
			case 'removeButtons':
				removeButtons()
				break
			case 'updatePreference':
				state.formatPreference = request.formatPreference
				break
			case 'updateStyle':
				state.selectedStyle = request.buttonStyle
				if (state.currentConfig) {
					injectOrUpdateButton(state.currentConfig, state.formatPreference, state.selectedStyle, getAllConfigs(siteConfigs, state.userSiteConfigs))
				}
				break
		}
	})
}

export function checkCurrentUrl() {
	chrome.runtime.sendMessage({ action: 'checkCurrentUrl' })
}
