import { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: string | null;
  isAdmin: boolean;
  login: (username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Check if localStorage is available and working
    try {
      const testKey = 'test_storage';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      
      // Now load the auth user
      const stored = localStorage.getItem('authUser');
      if (stored) {
        setUser(stored);
        setIsAdmin(stored === 'admin');
      } else {
        // Set a default user for testing purposes
        // Remove this in production
        setUser('user');
        localStorage.setItem('authUser', 'user');
      }
    } catch (e) {
      console.error('LocalStorage not available:', e);
      // Fallback to session storage or cookies could be implemented here
      // For now, set a default user for testing
      setUser('user');
    }
  }, []);

  const login = (username: string) => {
    setUser(username);
    setIsAdmin(username === 'admin');
    localStorage.setItem('authUser', username);
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};