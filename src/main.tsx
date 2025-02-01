import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "@/styles/index.css";
import App from "@/App";
import { BrowserRouter } from "react-router-dom";
import { store } from "@/store/store";
import { postEvent } from "@telegram-apps/sdk";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './language/i18n';

// Create a QueryClient instance
const queryClient = new QueryClient();

// Post the setup closing behavior event
postEvent("web_app_setup_closing_behavior", { need_confirmation: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <TonConnectUIProvider
        manifestUrl="https://res.cloudinary.com/dd6sildog/raw/upload/v1738043790/tonmanifest_wjbnog_xvdx0f_o5vppc.json"
        actionsConfiguration={{
          twaReturnUrl: `https://t.me/${import.meta.env.BASE_URL}`,
        }}
      >
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </Provider>
      </TonConnectUIProvider>
    </BrowserRouter>
  </StrictMode>
);
