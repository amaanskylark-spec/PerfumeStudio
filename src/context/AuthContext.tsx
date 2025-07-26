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
      }
      // Removed default user setting - users should log in properly
    } catch (e) {
      console.error('LocalStorage not available:', e);
      // Fallback to session storage or cookies could be implemented here
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