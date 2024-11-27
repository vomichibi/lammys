'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/src/firebase/config'
import { formatDate } from '@/lib/utils/date'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const router = useRouter()
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, 'orders')
        const q = query(ordersRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        setOrders(ordersData)
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
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
              <OrdersTable orders={orders.filter(order => order.status !== 'Completed')} />
            </TabsContent>
            <TabsContent value="completed" className="mt-6">
              <OrdersTable orders={orders.filter(order => order.status === 'Completed')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
