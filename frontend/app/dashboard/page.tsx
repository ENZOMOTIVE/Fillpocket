'use client'

import { useState } from 'react'
import { useWallet } from '@/components/Providers'

// Mock data for available trials and rewards
const mockTrials = [
  { id: 1, name: 'Trial A', reward: 100 },
  { id: 2, name: 'Trial B', reward: 150 },
  { id: 3, name: 'Trial C', reward: 200 },
]

export default function Dashboard() {
  const { account } = useWallet()
  const [review, setReview] = useState('')
  const [reviews, setReviews] = useState<string[]>([])

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (review.trim()) {
      setReviews([...reviews, review])
      setReview('')
      // Here you would typically store the review on the blockchain
    }
  }

  if (!account) {
    return <p>Please connect your wallet to view your dashboard.</p>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Available Clinical Trials</h2>
        <ul className="space-y-2">
          {mockTrials.map((trial) => (
            <li key={trial.id} className="bg-gray-100 p-4 rounded">
              <span className="font-medium">{trial.name}</span> - Reward: {trial.reward} tokens
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Rewards Balance</h2>
        <p className="text-2xl font-bold">500 tokens</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Submit a Review</h2>
        <form onSubmit={submitReview} className="space-y-2">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Write your review here..."
            required
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit Review
          </button>
        </form>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Reviews</h2>
        <ul className="space-y-2">
          {reviews.map((r, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded">
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

