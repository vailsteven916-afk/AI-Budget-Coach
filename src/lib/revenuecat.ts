import { Capacitor } from '@capacitor/core';
import { Purchases as PurchasesWeb } from '@revenuecat/purchases-js';
import { Purchases as PurchasesNative, LOG_LEVEL } from '@revenuecat/purchases-capacitor';

export const initRevenueCat = async () => {
  if (Capacitor.isNativePlatform()) {
    await PurchasesNative.setLogLevel({ level: LOG_LEVEL.DEBUG });
    // Use Google Play key for Android, App Store key for iOS
    const apiKey = import.meta.env.VITE_REVENUECAT_GOOGLE_PLAY_KEY || "goog_placeholder";
    await PurchasesNative.configure({ apiKey });
  } else {
    const apiKey = import.meta.env.VITE_REVENUECAT_PUBLIC_KEY;
    
    if (!apiKey || !apiKey.startsWith('rcb_')) {
      console.warn("RevenueCat Web Billing requires a valid API key starting with 'rcb_'. Premium features will be disabled until configured.");
      return;
    }

    const appUserId = PurchasesWeb.generateRevenueCatAnonymousAppUserId();
    try {
      PurchasesWeb.configure({
          apiKey: apiKey,
          appUserId: appUserId,
      });
    } catch (error) {
      console.error("RevenueCat configuration failed:", error);
    }
  }
};

export const logInRevenueCat = async (uid: string) => {
  if (Capacitor.isNativePlatform()) {
    const { customerInfo } = await PurchasesNative.logIn({ appUserID: uid });
    return customerInfo;
  } else {
    if (!PurchasesWeb.isConfigured()) return null;
    const purchases = PurchasesWeb.getSharedInstance();
    await purchases.changeUser(uid);
    return await purchases.getCustomerInfo();
  }
};

export const checkPremiumStatus = (customerInfo: any) => {
  if (!customerInfo) return false;
  return "AI Budget Coach Pro" in customerInfo.entitlements.active;
};

export const subscribeToPremium = async () => {
  if (Capacitor.isNativePlatform()) {
    const offerings = await PurchasesNative.getOfferings();
    if (!offerings.current || offerings.current.availablePackages.length === 0) {
      throw new Error("No subscription packages found.");
    }
    const packageToBuy = offerings.current.availablePackages[0];
    const { customerInfo } = await PurchasesNative.purchasePackage({ aPackage: packageToBuy });
    return customerInfo;
  } else {
    if (!PurchasesWeb.isConfigured()) throw new Error("RevenueCat Web is not configured.");
    const purchases = PurchasesWeb.getSharedInstance();
    const offerings = await purchases.getOfferings();
    const currentOffering = offerings.current;
    if (!currentOffering) throw new Error("No current offering found.");
    
    const purchaseResult = await purchases.presentPaywall({ offering: currentOffering });
    return purchaseResult.customerInfo;
  }
};
