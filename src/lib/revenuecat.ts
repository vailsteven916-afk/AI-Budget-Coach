import { Purchases } from '@revenuecat/purchases-js';

let purchasesInstance: Purchases | null = null;

export const getPurchases = (appUserId?: string) => {
  if (!purchasesInstance) {
    const apiKey = import.meta.env.VITE_REVENUECAT_PUBLIC_KEY;
    if (!apiKey) {
      console.warn('RevenueCat API key is missing. Please add VITE_REVENUECAT_PUBLIC_KEY to your environment variables.');
      return null;
    }
    
    try {
      purchasesInstance = Purchases.configure(apiKey, appUserId);
    } catch (error) {
      console.error('Failed to configure RevenueCat:', error);
      return null;
    }
  }
  
  // If appUserId is provided and different from current, we might need to log in
  // but for simplicity in this helper, we just return the configured instance.
  return purchasesInstance;
};
