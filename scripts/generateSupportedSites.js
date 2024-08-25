import fs from 'fs/promises'
import path from 'path'
import siteConfigs from '../src/content/config.js'

async function generateSupportedSitesMarkdown() {
	let markdownContent = '<!-- DO NOT EDIT; FILE IS GENERATED -->\n\n'
	markdownContent += '# Supported Websites and Features\n\n'
	markdownContent += 'This document is automatically generated based on the current configuration of QuickCite.\n\n'

	// Generate table of contents
	markdownContent += '## Table of Contents\n\n'
	for (const siteName of Object.keys(siteConfigs)) {
		markdownContent += `- [${capitalize(siteName)}](#${siteName.toLowerCase()})\n`
	}
	markdownContent += '\n'

	for (const [siteName, siteConfig] of Object.entries(siteConfigs)) {
		markdownContent += `## ${capitalize(siteName)}\n\n`
		markdownContent += `- Domain: \`${siteConfig.domain}\`\n`
		markdownContent += `- Default Prefix: ${siteConfig.prefix}\n\n`
		markdownContent += '| Page Type | Description |\n'
		markdownContent += '|-----------|-------------|\n'

		for (const [pageType, pageConfig] of Object.entries(siteConfig.pages)) {
			markdownContent += `| ${capitalize(pageType)} | ${getPageDescription(pageType, pageConfig)} |\n`
		}

		markdownContent += '\n'
	}

	const outputPath = path.join(process.cwd(), 'docs', 'SUPPORTED_SITES.md')
	await fs.writeFile(outputPath, markdownContent, 'utf8')
	console.log(`Supported sites markdown generated at ${outputPath}`)
}

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

function getPageDescription(pageType, pageConfig) {
	// TODO: Add descriptions that are more accurate
	return `Supports ${pageType} pages`
}

generateSupportedSitesMarkdown()
