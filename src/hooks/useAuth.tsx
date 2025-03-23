
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/api';

// Define interface for user
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token?: string;
}

// Define interface for auth context
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

// Create auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing user session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          id: userData.user.id,
          name: userData.user.name,
          email: userData.user.email,
          role: userData.user.role,
          token: userData.token
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const data = await authService.login(email, password);
      
      if (data.user && data.user.role === 'user') {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          token: data.token
        });
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${data.user.name}!`,
        });
        
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid user credentials",
        });
        
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Admin login function
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const data = await authService.login(email, password);
      
      if (data.user && data.user.role === 'admin') {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          token: data.token
        });
        
        toast({
          title: "Admin login successful",
          description: `Welcome back, ${data.user.name}!`,
        });
        
        navigate('/admin/dashboard');
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Admin login failed",
          description: "Invalid admin credentials",
        });
        
        return false;
      }
    } catch (error) {
      console.error("Admin login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const data = await authService.register(name, email, password);
      
      if (data.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          token: data.token
        });
        
        toast({
          title: "Registration successful",
          description: `Welcome, ${name}!`,
        });
        
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        adminLogin,
        register,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
