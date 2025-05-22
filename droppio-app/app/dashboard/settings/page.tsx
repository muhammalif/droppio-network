"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check, Twitter, Youtube, TwitterIcon as TikTok } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useXellarKit } from "@/lib/xellar-hooks"
import { useSearchParams } from "next/navigation"

// Dummy user data
const dummyUser = {
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
}

export default function SettingsPage() {
  const { address } = useXellarKit()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam || "profile")

  const [profileData, setProfileData] = useState({
    name: dummyUser.name,
    bio: dummyUser.bio,
    twitter: dummyUser.socialAccounts.find(s => s.platform === "twitter")?.username || "",
    youtube: dummyUser.socialAccounts.find(s => s.platform === "youtube")?.username || "",
    tiktok: "",
  })

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Show success message
      setSuccess(true)
      toast({
        title: "Profile updated",
        description: "Your creator profile has been successfully updated.",
      })
    } catch (err) {
      setError("Failed to update profile. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Show success message
      setSuccess(true)
      toast({
        title: "Social accounts updated",
        description: "Your social media accounts have been successfully updated.",
      })
    } catch (err) {
      setError("Failed to update social accounts. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifySocial = async (platform: string) => {
    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast({
        title: "Verification successful",
        description: `Your ${platform} account has been verified.`,
      })
    } catch (error) {
      console.error(`Error verifying ${platform} account:`, error)
      toast({
        title: "Verification failed",
        description: `Failed to verify your ${platform} account. Please try again.`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your creator profile and account settings</p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Creator Profile</CardTitle>
                <CardDescription>Update your creator profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Your profile has been updated successfully.</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details and wallet information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Wallet Address</label>
                <Input value={address || dummyUser.address} readOnly />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Account Type</label>
                <Input value={dummyUser.isCreator ? "Creator" : "Dropper"} readOnly />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Total Tipped</label>
                <Input value={`${dummyUser.totalTipped} IDRX`} readOnly />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Badge Level</label>
                <Input value={dummyUser.eligibilityLevel} readOnly />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <Card>
            <form onSubmit={handleSocialSubmit}>
              <CardHeader>
                <CardTitle>Social Media Accounts</CardTitle>
                <CardDescription>Connect and verify your social media accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Your social accounts have been updated successfully.</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Twitter Username</label>
                  <div className="flex gap-2">
                    <Input
                      name="twitter"
                      value={profileData.twitter}
                      onChange={handleChange}
                      placeholder="@username"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleVerifySocial("Twitter")}
                    >
                      <Twitter className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">YouTube Channel</label>
                  <div className="flex gap-2">
                    <Input
                      name="youtube"
                      value={profileData.youtube}
                      onChange={handleChange}
                      placeholder="Channel name"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleVerifySocial("YouTube")}
                    >
                      <Youtube className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">TikTok Username</label>
                  <div className="flex gap-2">
                    <Input
                      name="tiktok"
                      value={profileData.tiktok}
                      onChange={handleChange}
                      placeholder="@username"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleVerifySocial("TikTok")}
                    >
                      <TikTok className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
