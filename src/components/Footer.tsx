
import { Link } from "react-router-dom";
import { Train, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-railway-950 border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Train className="h-6 w-6 text-railway-600" />
              <span className="font-bold text-xl">IndiaRail</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your seamless journey partner across India. Connecting cities, connecting lives.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-railway-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-railway-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-railway-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-railway-600 transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-railway-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/trains" className="text-sm text-muted-foreground hover:text-railway-600 transition-colors">
                  Trains
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-railway-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-railway-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-railway-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-railway-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Passenger Info</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/booking-guide" className="text-sm text-muted-foreground hover:text-railway-600 transition-colors">
                  Booking Guide
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-sm text-muted-foreground hover:text-railway-600 transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/luggage-rules" className="text-sm text-muted-foreground hover:text-railway-600 transition-colors">
                  Luggage Rules
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-railway-600 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/amenities" className="text-sm text-muted-foreground hover:text-railway-600 transition-colors">
                  Train Amenities
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-railway-600 mr-3 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Railway Board, Rail Bhawan, Raisina Road, New Delhi - 110001
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-railway-600 mr-3" />
                <span className="text-sm text-muted-foreground">
                  +91 139
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-railway-600 mr-3" />
                <span className="text-sm text-muted-foreground">
                  info@indiarail.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} IndiaRail. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-railway-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-railway-600 transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-railway-600 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
