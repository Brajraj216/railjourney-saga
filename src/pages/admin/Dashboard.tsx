
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BarChart, 
  LineChart,
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Bar 
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Train, 
  Users, 
  Ticket, 
  IndianRupee, 
  TrendingUp, 
  Calendar, 
  BarChart3,
  RefreshCcw
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Mock data
const revenueData = [
  { month: "Jan", revenue: 4250000, tickets: 82500 },
  { month: "Feb", revenue: 3890000, tickets: 76000 },
  { month: "Mar", revenue: 4560000, tickets: 88000 },
  { month: "Apr", revenue: 4780000, tickets: 92000 },
  { month: "May", revenue: 5120000, tickets: 98500 },
  { month: "Jun", revenue: 5430000, tickets: 104000 },
  { month: "Jul", revenue: 5680000, tickets: 109000 },
  { month: "Aug", revenue: 5250000, tickets: 101000 },
  { month: "Sep", revenue: 4930000, tickets: 95000 },
  { month: "Oct", revenue: 5180000, tickets: 99500 },
  { month: "Nov", revenue: 5470000, tickets: 105000 },
  { month: "Dec", revenue: 5890000, tickets: 113500 },
];

const trainCategoryData = [
  { name: "Express", value: 45 },
  { name: "SuperFast", value: 30 },
  { name: "Passenger", value: 15 },
  { name: "Luxury", value: 10 },
];

const recentTickets = [
  { id: "T12345", user: "Rahul Sharma", route: "Delhi to Mumbai", date: "2023-09-15", amount: 1250 },
  { id: "T12346", user: "Priya Singh", route: "Chennai to Bangalore", date: "2023-09-15", amount: 850 },
  { id: "T12347", user: "Amit Patel", route: "Kolkata to Delhi", date: "2023-09-16", amount: 1650 },
  { id: "T12348", user: "Neha Gupta", route: "Mumbai to Pune", date: "2023-09-16", amount: 450 },
  { id: "T12349", user: "Vikram Reddy", route: "Hyderabad to Chennai", date: "2023-09-17", amount: 1050 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Redirect if not admin
  if (user?.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-railway-950 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}. Here's what's happening with IndiaRail today.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0 flex items-center gap-2"
            onClick={() => setIsLoading(true)}
          >
            <RefreshCcw className="h-4 w-4" /> Refresh Data
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-railway-900 h-40 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹60.43M</div>
                <p className="text-xs text-muted-foreground">
                  +12.5% from last year
                </p>
                <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-railway-800 rounded">
                  <div className="h-1 bg-railway-600 rounded" style={{ width: '75%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,164,000</div>
                <p className="text-xs text-muted-foreground">
                  +8.2% from last year
                </p>
                <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-railway-800 rounded">
                  <div className="h-1 bg-railway-600 rounded" style={{ width: '68%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Trains</CardTitle>
                <Train className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">782</div>
                <p className="text-xs text-muted-foreground">
                  +4.3% from last month
                </p>
                <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-railway-800 rounded">
                  <div className="h-1 bg-railway-600 rounded" style={{ width: '85%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.25M</div>
                <p className="text-xs text-muted-foreground">
                  +15.2% from last year
                </p>
                <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-railway-800 rounded">
                  <div className="h-1 bg-railway-600 rounded" style={{ width: '92%' }}></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue and ticket sales for the past year</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={revenueData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="revenue"
                          name="Revenue (₹)"
                          stroke="#0c95e6"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="tickets"
                          name="Tickets Sold"
                          stroke="#9f7aea"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Train Categories</CardTitle>
                  <CardDescription>Distribution of trains by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trainCategoryData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" name="Percentage %" fill="#0c95e6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Ticket Bookings</CardTitle>
                  <CardDescription>Latest transactions on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{ticket.user}</span>
                          <span className="text-xs text-muted-foreground">{ticket.route}</span>
                          <span className="text-xs text-muted-foreground">{ticket.date}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₹{ticket.amount}</div>
                          <div className="text-xs text-muted-foreground">ID: {ticket.id}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>In-depth analysis of railway operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-60 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">Detailed analytics view to be implemented</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Generated Reports</CardTitle>
                <CardDescription>Download and view system reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-60 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">Reports module to be implemented</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
