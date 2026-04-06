import Purchases, { LOG_LEVEL, CustomerInfo } from 'react-native-purchases';
import { Platform } from 'react-native';

export const initRevenueCat = async () => {
  Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  
  // Use your Google Play key for Android, App Store key for iOS
  const apiKey = Platform.select({
    android: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_PLAY_KEY,
    ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
  });

  if (apiKey) {
    Purchases.configure({ apiKey });
  } else {
    console.warn("RevenueCat API keys are missing in .env");
  }
};

export const logInRevenueCat = async (uid: string): Promise<CustomerInfo> => {
  const { customerInfo } = await Purchases.logIn(uid);
  return customerInfo;
};

export const checkPremiumStatus = (customerInfo: CustomerInfo | null): boolean => {
  if (!customerInfo) return false;
  return typeof customerInfo.entitlements.active['AI Budget Coach Pro'] !== 'undefined';
};

export const subscribeToPremium = async (): Promise<CustomerInfo> => {
  const offerings = await Purchases.getOfferings();
  if (!offerings.current || offerings.current.availablePackages.length === 0) {
    throw new Error("No subscription packages found.");
  }
  
  const packageToBuy = offerings.current.availablePackages[0];
  const { customerInfo } = await Purchases.purchasePackage(packageToBuy);
  return customerInfo;
};
