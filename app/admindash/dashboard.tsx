'use client'

import { useState, useEffect } from 'react'
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
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { auth, db } from '@/src/firebase/config'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://your-vps-ip:3001';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  recentOrders: any[];
  salesData: any[];
}

export default function Dashboard() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    recentOrders: [],
    salesData: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !isAdmin) return;

      try {
        // Fetch orders
        const ordersRef = collection(db, 'orders');
        const ordersQuery = query(ordersRef, orderBy('createdAt', 'desc'));
        const ordersSnapshot = await getDocs(ordersQuery);
        
        let totalOrders = 0;
        let totalRevenue = 0;
        const recentOrders: any[] = [];
        
        ordersSnapshot.forEach(doc => {
          const order = { id: doc.id, ...doc.data() };
          totalOrders++;
          totalRevenue += order.total || 0;
          if (recentOrders.length < 5) {
            recentOrders.push(order);
          }
        });

        // Fetch customers
        const customersRef = collection(db, 'users');
        const customersSnapshot = await getDocs(customersRef);
        const totalCustomers = customersSnapshot.size;

        // Generate mock sales data for the chart
        const salesData = generateSalesData();

        setStats({
          totalOrders,
          totalRevenue,
          totalCustomers,
          recentOrders,
          salesData
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isAdmin]);

  const generateSalesData = () => {
    const data = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        total: Math.floor(Math.random() * 5000) + 1000
      });
    }
    return data;
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Access denied. Admin privileges required.</div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <PackageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customers
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <LineChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={stats.salesData}>
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
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              You have {stats.recentOrders.length} orders this period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {order.userEmail}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${order.total?.toFixed(2)}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {order.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}