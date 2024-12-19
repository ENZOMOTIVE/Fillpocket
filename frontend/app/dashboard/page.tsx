'use client'

import { useState, useEffect } from 'react'
import { formatEther } from 'ethers'
import { useWallet } from '@/components/Providers'
import { getContractInterface } from '@/utils/contractInterface'

interface Trial {
  id: number
  name: string
  description: string
  reward: string
  isActive: boolean
}

export default function Dashboard() {
  const { account, provider } = useWallet()
  const [trials, setTrials] = useState<Trial[]>([])
  const [userRewards, setUserRewards] = useState<string>('0')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (account && provider) {
      fetchTrials()
      fetchUserRewards()
    }
  }, [account, provider])

  const fetchTrials = async () => {
    if (!provider || !account) return
    
    setLoading(true)
    setError(null)
    try {
      const contract = await getContractInterface(provider)
      const trialIds = await contract.getAllTrialIds()
      
      const trialPromises = trialIds.map(async (id: bigint) => {
        try {
          const details = await contract.getTrialDetails(id)
          return {
            id: Number(details.id),
            name: details.name,
            description: details.description,
            reward: formatEther(details.reward),
            isActive: details.isActive
          }
        } catch (error) {
          console.error(`Error fetching trial ${id}:`, error)
          return null
        }
      })
      
      const fetchedTrials = (await Promise.all(trialPromises))
        .filter((trial): trial is Trial => trial !== null && trial.isActive)
      
      setTrials(fetchedTrials)
    } catch (error) {
      console.error("Error fetching trials:", error)
      setError("Failed to load trials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRewards = async () => {
    if (!provider || !account) return
    
    try {
      const contract = await getContractInterface(provider)
      const rewards = await contract.getUserRewards(account)
      setUserRewards(formatEther(rewards))
    } catch (error) {
      console.error("Error fetching rewards:", error)
      setUserRewards('0')
    }
  }

  const participateInTrial = async (trialId: number) => {
    if (!provider || !account) return
    
    try {
      const contract = await getContractInterface(provider)
      const tx = await contract.participateInTrial(trialId)
      await tx.wait()
      alert("Successfully participated!")
      fetchTrials()
      fetchUserRewards()
    } catch (error) {
      console.error("Error participating:", error)
      alert("Failed to participate. Please try again.")
    }
  }

  const claimRewards = async () => {
    if (!provider || !account) return
    
    try {
      const contract = await getContractInterface(provider)
      const tx = await contract.claimRewards()
      await tx.wait()
      alert("Rewards claimed successfully!")
      fetchUserRewards()
    } catch (error) {
      console.error("Error claiming rewards:", error)
      alert("Failed to claim rewards. Please try again.")
    }
  }

  if (!account) {
    return <p className="text-center mt-8">Please connect your wallet to continue.</p>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clinical Trials Dashboard</h1>
      
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl mb-2">Your Rewards</h2>
        <p className="text-lg mb-2">{userRewards} CELO</p>
        {parseFloat(userRewards) > 0 && (
          <button 
            onClick={claimRewards}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Claim Rewards
          </button>
        )}
      </div>

      <h2 className="text-xl mb-4">Available Trials</h2>
      
      {loading ? (
        <p>Loading trials...</p>
      ) : trials.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {trials.map((trial) => (
            <div key={trial.id} className="border p-4 rounded">
              <h3 className="font-bold">{trial.name}</h3>
              <p className="my-2">{trial.description}</p>
              <p className="mb-2">Reward: {trial.reward} CELO</p>
              <button
                onClick={() => participateInTrial(trial.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Participate
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No active trials available.</p>
      )}
    </div>
  )
}

