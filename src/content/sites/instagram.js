const instagram = {
	domain: 'instagram.com',
	prefix: '📸',
	pages: {
		profile: {
			urlPattern: /^https:\/\/www\.instagram\.com\/[^\/]+\/?$/,
			buttonId: 'instagram-profile-copy-button',
			getInfo: () => {
				const name = document.title.split('•')[0].trim()
				return { name }
			},
			buildMarkdown: (info, url) => `[${info.name}](${url})`,
			buildPlaintext: (info, url) => `${info.name} - ${url}`,
		},
	},
}

export default instagram
