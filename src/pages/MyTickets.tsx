
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { Train, Search, ArrowRight, UserCircle, Tag } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

// Mock ticket data
const mockTickets = [
  {
    id: "T12345",
    train: {
      name: "Rajdhani Express",
      number: "12301",
      from: "New Delhi",
      to: "Mumbai Central",
      departure: "16:50",
      arrival: "08:35",
      duration: "15h 45m",
    },
    journeyDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    bookingDate: new Date(),
    passengers: [
      { name: "John Doe", age: "28", gender: "male" }
    ],
    class: "2A",
    status: "confirmed",
    totalAmount: 1850
  },
  {
    id: "T12346",
    train: {
      name: "Shatabdi Express",
      number: "12002",
      from: "New Delhi",
      to: "Bhopal",
      departure: "06:15",
      arrival: "14:10",
      duration: "7h 55m",
    },
    journeyDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    bookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    passengers: [
      { name: "Jane Doe", age: "26", gender: "female" },
      { name: "John Doe", age: "28", gender: "male" }
    ],
    class: "EC",
    status: "confirmed",
    totalAmount: 3200
  },
  {
    id: "T12347",
    train: {
      name: "Duronto Express",
      number: "12213",
      from: "Mumbai CST",
      to: "Delhi Sarai Rohilla",
      departure: "23:10",
      arrival: "16:25",
      duration: "17h 15m",
    },
    journeyDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    bookingDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    passengers: [
      { name: "John Doe", age: "28", gender: "male" }
    ],
    class: "3A",
    status: "completed",
    totalAmount: 1450
  },
  {
    id: "T12348",
    train: {
      name: "Vande Bharat Express",
      number: "22435",
      from: "New Delhi",
      to: "Varanasi",
      departure: "06:00",
      arrival: "14:00",
      duration: "8h 00m",
    },
    journeyDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    bookingDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    passengers: [
      { name: "John Doe", age: "28", gender: "male" },
      { name: "Jane Doe", age: "26", gender: "female" }
    ],
    class: "EC",
    status: "cancelled",
    totalAmount: 4200
  }
];

const MyTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState(mockTickets);
  const [filteredTickets, setFilteredTickets] = useState(mockTickets);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);
  
  useEffect(() => {
    // Filter tickets based on search query
    if (searchQuery.trim() === "") {
      setFilteredTickets(tickets);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = tickets.filter(
        ticket => 
          ticket.id.toLowerCase().includes(query) ||
          ticket.train.name.toLowerCase().includes(query) ||
          ticket.train.from.toLowerCase().includes(query) ||
          ticket.train.to.toLowerCase().includes(query)
      );
      setFilteredTickets(filtered);
    }
  }, [searchQuery, tickets]);
  
  // Split tickets by status
  const upcomingTickets = filteredTickets.filter(ticket => 
    ticket.status === "confirmed" && new Date(ticket.journeyDate) > new Date()
  );
  
  const completedTickets = filteredTickets.filter(ticket => 
    ticket.status === "completed" || 
    (ticket.status === "confirmed" && new Date(ticket.journeyDate) < new Date())
  );
  
  const cancelledTickets = filteredTickets.filter(ticket => 
    ticket.status === "cancelled"
  );
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-railway-950 pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-railway-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-railway-950 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2">My Tickets</h1>
            <p className="text-muted-foreground">
              View and manage all your train tickets in one place
            </p>
          </motion.div>
          
          <motion.div
            className="mb-6 flex flex-col sm:flex-row gap-4 justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative w-full sm:w-1/2 lg:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by train, station or PNR..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Link to="/trains">
                <Button className="bg-railway-600 hover:bg-railway-700">
                  Book New Ticket
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-6">
                <TabsTrigger value="upcoming" className="relative">
                  Upcoming
                  {upcomingTickets.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-railway-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {upcomingTickets.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed
                </TabsTrigger>
                <TabsTrigger value="cancelled">
                  Cancelled
                </TabsTrigger>
                <TabsTrigger value="all">
                  All Tickets
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-6">
                {upcomingTickets.length > 0 ? (
                  upcomingTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))
                ) : (
                  <EmptyState
                    title="No Upcoming Journeys"
                    description="You don't have any upcoming train journeys. Book a ticket to get started."
                    action={
                      <Link to="/trains">
                        <Button className="bg-railway-600 hover:bg-railway-700">
                          Book New Ticket
                        </Button>
                      </Link>
                    }
                  />
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-6">
                {completedTickets.length > 0 ? (
                  completedTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))
                ) : (
                  <EmptyState
                    title="No Completed Journeys"
                    description="You haven't completed any journeys yet."
                  />
                )}
              </TabsContent>
              
              <TabsContent value="cancelled" className="space-y-6">
                {cancelledTickets.length > 0 ? (
                  cancelledTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))
                ) : (
                  <EmptyState
                    title="No Cancelled Tickets"
                    description="You don't have any cancelled tickets."
                  />
                )}
              </TabsContent>
              
              <TabsContent value="all" className="space-y-6">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))
                ) : (
                  <EmptyState
                    title="No Tickets Found"
                    description="No tickets match your search criteria. Try adjusting your search."
                  />
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Ticket Card Component
const TicketCard = ({ ticket }: { ticket: any }) => {
  const isPast = new Date(ticket.journeyDate) < new Date();
  
  let statusColor = "bg-green-500";
  if (ticket.status === "cancelled") {
    statusColor = "bg-red-500";
  } else if (isPast) {
    statusColor = "bg-blue-500";
  }

  return (
    <Card className={`overflow-hidden ${ticket.status === "cancelled" ? "opacity-75" : ""}`}>
      <CardHeader className="pb-4 border-b">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-railway-100 dark:bg-railway-800 p-2 rounded-full">
              <Train className="h-5 w-5 text-railway-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{ticket.train.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{ticket.train.number}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm font-medium">{ticket.id}</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Booked on {format(new Date(ticket.bookingDate), "d MMM yyyy")}</span>
              </div>
            </div>
            
            <div>
              <Badge 
                className={`${
                  ticket.status === "cancelled" 
                    ? "bg-red-100 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400" 
                    : isPast
                      ? "bg-blue-100 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-green-100 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                }`}
              >
                <span className={`w-2 h-2 rounded-full mr-1.5 ${statusColor}`}></span>
                {ticket.status === "cancelled" 
                  ? "Cancelled" 
                  : isPast 
                    ? "Completed" 
                    : "Confirmed"
                }
              </Badge>
            </div>
            
            <Link to={`/ticket/${ticket.id}`} state={ticket}>
              <Button variant="outline" size="sm">
                View Ticket
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">From</p>
                <p className="font-medium">{ticket.train.from}</p>
                <p className="text-sm">{ticket.train.departure}</p>
              </div>
              
              <div className="md:hidden text-right">
                <p className="text-sm text-muted-foreground">To</p>
                <p className="font-medium">{ticket.train.to}</p>
                <p className="text-sm">{ticket.train.arrival}</p>
              </div>
            </div>
            
            <div className="md:hidden flex items-center justify-center my-2">
              <div className="h-[1px] flex-grow bg-gray-200"></div>
              <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
              <div className="h-[1px] flex-grow bg-gray-200"></div>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col justify-center items-center">
            <div className="text-xs text-muted-foreground mb-1">
              {ticket.train.duration}
            </div>
            <div className="w-full flex items-center">
              <div className="h-[1px] flex-grow bg-gray-200"></div>
              <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
              <div className="h-[1px] flex-grow bg-gray-200"></div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {format(new Date(ticket.journeyDate), "EEE, d MMM yyyy")}
            </div>
          </div>
          
          <div className="hidden md:block">
            <p className="text-sm text-muted-foreground">To</p>
            <p className="font-medium">{ticket.train.to}</p>
            <p className="text-sm">{ticket.train.arrival}</p>
          </div>
          
          <div className="md:hidden text-center my-2">
            <Badge variant="outline" className="font-normal">
              {format(new Date(ticket.journeyDate), "EEE, d MMM yyyy")}
            </Badge>
          </div>
          
          <div className="border-t md:border-t-0 pt-4 md:pt-0 col-span-1 md:col-span-3">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {ticket.passengers.length} {ticket.passengers.length === 1 ? "Passenger" : "Passengers"}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({ticket.passengers.map((p: any) => p.name).join(", ")})
                </span>
              </div>
              
              <div className="space-x-4">
                <span className="text-sm text-muted-foreground">
                  Class: <span className="font-medium">{ticket.class}</span>
                </span>
                <span className="text-sm font-medium">
                  ₹{ticket.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Empty State Component
const EmptyState = ({ 
  title, 
  description, 
  action 
}: { 
  title: string; 
  description: string; 
  action?: React.ReactNode;
}) => {
  return (
    <div className="bg-white dark:bg-railway-900 rounded-lg shadow-sm p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 dark:bg-railway-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <Train className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">
        {description}
      </p>
      {action}
    </div>
  );
};

export default MyTickets;
