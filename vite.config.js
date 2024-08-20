import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import manifest from './src/manifest.json'

export default defineConfig({
	plugins: [crx({ manifest })],
	css: {
		postcss: {
			plugins: [tailwindcss, autoprefixer],
		},
	},
	build: {
		rollupOptions: {
			input: {
				popup: 'src/popup/popup.html',
				background: 'src/background/background.js',
				content: 'src/content/content.js',
			},
		},
	},
})
