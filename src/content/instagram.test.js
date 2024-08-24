import siteConfigs from './config'

describe('Instagram URL pattern tests', () => {
	const testCases = [
		{ page: 'profile', url: 'https://www.instagram.com/username/', shouldMatch: true },
		{ page: 'profile', url: 'https://www.instagram.com/p/123456/', shouldMatch: false },
	]

	test.each(testCases)('$page: $url should ${shouldMatch ? "match" : "not match"}', ({ page, url, shouldMatch }) => {
		const pattern = siteConfigs.instagram.pages[page].urlPattern
		if (shouldMatch) {
			expect(url).toMatch(pattern)
		} else {
			expect(url).not.toMatch(pattern)
		}
	})
})

describe('Instagram markdown generator tests', () => {
	const markdownTestCases = [
		{
			page: 'profile',
			info: { name: 'Travel Enthusiast' },
			url: 'https://www.instagram.com/travelenthusiast/',
			expected: '[Travel Enthusiast](https://www.instagram.com/travelenthusiast/)',
		},
	]

	test.each(markdownTestCases)('$page: should generate correct markdown', ({ page, info, url, expected }) => {
		const buildMarkdown = siteConfigs.instagram.pages[page].buildMarkdown
		expect(buildMarkdown(info, url)).toBe(expected)
	})
})
