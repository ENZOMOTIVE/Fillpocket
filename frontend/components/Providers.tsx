'use client'

import { createContext, useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'

const WalletContext = createContext<{
  account: string | null
  connect: () => Promise<void>
  switchNetwork: (chainId: string) => Promise<void>
}>({
  account: null,
  connect: async () => {},
  switchNetwork: async () => {},
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)

  const connect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        setAccount(address)
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    } else {
      console.log('Please install MetaMask!')
    }
  }

  const switchNetwork = async (chainId: string) => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        })
      } catch (error) {
        console.error('Failed to switch network:', error)
      }
    }
  }

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null)
      })
    }
  }, [])

  return (
    <WalletContext.Provider value={{ account, connect, switchNetwork }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)

