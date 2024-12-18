'use client'

import { useWallet } from '@/components/Providers'

export default function Home() {
  const { account, connect, switchNetwork } = useWallet()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Welcome to Clinical Trials Platform</h1>
      {!account ? (
        <button
          onClick={connect}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <p className="mb-4">Connected: {account}</p>
      )}
      <button
        onClick={() => switchNetwork('0x1')} // Ethereum Mainnet
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Switch to Ethereum Mainnet
      </button>
    </div>
  )
}

