import React, { createContext, useContext, useEffect, useState } from 'react';
import bcryptjs from 'bcryptjs';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'eq_coach_users';
const AUTH_USER_KEY = 'eq_coach_current_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a logged-in user in localStorage
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const getUsers = (): { [email: string]: { id: string; password: string; name: string } } => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  };

  const saveUsers = (users: { [email: string]: { id: string; password: string; name: string } }) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const users = getUsers();
      const lowerCaseEmail = email.toLowerCase().trim();
      
      if (users[lowerCaseEmail]) {
        throw new Error('User already exists with this email');
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      const id = crypto.randomUUID();
      
      users[lowerCaseEmail] = {
        id,
        password: hashedPassword,
        name,
      };
      
      saveUsers(users);
      
      // Don't automatically sign in after signup
      // Let the user explicitly sign in after registration
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const users = getUsers();
      const lowerCaseEmail = email.toLowerCase().trim();
      const user = users[lowerCaseEmail];
      
      if (!user) {
        throw new Error('No account found with this email address');
      }

      const isValidPassword = await bcryptjs.compare(password, user.password);
      
      if (!isValidPassword) {
        throw new Error('Incorrect password');
      }

      const userData = { id: user.id, email: lowerCaseEmail, name: user.name };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
      setUser(userData);
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = () => {
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}