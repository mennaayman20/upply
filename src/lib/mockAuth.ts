import { User, UserRole } from '@/types';

const STORAGE_KEYS = {
  CURRENT_USER: 'upply_current_user',
  USERS: 'upply_users',
};

export const mockAuth = {
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  },

  login: (email: string, password: string): User | null => {
    const users = mockAuth.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  signup: (email: string, password: string, role: UserRole): User => {
    const users = mockAuth.getAllUsers();
    
    // Prevent duplicate email signup
    if (users.some(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      password, // 👈 Added password
      role,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getAllUsers: (): User[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    return stored ? JSON.parse(stored) : [];
  },

  resetPassword: (email: string, newPassword: string): boolean => {
    const users = mockAuth.getAllUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) return false;
    
    users[userIndex].password = newPassword; // 👈 Update stored password
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    return true;
  },

  checkEmailExists: (email: string): boolean => {
    const users = mockAuth.getAllUsers();
    return users.some(u => u.email === email);
  },
};
