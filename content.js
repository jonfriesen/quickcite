let formatPreference = 'markdown';
let prefix = ':github:';

// Function to create and inject the button
function injectButton() {
  if (document.getElementById('pr-copy-button')) return;

  const button = document.createElement('button');
  button.id = 'pr-copy-button';
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 1.5em; height: 1.5em; vertical-align: middle; margin-right: 0.5em;">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
    </svg>
  `; 
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    padding: 0.5rem 1rem;
    background-color: #ffffff;
    color: #1f2937;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.1s ease-in-out;
  `;
  
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = '#f3f4f6';
  });

  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = '#ffffff';
  });

  button.addEventListener('click', () => {
    const prNumber = document.querySelector('h1.gh-header-title > span.f1-light').textContent.trim();
    const currentUrl = window.location.href;
    const titleElement = document.querySelector('bdi.js-issue-title.markdown-title');
    const prTitle = titleElement ? titleElement.textContent.trim() : currentUrl;
    
    let textToCopy;
    if (formatPreference === 'markdown') {
      textToCopy = `${prefix} [#${prNumber}: ${prTitle}](${currentUrl})`;
      // textToCopy = `:github: [${prNumber}: ${prTitle}](${currentUrl})`;
    } else {
      textToCopy = `#${prNumber}: ${prTitle} - ${currentUrl}`;
    }    

    navigator.clipboard.writeText(textToCopy).then(() => {
      console.debug('Copied to clipboard: ' + textToCopy);
      // Change button text to indicate successful copy
      const originalText = button.innerHTML;
      button.innerHTML = 'Copied!';
      button.style.backgroundColor = '#10B981'; // Success green color
      button.style.color = '#ffffff';
      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.backgroundColor = '#ffffff';
        button.style.color = '#1f2937';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  });

  document.body.appendChild(button);
}

// Function to remove the button
function removeButton() {
  const button = document.getElementById('pr-copy-button');
  if (button) button.remove();
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'injectButton') {
    console.log("injecting button", request.formatPreference, request.prefix)
    formatPreference = request.formatPreference;
    prefix = request.prefix;
    injectButton();
  } else if (request.action === 'removeButton') {
    removeButton();
  } else if (request.action === 'updatePreference') {
    formatPreference = request.formatPreference;
  } else if (request.action === 'updatePrefix') {
    console.log("setting prefix", JSON.stringify(request))
    prefix = request.prefix;
  }
});
