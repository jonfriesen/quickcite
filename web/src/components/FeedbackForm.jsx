import React, { useId, useState } from 'react'
import { Button } from '@/components/Button'

export function FeedbackForm() {
  const emailId = useId()
  const feedbackId = useId()
  const honeypotId = useId()
  const [feedback, setFeedback] = useState('')
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (honeypot) {
      // If honeypot is filled, silently reject the submission
      return
    }
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('https://flows.apps.frsn.io/webhook/quickcite-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback, email }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      setSubmitStatus('success')
      setFeedback('')
      setEmail('')
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative isolate mt-8 space-y-4">
      {/* Feedback text area */}
      <div className="relative">
        <label htmlFor={feedbackId} className="sr-only">
          Feedback
        </label>
        <textarea
          required
          id={feedbackId}
          name="feedback"
          rows="3"
          maxLength="250"
          placeholder="Your feedback (max 250 characters)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="peer w-full bg-transparent px-4 py-2.5 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-[0.8125rem]/6 rounded-lg resize-none"
        />
        <div className="absolute inset-0 -z-10 rounded-lg transition peer-focus:ring-4 peer-focus:ring-sky-300/15" />
        <div className="absolute inset-0 -z-10 rounded-lg bg-white/2.5 ring-1 ring-white/15 transition peer-focus:ring-sky-300" />
        <div className="text-right text-[0.625rem] text-gray-400 mt-1 mr-1">{feedback.length}/250</div>
      </div>

      {/* Email input */}
      <div className="relative">
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          required
          type="email"
          autoComplete="email"
          name="email"
          id={emailId}
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="peer w-full bg-transparent px-4 py-2.5 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-[0.8125rem]/6 rounded-lg"
        />
        <div className="absolute inset-0 -z-10 rounded-lg transition peer-focus:ring-4 peer-focus:ring-sky-300/15" />
        <div className="absolute inset-0 -z-10 rounded-lg bg-white/2.5 ring-1 ring-white/15 transition peer-focus:ring-sky-300" />
      </div>

      {/* Honeypot field */}
      <div className="hidden">
        <label htmlFor={honeypotId} className="sr-only">
          Leave this field empty
        </label>
        <input
          type="text"
          id={honeypotId}
          name="honeypot"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex="-1"
          autoComplete="off"
        />
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <Button type="submit" arrow disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </div>

      {/* Submission status message */}
      {submitStatus && (
        <div className={`text-sm ${submitStatus === 'success' ? 'text-green-500' : 'text-red-500'}`}>
          {submitStatus === 'success' ? 'Feedback submitted successfully!' : 'Error submitting feedback. Please try again.'}
        </div>
      )}
    </form>
  )
}
