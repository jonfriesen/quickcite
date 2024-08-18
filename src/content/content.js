import siteConfigs from './config.js'
import '../styles/button.css'
import clipboardTextSvg from '../assets/clipboard.svg'
import clipboardMdSvg from '../assets/clipboard2.svg'
import checkmarkSvg from '../assets/checkmark.svg'

let formatPreference = 'markdown'
let selectedStyle = 'dark' // Default style
let userSiteConfigs = {}
let currentConfig = null

function injectOrUpdateButton(config) {
	let button = document.getElementById(config.buttonId)

	if (!button) {
		button = document.createElement('button')
		button.id = config.buttonId
		document.body.appendChild(button)
	}

	let icon = formatPreference === 'markdown' ? clipboardMdSvg : clipboardTextSvg

	button.className = `copy-button ${selectedStyle}`
	button.innerHTML = `<img src="${chrome.runtime.getURL(icon)}" alt="Copy Info">`

	button.addEventListener('mouseenter', () => {
		button.style.transform = 'scale(1.05)'
	})

	button.addEventListener('mouseleave', () => {
		button.style.transform = 'scale(1)'
	})

	button.addEventListener('click', () => {
		const siteConfig = siteConfigs[config.siteKey]
		const pageConfig = siteConfig.pages[config.pageKey]
		const info = pageConfig.getInfo()
		const currentUrl = window.location.href

		let textToCopy
		if (formatPreference === 'markdown') {
			textToCopy = `${config.prefix} ${pageConfig.buildMarkdown(info, currentUrl)}`
		} else {
			textToCopy = `${config.prefix} ${pageConfig.buildPlaintext(info, currentUrl)}`
		}

		navigator.clipboard
			.writeText(textToCopy)
			.then(() => {
				console.debug('Copied to clipboard: ' + textToCopy)
				const originalHTML = button.innerHTML
				button.innerHTML = `<img src="${chrome.runtime.getURL(checkmarkSvg)}" alt="Copy Info">`
				button.classList.add('success')
				setTimeout(() => {
					button.innerHTML = originalHTML
					button.classList.remove('success')
				}, 2000)
			})
			.catch((err) => {
				console.error('Failed to copy text: ', err)
			})
	})
}

// Function to remove all buttons
function removeButtons() {
	const buttons = document.querySelectorAll('.copy-button')
	buttons.forEach((button) => button.remove())
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	switch (request.action) {
		case 'updateConfig':
			formatPreference = request.formatPreference
			selectedStyle = request.buttonStyle
			userSiteConfigs = request.siteConfigs
			currentConfig = request.config
			if (currentConfig) {
				injectOrUpdateButton(currentConfig)
			} else {
				removeButtons()
			}
			break
		case 'removeButtons':
			removeButtons()
			break
		case 'updatePreference':
			formatPreference = request.formatPreference
			break
		case 'updateStyle':
			selectedStyle = request.buttonStyle
			if (currentConfig) {
				injectOrUpdateButton(currentConfig)
			}
			break
	}
})

// Initial setup
chrome.runtime.sendMessage({ action: 'checkCurrentUrl' })
