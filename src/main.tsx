import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import '@/styles/index.css'
import App from '@/App'
import { store } from '@/store/store'
import { postEvent } from '@telegram-apps/sdk';
import { TonConnectUIProvider } from '@tonconnect/ui-react'
postEvent('web_app_setup_closing_behavior', { need_confirmation: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider
      manifestUrl="https://res.cloudinary.com/dd6sildog/raw/upload/v1733909863/tonmanifest_wjbnog.json"
      >
      <Provider store={store}>
        <App />
      </Provider>
    </TonConnectUIProvider>
  </StrictMode>,
)
