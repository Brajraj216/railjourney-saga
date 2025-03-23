
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  
  try {
    const userData = JSON.parse(user);
    return userData.token;
  } catch (error) {
    console.error('Error parsing user data', error);
    return null;
  }
};

// Helper function for API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const token = getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Something went wrong';
      
      if (response.status === 401) {
        // Handle unauthorized error
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth services
export const authService = {
  register: async (name: string, email: string, password: string) => {
    try {
      const data = await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      
      localStorage.setItem('user', JSON.stringify(data));
      
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  login: async (email: string, password: string) => {
    try {
      const data = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      localStorage.setItem('user', JSON.stringify(data));
      
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('user');
  },
};

// Train services
export const trainService = {
  getAllTrains: async () => {
    try {
      return await apiRequest('/trains');
    } catch (error) {
      throw error;
    }
  },
  
  getTrainById: async (id: string) => {
    try {
      return await apiRequest(`/trains/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

// Ticket services
export const ticketService = {
  bookTicket: async (bookingData: any) => {
    try {
      return await apiRequest('/tickets', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
    } catch (error) {
      throw error;
    }
  },
  
  getAllTickets: async () => {
    try {
      return await apiRequest('/tickets');
    } catch (error) {
      throw error;
    }
  },
  
  getTicketById: async (id: string) => {
    try {
      return await apiRequest(`/tickets/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  cancelTicket: async (id: string) => {
    try {
      return await apiRequest(`/tickets/${id}/cancel`, {
        method: 'PUT',
      });
    } catch (error) {
      throw error;
    }
  },
};

// Admin services
export const adminService = {
  getDashboardData: async () => {
    try {
      return await apiRequest('/admin/dashboard');
    } catch (error) {
      throw error;
    }
  },
};
