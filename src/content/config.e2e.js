import { test as base, expect } from '@playwright/test'
import siteConfigs from './config.js'

// Define a common user agent
const COMMON_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

// Create a custom test fixture that sets the user agent
const test = base.extend({
	page: async ({ page }, use) => {
		await page.setExtraHTTPHeaders({
			'User-Agent': COMMON_USER_AGENT,
		})
		await use(page)
	},
})

// Helper function to test a specific page configuration
async function testPageConfig(page, url, config) {
	await page.goto(url)
	await page.waitForLoadState('domcontentloaded')

	// Execute the getInfo function in the browser context
	const info = await page.evaluate(config.getInfo)

	// Verify that the info object is not null or undefined
	expect(info).toBeTruthy()

	// Verify that all expected properties are present and non-empty
	for (const key in info) {
		expect(info[key]).not.toBe(undefined, `Expected info[${key}] to be defined, but it was undefined`)
		expect(info[key]).not.toBe(null, `Expected info[${key}] to be non-null, but it was null`)
		if (typeof info[key] === 'string') {
			expect(info[key].trim()).not.toBe('', `Expected info[${key}] to be non-empty string, but it was: "${info[key]}"`)
		} else {
			expect(info[key]).toBeTruthy(`Expected info[${key}] to be truthy, but it was: ${JSON.stringify(info[key])}`)
		}
	}

	// Test markdown and plaintext building functions
	const markdown = config.buildMarkdown(info, url)
	const plaintext = config.buildPlaintext(info, url)

	expect(markdown).toBeTruthy()
	expect(plaintext).toBeTruthy()
}

// Test cases for each site and page type
for (const [siteName, siteConfig] of Object.entries(siteConfigs)) {
	// LinkedIn is hard to test because it requires auth
	if (siteName === 'linkedin') continue

	for (const [pageName, pageConfig] of Object.entries(siteConfig.pages)) {
		test(`${siteName} - ${pageName}`, async ({ page }) => {
			const testUrls = {
				github: {
					pr: 'https://github.com/microsoft/playwright/pull/20635',
					issue: 'https://github.com/microsoft/playwright/issues/20636',
					discussion: 'https://github.com/golang/go/discussions/61669',
					repo: 'https://github.com/microsoft/playwright',
					user: 'https://github.com/microsoft',
					release: 'https://github.com/microsoft/playwright/releases/tag/v1.32.3',
					commit: 'https://github.com/golang/go/commit/96d8ff00c2d6a88384863a656fb5e53716b614d3',
					action_run: 'https://github.com/jonfriesen/quickcite/actions/runs/10446232111',
				},
				instagram: {
					profile: 'https://www.instagram.com/jonfriesen/',
				},
				trello: {
					board: 'https://trello.com/b/AwYSWOyt/ultimate-to-do-list',
				},
			}

			const testUrl = testUrls[siteName][pageName]
			await testPageConfig(page, testUrl, pageConfig)
		})
	}
}
