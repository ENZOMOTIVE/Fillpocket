'use client'

import { useWallet } from '@/components/Providers'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

const CELO_ALFAJORES_NETWORK = {
  chainId: '0xaef3', // 44787 in decimal
  chainName: 'Celo Alfajores Testnet',
  nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
  rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
  blockExplorerUrls: ['https://alfajores-blockscout.celo-testnet.org/'],
}

export default function Home() {
  const { account, connect, switchNetwork } = useWallet()

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Contribute-Earn-Belief
        </h1>
        <video className="w-full max-w-xl mx-auto" autoPlay loop muted playsInline>
  <source src="/logo.mp4" type="video/mp4" />
</video>

        <p className="mt-3 text-xl text-gray-500 sm:mt-4">
          Connect your wallet to participate in clinical trials and earn rewards
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {!account ? (
            <button
              onClick={connect}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Connect Wallet
              <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
            </button>
          ) : (
            <div className="inline-flex items-center px-6 py-3 border border-gray-200 rounded-md bg-white text-sm font-medium text-gray-900">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          )}
          
          <button
            onClick={() => switchNetwork(CELO_ALFAJORES_NETWORK.chainId)}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 rounded-md bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Switch to Celo Alfajores Testnet
          </button>
        </div>

        {account && (
          <div className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary/10">
            Ready to participate in clinical trials
          </div>
        )}
      </div>
    </div>
  )
}

