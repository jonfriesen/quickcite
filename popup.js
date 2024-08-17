document.addEventListener('DOMContentLoaded', () => {
  // Load the current preferences
  chrome.storage.sync.get({formatPreference: 'markdown', prefix: ':github:'}, (items) => {
    document.querySelector(`input[value="${items.formatPreference}"]`).checked = true;
    document.getElementById('prefix').value = items.prefix;
  });

  // Add event listeners to the radio buttons
  document.querySelectorAll('input[name="format"]').forEach(radio => {
    radio.addEventListener('change', (event) => {
      const newPreference = event.target.value;
      chrome.storage.sync.set({formatPreference: newPreference}, () => {
        chrome.runtime.sendMessage({action: 'updatePreference', formatPreference: newPreference});
      });
    });
  });

  // Add event listener to the prefix input
  document.getElementById('prefix').addEventListener('input', (event) => {
    const newPrefix = event.target.value;
    chrome.storage.sync.set({prefix: newPrefix}, () => {
      chrome.runtime.sendMessage({action: 'updatePrefix', prefix: newPrefix});
    });
  });
});
