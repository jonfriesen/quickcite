import siteConfigs from '../config'

export function runUrlPatternTests(siteName, testCases) {
	describe(`${siteName} URL pattern tests`, () => {
		test.each(testCases)('$page: $url should ${shouldMatch ? "match" : "not match"}', ({ page, url, shouldMatch }) => {
			const pattern = siteConfigs[siteName].pages[page].urlPattern
			if (shouldMatch) {
				expect(url).toMatch(pattern)
			} else {
				expect(url).not.toMatch(pattern)
			}
		})
	})
}

export function runMarkdownGeneratorTests(siteName, markdownTestCases) {
	describe(`${siteName} markdown generator tests`, () => {
		test.each(markdownTestCases)('$page: should generate correct markdown', ({ page, info, url, expected }) => {
			const buildMarkdown = siteConfigs[siteName].pages[page].buildMarkdown
			expect(buildMarkdown(info, url)).toBe(expected)
		})
	})
}

export function runPlaintextGeneratorTests(siteName, plaintextTestCases) {
	describe(`${siteName} plaintext generator tests`, () => {
		test.each(plaintextTestCases)('$page: should generate correct plaintext', ({ page, info, url, expected }) => {
			const buildPlaintext = siteConfigs[siteName].pages[page].buildPlaintext
			expect(buildPlaintext(info, url)).toBe(expected)
		})
	})
}
