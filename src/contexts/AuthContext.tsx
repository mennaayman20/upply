import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { mockAuth } from '@/lib/mockAuth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, role: UserRole) => Promise<User>;
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
  checkEmailExists: (email: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = mockAuth.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const loggedInUser = mockAuth.login(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, role: UserRole): Promise<User> => {
    const newUser = mockAuth.signup(email, password, role);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    mockAuth.logout();
    setUser(null);
  };

  const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
    return mockAuth.resetPassword(email, newPassword);
  };

  const checkEmailExists = (email: string): boolean => {
    return mockAuth.checkEmailExists(email);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, resetPassword, checkEmailExists, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
