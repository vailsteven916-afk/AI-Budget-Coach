import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Purchases } from "@revenuecat/purchases-js";
import App from './App.tsx';
import './index.css';

const appUserId = Purchases.generateRevenueCatAnonymousAppUserId();
const apiKey = import.meta.env.VITE_REVENUECAT_PUBLIC_KEY || "test_munXrmSXbnatIsKCHTECDDdOBMr";

try {
  Purchases.configure({
      apiKey: apiKey,
      appUserId: appUserId,
  });
} catch (error) {
  console.error("RevenueCat configuration failed:", error);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
