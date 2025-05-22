import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Gift, Shield, Wallet } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">About Droppio</h1>
          <p className="text-xl text-muted-foreground">
            A Web3 platform for supporting content creators through blockchain technology
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              Droppio aims to revolutionize how content creators are supported by leveraging blockchain technology to
              create a transparent, secure, and rewarding ecosystem for both creators and their supporters.
            </p>
            <p className="text-muted-foreground">
              We believe that content creators deserve to be fairly compensated for their work, and that fans should
              have meaningful ways to show their appreciation. By using blockchain technology, we can create a direct
              connection between creators and their audience, without intermediaries taking large cuts of the revenue.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <Wallet className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-lg">Connect Wallet</CardTitle>
                  <CardDescription>Connect your wallet to get started</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Droppio uses your blockchain wallet for secure authentication and transactions. Simply connect your
                    wallet to access all features.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Gift className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-lg">Tip Creators</CardTitle>
                  <CardDescription>Send $IDRX tokens directly to creators</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Use $IDRX tokens to tip your favorite content creators. 100% of your tip goes directly to the
                    creator, with no middlemen taking a cut.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Award className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-lg">Earn Badges</CardTitle>
                  <CardDescription>Receive exclusive Soulbound Tokens as badges</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    As you support creators, you'll earn exclusive Soulbound Tokens (SBTs) that showcase your
                    contribution level. These non-transferable badges are yours forever.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Shield className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-lg">Verified Creators</CardTitle>
                  <CardDescription>Creators verify their social media accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    All creators on Droppio verify their social media accounts, ensuring that you're supporting the real
                    person behind the content you love.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              Have questions or suggestions? We'd love to hear from you! Reach out to us at{" "}
              <a href="mailto:contact@droppio.io" className="text-primary hover:underline">
                contact@droppio.io
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
