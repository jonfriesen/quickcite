import siteConfigs from './config'

describe('Trello URL pattern tests', () => {
	const testCases = [
		{ page: 'board', url: 'https://trello.com/b/F8vdp5Mo', shouldMatch: true },
		{ page: 'board', url: 'https://trello.com/b/sZr0YugI/awesome-stuff', shouldMatch: true },
		{ page: 'board', url: 'https://trello.com/c/abcdefgh', shouldMatch: false },
		{ page: 'board', url: 'https://trello.com/b/F8vdp5Mo/subfolder/not-valid', shouldMatch: false },
	]

	test.each(testCases)('$page: $url should ${shouldMatch ? "match" : "not match"}', ({ page, url, shouldMatch }) => {
		const pattern = siteConfigs.trello.pages[page].urlPattern
		if (shouldMatch) {
			expect(url).toMatch(pattern)
		} else {
			expect(url).not.toMatch(pattern)
		}
	})
})

describe('Trello markdown generator tests', () => {
	const markdownTestCases = [
		{
			page: 'board',
			info: { boardName: 'Project Roadmap' },
			url: 'https://trello.com/b/F8vdp5Mo',
			expected: '[Project Roadmap](https://trello.com/b/F8vdp5Mo)',
		},
		{
			page: 'board',
			info: { boardName: 'Team Tasks' },
			url: 'https://trello.com/b/sZr0YugI/team-tasks',
			expected: '[Team Tasks](https://trello.com/b/sZr0YugI/team-tasks)',
		},
	]

	test.each(markdownTestCases)('$page: should generate correct markdown', ({ page, info, url, expected }) => {
		const buildMarkdown = siteConfigs.trello.pages[page].buildMarkdown
		expect(buildMarkdown(info, url)).toBe(expected)
	})
})

describe('Trello plaintext generator tests', () => {
	const plaintextTestCases = [
		{
			page: 'board',
			info: { boardName: 'Project Roadmap' },
			url: 'https://trello.com/b/F8vdp5Mo',
			expected: 'Project Roadmap - https://trello.com/b/F8vdp5Mo',
		},
		{
			page: 'board',
			info: { boardName: 'Team Tasks' },
			url: 'https://trello.com/b/sZr0YugI/team-tasks',
			expected: 'Team Tasks - https://trello.com/b/sZr0YugI/team-tasks',
		},
	]

	test.each(plaintextTestCases)('$page: should generate correct plaintext', ({ page, info, url, expected }) => {
		const buildPlaintext = siteConfigs.trello.pages[page].buildPlaintext
		expect(buildPlaintext(info, url)).toBe(expected)
	})
})
