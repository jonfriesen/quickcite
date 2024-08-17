document.addEventListener('DOMContentLoaded', () => {
	// Load the current preferences
	chrome.storage.sync.get(
		{ formatPreference: 'markdown', prefix: ':github:', buttonStyle: 'dark' },
		(items) => {
			document.querySelector(`input[value="${items.formatPreference}"]`).checked = true
			document.getElementById('prefix').value = items.prefix
			document.querySelector(`[data-style="${items.buttonStyle}"]`).classList.add('selected')
		},
	)

	// Add event listeners to the radio buttons
	document.querySelectorAll('input[name="format"]').forEach((radio) => {
		radio.addEventListener('change', (event) => {
			const newPreference = event.target.value
			chrome.storage.sync.set({ formatPreference: newPreference }, () => {
				chrome.runtime.sendMessage({ action: 'updatePreference', formatPreference: newPreference })
			})
		})
	})

	// Add event listener to the prefix input
	document.getElementById('prefix').addEventListener('input', (event) => {
		const newPrefix = event.target.value
		chrome.storage.sync.set({ prefix: newPrefix }, () => {
			chrome.runtime.sendMessage({ action: 'updatePrefix', prefix: newPrefix })
		})
	})

	// Add event listeners for style options
	document.querySelectorAll('.style-option').forEach((option) => {
		option.addEventListener('click', (event) => {
			const newStyle = event.target.dataset.style
			document.querySelectorAll('.style-option').forEach((opt) => opt.classList.remove('selected'))
			event.target.classList.add('selected')
			chrome.storage.sync.set({ buttonStyle: newStyle }, () => {
				chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
					chrome.tabs.sendMessage(tabs[0].id, { action: 'updateStyle', style: newStyle })
				})
			})
		})
	})
})
