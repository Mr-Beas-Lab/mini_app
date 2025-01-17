import { Client } from "@ston-fi/sdk";

export const tonApiClient = new Client({
  endpoint: import.meta.env.VITE_TON_API_URL ?? "https://toncenter.com/api/v2/jsonRPC",
  apiKey: import.meta.env.VITE_TON_API_KEY,
});
