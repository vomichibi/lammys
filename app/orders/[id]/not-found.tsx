import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function OrderNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileQuestion className="h-6 w-6 text-gray-400" />
            <CardTitle>Order Not Found</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          
          <div className="space-y-2">
            <Button 
              asChild
              variant="outline"
              className="w-full"
            >
              <Link href="/dashboard?tab=orders">
                <Search className="mr-2 h-4 w-4" />
                View All Orders
              </Link>
            </Button>
            
            <Button 
              asChild
              className="w-full"
            >
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
