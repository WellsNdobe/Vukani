import Constants from "expo-constants";

const FALLBACK_API_BASE_URL = "http://localhost:5000";

const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;
const configuredBaseUrl = extra?.apiBaseUrl ?? process.env.EXPO_PUBLIC_API_BASE_URL;

export const API_BASE_URL = (configuredBaseUrl || FALLBACK_API_BASE_URL).replace(/\/$/, "");
