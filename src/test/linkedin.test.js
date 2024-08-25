import { runUrlPatternTests, runMarkdownGeneratorTests } from './testUtils'

const urlPatternTestCases = [
	{ page: 'profile', url: 'https://www.linkedin.com/in/username/', shouldMatch: true },
	{ page: 'company', url: 'https://www.linkedin.com/company/companyname/', shouldMatch: true },
	{ page: 'pulse', url: 'https://www.linkedin.com/pulse/article-title/', shouldMatch: true },
	{ page: 'profile', url: 'https://www.linkedin.com/feed/', shouldMatch: false },
]

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

runUrlPatternTests('linkedin', urlPatternTestCases)
runMarkdownGeneratorTests('linkedin', markdownTestCases)
