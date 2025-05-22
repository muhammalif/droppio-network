import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Award, Gift, Users, Wallet } from "lucide-react"
import FeatureCard from "@/components/feature-card"
import HeroSection from "@/components/hero-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />

        <section className="py-12 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Support your favorite content creators with blockchain-powered tipping and earn exclusive badges
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
              <FeatureCard
                icon={<Wallet className="h-10 w-10 text-primary" />}
                title="Connect Wallet"
                description="Connect your wallet to start tipping creators and earning badges based on your contributions."
              />
              <FeatureCard
                icon={<Gift className="h-10 w-10 text-primary" />}
                title="Tip Creators"
                description="Send $IDRX tokens to your favorite creators as a way to show appreciation for their content."
              />
              <FeatureCard
                icon={<Award className="h-10 w-10 text-primary" />}
                title="Earn Badges"
                description="Receive exclusive Soulbound Tokens (SBTs) as badges based on your contribution levels."
              />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join as a Creator</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Register as a creator to receive tips and build your community on the blockchain
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button className="gap-1">
                    Register Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/creators">
                  <Button variant="outline">Browse Creators</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Leaderboard</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Check out our top droppers and creators
                </p>
              </div>
              <Link href="/leaderboard">
                <Button variant="outline" className="gap-1">
                  View Leaderboard <Users className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">© 2025 Droppio. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
