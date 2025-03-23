
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Train,
  LogIn,
  User,
  Ticket,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-railway-950/80 backdrop-blur-md shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-2 text-railway-800 dark:text-white"
        >
          <Train className="h-6 w-6" />
          <span className="font-bold text-xl">IndiaRail</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-railway-600 ${
              location.pathname === "/" ? "text-railway-600" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            to="/trains"
            className={`text-sm font-medium transition-colors hover:text-railway-600 ${
              location.pathname === "/trains" ? "text-railway-600" : "text-muted-foreground"
            }`}
          >
            Trains
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-railway-600 ${
              location.pathname === "/about" ? "text-railway-600" : "text-muted-foreground"
            }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors hover:text-railway-600 ${
              location.pathname === "/contact" ? "text-railway-600" : "text-muted-foreground"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/my-tickets">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Ticket className="h-4 w-4" />
                  My Tickets
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="default" size="sm" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-muted-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-railway-950 shadow-md animate-slideDown">
          <nav className="container mx-auto py-4 px-4 flex flex-col space-y-4">
            <Link
              to="/"
              className={`text-sm font-medium py-2 transition-colors hover:text-railway-600 ${
                location.pathname === "/" ? "text-railway-600" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/trains"
              className={`text-sm font-medium py-2 transition-colors hover:text-railway-600 ${
                location.pathname === "/trains" ? "text-railway-600" : "text-muted-foreground"
              }`}
            >
              Trains
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium py-2 transition-colors hover:text-railway-600 ${
                location.pathname === "/about" ? "text-railway-600" : "text-muted-foreground"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium py-2 transition-colors hover:text-railway-600 ${
                location.pathname === "/contact" ? "text-railway-600" : "text-muted-foreground"
              }`}
            >
              Contact
            </Link>
            
            <div className="border-t pt-4 mt-2 space-y-2">
              {user ? (
                <>
                  <Link to="/my-tickets" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Ticket className="h-4 w-4 mr-2" />
                      My Tickets
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" className="block">
                    <Button variant="default" size="sm" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
