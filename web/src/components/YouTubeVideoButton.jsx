'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/Button'

export function YouTubeVideoButton({ videoUrl }) {
	const [showVideo, setShowVideo] = useState(false)

	// Extract video ID from the YouTube URL
	const getVideoId = (url) => {
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
		const match = url.match(regExp)
		return match && match[2].length === 11 ? match[2] : null
	}

	const videoId = getVideoId(videoUrl)

	// Construct the embed URL with parameters to hide most UI elements
	const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0`

	const handleOverlayClick = (e) => {
		if (e.target === e.currentTarget) {
			setShowVideo(false)
		}
	}

	useEffect(() => {
		const handleEscKey = (event) => {
			if (event.key === 'Escape') {
				setShowVideo(false)
			}
		}

		if (showVideo) {
			document.addEventListener('keydown', handleEscKey)
		}

		return () => {
			document.removeEventListener('keydown', handleEscKey)
		}
	}, [showVideo])

	return (
		<>
			<Button className="transition duration-300 flex items-center" onClick={() => setShowVideo(true)}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="lucide lucide-youtube mr-2">
					<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
					<path d="m10 15 5-3-5-3z" />
				</svg>
				Product Tour
			</Button>

			{showVideo && videoId && (
				<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999]" onClick={handleOverlayClick}>
					<div className="relative">
						<button className="absolute -top-12 -right-12 text-black hover:text-gray-700 transition duration-300" onClick={() => setShowVideo(false)}>
							<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
								<circle cx="20" cy="20" r="20" fill="#E5E7EB" />
								<path d="M15 15 L25 25 M15 25 L25 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
							</svg>
						</button>
						<div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
							<iframe
								className="w-[560px] h-[315px] md:w-[640px] md:h-[360px] lg:w-[853px] lg:h-[480px]"
								src={embedUrl}
								title="YouTube: QuickCite Product Video"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen></iframe>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
