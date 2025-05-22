"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useXellarKit } from "@/lib/xellar-hooks"
import { Gift } from "lucide-react"

// Dummy data for creators
const creators = [
  {
    id: "1",
    name: "John Doe",
    address: "0x1234...5678",
    bio: "Web3 enthusiast and content creator. Building the future of decentralized content.",
    isCreator: true,
    balance: "1000",
    totalTipped: "1500000",
    eligibilityLevel: "gold",
    socialAccounts: [
      { platform: "twitter", username: "johndoe", verified: true },
      { platform: "youtube", username: "johndoe", verified: true },
    ],
    recentContent: [
      { title: "Getting Started with Web3", views: 1200, likes: 150 },
      { title: "Understanding Smart Contracts", views: 800, likes: 90 },
    ]
  },
  {
    id: "2",
    name: "Jane Smith",
    address: "0x2345...6789",
    bio: "Crypto trader and NFT collector. Sharing insights about the crypto market.",
    isCreator: true,
    balance: "2000",
    totalTipped: "800000",
    eligibilityLevel: "silver",
    socialAccounts: [
      { platform: "twitter", username: "janesmith", verified: true },
      { platform: "tiktok", username: "janesmith", verified: true },
    ],
    recentContent: [
      { title: "Market Analysis: Week 1", views: 2500, likes: 300 },
      { title: "NFT Trends 2024", views: 1800, likes: 200 },
    ]
  },
  {
    id: "3",
    name: "Bob Wilson",
    address: "0x3456...7890",
    bio: "Blockchain developer and educator. Teaching the next generation of Web3 builders.",
    isCreator: true,
    balance: "1500",
    totalTipped: "300000",
    eligibilityLevel: "bronze",
    socialAccounts: [
      { platform: "twitter", username: "bobwilson", verified: true },
      { platform: "youtube", username: "bobwilson", verified: false },
    ],
    recentContent: [
      { title: "Solidity Basics", views: 900, likes: 120 },
      { title: "DeFi Explained", views: 600, likes: 80 },
    ]
  }
]

export default function CreatorsPage() {
  const [selectedCreator, setSelectedCreator] = useState<any>(null)
  const [tipAmount, setTipAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { address } = useXellarKit()
  const { toast } = useToast()

  const handleTip = async () => {
    if (!selectedCreator || !tipAmount || !address) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/creator/tip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorId: selectedCreator.id,
          amount: tipAmount,
          message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send tip")
      }

      toast({
        title: "Success",
        description: `Tip sent successfully to ${selectedCreator.name}!`,
      })

      // Reset form
      setTipAmount("")
      setMessage("")
      setSelectedCreator(null)
    } catch (error: any) {
      console.error("Error sending tip:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to send tip. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Featured Creators</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {creators.map((creator) => (
          <Card key={creator.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://avatar.vercel.sh/${creator.address}.png`} />
                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle>{creator.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{creator.address}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">{creator.bio}</p>
                
                <div className="flex flex-wrap gap-2">
                  {creator.socialAccounts.map((account) => (
                    <Badge key={account.platform} variant="outline">
                      {account.platform} {account.verified && "✓"}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Recent Content</h4>
                  {creator.recentContent.map((content, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium">{content.title}</p>
                      <p className="text-muted-foreground">
                        {content.views} views • {content.likes} likes
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Tipped</p>
                    <p className="font-medium">{creator.totalTipped} IDRX</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Level</p>
                    <p className="font-medium capitalize">{creator.eligibilityLevel}</p>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full"
                      onClick={() => setSelectedCreator(creator)}
                    >
                      Support Creator
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Support {creator.name}</DialogTitle>
                      <DialogDescription>
                        Send a tip to support {creator.name}'s work
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Amount (IDRX)</label>
                        <Input
                          type="number"
                          placeholder="10000"
                          value={tipAmount}
                          onChange={(e) => setTipAmount(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Message (optional)</label>
                        <Textarea
                          placeholder="Add a message to your tip..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        className="w-full gap-2" 
                        onClick={handleTip} 
                        disabled={!tipAmount || isSubmitting}
                      >
                        <Gift className="h-4 w-4" />
                        {isSubmitting ? "Sending..." : "Send Tip"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
