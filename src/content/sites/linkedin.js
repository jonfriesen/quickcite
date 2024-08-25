const linkedin = {
	domain: 'linkedin.com',
	prefix: '💼',
	pages: {
		profile: {
			urlPattern: /^https:\/\/www\.linkedin\.com\/in\/[^\/]+\/?$/,
			buttonId: 'li-profile-copy-button',
			getInfo: () => {
				const name = document.querySelector('h1.text-heading-xlarge').textContent.trim()
				const headline = document.querySelector('div.text-body-medium').textContent.trim()
				return { name, headline }
			},
			buildMarkdown: (info, url) => `[${info.name}](${url}) - ${info.headline}`,
			buildPlaintext: (info, url) => `${info.name} - ${info.headline} - ${url}`,
		},
		company: {
			urlPattern: /^https:\/\/www\.linkedin\.com\/company\/[^\/]+\/?$/,
			buttonId: 'li-company-copy-button',
			getInfo: () => {
				const name = document.querySelector('h1.org-top-card-summary__title').textContent.trim()
				const about = document.querySelector('p.org-top-card-summary__tagline').textContent.trim()
				return { name, about }
			},
			buildMarkdown: (info, url) => `[${info.name}](${url}) - ${info.about}`,
			buildPlaintext: (info, url) => `${info.name} - ${url} - ${info.about}`,
		},
		pulse: {
			urlPattern: /^https:\/\/www\.linkedin\.com\/pulse\/[^\/]+\/?$/,
			buttonId: 'li-pulse-copy-button',
			getInfo: () => {
				const title = document.querySelector('h1.reader-article-header__title').textContent.trim()
				const author = document.querySelector('div.reader-author-info__container h2').textContent.trim()
				const date = document.querySelector('div.reader-author-info__container time').textContent.trim()
				return { title, author, date }
			},
			buildMarkdown: (info, url) => `[${info.title}](${url})\nBy ${info.author} | ${info.date}`,
			buildPlaintext: (info, url) => `${info.title}\nBy ${info.author} | ${info.date}\n${url}`,
		},
	},
}

export default linkedin
