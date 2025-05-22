import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Support Creators with Blockchain Tipping
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Droppio is a Web3 platform that lets you support content creators with tips and earn exclusive badges
                through blockchain technology.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/connect">
                <Button size="lg" className="gap-1">
                  Get Started <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 p-2">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="space-y-2 text-center text-white">
                  <div className="mx-auto h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <path d="M12 2v20" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Blockchain Tipping</h3>
                  <p className="text-sm text-white/80">Tip creators with $IDRX tokens and earn exclusive badges</p>
                </div>
              </div>
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/50 blur-3xl"></div>
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/50 blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
