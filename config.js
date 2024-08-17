// config.js

const siteConfigs = {
	github: {
		domain: 'github.com',
		prefix: ':github:',
		pages: {
			pr: {
				urlPattern: /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/\d+/,
				buttonId: 'gh-pr-copy-button',
				getInfo: () => {
					const prNumber = document.querySelector('h1.gh-header-title > span.f1-light').textContent.trim()
					const titleElement = document.querySelector('bdi.js-issue-title.markdown-title')
					const prTitle = titleElement ? titleElement.textContent.trim() : document.title
					return { number: prNumber, title: prTitle }
				},
				buildMarkdown: (info, url) => `[#${info.number}: ${info.title}](${url})`,
				buildPlaintext: (info, url) => `#${info.number}: ${info.title} - ${url}`,
			},
			issue: {
				urlPattern: /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/issues\/\d+/,
				buttonId: 'gh-issue-copy-button',
				getInfo: () => {
					const issueNumber = document.querySelector('h1.gh-header-title > span.f1-light').textContent.trim()
					const titleElement = document.querySelector('bdi.js-issue-title.markdown-title')
					const issueTitle = titleElement ? titleElement.textContent.trim() : document.title
					return { number: issueNumber, title: issueTitle }
				},
				buildMarkdown: (info, url) => `[#${info.number}: ${info.title}](${url})`,
				buildPlaintext: (info, url) => `#${info.number}: ${info.title} - ${url}`,
			},
			discussion: {
				urlPattern: /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/discussions\/\d+/,
				buttonId: 'gh-discussion-copy-button',
				getInfo: () => {
					const discussionNumber = document.querySelector('h1.gh-header-title > span.f1-light').textContent.trim()
					const titleElement = document.querySelector('h1.gh-header-title')
					const discussionTitle = titleElement ? titleElement.textContent.trim().replace(discussionNumber, '').trim() : document.title
					return { number: discussionNumber, title: discussionTitle }
				},
				buildMarkdown: (info, url) => `[#${info.number}: ${info.title}](${url})`,
				buildPlaintext: (info, url) => `#${info.number}: ${info.title} - ${url}`,
			},
			repo: {
				urlPattern: /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/,
				buttonId: 'gh-repo-copy-button',
				getInfo: () => {
					const repoName = document.querySelector('strong[itemprop="name"] > a').textContent.trim()
					const repoDescription = document.querySelector('p.f4.my-3').textContent.trim()
					return { title: repoName, description: repoDescription }
				},
				buildMarkdown: (info, url) => `[${info.title}](${url})${info.description ? ` - ${info.description}` : ''}`,
				buildPlaintext: (info, url) => `${info.title} - ${url}${info.description ? ` (${info.description})` : ''}`,
			},
			user: {
				urlPattern: /^https:\/\/github\.com\/[^\/]+\/?$/,
				buttonId: 'gh-user-copy-button',
				getInfo: () => {
					const userName = document.querySelector('span.p-nickname').textContent.trim()
					const userBio = document.querySelector('div[data-bio-text]')?.textContent.trim() || ''
					return { name: userName, bio: userBio }
				},
				buildMarkdown: (info, url) => `[${info.name}](${url})${info.bio ? ` - ${info.bio}` : ''}`,
				buildPlaintext: (info, url) => `${info.name} - ${url}${info.bio ? ` (${info.bio})` : ''}`,
			},
		},
	},
	linkedin: {
		domain: 'linkedin.com',
		prefix: ':linkedin:',
		pages: {
			company: {
				urlPattern: /^https:\/\/www\.linkedin\.com\/company\/[^\/]+/,
				buttonId: 'li-company-copy-button',
				getInfo: () => {
					const companyName = document.querySelector('h1.org-top-card-summary__title').textContent.trim()
					const companyDescription = document.querySelector('p.org-top-card-summary__tagline').textContent.trim()
					return { name: companyName, description: companyDescription }
				},
				buildMarkdown: (info, url) => `[${info.name}](${url})${info.description ? ` - ${info.description}` : ''}`,
				buildPlaintext: (info, url) => `${info.name} - ${url}${info.description ? ` (${info.description})` : ''}`,
			},
		},
	},
}

export default siteConfigs
