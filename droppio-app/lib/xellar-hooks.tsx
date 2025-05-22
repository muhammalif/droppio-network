"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import { XellarKitProvider as XellarKitProviderBase, useXellarAccount } from "@xellar/kit"

// Create a context for Xellar Kit
interface XellarKitContextType {
  connect: () => Promise<void>
  disconnect: () => void
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  balance: string | null
}

const XellarKitContext = createContext<XellarKitContextType | undefined>(undefined)

// Provider component
export function XellarKitProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [balance, setBalance] = useState<string | null>(null)
  const xellarAccount = useXellarAccount()

  useEffect(() => {
    if (xellarAccount) {
      const primaryAddress = xellarAccount.address[0]?.address
      setAddress(primaryAddress || null)
      setIsConnected(!!primaryAddress)
    } else {
      setAddress(null)
      setIsConnected(false)
    }
  }, [xellarAccount])

  const connect = async () => {
    setIsConnecting(true)
    try {
      // The actual connection is handled by XellarKitProviderBase
      // We just need to wait for the account to be available
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
    setBalance(null)
  }

  return (
    <XellarKitProviderBase>
      <XellarKitContext.Provider
        value={{
          connect,
          disconnect,
          address,
          isConnected,
          isConnecting,
          balance,
        }}
      >
        {children}
      </XellarKitContext.Provider>
    </XellarKitProviderBase>
  )
}

// Hook to use Xellar Kit
export function useXellarKit() {
  const context = useContext(XellarKitContext)
  if (context === undefined) {
    throw new Error("useXellarKit must be used within a XellarKitProvider")
  }
  return context
}

export function getXellarProvider() {
  if (typeof window !== "undefined" && (window as any).xellarProvider) {
    return (window as any).xellarProvider;
  }
  if (typeof window !== "undefined" && window.ethereum) {
    return window.ethereum;
  }
  return undefined;
}
