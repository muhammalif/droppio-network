"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Award, Gift, User, Settings } from "lucide-react"
import Link from "next/link"
import BadgeInfo from "@/components/badge-info"
import { useXellarKit } from "@/lib/xellar-hooks"
import { useSearchParams } from "next/navigation"
import { getUserByAddress } from "@/lib/actions/user-actions"
import { checkBadgeEligibility, mintBadge } from "@/lib/actions/badge-actions"
import { registerAsCreator } from "@/lib/actions/user-actions"
import { useToast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const { address, disconnect } = useXellarKit()
  const [userData, setUserData] = useState<any>(null)
  const [badgeData, setBadgeData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam || "overview")
  const { toast } = useToast()

  useEffect(() => {
    // Load user data when address is available
    const loadUserData = async () => {
      if (!address) return
      console.log("[Dashboard] Start loading user data");
      try {
        setIsLoading(true)
        const user = await getUserByAddress(address)
        console.log("[Dashboard] User loaded", user);

        if (user) {
          setUserData(user)

          // Check badge eligibility
          const eligibility = await checkBadgeEligibility(user.id)
          console.log("[Dashboard] Eligibility loaded", eligibility);
          setBadgeData(eligibility)
        } else {
          // Fallback log if user not found
          console.warn("[Dashboard] No user found for address", address);
        }
      } catch (error) {
        console.error("[Dashboard] Error loading user data:", error)
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
        console.log("[Dashboard] Loading finished. userData:", userData);
      }
    }

    loadUserData()
  }, [address, toast])

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  useEffect(() => {
    if (!address) {
      setIsLoading(false);
    }
  }, [address]);

  const handleRegisterAsCreator = async () => {
    if (!userData) return

    try {
      setIsProcessing(true)
      await registerAsCreator(userData.id)

      // Reload user data
      const updatedUser = await getUserByAddress(address!)
      setUserData(updatedUser)

      toast({
        title: "Success",
        description: "You are now registered as a creator!",
      })
    } catch (error) {
      console.error("Error registering as creator:", error)
      toast({
        title: "Error",
        description: "Failed to register as creator. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMintBadge = async (level: string) => {
    if (!userData) return

    try {
      setIsProcessing(true)
      await mintBadge({
        userId: userData.id,
        level,
      })

      // Reload user data
      const updatedUser = await getUserByAddress(address!)
      setUserData(updatedUser)

      // Update badge eligibility
      const eligibility = await checkBadgeEligibility(userData.id)
      setBadgeData(eligibility)

      toast({
        title: "Success",
        description: `You have successfully minted the ${level} badge!`,
      })
    } catch (error) {
      console.error("Error minting badge:", error)
      toast({
        title: "Error",
        description: "Failed to mint badge. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isLoading && address && !userData) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <p className="text-muted-foreground mb-6">No user data found for this wallet. Please register or try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {userData?.name ? `Welcome, ${userData.name}` : "Manage your Droppio account and activities"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData?.balance || "0 IDRX"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tipped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData?.totalTipped || "0 IDRX"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Badge Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize flex items-center gap-2">
              {userData?.eligibilityLevel === "none" || !userData?.eligibilityLevel ? (
                "None"
              ) : (
                <>
                  {userData?.eligibilityLevel}
                  <Award className="h-5 w-5 text-yellow-500" />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-[500px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="creators">Creators</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>Your current account type and options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Account Type:</span>
                  <Badge variant={userData?.isCreator ? "default" : "outline"}>
                    {userData?.isCreator ? "Creator" : "Dropper"}
                  </Badge>
                </div>
                {!userData?.isCreator && (
                  <Button onClick={handleRegisterAsCreator} className="w-full" disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Register as Creator (250,000 IDRX)"}
                  </Button>
                )}
                {userData?.isCreator && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Tips Received:</span>
                      <span>125,000 IDRX</span>
                    </div>
                    <Button className="w-full">Withdraw Tips</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common actions you can take</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/creators">
                  <Button variant="outline" className="w-full justify-start">
                    <Gift className="mr-2 h-4 w-4" />
                    Tip a Creator
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    View Leaderboard
                  </Button>
                </Link>
                {userData?.isCreator && (
                  <Link href="/dashboard/settings">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Creator Profile
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="badges" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Badges</CardTitle>
                  <CardDescription>Badges you've earned by supporting creators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <BadgeCard
                      level="bronze"
                      owned={userData?.badges?.some((b: any) => b.level === "bronze") || false}
                      eligible={badgeData?.eligibleBadges?.includes("bronze") || false}
                      onMint={() => handleMintBadge("bronze")}
                      requiredAmount="100,000"
                      isProcessing={isProcessing}
                    />
                    <BadgeCard
                      level="silver"
                      owned={userData?.badges?.some((b: any) => b.level === "silver") || false}
                      eligible={badgeData?.eligibleBadges?.includes("silver") || false}
                      onMint={() => handleMintBadge("silver")}
                      requiredAmount="500,000"
                      isProcessing={isProcessing}
                    />
                    <BadgeCard
                      level="gold"
                      owned={userData?.badges?.some((b: any) => b.level === "gold") || false}
                      eligible={badgeData?.eligibleBadges?.includes("gold") || false}
                      onMint={() => handleMintBadge("gold")}
                      requiredAmount="1,000,000"
                      isProcessing={isProcessing}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-1">
              <BadgeInfo />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="creators" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Creators You Support</CardTitle>
              <CardDescription>Content creators you've tipped</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">You haven't tipped any creators yet.</p>
                <Link href="/creators">
                  <Button className="mt-4">Browse Creators</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/dashboard/settings?tab=profile" className="block">
                  <Card className="h-full hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg">Profile Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Update your creator profile information, including your name, bio, and profile picture.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/settings?tab=social" className="block">
                  <Card className="h-full hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg">Social Media</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Connect and verify your social media accounts to showcase your content.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/settings?tab=account" className="block">
                  <Card className="h-full hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg">Account Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        View your account details, including your wallet address and registration date.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/notifications" className="block">
                  <Card className="h-full hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg">Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Manage your notification preferences and view your notification history.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface BadgeCardProps {
  level: string
  owned: boolean
  eligible: boolean
  onMint: () => void
  requiredAmount: string
  isProcessing: boolean
}

function BadgeCard({ level, owned, eligible, onMint, requiredAmount, isProcessing }: BadgeCardProps) {
  const colors = {
    bronze: "bg-amber-500",
    silver: "bg-slate-400",
    gold: "bg-yellow-500",
  }

  const bgColor = colors[level as keyof typeof colors] || "bg-gray-200"

  return (
    <Card className="overflow-hidden">
      <div className={`h-40 flex items-center justify-center ${bgColor}`}>
        <Award className="h-20 w-20 text-white" />
      </div>
      <CardContent className="pt-6">
        <h3 className="text-lg font-bold capitalize mb-2">{level} Badge</h3>
        {owned ? (
          <Badge className="mb-2">Owned</Badge>
        ) : eligible ? (
          <Button onClick={onMint} className="w-full" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Mint Badge"}
          </Button>
        ) : (
          <div className="text-sm text-muted-foreground">
            <p>Not eligible yet</p>
            <p className="mt-1">Need to tip {requiredAmount} IDRX</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
