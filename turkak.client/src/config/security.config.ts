
// Güvenlik konfigürasyonu
export const securityConfig = {
  // API Base URL - Backend port 7104'te çalışıyor (Program.cs'den)
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://your-api-domain.com/api' 
    : 'https://localhost:7104/api',
  
  // Token güvenliği
  tokenStorageKey: 'authToken',
  userStorageKey: 'user',
  
  // Request timeout
  requestTimeout: 30000, // 30 saniye
  
  // CORS settings
  allowedOrigins: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080',
    'https://localhost:7104'
  ]
};

// Güvenli localStorage kullanımı
export const secureStorage = {
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
};
