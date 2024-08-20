'use client'

import Link from 'next/link'

import { IconLink } from '@/components/IconLink'
import { Logo } from '@/components/Logo'
import { FeedbackForm } from '@/components/FeedbackForm'
import { IconLoading } from '@/components/IconLoading'
import { YouTubeVideoButton } from '@/components/YouTubeVideoButton'

function BookIcon(props) {
	return (
		<svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor" {...props}>
			<path d="M7 3.41a1 1 0 0 0-.668-.943L2.275 1.039a.987.987 0 0 0-.877.166c-.25.192-.398.493-.398.812V12.2c0 .454.296.853.725.977l3.948 1.365A1 1 0 0 0 7 13.596V3.41ZM9 13.596a1 1 0 0 0 1.327.946l3.948-1.365c.429-.124.725-.523.725-.977V2.017c0-.32-.147-.62-.398-.812a.987.987 0 0 0-.877-.166L9.668 2.467A1 1 0 0 0 9 3.41v10.186Z" />
		</svg>
	)
}

function GitHubIcon(props) {
	return (
		<svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor" {...props}>
			<path d="M8 .198a8 8 0 0 0-8 8 7.999 7.999 0 0 0 5.47 7.59c.4.076.547-.172.547-.384 0-.19-.007-.694-.01-1.36-2.226.482-2.695-1.074-2.695-1.074-.364-.923-.89-1.17-.89-1.17-.725-.496.056-.486.056-.486.803.056 1.225.824 1.225.824.714 1.224 1.873.87 2.33.666.072-.518.278-.87.507-1.07-1.777-.2-3.644-.888-3.644-3.954 0-.873.31-1.586.823-2.146-.09-.202-.36-1.016.07-2.118 0 0 .67-.214 2.2.82a7.67 7.67 0 0 1 2-.27 7.67 7.67 0 0 1 2 .27c1.52-1.034 2.19-.82 2.19-.82.43 1.102.16 1.916.08 2.118.51.56.82 1.273.82 2.146 0 3.074-1.87 3.75-3.65 3.947.28.24.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.14.46.55.38A7.972 7.972 0 0 0 16 8.199a8 8 0 0 0-8-8Z" />
		</svg>
	)
}

function FeedIcon(props) {
	return (
		<svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M2.5 3a.5.5 0 0 1 .5-.5h.5c5.523 0 10 4.477 10 10v.5a.5.5 0 0 1-.5.5h-.5a.5.5 0 0 1-.5-.5v-.5A8.5 8.5 0 0 0 3.5 4H3a.5.5 0 0 1-.5-.5V3Zm0 4.5A.5.5 0 0 1 3 7h.5A5.5 5.5 0 0 1 9 12.5v.5a.5.5 0 0 1-.5.5H8a.5.5 0 0 1-.5-.5v-.5a4 4 0 0 0-4-4H3a.5.5 0 0 1-.5-.5v-.5Zm0 5a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
			/>
		</svg>
	)
}

function XIcon(props) {
	return (
		<svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor" {...props}>
			<path d="M9.51762 6.77491L15.3459 0H13.9648L8.90409 5.88256L4.86212 0H0.200195L6.31244 8.89547L0.200195 16H1.58139L6.92562 9.78782L11.1942 16H15.8562L9.51728 6.77491H9.51762ZM7.62588 8.97384L7.00658 8.08805L2.07905 1.03974H4.20049L8.17706 6.72795L8.79636 7.61374L13.9654 15.0075H11.844L7.62588 8.97418V8.97384Z" />
		</svg>
	)
}

const AnimatedGradientText = ({ children }) => (
	<>
		<style jsx>{`
			@keyframes gradient-x {
				0%,
				100% {
					background-position: 0% 50%;
				}
				50% {
					background-position: -100% 50%;
				}
			}
			.animate-gradient-x {
				animation: gradient-x 3s linear infinite;
				background-size: 200% 100%;
			}
		`}</style>
		<h1 className="ml-4 font-display text-5xl font-bold tracking-tight">
			<span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-400 to-white animate-gradient-x">{children}</span>
		</h1>
	</>
)

