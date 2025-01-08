import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import '@/styles/index.css'
import App from '@/App'
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import { store } from '@/store/store'
import { postEvent } from '@telegram-apps/sdk';
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { OmnistonProvider } from "@ston-fi/omniston-sdk-react";

postEvent('web_app_setup_closing_behavior', { need_confirmation: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <TonConnectUIProvider
          manifestUrl="https://res.cloudinary.com/dd6sildog/raw/upload/v1733909863/tonmanifest_wjbnog.json"
          >
             <OmnistonProvider
                  apiUrl="wss://omni-ws.ston.fi"
              >
                  <Provider store={store}>
                    <App />
                  </Provider>
              </OmnistonProvider>
        </TonConnectUIProvider>
    </BrowserRouter>,

  </StrictMode>,
)
