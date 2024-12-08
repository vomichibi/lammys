'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  PencilIcon, 
  TrashIcon, 
  UserPlusIcon,
  SearchIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
  ShieldIcon,
  CalendarIcon
} from 'lucide-react'
import { getAllUsers, User } from '@/lib/userManagement'

interface Customer extends User {
  phone?: string;
  totalOrders?: number;
  lastOrder?: string;
}

export default function CustomersPage() {
  const { user } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const users = await getAllUsers();
        // Convert users to customers format
        const customerData = users.map(user => ({
          ...user,
          phone: '', // You can add these fields from your orders database
          totalOrders: 0,
          lastOrder: '',
        }));
        setCustomers(customerData);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Customers</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                className="pl-8"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Registered Date</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Last Order</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <UserIcon className="mr-2 h-4 w-4 text-gray-500" />
                          {customer.name || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MailIcon className="mr-2 h-4 w-4 text-gray-500" />
                          {customer.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <ShieldIcon className="mr-2 h-4 w-4 text-gray-500" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            customer.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {customer.role}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                          {new Date(customer.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                          {new Date(customer.last_login_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{customer.totalOrders || 0}</TableCell>
                      <TableCell>{customer.lastOrder || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
