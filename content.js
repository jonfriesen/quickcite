let formatPreference = 'markdown'
let prefix = ':github:'

// Function to create and inject the button
function injectButton() {
	if (document.getElementById('pr-copy-button')) return

	const button = document.createElement('button')
	button.id = 'pr-copy-button'
	button.innerHTML = `
	  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 1.5em; height: 1.5em;">
		<path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
	  </svg>
	`
	button.style.cssText = `
	  position: fixed;
	  bottom: 20px;
	  right: 20px;
	  z-index: 9999;
	  width: 50px;
	  height: 50px;
	  background-color: #1f2937;
	  color: #ffffff;
	  border: 1px solid #4b5563;
	  border-radius: 8px;
	  font-size: 0.875rem;
	  font-weight: 500;
	  cursor: pointer;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
	  transition: all 0.2s ease-in-out;
	`

	button.addEventListener('mouseover', () => {
		button.style.backgroundColor = '#374151'
		button.style.borderColor = '#6b7280'
		button.style.transform = 'scale(1.05)'
	})

	button.addEventListener('mouseout', () => {
		button.style.backgroundColor = '#1f2937'
		button.style.borderColor = '#4b5563'
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
				// Change button to indicate successful copy
				const originalHTML = button.innerHTML
				button.innerHTML = `
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 1.5em; height: 1.5em;">
			  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
			</svg>
		  `
				button.style.backgroundColor = '#10B981' // Success green color
				button.style.borderColor = '#34D399' // Lighter green for border
				setTimeout(() => {
					button.innerHTML = originalHTML
					button.style.backgroundColor = '#1f2937'
					button.style.borderColor = '#4b5563'
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
	}
})
