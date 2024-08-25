import siteConfigs from './config'

describe('GitHub URL pattern tests', () => {
	const testCases = [
		{ page: 'pr', url: 'https://github.com/user/repo/pull/123', shouldMatch: true },
		{ page: 'issue', url: 'https://github.com/user/repo/issues/456', shouldMatch: true },
		{ page: 'discussion', url: 'https://github.com/user/repo/discussions/789', shouldMatch: true },
		{ page: 'repo', url: 'https://github.com/user/repo', shouldMatch: true },
		{ page: 'user', url: 'https://github.com/username', shouldMatch: true },
		{ page: 'release', url: 'https://github.com/user/repo/releases/tag/v1.0.0', shouldMatch: true },
		{ page: 'commit', url: 'https://github.com/user/repo/commit/1234567890123456789012345678901234567890', shouldMatch: true },
		{ page: 'pr', url: 'https://github.com/user/repo', shouldMatch: false },
		{ page: 'action_run', url: 'https://github.com/jonfriesen/quickcite/actions/runs/10476888027', shouldMatch: true },
		{ page: 'action_run', url: 'https://github.com/octocat/Hello-World/actions/runs/12345678', shouldMatch: true },
		{ page: 'action_run', url: 'https://github.com/octocat/Hello-World/actions', shouldMatch: false },
		{ page: 'action_run', url: 'https://github.com/octocat/Hello-World/actions/runs/abcdefgh', shouldMatch: false },
		{ page: 'action_run', url: 'https://github.com/octocat/Hello-World/actions/runs/abcdefgh/job/12345678', shouldMatch: false },
	]

	test.each(testCases)('$page: $url should ${shouldMatch ? "match" : "not match"}', ({ page, url, shouldMatch }) => {
		const pattern = siteConfigs.github.pages[page].urlPattern
		if (shouldMatch) {
			expect(url).toMatch(pattern)
		} else {
			expect(url).not.toMatch(pattern)
		}
	})
})

describe('GitHub markdown generator tests', () => {
	const mockGetStatusEmoji = (status) => {
		const statusMap = {
			Queued: '⏳',
			'In progress': '🔄',
			Success: '✅',
			Failure: '❌',
			Cancelled: '🚫',
			Skipped: '⏭️',
		}
		return statusMap[status] || ''
	}

	const markdownTestCases = [
		{
			page: 'pr',
			info: { number: '#123', title: 'Add new feature' },
			url: 'https://github.com/user/repo/pull/123',
			expected: '[#123: Add new feature](https://github.com/user/repo/pull/123)',
		},
		{
			page: 'issue',
			info: { number: '#456', title: 'Fix bug in login' },
			url: 'https://github.com/user/repo/issues/456',
			expected: '[#456: Fix bug in login](https://github.com/user/repo/issues/456)',
		},
		{
			page: 'discussion',
			info: { number: '#789', title: 'Propose new architecture' },
			url: 'https://github.com/user/repo/discussions/789',
			expected: '[#789: Propose new architecture](https://github.com/user/repo/discussions/789)',
		},
		{
			page: 'repo',
			info: { title: 'user/repo', description: 'A cool project' },
			url: 'https://github.com/user/repo',
			expected: '[user/repo](https://github.com/user/repo) - A cool project',
		},
		{
			page: 'user',
			info: { name: 'John Doe', bio: 'Software Developer' },
			url: 'https://github.com/johndoe',
			expected: '[John Doe](https://github.com/johndoe) - Software Developer',
		},
		{
			page: 'release',
			info: { title: 'v1.0.0: First Release', date: '2023-05-01T00:00:00Z' },
			url: 'https://github.com/user/repo/releases/tag/v1.0.0',
			expected: '[v1.0.0: First Release](https://github.com/user/repo/releases/tag/v1.0.0) - Released on ' + new Date('2023-05-01T00:00:00Z').toLocaleDateString(),
		},
		{
			page: 'commit',
			info: { title: 'Update README.md', hash: '1234567890abcdef', author: 'John Doe', date: '2023-05-01T00:00:00Z' },
			url: 'https://github.com/user/repo/commit/1234567890abcdef',
			expected: '[(1234567) - Update README.md](https://github.com/user/repo/commit/1234567890abcdef)\nBy John Doe on ' + new Date('2023-05-01T00:00:00Z').toLocaleString(),
		},
		{
			page: 'action_run',
			info: { repoOwner: 'jonfriesen', repoName: 'quickcite', workflowName: 'CI', runNumber: '#1234', runStatus: 'Success', statusEmoji: '✅' },
			url: 'https://github.com/jonfriesen/quickcite/actions/runs/10476888027',
			expected: '[jonfriesen/quickcite: CI #1234 ✅ (Success)](https://github.com/jonfriesen/quickcite/actions/runs/10476888027)',
		},
		{
			page: 'action_run',
			info: { repoOwner: 'octocat', repoName: 'Hello-World', workflowName: 'Build', runNumber: '#5678', runStatus: 'Failure', statusEmoji: '❌' },
			url: 'https://github.com/octocat/Hello-World/actions/runs/12345678',
			expected: '[octocat/Hello-World: Build #5678 ❌ (Failure)](https://github.com/octocat/Hello-World/actions/runs/12345678)',
		},
		{
			page: 'action_run',
			info: { repoOwner: 'test', repoName: 'repo', workflowName: 'Deploy', runNumber: '#9012', runStatus: 'In progress', statusEmoji: '🔄' },
			url: 'https://github.com/test/repo/actions/runs/90123456',
			expected: '[test/repo: Deploy #9012 🔄 (In progress)](https://github.com/test/repo/actions/runs/90123456)',
		},
	]

	test.each(markdownTestCases)('$page: should generate correct markdown', ({ page, info, url, expected }) => {
		const buildMarkdown = siteConfigs.github.pages[page].buildMarkdown
		expect(buildMarkdown(info, url)).toBe(expected)
	})
})
