import { injectOrUpdateButton, removeButtons } from './button.js'

export function setupMessageListener(state, siteConfigs) {
	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		switch (request.action) {
			case 'updateConfig':
				state.formatPreference = request.formatPreference
				state.selectedStyle = request.buttonStyle
				state.userSiteConfigs = request.siteConfigs
				state.currentConfig = request.config
				if (state.currentConfig) {
					injectOrUpdateButton(state.currentConfig, state.formatPreference, state.selectedStyle, siteConfigs)
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
					injectOrUpdateButton(state.currentConfig, state.formatPreference, state.selectedStyle, siteConfigs)
				}
				break
		}
	})
}

export function checkCurrentUrl() {
	chrome.runtime.sendMessage({ action: 'checkCurrentUrl' })
}
