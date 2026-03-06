import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('eventsphere_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const userData = await authService.login({ email, password });
    setUser(userData);
    localStorage.setItem('eventsphere_user', JSON.stringify(userData));
    toast.success('Welcome back!');
  };

  const register = async (name: string, email: string, password: string) => {
    const userData = await authService.register({ name, email, password });
    setUser(userData);
    localStorage.setItem('eventsphere_user', JSON.stringify(userData));
    toast.success('Account created successfully!');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eventsphere_user');
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
