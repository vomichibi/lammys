'use client';

import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <h3 className="text-sm font-medium">Total Revenue</h3>
              <div className="mt-2 text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium">Subscriptions</h3>
              <div className="mt-2 text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">+180.1% from last month</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium">Sales</h3>
              <div className="mt-2 text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">+19% from last month</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium">Active Now</h3>
              <div className="mt-2 text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+201 since last hour</p>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 p-6">
              <h3 className="text-lg font-medium mb-4">Overview</h3>
              {/* Add a chart or detailed statistics here */}
            </Card>
            <Card className="col-span-3 p-6">
              <h3 className="text-lg font-medium mb-4">Recent Sales</h3>
              {/* Add recent sales list here */}
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Analytics Content</h3>
            {/* Add analytics content here */}
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Reports Content</h3>
            {/* Add reports content here */}
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Notifications Content</h3>
            {/* Add notifications content here */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
