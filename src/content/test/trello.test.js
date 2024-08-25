import { runUrlPatternTests, runMarkdownGeneratorTests, runPlaintextGeneratorTests } from './testUtils'

const urlPatternTestCases = [
	{ page: 'board', url: 'https://trello.com/b/F8vdp5Mo', shouldMatch: true },
	{ page: 'board', url: 'https://trello.com/b/sZr0YugI/awesome-stuff', shouldMatch: true },
	{ page: 'board', url: 'https://trello.com/c/abcdefgh', shouldMatch: false },
	{ page: 'board', url: 'https://trello.com/b/F8vdp5Mo/subfolder/not-valid', shouldMatch: false },
]

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

runUrlPatternTests('trello', urlPatternTestCases)
runMarkdownGeneratorTests('trello', markdownTestCases)
runPlaintextGeneratorTests('trello', plaintextTestCases)
