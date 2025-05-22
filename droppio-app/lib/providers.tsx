"use client"

import { WagmiProvider, createConfig, http } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { XellarKitProvider } from "./xellar-hooks"
import { defaultConfig } from "@xellar/kit"

// Define Lisk Sepolia chain
const liskSepolia = {
  id: 4202,
  name: 'Lisk Sepolia',
  network: 'lisk-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia-api.lisk.com'] },
    public: { http: ['https://rpc.sepolia-api.lisk.com'] },
  },
  blockExplorers: {
    default: { name: 'Lisk Sepolia Explorer', url: 'https://sepolia-blockscout.lisk.com' },
  },
  testnet: true,
} as const

const config = defaultConfig({
  appName: "Droppio",
  appDescription: "Web3 Tipping Platform",
//   appUrl: "https://droppio.xyz",
  chains: [liskSepolia],
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "demo",
  xellarAppId: process.env.NEXT_PUBLIC_XELLAR_APP_ID,
  xellarEnv: "sandbox",
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider>{children}</XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
} 