'use client'

import { useState, useEffect } from 'react'
import { formatEther, parseEther } from 'ethers'
import { useWallet } from '@/components/Providers'
import { getContractInterface } from '@/utils/contractInterface'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Trial {
  id: number
  name: string
  description: string
  reward: string
  isActive: boolean
}

const hardcodedTrials: Trial[] = [
  {
    id: 1,
    name: "Alzheimer's Early Detection Study",
    description: "A groundbreaking study aimed at identifying early markers of Alzheimer's disease in adults aged 50-65.",
    reward: "500",
    isActive: true,
  },
  {
    id: 2,
    name: "Type 2 Diabetes Management Trial",
    description: "Evaluating the effectiveness of a new combination therapy for better management of Type 2 Diabetes.",
    reward: "750",
    isActive: true,
  },
  {
    id: 3,
    name: "COVID-19 Long-Term Effects Study",
    description: "Investigating the long-term effects of COVID-19 on respiratory and cognitive functions in recovered patients.",
    reward: "1000",
    isActive: false,
  },
]

export default function Dashboard() {
  const { account, provider } = useWallet()
  const [trials, setTrials] = useState<Trial[]>(hardcodedTrials)
  const [userRewards, setUserRewards] = useState<string>('0')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (account && provider) {
      fetchUserRewards()
    }
  }, [account, provider])

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
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Wallet Connection Required</CardTitle>
            <CardDescription>Please connect your wallet to access the dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Clinical Trials Dashboard</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{userRewards} CELO</p>
        </CardContent>
        {parseFloat(userRewards) > 0 && (
          <CardFooter>
            <Button onClick={claimRewards} variant="default">
              Claim Rewards
            </Button>
          </CardFooter>
        )}
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Available Trials</h2>
      
      {loading ? (
        <p>Loading trials...</p>
      ) : trials.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trials.map((trial) => (
            <Card key={trial.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="mr-2">{trial.name}</CardTitle>
                  <Badge variant={trial.isActive ? "default" : "secondary"}>
                    {trial.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-2">{trial.description}</p>
                <p className="font-semibold">Reward: {trial.reward} CELO</p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => participateInTrial(trial.id)}
                  disabled={!trial.isActive}
                  className="w-full"
                >
                  Participate
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p>No active trials available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