export function Intro() {
	return (
		<>
			<div>
				<Link href="/" className="flex items-center">
					<Logo className="h-16 rotate-90 w-auto" />
					<AnimatedGradientText>QuickCite</AnimatedGradientText>
				</Link>
			</div>
			{/* <h1 className="mt-14 font-display text-4xl/tight font-light text-white">
				A Chrome extension to build <span className="text-sky-300">context rich links</span>
			</h1> */}
			<h1 className="mt-14 font-display text-4xl/tight font-light text-white">
				A{' '}
				<span className="font-sans font-semibold tracking-tight">
					<span className="text-blue-500">C</span>
					<span className="text-red-400">h</span>
					<span className="text-yellow-300">r</span>
					<span className="text-blue-500">o</span>
					<span className="text-green-400">m</span>
					<span className="text-red-400">e</span>
				</span>{' '}
				extension to build <span className="text-sky-300">context rich links</span>
			</h1>
			<div className="mt-6 mb-6 bg-blue-600 border-l-4 border-blue-400 text-blue-200 p-4 rounded">
				<div className="flex items-center">
					<IconLoading className="mr-2 h-4 w-4 flex-none text-blue-400" />
					<p className="font-bold">Extension Under Review</p>
				</div>
				<p className="text-sm">
					The QuickCite Chrome extension is stuck in Google&apos;s review limbo. We&apos;re eager to get it live—thanks for your patience while Google takes its time!
				</p>
			</div>

			<div className="flex justify-center items-center">
				<YouTubeVideoButton videoUrl="https://youtu.be/CCF5vnF3Dmw" />
			</div>
			<p className="mt-4 text-sm/6 text-gray-300">
				QuickCite is a chrome extension designed to enhance productivity by allowing users to quickly copy formatted information from various websites, including GitHub, LinkedIn,
				and Instagram.
			</p>
			<ul className="mt-4 space-y-2 text-sm/6 text-gray-300">
				<li className="flex items-start">
					<svg className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
					</svg>
					<span>
						GitHub - <span className="text-xs text-gray-400">Pull Requests, Issues, Repositories, Discussions, Releases, Users/Orgs</span>
					</span>
				</li>
				<li className="flex items-start">
					<svg className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
					</svg>
					<span>
						LinkedIn - <span className="text-xs text-gray-400">Profiles, Companies, Articles</span>
					</span>
				</li>
				<li className="flex items-start">
					<svg className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
					</svg>
					<span>
						Instagram - <span className="text-xs text-gray-400">Profiles</span>
					</span>
				</li>
			</ul>
			<p className="mt-4 text-xs text-gray-400">
				I&apos;d like to continue to improve and expand our site catalog. If you have suggestions for new sites to support or encounter any bugs, please let us know using the form
				below. Your feedback is invaluable in helping us make QuickCite even better!
			</p>
			<FeedbackForm />
			<div className="mt-8 flex flex-wrap justify-center gap-x-1 gap-y-3 sm:gap-x-2 lg:justify-start">
				<IconLink href="https://quickcite.link" icon={BookIcon} className="flex-none">
					Documentation
				</IconLink>
				<IconLink href="https://github.com/jonfriesen/quickcite" icon={GitHubIcon} className="flex-none">
					GitHub
				</IconLink>
				{/* <IconLink href="/feed.xml" icon={FeedIcon} className="flex-none">
          RSS
        </IconLink> */}
			</div>
		</>
	)
}

export function IntroFooter() {
	return (
		<p className="flex items-baseline gap-x-2 text-[0.8125rem]/6 text-gray-500">
			Brought to you by{' '}
			<IconLink href="https://x.com/jonfriesen" icon={XIcon} compact>
				Jon Friesen
			</IconLink>
		</p>
	)
}
