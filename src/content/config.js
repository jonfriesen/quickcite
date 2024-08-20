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
					let repo = document.title.split(':')[0].trim() || document.querySelector('div.AppHeader-context-full').textContent.trim()
					// if repo starts with "GitHub - " then remove it
					if (repo.startsWith('GitHub - ')) {
						repo = repo.substring(9)
					}
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
			release: {
				urlPattern: /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/releases\/tag\/[^\/]+/,
				buttonId: 'gh-release-copy-button',
				getInfo: () => {
					const releaseBodyElement = document.querySelector('div.Box-body')

					// Get the release title
					const titleElement = releaseBodyElement.querySelector('h1')
					const releaseTitle = titleElement ? titleElement.textContent.trim() : ''

					// Get the release tag
					const tagSvgElement = releaseBodyElement.querySelector('svg.octicon.octicon-tag')
					const spanElement = tagSvgElement ? tagSvgElement.nextElementSibling : null
					const releaseTag = spanElement ? spanElement.textContent.trim() : ''

					// Get the release date
					const dateElement = releaseBodyElement.querySelector('relative-time')
					const releaseDate = dateElement ? dateElement.getAttribute('datetime') : ''

					// Build title
					let releaseTitleAndTag = releaseTitle
					if (releaseTitle && releaseTag !== releaseTitle) {
						releaseTitleAndTag = `${releaseTag}: ${releaseTitle}`
					}

					// Get the release description
					// Note: I'm not sure if I want to include the release description
					// const descriptionElement = document.querySelector('.markdown-body')
					// const releaseDescription = descriptionElement ? descriptionElement.textContent.trim() : ''

					return {
						title: releaseTitleAndTag,
						date: releaseDate,
					}
				},
				buildMarkdown: (info, url) => {
					const formattedDate = info.date ? new Date(info.date).toLocaleDateString() : ''
					return `[${info.title}](${url}) - Released on ${formattedDate}`
				},
				buildPlaintext: (info, url) => {
					const formattedDate = info.date ? new Date(info.date).toLocaleDateString() : ''
					return `${info.title} - ${url}\nReleased on ${formattedDate}`
				},
			},
			commit: {
				urlPattern: /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/commit\/[a-f0-9]{40}$/,
				buttonId: 'gh-commit-copy-button',
				getInfo: () => {
					const commitTitle = document.querySelector('.commit-title').textContent.trim()
					const commitHash = document.querySelector('.sha.user-select-contain').textContent.trim()
					const authorName = document.querySelector('.commit-author').textContent.trim()
					const commitDate = document.querySelector('relative-time').getAttribute('datetime')

					return {
						title: commitTitle,
						hash: commitHash,
						author: authorName,
						date: commitDate,
					}
				},
				buildMarkdown: (info, url) => {
					const formattedDate = new Date(info.date).toLocaleString()
					return `[(${info.hash.slice(0, 7)}) - ${info.title}](${url})\nBy ${info.author} on ${formattedDate}`
				},
				buildPlaintext: (info, url) => {
					const formattedDate = new Date(info.date).toLocaleString()
					return `(${info.hash.slice(0, 7)}) -${info.title}\nBy ${info.author} on ${formattedDate}\n${url}`
				},
			},
		},
	},
	instagram: {
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
	},
	linkedin: {
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
	},
}

export default siteConfigs
