// Local backend: import { Platform } from 'react-native' and use
// const DEV_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
const DEV_API_URL = 'https://lwinoo-staging.techbanq.net/';
const PRODUCTION_API_URL = 'https://lwinoo-staging.techbanq.net/';

export const API_BASE_URL = __DEV__ ? DEV_API_URL : PRODUCTION_API_URL;
export const REQUEST_TIMEOUT_MS = 15000;
export const DEFAULT_COORDINATE = { latitude: 24.7136, longitude: 46.6753 };

// Flip to true once a real Google Maps key is in Info.plist and AndroidManifest.xml.
// Until then iOS falls back to Apple Maps, which needs no key.
export const GOOGLE_MAPS_ENABLED = false;

// Temporary: profile-photo uploads go to the backend dev's ngrok server instead of staging's /api/files.
// Set to null to go back to API_BASE_URL.
export const UPLOAD_BASE_URL: string | null = 'https://moisture-granola-underwent.ngrok-free.dev';
