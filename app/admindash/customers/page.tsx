'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
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
  UserIcon
} from 'lucide-react'

// Mock data - Replace with actual data fetching
const mockCustomers = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john@example.com', 
    phone: '0412345678',
    registeredDate: '2024-01-15',
    lastOrder: '2024-01-20',
    totalOrders: 5
  },
  // Add more mock customers...
]

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
  lastOrder: string;
  totalOrders: number;
}

export default function CustomersPage() {
  const { data: session, status } = useSession()
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'email' | 'phone' | 'name'>('name')
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({})

  useEffect(() => {
    filterCustomers()
  }, [searchTerm, filterType])

  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers)
      return
    }

    const filtered = customers.filter(customer => {
      const searchLower = searchTerm.toLowerCase()
      switch (filterType) {
        case 'email':
          return customer.email.toLowerCase().includes(searchLower)
        case 'phone':
          return customer.phone.includes(searchTerm)
        case 'name':
          return customer.name.toLowerCase().includes(searchLower)
        default:
          return true
      }
    })
    setFilteredCustomers(filtered)
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
  }

  const handleDelete = (customer: Customer) => {
    setCustomerToDelete(customer)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (customerToDelete) {
      setCustomers(prev => prev.filter(c => c.id !== customerToDelete.id))
      setFilteredCustomers(prev => prev.filter(c => c.id !== customerToDelete.id))
    }
    setIsDeleteDialogOpen(false)
    setCustomerToDelete(null)
  }

  const handleSaveEdit = () => {
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => 
        c.id === editingCustomer.id ? editingCustomer : c
      ))
      setFilteredCustomers(prev => prev.map(c => 
        c.id === editingCustomer.id ? editingCustomer : c
      ))
      setEditingCustomer(null)
    }
  }

  const handleCreateCustomer = () => {
    const newId = Math.max(...customers.map(c => parseInt(c.id))) + 1
    const customer: Customer = {
      id: newId.toString(),
      name: newCustomer.name || '',
      email: newCustomer.email || '',
      phone: newCustomer.phone || '',
      registeredDate: new Date().toISOString().split('T')[0],
      lastOrder: '-',
      totalOrders: 0
    }
    setCustomers(prev => [...prev, customer])
    setFilteredCustomers(prev => [...prev, customer])
    setNewCustomer({})
    setIsNewCustomerDialogOpen(false)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Access Denied. Admin privileges required.</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customer Management</h1>
        <Button onClick={() => setIsNewCustomerDialogOpen(true)}>
          <UserPlusIcon className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'name' ? 'default' : 'outline'}
                onClick={() => setFilterType('name')}
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Name
              </Button>
              <Button
                variant={filterType === 'email' ? 'default' : 'outline'}
                onClick={() => setFilterType('email')}
              >
                <MailIcon className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button
                variant={filterType === 'phone' ? 'default' : 'outline'}
                onClick={() => setFilterType('phone')}
              >
                <PhoneIcon className="w-4 h-4 mr-2" />
                Phone
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.registeredDate}</TableCell>
                  <TableCell>{customer.lastOrder}</TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(customer)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(customer)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Customer Dialog */}
      <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label>Name</label>
              <Input
                value={editingCustomer?.name}
                onChange={(e) => setEditingCustomer(prev => 
                  prev ? { ...prev, name: e.target.value } : null
                )}
              />
            </div>
            <div className="space-y-2">
              <label>Email</label>
              <Input
                value={editingCustomer?.email}
                onChange={(e) => setEditingCustomer(prev => 
                  prev ? { ...prev, email: e.target.value } : null
                )}
              />
            </div>
            <div className="space-y-2">
              <label>Phone</label>
              <Input
                value={editingCustomer?.phone}
                onChange={(e) => setEditingCustomer(prev => 
                  prev ? { ...prev, phone: e.target.value } : null
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCustomer(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {customerToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Customer Dialog */}
      <Dialog open={isNewCustomerDialogOpen} onOpenChange={setIsNewCustomerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label>Name</label>
              <Input
                value={newCustomer.name || ''}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label>Email</label>
              <Input
                value={newCustomer.email || ''}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label>Phone</label>
              <Input
                value={newCustomer.phone || ''}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCustomerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCustomer}>Create Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
