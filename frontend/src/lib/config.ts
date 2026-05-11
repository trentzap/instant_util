// Determine if we are running in development or production
const isDev = process.env.NODE_ENV === 'development';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || (isDev ? 'http://localhost:8000' : 'https://instant-utilities-backend.onrender.com');
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || (isDev ? 'ws://localhost:8000' : 'wss://instant-utilities-backend.onrender.com');
