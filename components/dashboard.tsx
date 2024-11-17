'use client'

import { useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { CalendarIcon, CogIcon, LineChartIcon, PackageIcon, SearchIcon, UsersIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data
const upcomingBookings = [
  { id: 1, customer: 'John Doe', service: 'Dry Cleaning', date: '2024-03-15' },
  { id: 2, customer: 'Jane Smith', service: 'Alteration', date: '2024-03-16' },
  { id: 3, customer: 'Bob Johnson', service: 'Laundry', date: '2024-03-17' },
]

const monthlySales = {
  current: 15000,
  previous: 12000,
  percentageChange: 25
}

const customers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '345-678-9012' },
]

const orders = [
  { id: 1, customer: 'John Doe', service: 'Dry Cleaning', status: 'In Progress', items: 3 },
  { id: 2, customer: 'Jane Smith', service: 'Alteration', status: 'Ready for Pickup', items: 1 },
  { id: 3, customer: 'Bob Johnson', service: 'Laundry', status: 'Received', items: 5 },
]

const salesData = [
  { name: 'Jan', total: 1500 },
  { name: 'Feb', total: 2300 },
  { name: 'Mar', total: 3200 },
  { name: 'Apr', total: 4000 },
  { name: 'May', total: 3800 },
  { name: 'Jun', total: 4300 },
]

const initialServices = [
  { id: 1, name: 'Dry Cleaning', price: 15 },
  { id: 2, name: 'Laundry', price: 10 },
  { id: 3, name: 'Alteration', price: 20 },
]

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [services, setServices] = useState(initialServices)
  const [newService, setNewService] = useState({ name: '', price: '' })
  const [editingService, setEditingService] = useState(null)

  const handleAddService = () => {
    if (newService.name && newService.price) {
      setServices([...services, { id: services.length + 1, ...newService }])
      setNewService({ name: '', price: '' })
    }
  }

  const handleUpdateService = (id, updatedPrice) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, price: parseFloat(updatedPrice) } : service
    ))
    setEditingService(null)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Dry Cleaning Admin</h1>
        </div>
        <nav className="mt-4">
          <Button
            variant={activeTab === 'overview' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('overview')}
          >
            <LineChartIcon className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button
            variant={activeTab === 'customers' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('customers')}
          >
            <UsersIcon className="mr-2 h-4 w-4" />
            Customers
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('orders')}
          >
            <PackageIcon className="mr-2 h-4 w-4" />
            Orders
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('analytics')}
          >
            <LineChartIcon className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('settings')}
          >
            <CogIcon className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Overview</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${monthlySales.current}</div>
                  <p className="text-xs text-muted-foreground">
                    +{monthlySales.percentageChange}% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Upcoming Bookings
                  </CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingBookings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    For the next 7 days
                  </p>
                </CardContent>
              </Card>
              {/* Add more summary cards as needed */}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.customer}</TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Customer Management</h2>
            <div className="flex justify-between items-center">
              <div className="relative">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search customers" className="pl-8" />
              </div>
              <Button>Add Customer</Button>
            </div>
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                          <Button variant="destructive" size="sm">Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Order Management</h2>
            <div className="flex justify-between items-center">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="ready">Ready for Pickup</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <Button>Create Order</Button>
            </div>
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.service}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="mr-2">Update Status</Button>
                          <Button variant="outline" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Analytics & Reports</h2>
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    total: {
                      label: "Total Sales",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={salesData}>
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
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            {/* Add more analytics components here */}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Settings & Customization</h2>
            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add form for updating business hours */}
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="openTime">Opening Time</Label>
                    <Input id="openTime" type="time" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="closeTime">Closing Time</Label>
                    <Input id="closeTime" type="time" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Service Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="serviceName">Service Name</Label>
                      <Input 
                        id="serviceName" 
                        placeholder="Enter service name" 
                        value={newService.name}
                        onChange={(e) => setNewService({...newService, name: e.target.value})}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="servicePrice">Price</Label>
                      <Input 
                        id="servicePrice" 
                        type="number" 
                        placeholder="Enter price" 
                        value={newService.price}
                        onChange={(e) => setNewService({...newService, price: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleAddService}>Add Service</Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell>{service.name}</TableCell>
                          <TableCell>
                            {editingService === service.id ? (
                              <Input 
                                type="number" 
                                value={service.price} 
                                onChange={(e) => handleUpdateService(service.id, e.target.value)}
                                onBlur={() => setEditingService(null)}
                                autoFocus
                              />
                            ) : (
                              `$${service.price}`
                            )}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditingService(service.id)}
                            >
                              Edit Price
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}