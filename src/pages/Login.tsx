
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Train, UserCheck, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdminSubmitting, setIsAdminSubmitting] = useState(false);
  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) return;
    
    setIsAdminSubmitting(true);
    
    try {
      const success = await adminLogin(adminEmail, adminPassword);
      if (success) {
        navigate("/admin/dashboard");
      }
    } finally {
      setIsAdminSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-white/90 dark:bg-railway-950/90"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1540103711724-ebf833bde8d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
            backgroundAttachment: "fixed"
          }}
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <Train className="h-7 w-7 text-railway-600" />
            <span className="font-bold text-2xl">IndiaRail</span>
          </Link>
        </div>
        
        <div className="bg-white dark:bg-railway-900 p-8 rounded-xl shadow-xl backdrop-blur-sm">
          <Tabs defaultValue="user" className="space-y-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                User Login
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Admin Login
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="user" className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Sign in to your account to manage your bookings
                </p>
              </div>
              
              <form onSubmit={handleUserLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-railway-600 hover:text-railway-700"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-railway-600 hover:bg-railway-700" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-railway-600 hover:text-railway-700 font-medium">
                    Create one
                  </Link>
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Admin Portal</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Access the administrator dashboard
                </p>
              </div>
              
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@indiarail.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="admin-password">Password</Label>
                    <Link
                      to="/admin/forgot-password"
                      className="text-xs text-railway-600 hover:text-railway-700"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-railway-600 hover:bg-railway-700" 
                  disabled={isAdminSubmitting}
                >
                  {isAdminSubmitting ? "Signing in..." : "Sign In as Admin"}
                </Button>
              </form>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  To request admin access, please contact the{" "}
                  <Link to="/contact" className="text-railway-600 hover:text-railway-700 font-medium">
                    system administrator
                  </Link>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
