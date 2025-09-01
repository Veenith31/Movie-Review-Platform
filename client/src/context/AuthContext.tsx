
import { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  username?: string;
  role?: string; 
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (newToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        const decodedToken: { user: User } = jwtDecode(storedToken);
        setUser(decodedToken.user);
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to decode token on initial load", error);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  }, []);

  const login = (newToken: string) => {
    const decodedToken: { user: User } = jwtDecode(newToken);
    setUser(decodedToken.user);
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
