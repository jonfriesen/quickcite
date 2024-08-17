let formatPreference = 'markdown'
let prefix = ':github:'
let selectedStyle = 'dark' // Default style

function injectButton() {
	if (document.getElementById('pr-copy-button')) return

	const button = document.createElement('button')
	button.id = 'pr-copy-button'
	button.className = `pr-copy-button ${selectedStyle}`
	button.innerHTML = `<img src="${chrome.runtime.getURL('dist/clipboard.svg')}" alt="Copy PR Info">`

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
		const prNumber = document.querySelector('h1.gh-header-title > span.f1-light').textContent.trim()
		const currentUrl = window.location.href
		const titleElement = document.querySelector('bdi.js-issue-title.markdown-title')
		const prTitle = titleElement ? titleElement.textContent.trim() : currentUrl

		let textToCopy
		switch (formatPreference) {
			case 'markdown':
				textToCopy = `${prefix} [#${prNumber}: ${prTitle}](${currentUrl})`
				break
			default:
				textToCopy = `#${prNumber}: ${prTitle} - ${currentUrl}`
				break
		}

		navigator.clipboard
			.writeText(textToCopy)
			.then(() => {
				console.debug('Copied to clipboard: ' + textToCopy)
				const originalHTML = button.innerHTML
				button.innerHTML = `<img src="${chrome.runtime.getURL('dist/checkmark.svg')}" alt="Copy PR Info">`
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

// Function to remove the button
function removeButton() {
	const button = document.getElementById('pr-copy-button')
	if (button) button.remove()
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	switch (request.action) {
		case 'injectButton':
			console.log('injecting button', request.formatPreference, request.prefix)
			formatPreference = request.formatPreference
			prefix = request.prefix
			injectButton()
			break
		case 'removeButton':
			removeButton()
			break
		case 'updatePreference':
			formatPreference = request.formatPreference
			break
		case 'updatePrefix':
			console.log('setting prefix', JSON.stringify(request))
			prefix = request.prefix
			break
		case 'updateStyle':
			selectedStyle = request.style
			const button = document.getElementById('pr-copy-button')
			if (button) {
				button.className = `pr-copy-button ${selectedStyle}`
			}
			break
	}
})
