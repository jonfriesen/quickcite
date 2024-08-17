let formatPreference = 'markdown'
let selectedStyle = 'dark' // Default style

function injectButton(config) {
	if (document.getElementById(config.buttonId)) return

	const siteConfig = siteConfigs[config.siteKey]
	const pageConfig = siteConfig.pages[config.pageKey]

	console.log('siteConfig', siteConfig)
	console.log('pageConfig', pageConfig)

	const button = document.createElement('button')
	button.id = config.buttonId
	button.className = `copy-button ${selectedStyle}`
	button.innerHTML = `<img src="${chrome.runtime.getURL('dist/clipboard.svg')}" alt="Copy Info">`

	// Inject the shared styles
	const style = document.createElement('link')
	style.rel = 'stylesheet'
	style.type = 'text/css'
	style.href = chrome.runtime.getURL('dist/buttons.css')
	;(document.head || document.documentElement).appendChild(style)

	button.addEventListener('mouseenter', () => {
		button.style.transform = 'scale(1.05)'
	})

	button.addEventListener('mouseleave', () => {
		button.style.transform = 'scale(1)'
	})

	button.addEventListener('click', () => {
		const info = pageConfig.getInfo()
		const currentUrl = window.location.href

		let textToCopy
		if (formatPreference === 'markdown') {
			textToCopy = `${siteConfig.prefix} ${pageConfig.buildMarkdown(info, currentUrl)}`
		} else {
			textToCopy = `${siteConfig.prefix} ${pageConfig.buildPlaintext(info, currentUrl)}`
		}

		navigator.clipboard
			.writeText(textToCopy)
			.then(() => {
				console.debug('Copied to clipboard: ' + textToCopy)
				const originalHTML = button.innerHTML
				button.innerHTML = `<img src="${chrome.runtime.getURL('dist/checkmark.svg')}" alt="Copy Info">`
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

	document.body.appendChild(button)
}

// Function to remove all buttons
function removeButtons() {
	const buttons = document.querySelectorAll('.copy-button')
	buttons.forEach((button) => button.remove())
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	switch (request.action) {
		case 'injectButton':
			formatPreference = request.formatPreference
			selectedStyle = request.buttonStyle
			injectButton(request.config)
			break
		case 'removeButtons':
			removeButtons()
			break
		case 'updatePreference':
			formatPreference = request.formatPreference
			break
		case 'updateStyle':
			selectedStyle = request.buttonStyle
			const buttons = document.querySelectorAll('.copy-button')
			buttons.forEach((button) => {
				button.className = `copy-button ${selectedStyle}`
			})
			break
	}
})
