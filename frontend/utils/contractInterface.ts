import { BrowserProvider, Contract } from 'ethers'
import { ABI } from './contract-abi'

export const CONTRACT_ADDRESS = "0xb9644aae16bb195d55e2e2081226138dc4cfa255"

export async function getContractInterface(provider: BrowserProvider) {
  const signer = await provider.getSigner()
  const contract = new Contract(CONTRACT_ADDRESS, ABI, signer)
  
  return {
    ...contract,
    getAllTrialIds: async () => {
      try {
        const result = await contract.getAllTrialIds()
        return Array.isArray(result) ? result : []
      } catch (error) {
        console.error("Error in getAllTrialIds:", error)
        return []
      }
    },
    getUserRewards: async (address: string) => {
      try {
        const result = await contract.getUserRewards(address)
        return result || BigInt(0)
      } catch (error) {
        console.error("Error in getUserRewards:", error)
        return BigInt(0)
      }
    },
    getTrialDetails: async (id: bigint) => {
      try {
        return await contract.getTrialDetails(id)
      } catch (error) {
        console.error("Error in getTrialDetails:", error)
        throw error
      }
    },
    createTrial: async (name: string, description: string, reward: bigint) => {
      try {
        const tx = await contract.createTrial(name, description, reward)
        return await tx.wait()
      } catch (error) {
        console.error("Error in createTrial:", error)
        throw error
      }
    }
  }
}

