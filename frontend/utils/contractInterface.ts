import { ethers } from 'ethers'

const ABI = [
  "function createTrial(string name, string description, uint256 reward) public",
  "function participateInTrial(uint256 trialId) public",
  "function getTrialDetails(uint256 trialId) public view returns (uint256 id, address creator, string name, string description, uint256 reward, bool isActive)",
  "function getAvailableTrials() public view returns (uint256[])",
  "function getUserRewards(address user) public view returns (uint256)"
]

export function getContractInterface(provider: ethers.providers.Web3Provider) {
  // Replace with your actual deployed contract address
  const contractAddress = "0x..."
  return new ethers.Contract(contractAddress, ABI, provider.getSigner())
}

