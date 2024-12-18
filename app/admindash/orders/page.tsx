'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from '@/lib/utils/date'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data - Replace with actual data fetching
const orders = {
  current: [
    { id: '1', customer: 'John Doe', service: 'Dry Cleaning', status: 'In Progress', date: '2024-01-15', total: '$45.00' },
    { id: '2', customer: 'Sarah Smith', service: 'Laundry', status: 'Processing', date: '2024-01-15', total: '$32.00' },
    { id: '3', customer: 'Mike Brown', service: 'Alterations', status: 'Pending', date: '2024-01-14', total: '$28.00' },
  ],
  completed: [
    { id: '4', customer: 'Emma Wilson', service: 'Dry Cleaning', status: 'Completed', date: '2024-01-13', total: '$55.00' },
    { id: '5', customer: 'James Miller', service: 'Laundry', status: 'Completed', date: '2024-01-12', total: '$42.00' },
    { id: '6', customer: 'Lisa Anderson', service: 'Alterations', status: 'Completed', date: '2024-01-11', total: '$35.00' },
  ]
}

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold'
    case 'in progress':
      return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold'
    case 'pending':
      return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold'
    default:
      return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold'
  }
}

const OrdersTable = ({ orders }: { orders: any[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Order ID</TableHead>
        <TableHead>Customer</TableHead>
        <TableHead>Service</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Total</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {orders.map((order) => (
        <TableRow key={order.id}>
          <TableCell className="font-medium">{order.id}</TableCell>
          <TableCell>{order.customer}</TableCell>
          <TableCell>{order.service}</TableCell>
          <TableCell>{formatDate(order.date)}</TableCell>
          <TableCell>
            <span className={getStatusStyle(order.status)}>
              {order.status}
            </span>
          </TableCell>
          <TableCell className="text-right">{order.total}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

export default function OrdersPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('current')

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Access Denied. Admin privileges required.</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="current">Current Orders</TabsTrigger>
              <TabsTrigger value="completed">Completed Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="current" className="mt-6">
              <OrdersTable orders={orders.current} />
            </TabsContent>
            <TabsContent value="completed" className="mt-6">
              <OrdersTable orders={orders.completed} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
