import clipboardTextSvg from '../assets/clipboard.svg'
import clipboardMdSvg from '../assets/clipboard2.svg'
import checkmarkSvg from '../assets/checkmark.svg'

export function injectOrUpdateButton(config, formatPreference, selectedStyle, siteConfigs) {
	let button = document.getElementById(config.buttonId)

	if (!button) {
		button = document.createElement('button')
		button.id = config.buttonId
		document.body.appendChild(button)
	}

	let icon = formatPreference === 'markdown' ? clipboardMdSvg : clipboardTextSvg

	button.className = `copy-button ${selectedStyle}`
	button.innerHTML = `<img src="${chrome.runtime.getURL(icon)}" alt="Copy Info">`

	button.addEventListener('click', () => handleButtonClick(config, formatPreference, siteConfigs, button))
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
	const buttons = document.querySelectorAll('.copy-button')
	buttons.forEach((button) => button.remove())
}
