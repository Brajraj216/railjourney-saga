
import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  ChevronRight,
  Clock,
  Download,
  IndianRupee,
  MapPin,
  Share2,
  Calendar,
  Loader2,
  Trash2,
  AlertTriangle,
  ArrowRight,
  Train
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

const Ticket = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const ticketData = location.state;
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isCancellationOpen, setIsCancellationOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<"confirmed" | "cancelled" | "pending">("confirmed");
  
  useEffect(() => {
    // Simulate loading for demo
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);
  
  const handleDownloadTicket = () => {
    setIsDownloading(true);
    // Simulate download
    setTimeout(() => {
      setIsDownloading(false);
      toast({
        title: "Ticket Downloaded",
        description: "Your ticket has been downloaded successfully.",
      });
    }, 2000);
  };
  
  const handleShareTicket = () => {
    // Simulate share functionality
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Ticket link copied to clipboard.",
    });
  };
  
  const handleCancelTicket = () => {
    setIsCancelling(true);
    // Simulate cancellation
    setTimeout(() => {
      setIsCancelling(false);
      setIsCancellationOpen(false);
      setTicketStatus("cancelled");
      toast({
        title: "Ticket Cancelled",
        description: "Your ticket has been cancelled successfully. Refund will be processed in 5-7 business days.",
      });
    }, 2000);
  };
  
  // If we don't have ticket data and aren't loading, show error
  if (!isLoading && (!ticketData || !ticketData.train)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-railway-950 pt-20">
        <div className="text-center max-w-md px-4">
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full inline-block mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Ticket Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the ticket you're looking for. It may have been removed or the link is invalid.
          </p>
          <div className="space-y-2">
            <Link to="/my-tickets">
              <Button variant="outline" className="w-full">View My Tickets</Button>
            </Link>
            <Link to="/trains">
              <Button className="w-full">Book New Ticket</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-railway-950 pt-20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-railway-600" />
          <p className="text-muted-foreground">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-railway-950 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Status Banner */}
          {ticketStatus === "confirmed" ? (
            <motion.div 
              className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mr-3">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800 dark:text-green-300">Booking Confirmed</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Your ticket has been booked successfully. Ticket ID: {id}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-green-600 border-green-200 hover:border-green-300 hover:bg-green-50"
                onClick={handleDownloadTicket}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center mr-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />
                </div>
                <div>
                  <h3 className="font-medium text-red-800 dark:text-red-300">Booking Cancelled</h3>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    This ticket has been cancelled. Refund is being processed.
                  </p>
                </div>
              </div>
              <Link to="/trains">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50"
                >
                  Book New Ticket
                </Button>
              </Link>
            </motion.div>
          )}
          
          {/* Ticket Card */}
          <motion.div
            className="mb-6 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className={ticketStatus === "cancelled" ? "opacity-60" : ""}>
              <CardHeader className="border-b pb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-railway-100 dark:bg-railway-800 rounded-full flex items-center justify-center">
                      <Train className="h-6 w-6 text-railway-600" />
                    </div>
                    <div>
                      <CardTitle>{ticketData.train.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{ticketData.train.number}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={handleShareTicket}
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={handleDownloadTicket}
                      disabled={isDownloading || ticketStatus === "cancelled"}
                    >
                      {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      E-Ticket
                    </Button>
                    
                    {ticketStatus === "confirmed" && (
                      <Dialog open={isCancellationOpen} onOpenChange={setIsCancellationOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Cancel
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cancel Ticket</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to cancel this ticket? Cancellation charges may apply.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg text-sm">
                            <h4 className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 mb-2">
                              <AlertTriangle className="h-4 w-4" /> Cancellation Policy
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-amber-700 dark:text-amber-300">
                              <li>More than 48 hours before departure: 75% refund</li>
                              <li>24-48 hours before departure: 50% refund</li>
                              <li>Less than 24 hours before departure: No refund</li>
                            </ul>
                          </div>
                          
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => setIsCancellationOpen(false)}
                            >
                              Keep Ticket
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={handleCancelTicket}
                              disabled={isCancelling}
                            >
                              {isCancelling ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Cancelling...
                                </>
                              ) : (
                                "Confirm Cancellation"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="p-6 border-b">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">From</p>
                      <h3 className="text-xl font-semibold">{ticketData.train.from}</h3>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm text-muted-foreground">
                          {ticketData.journeyDate ? format(new Date(ticketData.journeyDate), "EEE, d MMM yyyy") : ""}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm text-muted-foreground">
                          {ticketData.train.departure}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-sm text-muted-foreground mb-1 flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> {ticketData.train.duration}
                      </div>
                      <div className="w-full flex items-center">
                        <div className="h-[2px] flex-grow bg-gray-200 dark:bg-gray-700"></div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground mx-1" />
                        <div className="h-[2px] flex-grow bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {ticketData.class} Class
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">To</p>
                      <h3 className="text-xl font-semibold">{ticketData.train.to}</h3>
                      <div className="flex items-center justify-end mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm text-muted-foreground">
                          {ticketData.journeyDate 
                            ? format(
                                new Date(
                                  new Date(ticketData.journeyDate).getTime() + 
                                  (ticketData.train.duration.includes('h') 
                                    ? parseInt(ticketData.train.duration) * 60 * 60 * 1000 
                                    : 0)
                                ), 
                                "EEE, d MMM yyyy"
                              ) 
                            : ""}
                        </span>
                      </div>
                      <div className="flex items-center justify-end mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm text-muted-foreground">
                          {ticketData.train.arrival}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-b">
                  <h3 className="font-semibold mb-4">Passenger Details</h3>
                  <div className="space-y-4">
                    {ticketData.passengers && ticketData.passengers.map((passenger: any, index: number) => (
                      <div 
                        key={index} 
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 bg-gray-50 dark:bg-railway-900/30 rounded-lg"
                      >
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium">{passenger.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Age / Gender</p>
                          <p className="font-medium">
                            {passenger.age} / {passenger.gender.charAt(0).toUpperCase() + passenger.gender.slice(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Seat</p>
                          <p className="font-medium">
                            {ticketData.selectedSeats?.[index] || "Not assigned"}
                            {passenger.seatPreference !== "no-preference" && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({passenger.seatPreference.replace("-", " ")})
                              </span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <div className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${
                              ticketStatus === "confirmed" ? "bg-green-500" : "bg-red-500"
                            }`}></span>
                            <p className="font-medium">
                              {ticketStatus === "confirmed" ? "Confirmed" : "Cancelled"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-6 border-b">
                  <h3 className="font-semibold mb-4">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Transaction ID</span>
                        <span className="font-medium">{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Payment Date</span>
                        <span className="font-medium">{format(new Date(), "d MMM yyyy, h:mm a")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method</span>
                        <span className="font-medium">UPI</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Fare</span>
                        <span>₹{Math.round(ticketData.totalPrice * 0.85)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxes & Fees</span>
                        <span>₹{Math.round(ticketData.totalPrice * 0.15)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount</span>
                        <span className="flex items-center">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          {ticketData.totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold mb-4">Important Information</h3>
                  <div className="space-y-3 text-sm">
                    <p className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      Please arrive at the station at least 30 minutes before departure time.
                    </p>
                    <p className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      Carry a valid ID proof (Aadhaar, PAN, Voter ID, etc.) for verification.
                    </p>
                    <p className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      Ticket is valid only for the date and train mentioned.
                    </p>
                    <p className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      For any assistance during your journey, contact the Railway Helpline at 139.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {ticketStatus === "cancelled" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="rotate-45 border-8 border-red-500 text-red-500 text-4xl font-bold py-2 px-12 opacity-90">
                  CANCELLED
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Actions */}
          <motion.div
            className="flex flex-wrap justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-3">
              <Link to="/">
                <Button variant="outline">
                  Return to Home
                </Button>
              </Link>
              <Link to="/my-tickets">
                <Button variant="outline">
                  My Tickets
                </Button>
              </Link>
            </div>
            
            {ticketStatus === "confirmed" ? (
              <Link to="/trains">
                <Button>
                  Book Another Ticket
                </Button>
              </Link>
            ) : (
              <Link to="/trains">
                <Button>
                  Book New Ticket
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
