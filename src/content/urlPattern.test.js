import siteConfigs from './config'

describe('URL pattern tests', () => {
	const testCases = [
		// GitHub
		{ site: 'github', page: 'pr', url: 'https://github.com/user/repo/pull/123', shouldMatch: true },
		{ site: 'github', page: 'issue', url: 'https://github.com/user/repo/issues/456', shouldMatch: true },
		{ site: 'github', page: 'discussion', url: 'https://github.com/user/repo/discussions/789', shouldMatch: true },
		{ site: 'github', page: 'repo', url: 'https://github.com/user/repo', shouldMatch: true },
		{ site: 'github', page: 'user', url: 'https://github.com/username', shouldMatch: true },
		{ site: 'github', page: 'release', url: 'https://github.com/user/repo/releases/tag/v1.0.0', shouldMatch: true },
		{ site: 'github', page: 'commit', url: 'https://github.com/user/repo/commit/1234567890123456789012345678901234567890', shouldMatch: true },

		// Instagram
		{ site: 'instagram', page: 'profile', url: 'https://www.instagram.com/username/', shouldMatch: true },

		// LinkedIn
		{ site: 'linkedin', page: 'profile', url: 'https://www.linkedin.com/in/username/', shouldMatch: true },
		{ site: 'linkedin', page: 'company', url: 'https://www.linkedin.com/company/companyname/', shouldMatch: true },
		{ site: 'linkedin', page: 'pulse', url: 'https://www.linkedin.com/pulse/article-title/', shouldMatch: true },

		// Negative test cases
		{ site: 'github', page: 'pr', url: 'https://github.com/user/repo', shouldMatch: false },
		{ site: 'instagram', page: 'profile', url: 'https://www.instagram.com/p/123456/', shouldMatch: false },
		{ site: 'linkedin', page: 'profile', url: 'https://www.linkedin.com/feed/', shouldMatch: false },
	]

	test.each(testCases)('$site $page: $url should ${shouldMatch ? "match" : "not match"}', ({ site, page, url, shouldMatch }) => {
		const pattern = siteConfigs[site].pages[page].urlPattern
		if (shouldMatch) {
			expect(url).toMatch(pattern)
		} else {
			expect(url).not.toMatch(pattern)
		}
	})
})
