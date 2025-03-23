
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import {
  Train,
  Clock,
  Calendar,
  IndianRupee,
  CreditCard,
  Info,
  ChevronRight,
  Users,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

// Mock train data (same as in Trains.tsx)
const trainData = [
  {
    id: "1",
    name: "Rajdhani Express",
    number: "12301",
    from: "New Delhi",
    to: "Mumbai Central",
    departure: "16:50",
    arrival: "08:35",
    duration: "15h 45m",
    price: 1450,
    availability: "Available",
    rating: 4.7,
    type: "Superfast",
    amenities: ["food", "wifi", "entertainment", "charging", "bedding"],
    classes: ["SL", "3A", "2A", "1A"]
  },
  {
    id: "2",
    name: "Shatabdi Express",
    number: "12002",
    from: "New Delhi",
    to: "Bhopal",
    departure: "06:15",
    arrival: "14:10",
    duration: "7h 55m",
    price: 850,
    availability: "Limited",
    rating: 4.5,
    type: "Premium",
    amenities: ["food", "wifi", "entertainment", "charging"],
    classes: ["CC", "EC"]
  },
  {
    id: "3",
    name: "Duronto Express",
    number: "12213",
    from: "Mumbai CST",
    to: "Delhi Sarai Rohilla",
    departure: "23:10",
    arrival: "16:25",
    duration: "17h 15m",
    price: 1250,
    availability: "Available",
    rating: 4.3,
    type: "Superfast",
    amenities: ["food", "bedding", "charging"],
    classes: ["SL", "3A", "2A"]
  },
  {
    id: "4",
    name: "Vande Bharat Express",
    number: "22435",
    from: "New Delhi",
    to: "Varanasi",
    departure: "06:00",
    arrival: "14:00",
    duration: "8h 00m",
    price: 1950,
    availability: "Available",
    rating: 4.9,
    type: "Premium",
    amenities: ["food", "wifi", "entertainment", "charging"],
    classes: ["CC", "EC"]
  },
  {
    id: "5",
    name: "Tejas Express",
    number: "22119",
    from: "Mumbai CST",
    to: "Karmali",
    departure: "05:50",
    arrival: "14:15",
    duration: "8h 25m",
    price: 1200,
    availability: "Limited",
    rating: 4.5,
    type: "Premium",
    amenities: ["food", "wifi", "entertainment", "charging"],
    classes: ["CC", "EC"]
  }
];

// Class price multipliers
const classPriceMultipliers: Record<string, number> = {
  "SL": 1,
  "3A": 1.5,
  "2A": 2.2,
  "1A": 3,
  "CC": 1.2,
  "EC": 1.8
};

// Seat map data
const seatMap = {
  "SL": {
    rows: 8,
    seatsPerRow: 8,
    bookedSeats: [3, 12, 18, 24, 36, 45, 52]
  },
  "3A": {
    rows: 7,
    seatsPerRow: 6,
    bookedSeats: [5, 10, 19, 28, 32]
  },
  "2A": {
    rows: 5,
    seatsPerRow: 4,
    bookedSeats: [2, 8, 14]
  },
  "1A": {
    rows: 3,
    seatsPerRow: 2,
    bookedSeats: [3]
  },
  "CC": {
    rows: 9,
    seatsPerRow: 5,
    bookedSeats: [7, 15, 22, 31, 38]
  },
  "EC": {
    rows: 6,
    seatsPerRow: 4,
    bookedSeats: [4, 13, 20]
  }
};

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [train, setTrain] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");
  const [passengers, setPassengers] = useState([
    { name: "", age: "", gender: "male", seatNumber: 0, seatPreference: "no-preference" }
  ]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [addInsurance, setAddInsurance] = useState(false);
  const [specialMeal, setSpecialMeal] = useState(false);
  const [journeyDate, setJourneyDate] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Generate seat number array
  const getTotalSeats = (classType: string) => {
    if (!classType || !seatMap[classType as keyof typeof seatMap]) return 0;
    const { rows, seatsPerRow } = seatMap[classType as keyof typeof seatMap];
    return rows * seatsPerRow;
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    if (!train || !selectedClass) return 0;
    
    const basePrice = train.price;
    const classMultiplier = classPriceMultipliers[selectedClass] || 1;
    const passengersCount = passengers.length;
    const insuranceCost = addInsurance ? 49 * passengersCount : 0;
    const mealCost = specialMeal ? 150 * passengersCount : 0;
    const serviceFee = 25 * passengersCount;
    
    return (basePrice * classMultiplier * passengersCount) + insuranceCost + mealCost + serviceFee;
  };
  
  // Handle seat selection
  const handleSeatSelection = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      if (selectedSeats.length < passengers.length) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      } else {
        toast({
          title: "Maximum seats selected",
          description: `You can only select ${passengers.length} seats for ${passengers.length} passengers.`,
          variant: "destructive"
        });
      }
    }
  };
  
  // Handle adding passengers
  const handleAddPassenger = () => {
    if (passengers.length < 6) {
      setPassengers([
        ...passengers,
        { name: "", age: "", gender: "male", seatNumber: 0, seatPreference: "no-preference" }
      ]);
    } else {
      toast({
        title: "Maximum passengers reached",
        description: "You can book for a maximum of 6 passengers at a time.",
        variant: "destructive"
      });
    }
  };
  
  // Handle removing passengers
  const handleRemovePassenger = (index: number) => {
    if (passengers.length > 1) {
      const updatedPassengers = [...passengers];
      updatedPassengers.splice(index, 1);
      setPassengers(updatedPassengers);
      
      // Also update selected seats if needed
      if (selectedSeats.length > updatedPassengers.length) {
        setSelectedSeats(selectedSeats.slice(0, updatedPassengers.length));
      }
    }
  };
  
  // Handle passenger detail changes
  const handlePassengerChange = (index: number, field: string, value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };
  
  // Complete booking
  const handleCompleteBooking = () => {
    // Validate form
    const isPassengerValid = passengers.every(
      p => p.name && p.age && p.gender
    );
    
    if (!isPassengerValid) {
      toast({
        title: "Incomplete passenger details",
        description: "Please fill in all passenger details before proceeding.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedSeats.length !== passengers.length) {
      toast({
        title: "Seat selection incomplete",
        description: `Please select ${passengers.length} seats for all passengers.`,
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to complete your booking.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const ticketId = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // In a real app, this would be a server-side call to create the ticket
      navigate(`/ticket/${ticketId}`, { 
        state: { 
          train, 
          class: selectedClass,
          passengers,
          selectedSeats,
          journeyDate,
          totalPrice: calculateTotalPrice(),
          ticketId
        } 
      });
      
      setIsProcessing(false);
    }, 2000);
  };
  
  // Fetch train data
  useEffect(() => {
    // Simulate API call to get train details
    setLoading(true);
    setTimeout(() => {
      const foundTrain = trainData.find(t => t.id === id);
      if (foundTrain) {
        setTrain(foundTrain);
        if (foundTrain.classes.length > 0) {
          setSelectedClass(foundTrain.classes[0]);
        }
      }
      setLoading(false);
    }, 1000);
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-railway-950 pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-railway-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    );
  }
  
  if (!train) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-railway-950 pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Train Not Found</h1>
          <p className="text-muted-foreground mb-6">The train you're looking for doesn't exist.</p>
          <Link to="/trains">
            <Button>Browse All Trains</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-railway-950 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Main Booking Form */}
          <div className="w-full md:w-8/12 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Train Details</CardTitle>
                      <CardDescription>
                        Review your selected train and journey information
                      </CardDescription>
                    </div>
                    <Link to="/trains" className="text-sm text-railway-600 hover:text-railway-700">
                      Change Train
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 dark:bg-railway-900/30 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Train className="h-5 w-5 text-railway-600" />
                      <div>
                        <h3 className="font-semibold">{train.name}</h3>
                        <p className="text-xs text-muted-foreground">{train.number}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Departure</p>
                        <p className="font-medium">{train.departure}</p>
                        <p className="text-sm">{train.from}</p>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{train.duration}</p>
                        <div className="w-full flex items-center my-1">
                          <div className="h-[1px] flex-grow bg-gray-300"></div>
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                          <div className="h-[1px] flex-grow bg-gray-300"></div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Arrival</p>
                        <p className="font-medium">{train.arrival}</p>
                        <p className="text-sm">{train.to}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">
                          {format(journeyDate, "EEEE, MMMM d, yyyy")}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">
                          {train.from} → {train.to}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Travel Class</CardTitle>
                  <CardDescription>
                    Select your preferred travel class
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={selectedClass} 
                    onValueChange={setSelectedClass}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  >
                    {train.classes.map((cls: string) => (
                      <Label
                        key={cls}
                        htmlFor={cls}
                        className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer ${
                          selectedClass === cls 
                            ? "border-railway-600 bg-railway-50 dark:bg-railway-900/50" 
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <RadioGroupItem value={cls} id={cls} className="sr-only" />
                        <div className="text-lg font-bold">{cls}</div>
                        <div className="text-sm text-muted-foreground">
                          {cls === "SL" && "Sleeper Class"}
                          {cls === "3A" && "AC 3 Tier"}
                          {cls === "2A" && "AC 2 Tier"}
                          {cls === "1A" && "AC First Class"}
                          {cls === "CC" && "Chair Car"}
                          {cls === "EC" && "Executive Chair"}
                        </div>
                        <div className="mt-2 text-sm flex items-center">
                          <IndianRupee className="h-3 w-3 mr-1" />
                          {Math.round(train.price * (classPriceMultipliers[cls] || 1))}
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Passenger Details</CardTitle>
                    <CardDescription>
                      Add details for all passengers
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleAddPassenger}
                    disabled={passengers.length >= 6}
                    className="text-railway-600 border-railway-600"
                  >
                    Add Passenger
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {passengers.map((passenger, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Passenger {index + 1}</h3>
                          {passengers.length > 1 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemovePassenger(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`passenger-${index}-name`}>Full Name</Label>
                            <Input
                              id={`passenger-${index}-name`}
                              value={passenger.name}
                              onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                              placeholder="Enter passenger name"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`passenger-${index}-age`}>Age</Label>
                            <Input
                              id={`passenger-${index}-age`}
                              value={passenger.age}
                              onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
                              placeholder="Enter age"
                              type="number"
                              min="1"
                              max="120"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`passenger-${index}-gender`}>Gender</Label>
                            <Select 
                              value={passenger.gender} 
                              onValueChange={(value) => handlePassengerChange(index, "gender", value)}
                            >
                              <SelectTrigger id={`passenger-${index}-gender`}>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`passenger-${index}-preference`}>Seat Preference</Label>
                            <Select 
                              value={passenger.seatPreference} 
                              onValueChange={(value) => handlePassengerChange(index, "seatPreference", value)}
                            >
                              <SelectTrigger id={`passenger-${index}-preference`}>
                                <SelectValue placeholder="Select preference" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="no-preference">No Preference</SelectItem>
                                <SelectItem value="lower">Lower Berth</SelectItem>
                                <SelectItem value="middle">Middle Berth</SelectItem>
                                <SelectItem value="upper">Upper Berth</SelectItem>
                                <SelectItem value="side-lower">Side Lower</SelectItem>
                                <SelectItem value="side-upper">Side Upper</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Seat Selection</CardTitle>
                  <CardDescription>
                    Select {passengers.length} {passengers.length === 1 ? "seat" : "seats"} from the seat map
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedClass ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-gray-200 rounded-sm mr-2"></div>
                          <span>Available</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-railway-600 rounded-sm mr-2"></div>
                          <span>Your Selection</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-gray-400 rounded-sm mr-2"></div>
                          <span>Booked</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="grid grid-cols-8 md:grid-cols-12 gap-2 mb-4">
                          {Array.from({ length: getTotalSeats(selectedClass) }).map((_, index) => {
                            const seatNumber = index + 1;
                            const isBooked = seatMap[selectedClass as keyof typeof seatMap].bookedSeats.includes(seatNumber);
                            const isSelected = selectedSeats.includes(seatNumber);
                            
                            return (
                              <button
                                key={seatNumber}
                                className={`h-10 rounded-sm flex items-center justify-center text-xs font-medium transition-colors ${
                                  isBooked 
                                    ? "bg-gray-400 text-white cursor-not-allowed" 
                                    : isSelected
                                      ? "bg-railway-600 text-white hover:bg-railway-700"
                                      : "bg-gray-200 hover:bg-gray-300 dark:bg-railway-800 dark:hover:bg-railway-700"
                                }`}
                                onClick={() => !isBooked && handleSeatSelection(seatNumber)}
                                disabled={isBooked}
                                title={`Seat ${seatNumber}`}
                              >
                                {seatNumber}
                              </button>
                            );
                          })}
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>Selected: {selectedSeats.length}/{passengers.length}</span>
                          <span>Seats: {selectedSeats.join(", ") || "None"}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Please select a travel class first</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Payment Method</CardTitle>
                  <CardDescription>
                    Choose your preferred payment option
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    <div className={`flex items-center justify-between border rounded-lg p-4 ${
                      paymentMethod === "upi" ? "border-railway-600" : "border-gray-200"
                    }`}>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="font-medium cursor-pointer">UPI</Label>
                      </div>
                      <div className="flex gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-6" />
                      </div>
                    </div>
                    
                    <div className={`flex items-center justify-between border rounded-lg p-4 ${
                      paymentMethod === "card" ? "border-railway-600" : "border-gray-200"
                    }`}>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="font-medium cursor-pointer">Credit/Debit Card</Label>
                      </div>
                      <div className="flex gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/800px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/800px-Visa.svg.png" alt="Visa" className="h-6" />
                      </div>
                    </div>
                    
                    <div className={`flex items-center justify-between border rounded-lg p-4 ${
                      paymentMethod === "netbanking" ? "border-railway-600" : "border-gray-200"
                    }`}>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="netbanking" id="netbanking" />
                        <Label htmlFor="netbanking" className="font-medium cursor-pointer">Net Banking</Label>
                      </div>
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Booking Summary */}
          <div className="w-full md:w-4/12 md:sticky md:top-24 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Train</span>
                    <span className="font-medium">{train.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Journey</span>
                    <span className="font-medium">{train.from} to {train.to}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{format(journeyDate, "MMM d, yyyy")}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Class</span>
                    <span className="font-medium">{selectedClass || "Not selected"}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Passengers</span>
                    <span className="font-medium">{passengers.length}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="insurance" 
                        checked={addInsurance}
                        onCheckedChange={(checked) => setAddInsurance(checked as boolean)}
                      />
                      <Label htmlFor="insurance" className="cursor-pointer text-sm">Travel Insurance</Label>
                      <div className="relative group">
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-white dark:bg-railway-800 rounded shadow-lg text-xs">
                          Protect your journey with coverage for trip cancellations, delays, and medical emergencies.
                        </div>
                      </div>
                    </div>
                    <span>₹49 per person</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="meal" 
                        checked={specialMeal}
                        onCheckedChange={(checked) => setSpecialMeal(checked as boolean)}
                      />
                      <Label htmlFor="meal" className="cursor-pointer text-sm">Special Meal</Label>
                    </div>
                    <span>₹150 per person</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-1">
                    {passengers.length > 0 && selectedClass && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Base Fare ({passengers.length} {passengers.length === 1 ? "passenger" : "passengers"})</span>
                          <span>₹{train.price * classPriceMultipliers[selectedClass] * passengers.length}</span>
                        </div>
                        
                        {addInsurance && (
                          <div className="flex justify-between text-sm">
                            <span>Travel Insurance</span>
                            <span>₹{49 * passengers.length}</span>
                          </div>
                        )}
                        
                        {specialMeal && (
                          <div className="flex justify-between text-sm">
                            <span>Special Meal</span>
                            <span>₹{150 * passengers.length}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between text-sm">
                          <span>Service Fee</span>
                          <span>₹{25 * passengers.length}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>GST</span>
                          <span>Included</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center font-bold text-lg pt-2">
                    <span>Total Amount</span>
                    <span className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {calculateTotalPrice()}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-railway-600 hover:bg-railway-700"
                    disabled={
                      !selectedClass || 
                      selectedSeats.length !== passengers.length || 
                      !passengers.every(p => p.name && p.age) ||
                      isProcessing
                    }
                    onClick={handleCompleteBooking}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      "Complete Booking"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardContent className="text-center p-4">
                  <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {passengers.length > 0 ? (
                      <>
                        Booking for <span className="font-semibold">{passengers.length}</span> {passengers.length === 1 ? "passenger" : "passengers"}
                      </>
                    ) : (
                      "Add passenger details to continue"
                    )}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
