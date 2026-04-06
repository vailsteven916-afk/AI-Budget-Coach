import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Purchases } from "@revenuecat/purchases-js";
import App from './App.tsx';
import './index.css';

const appUserId = Purchases.generateRevenueCatAnonymousAppUserId();
Purchases.configure({
    apiKey: "test_munXrmSXbnatIsKCHTECDDdOBMr",
    appUserId: appUserId,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
