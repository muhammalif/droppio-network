"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Bell, Gift, Menu, Settings, User, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { WalletButton } from "@/components/wallet-button"

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    { href: "/", label: "Home", icon: <Gift className="h-5 w-5" /> },
    { href: "/creators", label: "Creators", icon: <User className="h-5 w-5" /> },
    { href: "/leaderboard", label: "Leaderboard", icon: <User className="h-5 w-5" /> },
    { href: "/about", label: "About", icon: <User className="h-5 w-5" /> },
    { href: "/dashboard", label: "Dashboard", icon: <User className="h-5 w-5" /> },
    { href: "/notifications", label: "Notifications", icon: <Bell className="h-5 w-5" /> },
    { href: "/dashboard/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col gap-6 px-2 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <Gift className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Droppio</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  pathname === route.href ? "bg-primary/10 text-primary" : "hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setOpen(false)}
              >
                {route.icon}
                <span className="font-medium">{route.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-4 px-3">
            <WalletButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
