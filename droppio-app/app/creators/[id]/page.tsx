"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, Twitter, Youtube, ExternalLink } from "lucide-react"
import Link from "next/link"
import BadgeInfo from "@/components/badge-info"

// Mock data - would be fetched from blockchain in real implementation
const mockCreator = {
  id: "1",
  name: "Alex Johnson",
  address: "0xabcd...1234",
  bio: "Digital artist and NFT creator specializing in abstract digital art and blockchain-based collectibles. Supporting independent artists in the Web3 space.",
  social: {
    twitter: "alexjohnson",
    youtube: "alexjohnsonart",
  },
  totalReceived: "1,250,000 IDRX",
}

export default function CreatorPage({ params }: { params: { id: string } }) {
  const [tipAmount, setTipAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTip = async () => {
    if (!tipAmount) return

    setIsSubmitting(true)

    try {
      // This is a placeholder for actual blockchain interaction
      // In a real implementation, you would use a library like ethers.js or web3.js
      // to interact with the smart contract

      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Reset form after successful tip
      setTipAmount("")
      setMessage("")
      alert("Tip sent successfully!")
    } catch (err) {
      console.error(err)
      alert("Failed to send tip. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="h-48 rounded-t-xl bg-gradient-to-r from-purple-500 to-indigo-600"></div>
          <div className="bg-card rounded-b-xl border border-t-0 p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex justify-center md:justify-start -mt-16 md:-mt-20">
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-background bg-muted flex items-center justify-center">
                  <span className="text-3xl font-bold">{mockCreator.name.charAt(0)}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">{mockCreator.name}</h1>
                    <p className="text-sm text-muted-foreground">{mockCreator.address}</p>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    {mockCreator.social.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`https://twitter.com/${mockCreator.social.twitter}`} target="_blank">
                          <Twitter className="h-4 w-4 mr-1" />
                          Twitter
                        </Link>
                      </Button>
                    )}
                    {mockCreator.social.youtube && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`https://youtube.com/@${mockCreator.social.youtube}`} target="_blank">
                          <Youtube className="h-4 w-4 mr-1" />
                          YouTube
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{mockCreator.bio}</p>
                <div className="text-sm">
                  <span className="text-muted-foreground">Total Received:</span>
                  <span className="font-medium ml-1">{mockCreator.totalReceived}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Latest Content</CardTitle>
                    <CardDescription>Recent content from {mockCreator.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Twitter className="h-4 w-4 text-sky-500" />
                          <span className="text-sm font-medium">Latest Tweet</span>
                        </div>
                        <p className="text-sm mb-2">
                          Just released my new NFT collection! Check it out and let me know what you think. #NFT
                          #DigitalArt #Web3
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`https://twitter.com/${mockCreator.social.twitter}`} target="_blank">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View on Twitter
                          </Link>
                        </Button>
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Youtube className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium">Latest Video</span>
                        </div>
                        <div className="aspect-video bg-muted rounded-md mb-2 flex items-center justify-center">
                          <Youtube className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium mb-1">How I Create Digital Art for Web3</p>
                        <p className="text-xs text-muted-foreground mb-2">Published 3 days ago • 15K views</p>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`https://youtube.com/@${mockCreator.social.youtube}`} target="_blank">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Watch on YouTube
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {mockCreator.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>{mockCreator.bio}</p>
                      <p>
                        I've been creating digital art for over 5 years and recently transitioned into the Web3 space.
                        My work focuses on abstract representations of blockchain technology and the future of digital
                        ownership.
                      </p>
                      <p>
                        Your support helps me continue creating independent art and educational content about NFTs and
                        digital art. Thank you for being part of this journey!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Send a Tip</CardTitle>
                <CardDescription>Support {mockCreator.name} with $IDRX tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
              </CardContent>
              <CardFooter>
                <Button className="w-full gap-2" onClick={handleTip} disabled={!tipAmount || isSubmitting}>
                  <Gift className="h-4 w-4" />
                  {isSubmitting ? "Sending..." : "Send Tip"}
                </Button>
              </CardFooter>
            </Card>

            <BadgeInfo />
          </div>
        </div>
      </div>
    </div>
  )
}
