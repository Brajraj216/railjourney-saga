
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  Train, 
  Clock, 
  IndianRupee, 
  ArrowRight, 
  Search, 
  Utensils, 
  Wifi, 
  Monitor, 
  Battery, 
  BookOpen,
  ChevronDown
} from "lucide-react";

// Mock train data
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

const Trains = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [trainClass, setTrainClass] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [trainType, setTrainType] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);
  
  // Filter amenities
  const [wifiFilter, setWifiFilter] = useState(false);
  const [foodFilter, setFoodFilter] = useState(false);
  const [entertainmentFilter, setEntertainmentFilter] = useState(false);
  const [chargingFilter, setChargingFilter] = useState(false);
  
  // Get the filtered trains
  const filteredTrains = trainData.filter((train) => {
    // Filter by price range
    if (train.price < priceRange[0] || train.price > priceRange[1]) {
      return false;
    }
    
    // Filter by train type if selected
    if (trainType && train.type !== trainType) {
      return false;
    }
    
    // Filter by class if selected
    if (trainClass && !train.classes.includes(trainClass)) {
      return false;
    }
    
    // Filter by amenities
    if (wifiFilter && !train.amenities.includes("wifi")) {
      return false;
    }
    if (foodFilter && !train.amenities.includes("food")) {
      return false;
    }
    if (entertainmentFilter && !train.amenities.includes("entertainment")) {
      return false;
    }
    if (chargingFilter && !train.amenities.includes("charging")) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-railway-950 pt-20">
      <div className="bg-railway-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Find & Book Train Tickets</h1>
          
          <div className="bg-white dark:bg-railway-800 p-6 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">From</label>
                <Select value={from} onValueChange={setFrom}>
                  <SelectTrigger className="border-0 bg-gray-50 dark:bg-railway-700">
                    <SelectValue placeholder="Select departure station" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delhi">New Delhi</SelectItem>
                    <SelectItem value="mumbai">Mumbai CST</SelectItem>
                    <SelectItem value="chennai">Chennai Central</SelectItem>
                    <SelectItem value="kolkata">Kolkata Howrah</SelectItem>
                    <SelectItem value="bangalore">Bangalore City</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">To</label>
                <Select value={to} onValueChange={setTo}>
                  <SelectTrigger className="border-0 bg-gray-50 dark:bg-railway-700">
                    <SelectValue placeholder="Select arrival station" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delhi">New Delhi</SelectItem>
                    <SelectItem value="mumbai">Mumbai CST</SelectItem>
                    <SelectItem value="chennai">Chennai Central</SelectItem>
                    <SelectItem value="kolkata">Kolkata Howrah</SelectItem>
                    <SelectItem value="bangalore">Bangalore City</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Date of Journey</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left border-0 bg-gray-50 dark:bg-railway-700"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Class</label>
                <Select value={trainClass} onValueChange={setTrainClass}>
                  <SelectTrigger className="border-0 bg-gray-50 dark:bg-railway-700">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SL">Sleeper Class (SL)</SelectItem>
                    <SelectItem value="3A">AC 3 Tier (3A)</SelectItem>
                    <SelectItem value="2A">AC 2 Tier (2A)</SelectItem>
                    <SelectItem value="1A">AC First Class (1A)</SelectItem>
                    <SelectItem value="CC">Chair Car (CC)</SelectItem>
                    <SelectItem value="EC">Executive Chair Car (EC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto text-railway-600 border-railway-600 hover:bg-railway-50 dark:text-white dark:border-white"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Hide Filters" : "Show Filters"} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                className="w-full sm:w-auto bg-railway-600 hover:bg-railway-700"
              >
                <Search className="mr-2 h-4 w-4" /> Search Trains
              </Button>
            </div>
            
            {showFilters && (
              <motion.div 
                className="mt-6 pt-4 border-t"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm text-gray-600 dark:text-gray-300">Price Range</h3>
                    <Slider
                      value={priceRange}
                      min={0}
                      max={2000}
                      step={50}
                      onValueChange={setPriceRange}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm text-gray-600 dark:text-gray-300">Train Type</h3>
                    <RadioGroup value={trainType} onValueChange={setTrainType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Premium" id="premium" />
                        <Label htmlFor="premium">Premium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Superfast" id="superfast" />
                        <Label htmlFor="superfast">Superfast</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Express" id="express" />
                        <Label htmlFor="express">Express</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Passenger" id="passenger" />
                        <Label htmlFor="passenger">Passenger</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-sm text-gray-600 dark:text-gray-300">Amenities</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-railway-600 hover:text-railway-700 p-0 h-auto"
                        onClick={() => setShowAmenities(!showAmenities)}
                      >
                        {showAmenities ? "Hide Details" : "Show Details"}
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wifi className="h-4 w-4 text-gray-500" />
                          <Label htmlFor="wifi">WiFi</Label>
                        </div>
                        <Switch id="wifi" checked={wifiFilter} onCheckedChange={setWifiFilter} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-gray-500" />
                          <Label htmlFor="food">Food Service</Label>
                        </div>
                        <Switch id="food" checked={foodFilter} onCheckedChange={setFoodFilter} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4 text-gray-500" />
                          <Label htmlFor="entertainment">Entertainment</Label>
                        </div>
                        <Switch id="entertainment" checked={entertainmentFilter} onCheckedChange={setEntertainmentFilter} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Battery className="h-4 w-4 text-gray-500" />
                          <Label htmlFor="charging">Charging Points</Label>
                        </div>
                        <Switch id="charging" checked={chargingFilter} onCheckedChange={setChargingFilter} />
                      </div>
                    </div>
                    
                    {showAmenities && (
                      <motion.div 
                        className="mt-2 pt-2 border-t text-xs text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p>WiFi: Available on premium trains</p>
                        <p>Food: Meal service available on most long-distance trains</p>
                        <p>Entertainment: On-board entertainment systems</p>
                        <p>Charging: Power outlets for devices</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {filteredTrains.length} Train{filteredTrains.length !== 1 ? 's' : ''} Found
          </h2>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="departure">Departure Time</SelectItem>
                <SelectItem value="arrival">Arrival Time</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-6">
          {filteredTrains.map((train) => (
            <motion.div
              key={train.id}
              className="bg-white dark:bg-railway-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3 bg-gray-50 dark:bg-railway-800 p-4 md:rounded-l-lg">
                      <div className="flex items-center gap-3">
                        <Train className="h-5 w-5 text-railway-600" />
                        <div>
                          <h3 className="font-semibold">{train.name}</h3>
                          <p className="text-xs text-muted-foreground">{train.number}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Badge variant="outline" className="bg-railway-50 dark:bg-railway-800 text-railway-600 dark:text-railway-400 border-railway-200">
                          {train.type}
                        </Badge>
                      </div>
                      
                      <div className="mt-4 flex gap-1 flex-wrap">
                        {train.amenities.includes("food") && (
                          <Utensils className="h-4 w-4 text-gray-400" title="Food Service" />
                        )}
                        {train.amenities.includes("wifi") && (
                          <Wifi className="h-4 w-4 text-gray-400" title="WiFi" />
                        )}
                        {train.amenities.includes("entertainment") && (
                          <Monitor className="h-4 w-4 text-gray-400" title="Entertainment" />
                        )}
                        {train.amenities.includes("charging") && (
                          <Battery className="h-4 w-4 text-gray-400" title="Charging Points" />
                        )}
                        {train.amenities.includes("bedding") && (
                          <BookOpen className="h-4 w-4 text-gray-400" title="Bedding" />
                        )}
                      </div>
                    </div>
                    
                    <div className="md:col-span-6 p-4 flex flex-col justify-center">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center md:text-left">
                          <p className="text-2xl font-semibold">{train.departure}</p>
                          <p className="text-sm text-muted-foreground">{train.from}</p>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-xs text-muted-foreground mb-1 flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> {train.duration}
                          </div>
                          <div className="w-full flex items-center">
                            <div className="h-[2px] flex-grow bg-gray-200 dark:bg-gray-700"></div>
                            <ArrowRight className="h-4 w-4 text-gray-400 mx-1" />
                            <div className="h-[2px] flex-grow bg-gray-200 dark:bg-gray-700"></div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {date ? format(date, "EEE, MMM d, yyyy") : "Select date"}
                          </div>
                        </div>
                        
                        <div className="text-center md:text-right">
                          <p className="text-2xl font-semibold">{train.arrival}</p>
                          <p className="text-sm text-muted-foreground">{train.to}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
                        {train.classes.map((cls) => (
                          <div key={cls} className="border rounded p-2">
                            <p className="text-sm font-medium">{cls}</p>
                            <p className="text-xs text-muted-foreground">Available</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="md:col-span-3 p-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
                      <div className="text-center md:text-right mb-4">
                        <div className="text-sm text-muted-foreground">Starting from</div>
                        <div className="text-2xl font-bold flex items-center justify-center md:justify-end">
                          <IndianRupee className="h-4 w-4" />
                          {train.price}
                        </div>
                        <div className="text-xs text-muted-foreground">{train.availability}</div>
                      </div>
                      
                      <Link to={`/booking/${train.id}`}>
                        <Button 
                          className="w-full bg-railway-600 hover:bg-railway-700"
                        >
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {filteredTrains.length === 0 && (
            <div className="bg-white dark:bg-railway-900 rounded-lg shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-railway-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Train className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Trains Found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search criteria to find available trains.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setPriceRange([0, 2000]);
                  setTrainType("");
                  setTrainClass("");
                  setWifiFilter(false);
                  setFoodFilter(false);
                  setEntertainmentFilter(false);
                  setChargingFilter(false);
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trains;
