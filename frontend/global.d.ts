// global.d.ts
interface Ethereum {
    isMetaMask?: boolean
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
    on?: (eventName: string, callback: (...args: unknown[]) => void) => void
    removeAllListeners?: (eventName: string) => void
  }
  
  interface Window {
    ethereum?: Ethereum
  }
  