import siteConfigs from './config'

describe('LinkedIn URL pattern tests', () => {
	const testCases = [
		{ page: 'profile', url: 'https://www.linkedin.com/in/username/', shouldMatch: true },
		{ page: 'company', url: 'https://www.linkedin.com/company/companyname/', shouldMatch: true },
		{ page: 'pulse', url: 'https://www.linkedin.com/pulse/article-title/', shouldMatch: true },
		{ page: 'profile', url: 'https://www.linkedin.com/feed/', shouldMatch: false },
	]

	test.each(testCases)('$page: $url should ${shouldMatch ? "match" : "not match"}', ({ page, url, shouldMatch }) => {
		const pattern = siteConfigs.linkedin.pages[page].urlPattern
		if (shouldMatch) {
			expect(url).toMatch(pattern)
		} else {
			expect(url).not.toMatch(pattern)
		}
	})
})

describe('LinkedIn markdown generator tests', () => {
	const markdownTestCases = [
		{
			page: 'profile',
			info: { name: 'John Doe', headline: 'Software Engineer' },
			url: 'https://www.linkedin.com/in/johndoe/',
			expected: '[John Doe](https://www.linkedin.com/in/johndoe/) - Software Engineer',
		},
		{
			page: 'company',
			info: { name: 'Tech Corp', about: 'Leading technology company' },
			url: 'https://www.linkedin.com/company/techcorp/',
			expected: '[Tech Corp](https://www.linkedin.com/company/techcorp/) - Leading technology company',
		},
		{
			page: 'pulse',
			info: { title: 'The Future of AI', author: 'Jane Smith', date: 'May 1, 2023' },
			url: 'https://www.linkedin.com/pulse/future-ai-jane-smith/',
			expected: '[The Future of AI](https://www.linkedin.com/pulse/future-ai-jane-smith/)\nBy Jane Smith | May 1, 2023',
		},
	]

	test.each(markdownTestCases)('$page: should generate correct markdown', ({ page, info, url, expected }) => {
		const buildMarkdown = siteConfigs.linkedin.pages[page].buildMarkdown
		expect(buildMarkdown(info, url)).toBe(expected)
	})
})
