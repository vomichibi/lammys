'use client'

import { useState } from 'react'
import { 
  LayoutDashboardIcon,
  ClipboardListIcon,
  UsersIcon,
  SettingsIcon,
  BellIcon,
  SearchIcon
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from 'firebase/auth'
import { auth } from '@/src/firebase/config'; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const sidebarLinks = [
  {
    name: 'Dashboard',
    href: '/admindash/dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    name: 'Orders',
    href: '/admindash/orders',
    icon: ClipboardListIcon,
  },
  {
    name: 'Customers',
    href: '/admindash/customers',
    icon: UsersIcon,
  },
  {
    name: 'Settings',
    href: '/admindash/settings',
    icon: SettingsIcon,
  },
]

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-semibold">Lammy's Admin</h1>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {sidebarLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div>
                <Avatar>
                  <AvatarImage src={user?.photoURL || ''} />
                  <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.displayName}</p>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
