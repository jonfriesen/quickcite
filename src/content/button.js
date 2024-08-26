import clipboardTextSvg from '../assets/clipboard.svg'
import clipboardMdSvg from '../assets/clipboard2.svg'
import checkmarkSvg from '../assets/checkmark.svg'
import buttonStyle from '../styles/button.css?raw'

function createIframeButton(config, formatPreference, selectedStyle) {
	const iframe = document.createElement('iframe')
	iframe.id = `${config.buttonId}-iframe`
	iframe.className = `quickcite-button-iframe`
	iframe.style.cssText = `
		position: fixed;
		bottom: 20px;
		right: 20px;
		z-index: 9999;
		border: none;
		background: transparent;
		width: 50px;
		height: 50px;
	`

	// Wait for the iframe to load before adding content
	iframe.onload = () => {
		const iframeDoc = iframe.contentDocument || iframe.contentWindow.document

		// Create button inside iframe
		const button = iframeDoc.createElement('button')
		button.id = config.buttonId

		// Add style to iframe
		const style = iframeDoc.createElement('style')
		style.textContent = buttonStyle // Assuming buttonStyle contains the full CSS content

		iframeDoc.head.appendChild(style)
		iframeDoc.body.appendChild(button)

		// // Populate button content
		// let icon = formatPreference === 'markdown' ? clipboardMdSvg : clipboardTextSvg
		// button.className = `copy-button ${selectedStyle}`
		// button.innerHTML = `<img src="${chrome.runtime.getURL(icon)}" alt="Copy Info">`
	}

	return iframe
}

export function injectOrUpdateButton(config, formatPreference, selectedStyle, siteConfigs) {
	let iframe = document.getElementById(`${config.buttonId}-iframe`)
	let button

	if (!iframe) {
		iframe = createIframeButton(config, formatPreference, selectedStyle)
		document.body.appendChild(iframe)

		// Wait for iframe to load before accessing button
		iframe.onload = () => {
			button = iframe.contentDocument.getElementById(config.buttonId)
			// TODO: This needs tos et the values on load!!
		}
	} else {
		button = iframe.contentDocument.getElementById(config.buttonId)
		button.removeEventListener('click', button.clickHandler)
	}

	// sets the button details
	let icon = formatPreference === 'markdown' ? clipboardMdSvg : clipboardTextSvg
	button.className = `copy-button ${selectedStyle}`
	button.innerHTML = `<img src="${chrome.runtime.getURL(icon)}" alt="Copy Info">`

	// We inject the clickHandler on the button so that in the event of config change
	// it can be removed, since we need a reference to it.
	button.clickHandler = () => handleButtonClick(config, formatPreference, siteConfigs, button)

	// Add the new click event listener
	console.log('settings clikc handler')
	button.addEventListener('click', button.clickHandler)
}

function handleButtonClick(config, formatPreference, siteConfigs, button) {
	const siteConfig = siteConfigs[config.siteKey]
	const pageConfig = siteConfig.pages[config.pageKey]
	const info = pageConfig.getInfo()
	const currentUrl = window.location.href

	let textToCopy =
		formatPreference === 'markdown' ? `${config.prefix} ${pageConfig.buildMarkdown(info, currentUrl)}` : `${config.prefix} ${pageConfig.buildPlaintext(info, currentUrl)}`

	navigator.clipboard
		.writeText(textToCopy)
		.then(() => {
			console.debug('Copied to clipboard: ' + textToCopy)
			updateButtonAfterCopy(button)
		})
		.catch((err) => {
			console.error('Failed to copy text: ', err)
		})
}

function updateButtonAfterCopy(button) {
	const originalHTML = button.innerHTML
	button.innerHTML = `<img src="${chrome.runtime.getURL(checkmarkSvg)}" alt="Copy Info">`
	button.classList.add('success')
	setTimeout(() => {
		button.innerHTML = originalHTML
		button.classList.remove('success')
	}, 2000)
}

export function removeButtons() {
	const iframes = document.querySelectorAll('.quickcite-button-iframe')
	iframes.forEach((iframe) => iframe.remove())
}
