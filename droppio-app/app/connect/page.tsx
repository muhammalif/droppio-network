"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useXellarKit } from "@/lib/xellar-hooks"

export default function ConnectWallet() {
  const { connect, isConnected, isConnecting, address } = useXellarKit()
  const router = useRouter()

  useEffect(() => {
    // If already connected, redirect to dashboard
    if (isConnected && address) {
      router.push("/dashboard")
    }
  }, [isConnected, address, router])

  const handleConnect = async () => {
    try {
      await connect()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[80vh] px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
          <CardDescription>Connect your wallet to start using Droppio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              <Wallet className="h-5 w-5" />
              {isConnecting ? "Connecting..." : "Connect with Xellar Kit"}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>By connecting your wallet, you agree to our</p>
            <p>
              <a href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </a>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              New to Web3?{" "}
              <a href="/learn" className="text-primary underline underline-offset-4 hover:text-primary/80">
                Learn how to create a wallet
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
