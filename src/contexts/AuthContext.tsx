import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { mockAuth } from '@/lib/mockAuth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, role: UserRole) => Promise<User>;
  logout: () => void;
  sendOtp: (email: string) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
  checkEmailExists: (email: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // تخزين الـ OTPs مؤقتًا
  const [otpStorage, setOtpStorage] = useState<{ [email: string]: string }>({});

  // ✅ Load current user if exists (mock)
  useEffect(() => {
    const currentUser = mockAuth.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  // ✅ Login
  const login = async (email: string, password: string): Promise<boolean> => {
    const loggedInUser = mockAuth.login(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      return true;
    }
    return false;
  };

  // ✅ Signup
  const signup = async (email: string, password: string, role: UserRole): Promise<User> => {
    const newUser = mockAuth.signup(email, password, role);
    setUser(newUser);
    return newUser;
  };

  // ✅ Logout
  const logout = () => {
    mockAuth.logout();
    setUser(null);
  };

const sendOtp = async (email: string): Promise<boolean> => {
  if (!mockAuth.checkEmailExists(email)) return false;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  setOtpStorage((prev) => ({ ...prev, [email]: otp }));

  console.log(`📩 OTP for ${email}: ${otp}`); // عرض OTP للتجربة
  alert(`Your OTP is: ${otp}`); // اختياري لتجربة أسهل

  await new Promise((res) => setTimeout(res, 1000));
  return true;
};

  // ✅ Verify OTP
  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    const isValid = otpStorage[email] === otp;

    if (isValid) {
      setOtpStorage((prev) => {
        const newData = { ...prev };
        delete newData[email];
        return newData;
      });
    }

    await new Promise((res) => setTimeout(res, 500));
    return isValid;
  };

  // ✅ Reset Password
  const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
    return mockAuth.resetPassword(email, newPassword);
  };

  // ✅ Check if Email Exists
  const checkEmailExists = (email: string): boolean => {
    return mockAuth.checkEmailExists(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        sendOtp,
        verifyOtp,
        resetPassword,
        checkEmailExists,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
