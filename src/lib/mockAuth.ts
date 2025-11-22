import { User, UserRole } from '@/types';

const STORAGE_KEYS = {
  CURRENT_USER: 'upply_current_user',
  USERS: 'upply_users',
  PENDING_VERIFICATION: 'upply_pending_verification',

   // ➕ Added for Reset Password
  RESET_VERIFICATION: 'upply_reset_verification',
};

export const mockAuth = {
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  },

  login: (email: string, password: string): User | null => {
    const users = mockAuth.getAllUsers();
    const user = users.find(u => u.email === email);
    
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  signup: (email: string, password: string, role: UserRole): { user: User; otp: string } => {
    const users = mockAuth.getAllUsers();
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store user temporarily with OTP
    const pendingData = {
      user: newUser,
      otp,
      password,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.PENDING_VERIFICATION, JSON.stringify(pendingData));
    
    return { user: newUser, otp };
  },

  verifyOTP: (otp: string): User | null => {
    const pendingStr = localStorage.getItem(STORAGE_KEYS.PENDING_VERIFICATION);
    if (!pendingStr) return null;
    
    const pendingData = JSON.parse(pendingStr);
    
    // Check if OTP matches and is not expired (valid for 10 minutes)
    if (pendingData.otp === otp && Date.now() - pendingData.timestamp < 600000) {
      const users = mockAuth.getAllUsers();
      users.push(pendingData.user);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(pendingData.user));
      localStorage.removeItem(STORAGE_KEYS.PENDING_VERIFICATION);
      return pendingData.user;
    }
    
    return null;
  },

  resendOTP: (): string | null => {
    const pendingStr = localStorage.getItem(STORAGE_KEYS.PENDING_VERIFICATION);
    if (!pendingStr) return null;
    
    const pendingData = JSON.parse(pendingStr);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    pendingData.otp = newOtp;
    pendingData.timestamp = Date.now();
    localStorage.setItem(STORAGE_KEYS.PENDING_VERIFICATION, JSON.stringify(pendingData));
    
    return newOtp;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getAllUsers: (): User[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    return stored ? JSON.parse(stored) : [];
  },


  
  // Step 1 → send OTP
  sendResetOTP: (email: string): string | null => {
    const users = mockAuth.getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) return null;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const resetData = {
      email,
      otp,
      timestamp: Date.now(),
    };

    localStorage.setItem(STORAGE_KEYS.RESET_VERIFICATION, JSON.stringify(resetData));

    return otp;
  },

  // Step 2 → verify OTP
  verifyResetOTP: (otp: string): boolean => {
    const stored = localStorage.getItem(STORAGE_KEYS.RESET_VERIFICATION);
    if (!stored) return false;

    const resetData = JSON.parse(stored);

    const valid =
      resetData.otp === otp &&
      Date.now() - resetData.timestamp < 600000; // 10 minutes

    return valid;
  },




  resetPassword: (email: string, newPassword: string): boolean => {
    const users = mockAuth.getAllUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      return false;
    }
    
    // In a real app, password would be hashed here
    // For mock purposes, we'll just update the user record
    users[userIndex] = { ...users[userIndex], email }; // Keep user data
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    return true;
  },

  checkEmailExists: (email: string): boolean => {
    const users = mockAuth.getAllUsers();
    return users.some(u => u.email === email);
  },
};




// import { User, UserRole } from '@/types';

// const STORAGE_KEYS = {
//   CURRENT_USER: 'upply_current_user',
//   USERS: 'upply_users',
//   PENDING_VERIFICATION: 'upply_pending_verification',
// };

// export const mockAuth = {
//   getCurrentUser: (): User | null => {
//     const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
//     return stored ? JSON.parse(stored) : null;
//   },

//   login: (email: string, password: string): User | null => {
//     const users = mockAuth.getAllUsers();
//     const user = users.find(u => u.email === email && u.password === password);
    
//     if (user) {
//       localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
//       return user;
//     }
//     return null;
//   },

//   signup: (email: string, password: string, role: UserRole): User => {
//     const users = mockAuth.getAllUsers();
    
//     // Prevent duplicate email signup
//     if (users.some(u => u.email === email)) {
//       throw new Error('Email already exists');
//     }

//     const newUser: User = {
//       id: `user_${Date.now()}`,
//       email,
//       password, // 👈 Added password
//       role,
//       createdAt: new Date().toISOString(),
//     };
    
//     users.push(newUser);
//     localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
//     localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    
//     return newUser;
//   },

//   logout: () => {
//     localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
//   },

//   getAllUsers: (): User[] => {
//     const stored = localStorage.getItem(STORAGE_KEYS.USERS);
//     return stored ? JSON.parse(stored) : [];
//   },

//   resetPassword: (email: string, newPassword: string): boolean => {
//     const users = mockAuth.getAllUsers();
//     const userIndex = users.findIndex(u => u.email === email);
    
//     if (userIndex === -1) return false;
    
//     users[userIndex].password = newPassword; // 👈 Update stored password
//     localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
//     return true;
//   },

//   checkEmailExists: (email: string): boolean => {
//     const users = mockAuth.getAllUsers();
//     return users.some(u => u.email === email);
//   },
// };
