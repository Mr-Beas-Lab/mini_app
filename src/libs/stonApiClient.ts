import { StonApiClient } from "@ston-fi/api";

export const stonApiClient = new StonApiClient({
  baseURL: import.meta.env.VITE_STON_API_URL || "https://api.ston.fi",
});
