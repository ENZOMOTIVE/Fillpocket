'use client'

import { useState } from 'react'
import { parseEther } from 'ethers'
import { useWallet } from '@/components/Providers'
import { getContractInterface } from '@/utils/contractInterface'

export default function CreateTrial() {
  const { account, provider } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [trialData, setTrialData] = useState({
    name: '',
    description: '',
    reward: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!provider || !account) return

    setIsSubmitting(true)
    try {
      const contract = await getContractInterface(provider)
      const rewardInWei = parseEther(trialData.reward)
      
      const tx = await contract.createTrial(
        trialData.name,
        trialData.description,
        rewardInWei
      )
      
      await tx.wait()
      alert('Trial created successfully!')
      
      // Reset form
      setTrialData({
        name: '',
        description: '',
        reward: '',
      })
    } catch (error) {
      console.error('Error creating trial:', error)
      alert('Failed to create trial. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTrialData({ ...trialData, [e.target.name]: e.target.value })
  }

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-lg">Please connect your wallet to create a trial.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create Clinical Trial</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Trial Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={trialData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              placeholder="Enter trial name"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={trialData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              placeholder="Enter trial description"
            />
          </div>
          <div>
            <label htmlFor="reward" className="block text-sm font-medium text-gray-700 mb-2">
              Reward Amount (in ETH)
            </label>
            <input
              type="number"
              id="reward"
              name="reward"
              value={trialData.reward}
              onChange={handleChange}
              required
              step="0.000000000000000001"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              placeholder="0.0"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Trial'}
          </button>
        </form>
      </div>
    </div>
  )
}

