import { useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios for Breeze
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
console.log('useAuth baseURL:', baseURL);
axios.defaults.baseURL = baseURL;
// Temporarily disable credentials to test
// axios.defaults.withCredentials = true;
// Remove default headers to avoid preflight
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export interface User {
  id: number;
  name: string;
  email: string;
  role_id?: number;
  role?: string | {
    id: number;
    name: string;
    slug: string;
  };
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  avatar?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get role name regardless of format
  const getRoleName = (user: User | null): string => {
    console.log('getRoleName called with user:', user);
    console.log('getRoleName - user.role:', user?.role);
    console.log('getRoleName - typeof user.role:', typeof user?.role);
    
    if (!user?.role) {
      console.log('getRoleName: no role found, returning user');
      return 'user';
    }
    
    // If role is a string (old format), map it to proper name
    if (typeof user.role === 'string') {
      console.log('getRoleName: role is string:', user.role);
      const roleMapping: { [key: string]: string } = {
        'frontend': 'Frontend Developer',
        'backend': 'Backend Developer',
        'pm': 'Project Manager',
        'designer': 'Designer',
        'qa': 'QA Engineer',
        'owner': 'Owner'
      };
      const mappedName = roleMapping[user.role] || user.role;
      console.log('getRoleName: mapped to:', mappedName);
      return mappedName;
    }
    
    // If role is an object (new format), return the name
    if (typeof user.role === 'object' && user.role.name) {
      console.log('getRoleName: role is object with name:', user.role.name);
      return user.role.name;
    }
    
    console.log('getRoleName: fallback to user');
    return 'user';
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      console.log('useAuth: checking token', { token });
      
      if (!token) {
        console.log('useAuth: no token found, setting user to null');
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        console.log('useAuth: validating token with API');
        const response = await axios.get('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('useAuth: token valid, full API response:', response.data);
        console.log('useAuth: user data:', response.data.user);
        console.log('useAuth: user role object:', response.data.user?.role);
        console.log('useAuth: user role name:', getRoleName(response.data.user));
        setUser(response.data.user);
      } catch (error) {
        console.log('useAuth: token invalid, removing token', error);
        // Token is invalid, remove it
        localStorage.removeItem('auth_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Starting login process...');
      console.log('Base URL:', axios.defaults.baseURL);
      
      // Skip CSRF for now to test
      console.log('Skipping CSRF token for testing...');
      
      // Attempt login directly
      console.log('Attempting login with:', { email, password: '***' });
      console.log('Request URL:', axios.defaults.baseURL + '/api/login');
      console.log('Request config:', {
        withCredentials: axios.defaults.withCredentials,
        headers: axios.defaults.headers
      });
      
      const response = await axios.post('/api/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Login response:', response.data);

      // Store the token
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        // Set default Authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }

      // Use user data from login response directly (no need to call /api/user)
      console.log('Using login response user data:', response.data.user);
      console.log('User role object:', response.data.user?.role);
      console.log('User role name:', getRoleName(response.data.user));
      setUser(response.data.user);
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        config: error.config,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        } : 'No response'
      });
      // Re-throw the error to be handled by the component
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    try {
      // Get CSRF token first
      await axios.get('/sanctum/csrf-cookie');
      
      // Attempt registration
      const response = await axios.post('/api/register', {
        name,
        email,
        password,
        password_confirmation,
      });

      // Fetch user data after successful registration
      const userResponse = await axios.get('/api/user');
      setUser(userResponse.data);
      
      return response.data;
    } catch (error: any) {
      // Re-throw the error to be handled by the component
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/logout');
    } catch (error: any) {
      // Even if logout fails, clear user state
    } finally {
      // Clear token and user state
      localStorage.removeItem('auth_token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    getRoleName,
  };
};
