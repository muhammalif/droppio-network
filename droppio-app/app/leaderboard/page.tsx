"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, TrendingUp, Users } from "lucide-react"

// Dummy data for leaderboard
const leaderboardData = {
  creators: [
    {
      id: "1",
      name: "John Doe",
      address: "0x1234...5678",
      totalTipped: "5000000",
      followers: 12000,
      contentCount: 45,
      rank: 1,
      change: "+2"
    },
    {
      id: "2",
      name: "Jane Smith",
      address: "0x2345...6789",
      totalTipped: "4500000",
      followers: 10000,
      contentCount: 38,
      rank: 2,
      change: "-1"
    },
    {
      id: "3",
      name: "Bob Wilson",
      address: "0x3456...7890",
      totalTipped: "3000000",
      followers: 8000,
      contentCount: 30,
      rank: 3,
      change: "+5"
    },
    {
      id: "4",
      name: "Alice Brown",
      address: "0x4567...8901",
      totalTipped: "1500000",
      followers: 6000,
      contentCount: 25,
      rank: 4,
      change: "new"
    },
    {
      id: "5",
      name: "Charlie Davis",
      address: "0x5678...9012",
      totalTipped: "500000",
      followers: 5000,
      contentCount: 20,
      rank: 5,
      change: "-2"
    }
  ],
  supporters: [
    {
      id: "1",
      name: "Mike Johnson",
      address: "0x6789...0123",
      totalTipped: "3000000",
      supportedCreators: 15,
      rank: 1,
      change: "+1"
    },
    {
      id: "2",
      name: "Sarah Williams",
      address: "0x7890...1234",
      totalTipped: "800000",
      supportedCreators: 12,
      rank: 2,
      change: "-1"
    },
    {
      id: "3",
      name: "David Lee",
      address: "0x8901...2345",
      totalTipped: "500000",
      supportedCreators: 10,
      rank: 3,
      change: "+3"
    },
    {
      id: "4",
      name: "Emma Taylor",
      address: "0x9012...3456",
      totalTipped: "100000",
      supportedCreators: 8,
      rank: 4,
      change: "new"
    },
    {
      id: "5",
      name: "James Wilson",
      address: "0x0123...4567",
      totalTipped: "50000",
      supportedCreators: 5,
      rank: 5,
      change: "-2"
    }
  ]
}

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Leaderboard</h1>
      
      <Tabs defaultValue="creators" className="space-y-6">
        <TabsList>
          <TabsTrigger value="creators" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Top Creators
          </TabsTrigger>
          <TabsTrigger value="supporters" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Top Supporters
          </TabsTrigger>
        </TabsList>

        <TabsContent value="creators">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Top Creators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardData.creators.map((creator) => (
                  <div key={creator.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={`https://avatar.vercel.sh/${creator.address}.png`} />
                          <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          {creator.rank}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{creator.name}</p>
                        <p className="text-sm text-muted-foreground">{creator.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-medium">{creator.totalTipped} IDRX</p>
                        <p className="text-sm text-muted-foreground">
                          {creator.followers.toLocaleString()} followers
                        </p>
                      </div>
                      <Badge variant={creator.change === "new" ? "default" : creator.change.startsWith("+") ? "secondary" : "destructive"}>
                        {creator.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supporters">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Top Supporters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardData.supporters.map((supporter) => (
                  <div key={supporter.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={`https://avatar.vercel.sh/${supporter.address}.png`} />
                          <AvatarFallback>{supporter.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          {supporter.rank}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{supporter.name}</p>
                        <p className="text-sm text-muted-foreground">{supporter.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-medium">{supporter.totalTipped} IDRX</p>
                        <p className="text-sm text-muted-foreground">
                          {supporter.supportedCreators} creators
                        </p>
                      </div>
                      <Badge variant={supporter.change === "new" ? "default" : supporter.change.startsWith("+") ? "secondary" : "destructive"}>
                        {supporter.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
