const trello = {
	domain: 'trello.com',
	prefix: '📋',
	pages: {
		board: {
			urlPattern: /^https:\/\/trello\.com\/b\/[a-zA-Z0-9]+(?:\/[^\/]+)?$/,
			buttonId: 'trello-board-copy-button',
			getInfo: () => {
				const boardName = document.querySelector('h1[data-testid="board-name-display"]').textContent.trim()
				return { boardName }
			},
			buildMarkdown: (info, url) => `[${info.boardName}](${url})`,
			buildPlaintext: (info, url) => `${info.boardName} - ${url}`,
		},
		// TODO: Add card support
		// card: {
		// 	urlPattern: /^https:\/\/trello\.com\/c\/[a-zA-Z0-9]+(?:\/[^\/]+)?$/,
		// 	buttonId: 'trello-card-copy-button',
		// 	getInfo: () => {
		// 		const cardName = document.querySelector('h2#js-dialog-title').textContent.trim()
		// 		const boardName = document.querySelector('h1[data-testid="board-name-display"]').textContent.trim()
		// 		return { cardName, boardName }
		// 	},
		// 	buildMarkdown: (info, url) => `[${info.cardName}](${url}) (${info.boardName})`,
		// 	buildPlaintext: (info, url) => `${info.cardName} (${info.boardName}) - ${url}`,
		// },
	},
}

export default trello
