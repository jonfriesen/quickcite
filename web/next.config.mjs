import nextMDX from '@next/mdx'

import { recmaPlugins } from './mdx/recma.mjs'
import { rehypePlugins } from './mdx/rehype.mjs'
import { remarkPlugins } from './mdx/remark.mjs'

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  // reactStrictMode: true,
  // swcMinify: true,
  // experimental: {
  //   newNextLinkBehavior: true,
  //   scrollRestoration: true,
  // },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

export default withMDX(nextConfig)