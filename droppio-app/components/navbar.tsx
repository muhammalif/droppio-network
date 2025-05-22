import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gift } from "lucide-react"
import MobileNav from "@/components/mobile-nav"
import NotificationsDropdown from "@/components/notifications-dropdown"
import { WalletButton } from "@/components/wallet-button"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Droppio</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
            Home
          </Link>
          <Link href="/creators" className="text-sm font-medium hover:underline underline-offset-4">
            Creators
          </Link>
          <Link href="/leaderboard" className="text-sm font-medium hover:underline underline-offset-4">
            Leaderboard
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <NotificationsDropdown />
          <div className="hidden md:block">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
          <div className="hidden md:block">
            <WalletButton />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
