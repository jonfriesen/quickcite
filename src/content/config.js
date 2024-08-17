// config.js

const siteConfigs = {
	github: {
		domain: 'github.com',
		prefix: '🐙',
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
				buildMarkdown: (info, url) => `[${info.number}: ${info.title}](${url})`,
				buildPlaintext: (info, url) => `${info.number}: ${info.title} - ${url}`,
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
				buildMarkdown: (info, url) => `[${info.number}: ${info.title}](${url})`,
				buildPlaintext: (info, url) => `${info.number}: ${info.title} - ${url}`,
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
				buildMarkdown: (info, url) => `[${info.number}: ${info.title}](${url})`,
				buildPlaintext: (info, url) => `${info.number}: ${info.title} - ${url}`,
			},
			repo: {
				urlPattern: /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/,
				buttonId: 'gh-repo-copy-button',
				getInfo: () => {
					const repo = document.title.split(':')[0].trim() || document.querySelector('div.AppHeader-context-full').textContent.trim()
					const repoDescription = document.querySelector('p.f4.my-3').textContent.trim()
					return { title: repo, description: repoDescription }
				},
				buildMarkdown: (info, url) => `[${info.title}](${url})${info.description ? ` - ${info.description}` : ''}`,
				buildPlaintext: (info, url) => `${info.title} - ${url}${info.description ? ` (${info.description})` : ''}`,
			},
			user: {
				urlPattern: /^https:\/\/github\.com\/[^\/]+\/?$/,
				buttonId: 'gh-user-copy-button',
				getInfo: () => {
					const name = document.title.trim()
					let bio = ''

					// Check if it's an organization page
					const isOrg = !!document.querySelector('meta[name="hovercard-subject-tag"][content^="organization:"]')

					if (isOrg) {
						// For organizations, try to get the description
						bio = document.querySelector('header > div > div > div.flex-1.d-flex.flex-column.gap-2 > div.color-fg-muted > div')?.textContent.trim() || ''
					} else {
						// For users, get the bio
						bio = document.querySelector('div[data-bio-text]')?.textContent.trim() || ''
					}

					return { name, bio }
				},
				buildMarkdown: (info, url) => `[${info.name}](${url})${info.bio ? ` - ${info.bio}` : ''}`,
				buildPlaintext: (info, url) => `${info.name} - ${url}${info.bio ? ` (${info.bio})` : ''}`,
			},
		},
	},
}

export default siteConfigs
