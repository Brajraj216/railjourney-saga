
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ChevronRight, Train, Map, Shield, Clock, Award } from "lucide-react";

const Home = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-railway-900/90 to-railway-800/70"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "overlay",
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 z-10 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="text-white space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block px-3 py-1 rounded-full bg-railway-600 text-white text-xs font-medium mb-2">
                Your Journey, Our Priority
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Seamless Rail Travel Across India
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-lg">
                Book train tickets effortlessly with IndiaRail. Connecting cities and people with comfort, 
                reliability, and modern convenience.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/trains">
                  <Button className="bg-railway-600 hover:bg-railway-700">
                    Explore Trains
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="text-white border-white hover:bg-white/10">
                    Sign Up Free
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/95 dark:bg-railway-900/95 p-6 rounded-xl shadow-xl backdrop-blur-sm"
            >
              <h2 className="text-xl font-semibold mb-6">Find & Book Train Tickets</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select departure station" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delhi">New Delhi</SelectItem>
                        <SelectItem value="mumbai">Mumbai Central</SelectItem>
                        <SelectItem value="chennai">Chennai Central</SelectItem>
                        <SelectItem value="kolkata">Kolkata Howrah</SelectItem>
                        <SelectItem value="bangalore">Bangalore City</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select arrival station" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delhi">New Delhi</SelectItem>
                        <SelectItem value="mumbai">Mumbai Central</SelectItem>
                        <SelectItem value="chennai">Chennai Central</SelectItem>
                        <SelectItem value="kolkata">Kolkata Howrah</SelectItem>
                        <SelectItem value="bangalore">Bangalore City</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date of Journey</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
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
                    <label className="text-sm font-medium">Travelers & Class</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sl">Sleeper Class</SelectItem>
                        <SelectItem value="3a">AC 3 Tier</SelectItem>
                        <SelectItem value="2a">AC 2 Tier</SelectItem>
                        <SelectItem value="1a">AC First Class</SelectItem>
                        <SelectItem value="cc">Chair Car</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Link to="/trains">
                  <Button className="w-full bg-railway-600 hover:bg-railway-700">
                    Search Trains
                  </Button>
                </Link>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-white dark:bg-railway-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Trusted by millions across India
            </h3>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/83/Indian_Railways.svg/220px-Indian_Railways.svg.png" alt="Indian Railways" className="h-12 grayscale hover:grayscale-0 transition-all duration-300" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Indian_Railway_Catering_and_Tourism_Corporation_Logo.svg/220px-Indian_Railway_Catering_and_Tourism_Corporation_Logo.svg.png" alt="IRCTC" className="h-12 grayscale hover:grayscale-0 transition-all duration-300" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/UPI-Logo-vector.svg/220px-UPI-Logo-vector.svg.png" alt="UPI" className="h-10 grayscale hover:grayscale-0 transition-all duration-300" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/RailTel_Logo.png" alt="RailTel" className="h-10 grayscale hover:grayscale-0 transition-all duration-300" />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-railway-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose IndiaRail?</h2>
            <p className="text-lg text-muted-foreground">
              Experience the best of Indian Railways with our modern booking platform, designed with you in mind.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white dark:bg-railway-800/50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="w-12 h-12 bg-railway-100 dark:bg-railway-800 rounded-full flex items-center justify-center mb-4">
                <Map className="h-6 w-6 text-railway-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pan-India Network</h3>
              <p className="text-muted-foreground">
                Access to all train routes across India with comprehensive coverage of stations nationwide.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-railway-800/50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="w-12 h-12 bg-railway-100 dark:bg-railway-800 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-railway-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
              <p className="text-muted-foreground">
                End-to-end encrypted transactions and secure payment gateways to protect your personal information.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-railway-800/50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="w-12 h-12 bg-railway-100 dark:bg-railway-800 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-railway-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
              <p className="text-muted-foreground">
                Stay informed with instant notifications about your journey, delays, platform changes, and more.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-railway-800/50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="w-12 h-12 bg-railway-100 dark:bg-railway-800 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-railway-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Loyalty Rewards</h3>
              <p className="text-muted-foreground">
                Earn points with every booking and redeem them for discounts, upgrades, and exclusive benefits.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-20 bg-white dark:bg-railway-950">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col md:flex-row md:items-center justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="text-3xl font-bold mb-4">Popular Routes</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Discover the most traveled train routes across India with competitive fares and convenient schedules.
              </p>
            </div>
            <Link 
              to="/trains" 
              className="inline-flex items-center text-railway-600 hover:text-railway-700 font-medium mt-4 md:mt-0"
            >
              View All Routes <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                route: "Delhi to Mumbai",
                train: "Rajdhani Express",
                time: "16h 20m",
                image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80",
              },
              {
                route: "Bangalore to Chennai",
                train: "Shatabdi Express",
                time: "5h 30m",
                image: "https://images.unsplash.com/photo-1584461772370-77c3d82a67c8?auto=format&fit=crop&w=600&q=80",
              },
              {
                route: "Kolkata to Delhi",
                train: "Duronto Express",
                time: "17h 15m",
                image: "https://images.unsplash.com/photo-1554672408-730436b60dde?auto=format&fit=crop&w=600&q=80",
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative h-60 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.route} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold text-white mb-1">{item.route}</h3>
                    <div className="flex items-center text-white/80">
                      <Train className="h-4 w-4 mr-2" />
                      <span>{item.train}</span>
                      <span className="mx-2">•</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-railway-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Starting from</p>
                      <p className="text-xl font-semibold">₹1,299</p>
                    </div>
                    <Link to="/trains">
                      <Button variant="outline" className="text-railway-600 hover:text-railway-700 border-railway-600 hover:border-railway-700 hover:bg-railway-50">
                        Check Availability
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-railway-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Embark on Your Next Journey?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join millions of travelers who book with IndiaRail for a seamless and comfortable railway experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button className="bg-white text-railway-600 hover:bg-gray-100">
                  Create Account
                </Button>
              </Link>
              <Link to="/trains">
                <Button variant="outline" className="text-white border-white hover:bg-white/10">
                  Explore Routes
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
