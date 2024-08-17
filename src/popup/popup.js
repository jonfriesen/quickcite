import '../styles/main.css'
import '../styles/button.css'
import './popup.css'

document.addEventListener('DOMContentLoaded', () => {
	// Load the current preferences
	chrome.storage.sync.get({ formatPreference: 'markdown', buttonStyle: 'dark' }, (items) => {
		document.querySelector(`input[value="${items.formatPreference}"]`).checked = true
		document.querySelector(`[data-style="${items.buttonStyle}"]`).classList.add('selected')
	})

	// Add event listeners to the radio buttons
	document.querySelectorAll('input[name="format"]').forEach((radio) => {
		radio.addEventListener('change', (event) => {
			const newPreference = event.target.value
			chrome.storage.sync.set({ formatPreference: newPreference }, () => {
				chrome.runtime.sendMessage({ action: 'updatePreference', formatPreference: newPreference })
			})
		})
	})

	// Add event listeners for style options
	document.querySelectorAll('.style-option').forEach((option) => {
		option.addEventListener('click', (event) => {
			// Find the .style-option element, whether the div was clicked or the img inside it
			const styleOption = event.target.closest('.style-option')
			if (!styleOption) return // Exit if we didn't click on a style option

			// Set the style to the one clicked on or the default dark style
			const newStyle = styleOption.dataset.style || 'dark'

			// Remove the selected class from all style options
			document.querySelectorAll('.style-option').forEach((opt) => opt.classList.remove('selected'))

			// Add the selected class to the clicked style option
			styleOption.classList.add('selected')

			// Save the new style to storage
			chrome.storage.sync.set({ buttonStyle: newStyle }, () => {
				chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
					chrome.tabs.sendMessage(tabs[0].id, { action: 'updateStyle', buttonStyle: newStyle })
				})
			})
		})
	})
})
