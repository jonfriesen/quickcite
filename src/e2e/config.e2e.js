import { test as base, expect } from '@playwright/test'
import { e2eTestUrls } from './targets.js'
import siteConfigs from '../content/config.js'

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

// Run for test cases
for (const [siteName, sitePages] of Object.entries(e2eTestUrls)) {
	for (const [pageName, testUrl] of Object.entries(sitePages)) {
		if (siteConfigs[siteName] && siteConfigs[siteName].pages[pageName]) {
			const pageConfig = siteConfigs[siteName].pages[pageName]

			test(`${siteName} - ${pageName}`, async ({ page }) => {
				await testPageConfig(page, testUrl, pageConfig)
			})
		}
	}
}
