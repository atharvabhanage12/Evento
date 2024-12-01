'use client'

import { useAuthStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, User } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  const { isLoggedIn, login, logout } = useAuthStore()

  const handleLoginClick = () => {
    if (isLoggedIn) {
      logout()
    } else {
      login()
    }
  }

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-primary">Evento</h1>
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Button variant="ghost" asChild><Link href="/">Home</Link></Button>
          <Button variant="ghost">Events</Button>
          <Button variant="ghost">About</Button>
          <Button variant="ghost">Contact</Button>
        </nav>
        <div className="flex items-center space-x-4">
          {isLoggedIn && (
            <Button variant="ghost" asChild>
              <Link href="/profile">
                <User className="h-5 w-5 mr-2" />
                Profile
              </Link>
            </Button>
          )}
          <Button onClick={handleLoginClick} variant="outline">
            {isLoggedIn ? 'Log Out' : 'Log In'}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col space-y-4 mt-8">
                <Button variant="ghost" asChild><Link href="/">Home</Link></Button>
                <Button variant="ghost">Events</Button>
                <Button variant="ghost">About</Button>
                <Button variant="ghost">Contact</Button>
                {isLoggedIn && (
                  <Button variant="ghost" asChild>
                    <Link href="/profile">Profile</Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

