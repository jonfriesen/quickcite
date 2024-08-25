import '../styles/main.css'
import '../styles/button.css'
import './popup.css'
import siteConfigs from '../content/sites/config.js'

document.addEventListener('DOMContentLoaded', () => {
	// Load current preferences and site configurations
	chrome.storage.sync.get({ formatPreference: 'markdown', buttonStyle: 'dark', siteConfigs: {} }, (items) => {
		// Set format preference
		document.querySelector(`input[value="${items.formatPreference}"]`).checked = true

		// Set button style
		document.querySelector(`[data-style="${items.buttonStyle}"]`).classList.add('selected')

		// Generate and populate site configuration UI
		const siteConfigContainer = document.getElementById('site-config')
		Object.entries(siteConfigs).forEach(([siteKey, siteConfig]) => {
			const siteEnabled = items.siteConfigs[siteKey]?.enabled ?? true
			const sitePrefix = items.siteConfigs[siteKey]?.prefix ?? siteConfig.prefix

			const siteDiv = document.createElement('div')
			siteDiv.className = 'flex items-center justify-between bg-gray-700 p-3 rounded mb-3'
			siteDiv.innerHTML = `
                <span class="flex flex-grow flex-col">
                    <span class="text-sm font-medium leading-6 text-white" id="${siteKey}-label">${siteConfig.domain}</span>
                    <input type="text" class="site-prefix bg-gray-600 text-white px-2 py-1 rounded mt-1 text-sm w-80 max-w-full" data-site="${siteKey}" value="${sitePrefix}" placeholder="Prefix" maxlength="80">
                </span>
                <button type="button" class="site-toggle relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 ml-3 ${
									siteEnabled ? 'bg-green-600' : 'bg-gray-200'
								}" role="switch" aria-checked="${siteEnabled}" aria-labelledby="${siteKey}-label" data-site="${siteKey}">
                    <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
											siteEnabled ? 'translate-x-5' : 'translate-x-0'
										}"></span>
                </button>
            `
			siteConfigContainer.appendChild(siteDiv)
		})
	})

	// Event listener for format preference
	document.querySelectorAll('input[name="format"]').forEach((radio) => {
		radio.addEventListener('change', (event) => {
			const newPreference = event.target.value
			chrome.storage.sync.set({ formatPreference: newPreference }, () => {
				chrome.runtime.sendMessage({ action: 'updatePreference', formatPreference: newPreference })
			})
		})
	})

	// Event listener for button style
	document.querySelectorAll('.style-option').forEach((option) => {
		option.addEventListener('click', (event) => {
			const styleOption = event.target.closest('.style-option')
			if (!styleOption) return

			const newStyle = styleOption.dataset.style || 'dark'

			document.querySelectorAll('.style-option').forEach((opt) => opt.classList.remove('selected'))
			styleOption.classList.add('selected')

			chrome.storage.sync.set({ buttonStyle: newStyle }, () => {
				chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
					chrome.tabs.sendMessage(tabs[0].id, { action: 'updateStyle', buttonStyle: newStyle })
				})
			})
		})
	})

	// Event listeners for site configuration changes
	document.getElementById('site-config').addEventListener('change', (event) => {
		const target = event.target
		if (target.classList.contains('site-prefix')) {
			updateSiteConfig(target.dataset.site, { prefix: target.value })
		}
	})

	document.getElementById('site-config').addEventListener('click', (event) => {
		const target = event.target
		if (target.classList.contains('site-toggle')) {
			const siteKey = target.dataset.site
			const newEnabled = target.getAttribute('aria-checked') === 'false'
			updateSiteConfig(siteKey, { enabled: newEnabled })

			// Update the toggle button appearance
			target.setAttribute('aria-checked', newEnabled)
			target.classList.toggle('bg-green-600', newEnabled)
			target.classList.toggle('bg-gray-200', !newEnabled)
			target.querySelector('span').classList.toggle('translate-x-5', newEnabled)
			target.querySelector('span').classList.toggle('translate-x-0', !newEnabled)
		}
	})

	function updateSiteConfig(siteKey, updates) {
		chrome.storage.sync.get({ siteConfigs: {} }, (items) => {
			const updatedConfigs = { ...items.siteConfigs }

			if (!updatedConfigs[siteKey]) {
				updatedConfigs[siteKey] = {}
			}

			Object.assign(updatedConfigs[siteKey], updates)

			chrome.storage.sync.set({ siteConfigs: updatedConfigs }, () => {
				chrome.runtime.sendMessage({ action: 'updateSiteConfig', siteConfigs: updatedConfigs })
			})
		})
	}
})
