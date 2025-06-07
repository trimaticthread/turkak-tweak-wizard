
// Environment konfigürasyonu
export const environment = {
  production: process.env.NODE_ENV === 'production',
  development: process.env.NODE_ENV === 'development',
  
  // API konfigürasyonu - Backend'inizin çalıştığı doğru port
  api: {
    baseUrl: process.env.VITE_API_BASE_URL || 'https://localhost:7104/api',
    timeout: parseInt(process.env.VITE_API_TIMEOUT || '30000'),
  },
  
  // Uygulama bilgileri
  app: {
    name: 'TURKAK Kalibrasyon Sistemi',
    version: '1.0.0',
  }
};

// Güvenlik kontrolleri
if (environment.production) {
  // Production ortamında gerekli kontroller
  if (!process.env.VITE_API_BASE_URL) {
    console.warn('Production ortamında VITE_API_BASE_URL tanımlanmalı');
  }
}
