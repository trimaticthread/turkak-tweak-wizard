
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '@/services/auth.service';
import { EmployeeLoginDto, EmployeeLoginResponseDto } from '@/types/api.types';
import { toast } from 'sonner';

interface AuthContextType {
  user: EmployeeLoginResponseDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<EmployeeLoginResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app startup
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser && AuthService.isAuthenticated()) {
          // Verify token with backend
          const isValid = await AuthService.verifyToken();
          if (isValid.valid) {
            setUser(currentUser);
          } else {
            // Token is invalid, clear storage
            await AuthService.logout();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        await AuthService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const credentials: EmployeeLoginDto = {
        employeeUserName: username,
        employeePassword: password,
      };
      
      const userData = await AuthService.login(credentials);
      setUser(userData);
      
      toast.success('Giriş başarılı', {
        description: `Hoş geldiniz, ${userData.employeeNameSurname}!`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Giriş başarısız';
      toast.error('Giriş başarısız', {
        description: message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
      setUser(null);
      toast.success('Çıkış yapıldı', {
        description: 'Güvenli bir şekilde çıkış yaptınız.',
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on backend, clear frontend state
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
