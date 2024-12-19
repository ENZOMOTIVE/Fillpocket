'use client'

import { useState } from 'react'
import { useWallet } from '@/components/Providers'

export default function CreateTrial() {
  const { account } = useWallet()
  const [trialData, setTrialData] = useState({
    name: '',
    description: '',
    reward: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would interact with your smart contract to create the trial
    console.log('Creating trial:', trialData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTrialData({ ...trialData, [e.target.name]: e.target.value })
  }

  if (!account) {
    return <p>Please connect your wallet to create a trial.</p>
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Clinical Trial</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Trial Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={trialData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={trialData.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <div>
          <label htmlFor="reward" className="block mb-1">
            Reward Amount
          </label>
          <input
            type="number"
            id="reward"
            name="reward"
            value={trialData.reward}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Trial
        </button>
      </form>
    </div>
  )
}

