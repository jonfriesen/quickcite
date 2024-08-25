import { runUrlPatternTests, runMarkdownGeneratorTests } from './testUtils'

const urlPatternTestCases = [
	{ page: 'profile', url: 'https://www.instagram.com/username/', shouldMatch: true },
	{ page: 'profile', url: 'https://www.instagram.com/p/123456/', shouldMatch: false },
]

const markdownTestCases = [
	{
		page: 'profile',
		info: { name: 'Travel Enthusiast' },
		url: 'https://www.instagram.com/travelenthusiast/',
		expected: '[Travel Enthusiast](https://www.instagram.com/travelenthusiast/)',
	},
]

runUrlPatternTests('instagram', urlPatternTestCases)
runMarkdownGeneratorTests('instagram', markdownTestCases)
