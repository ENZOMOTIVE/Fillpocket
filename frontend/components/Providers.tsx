'use client'

import { createContext, useState, useEffect, useContext } from 'react'
import { BrowserProvider, JsonRpcSigner } from 'ethers'

interface WalletContextType {
  account: string | null
  provider: BrowserProvider | null
  signer: JsonRpcSigner | null
  connect: () => Promise<void>
  switchNetwork: (chainId: string) => Promise<void>
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  provider: null,
  signer: null,
  connect: async () => {},
  switchNetwork: async () => {},
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)

  const connect = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const browserProvider = new BrowserProvider(window.ethereum)
        const newSigner = await browserProvider.getSigner()
        const address = await newSigner.getAddress()

        setProvider(browserProvider)
        setSigner(newSigner)
        setAccount(address)
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    } else {
      console.log('Please install MetaMask!')
    }
  }

  const switchNetwork = async (chainId: string) => {
    if (typeof window !== 'undefined' && window.ethereum) {
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
    if (typeof window !== 'undefined' && window.ethereum) {
      const { ethereum } = window

      // Handle account changes
      ethereum.on?.('accountsChanged', async (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null)
          setProvider(null)
          setSigner(null)
        } else {
          setAccount(accounts[0])
          const browserProvider = new BrowserProvider(ethereum)
          const newSigner = await browserProvider.getSigner()
          setProvider(browserProvider)
          setSigner(newSigner)
        }
      })

      // Check if already connected
      ethereum
        .request?.({ method: 'eth_accounts' })
        .then(async (accounts: string[]) => {
          if (accounts.length > 0) {
            const browserProvider = new BrowserProvider(ethereum)
            const newSigner = await browserProvider.getSigner()
            setProvider(browserProvider)
            setSigner(newSigner)
            setAccount(accounts[0])
          }
        })
        .catch((error) => console.error('Failed to fetch accounts:', error))

      return () => {
        if (typeof window !== 'undefined' && window.ethereum) {
          window.ethereum.removeAllListeners?.('accountsChanged')
        }
      }
    }
  }, [])

  const value = {
    account,
    provider,
    signer,
    connect,
    switchNetwork,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)