'use client'

import { useState } from 'react'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { 
  CalendarIcon, 
  CogIcon, 
  LineChartIcon, 
  PackageIcon, 
  SearchIcon, 
  UsersIcon, 
  LogOutIcon, 
  DollarSignIcon,
  LayoutDashboardIcon,
  ClipboardListIcon,
  SettingsIcon,
  BellIcon
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

// Mock data for the dashboard
const revenueData = [
  { name: 'Jan', total: 1200 },
  { name: 'Feb', total: 1800 },
  { name: 'Mar', total: 2200 },
  { name: 'Apr', total: 2600 },
  { name: 'May', total: 2400 },
  { name: 'Jun', total: 2800 },
]

const recentOrders = [
  { id: '1', customer: 'John Doe', service: 'Dry Cleaning', status: 'In Progress', total: '$45.00' },
  { id: '2', customer: 'Jane Smith', service: 'Laundry', status: 'Completed', total: '$32.00' },
  { id: '3', customer: 'Mike Johnson', service: 'Alterations', status: 'Pending', total: '$28.00' },
]

const sidebarLinks = [
  { name: 'Dashboard', icon: LayoutDashboardIcon, href: '/admindash/dashboard' },
  { name: 'Orders', icon: ClipboardListIcon, href: '/admindash/orders' },
  { name: 'Customers', icon: UsersIcon, href: '/admindash/customers' },
  { name: 'Settings', icon: SettingsIcon, href: '/admindash/settings' },
]

export default function Dashboard() {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
                  <AvatarImage src={session?.user?.image || ''} />
                  <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{session?.user?.name}</p>
                <Button 
                  variant="ghost" 
                  onClick={() => signOut({ callbackUrl: '/login' })}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
          <button
            type="button"
            className="md:hidden px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    className="pl-10"
                    placeholder="Search orders, customers..."
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$13,045</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+48</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                <PackageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">124</div>
                <p className="text-xs text-muted-foreground">+8 since yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">+201 this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Tables Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
            {/* Revenue Chart */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Revenue']}
                        labelStyle={{ color: '#888888' }}
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ fill: '#2563eb' }}
                        activeDot={{ r: 6, fill: '#2563eb' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{order.customer[0]}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.service}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="ml-4 font-medium">
                        {order.total}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}