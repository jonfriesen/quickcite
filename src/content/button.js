import clipboardTextSvg from '../assets/clipboard.svg'
import clipboardMdSvg from '../assets/clipboard2.svg'
import checkmarkSvg from '../assets/checkmark.svg'
import buttonStyle from '../styles/button.css?raw'

function createShadowDomButton(config, formatPreference, selectedStyle) {
	const wrapper = document.createElement('div')
	wrapper.id = `${config.buttonId}-wrapper`
	wrapper.className = `quickcite-button-wrapper`
	wrapper.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
    `

	const shadowRoot = wrapper.attachShadow({ mode: 'open' })

	const button = document.createElement('button')
	button.id = config.buttonId

	// Inline the CSS directly in the Shadow DOM
	const style = document.createElement('style')
	style.textContent = buttonStyle // Assuming buttonStyle contains the full CSS content

	shadowRoot.appendChild(style)
	shadowRoot.appendChild(button)

	return { wrapper, button }
}

export function injectOrUpdateButton(config, formatPreference, selectedStyle, siteConfigs) {
	let wrapper = document.getElementById(`${config.buttonId}-wrapper`)
	let button

	if (!wrapper) {
		const { wrapper: newWrapper, button: newButton } = createShadowDomButton(config, formatPreference, selectedStyle)
		document.body.appendChild(newWrapper)
		wrapper = newWrapper
		button = newButton
	} else {
		button = wrapper.shadowRoot.getElementById(config.buttonId)
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
	const wrappers = document.querySelectorAll('.quickcite-button-wrapper')
	wrappers.forEach((wrapper) => wrapper.remove())
}
