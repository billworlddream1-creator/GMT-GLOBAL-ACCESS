export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  INTEL_ANALYSIS = 'INTEL_ANALYSIS',
  MATH_CORE = 'MATH_CORE',
  NETWORK_SCANNER = 'NETWORK_SCANNER',
  GLOBAL_MARKET = 'GLOBAL_MARKET',
  DEVICE_SENSORS = 'DEVICE_SENSORS',
  SURVEILLANCE = 'SURVEILLANCE',
  LOCATION_TRACKER = 'LOCATION_TRACKER',
  SECURITY_OPS = 'SECURITY_OPS',
  PROFILE = 'PROFILE',
  CRYPTO_TRACKER = 'CRYPTO_TRACKER',
  IDENTITY_RESOLVER = 'IDENTITY_RESOLVER',
  FINANCIAL_INTEL = 'FINANCIAL_INTEL',
  USB_EXTRACTOR = 'USB_EXT_SCAN'
}

export interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'CRITICAL' | 'SUCCESS';
  message: string;
}

export interface MarketMetric {
  name: string;
  value: number;
  growth: number; // Percentage
  status: 'up' | 'down' | 'stable';
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  clearanceLevel: number;
  department: string;
  avatarUrl: string;
}

export interface CryptoCoin {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume24h: string;
}

export interface BankAccount {
  accountNumber: string;
  bankName: string;
  location: string;
  city: string;
  country: string;
  balance?: string;
  status: string;
}