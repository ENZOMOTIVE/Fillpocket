'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/components/Providers'
import { getContractInterface } from '@/utils/contractInterface'
import { ethers } from 'ethers'

interface Trial {
  id: number
  name: string
  description: string
  reward: number
}

export default function Dashboard() {
  const { account } = useWallet()
  const [trials, setTrials] = useState<Trial[]>([])
  const [userRewards, setUserRewards] = useState<number>(0)

  useEffect(() => {
    if (account) {
      fetchTrials()
      fetchUserRewards()
    }
  }, [account])

  const fetchTrials = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = getContractInterface(provider)
      
      try {
        const availableTrialIds = await contract.getAvailableTrials()
        const trialPromises = availableTrialIds.map(async (id: number) => {
          const trialDetails = await contract.getTrialDetails(id)
          return {
            id: trialDetails.id.toNumber(),
            name: trialDetails.name,
            description: trialDetails.description,
            reward: ethers.utils.formatEther(trialDetails.reward)
          }
        })
        const fetchedTrials = await Promise.all(trialPromises)
        setTrials(fetchedTrials)
      } catch (error) {
        console.error("Error fetching trials:", error)
      }
    }
  }

  const fetchUserRewards = async () => {
    if (typeof window.ethereum !== 'undefined' && account) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = getContractInterface(provider)
      
      try {
        const rewards = await contract.getUserRewards(account)
        setUserRewards(ethers.utils.formatEther(rewards))
      } catch (error) {
        console.error("Error fetching user rewards:", error)
      }
    }
  }

  const participateInTrial = async (trialId: number) => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = getContractInterface(provider)
      
      try {
        const tx = await contract.participateInTrial(trialId)
        await tx.wait()
        alert("Successfully participated in the trial!")
        fetchUserRewards()
      } catch (error) {
        console.error("Error participating in trial:", error)
        alert("Failed to participate in the trial. Please try again.")
      }
    }
  }

  if (!account) {
    return <p className="text-center mt-8">Please connect your wallet to view your dashboard.</p>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Rewards Balance</h2>
        <p className="text-3xl font-bold text-primary">{userRewards} tokens</p>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Available Clinical Trials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trials.map((trial) => (
          <div key={trial.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{trial.name}</h3>
              <p className="text-gray-600 mb-4">{trial.description}</p>
              <p className="text-lg font-medium mb-4">Reward: {trial.reward} tokens</p>
              <button
                onClick={() => participateInTrial(trial.id)}
                className="w-full bg-primary text-white font-medium py-2 px-4 rounded hover:bg-primary/90 transition-colors"
              >
                Participate
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {trials.length === 0 && (
        <p className="text-center text-gray-600 mt-8">No clinical trials available at the moment.</p>
      )}
    </div>
  )
}

