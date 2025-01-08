import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Settings } from 'lucide-react'
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react'
import { TokenSelector } from './TokenSelector'
import { SettingsModal } from './SettingModal'

const TOKENS = [
  { symbol: 'TON', icon: '/placeholder.svg?height=24&width=24' },
  { symbol: 'USDT', icon: '/placeholder.svg?height=24&width=24' },
  { symbol: 'STON', icon: '/placeholder.svg?height=24&width=24' },
  { symbol: 'GEMSTON', icon: '/placeholder.svg?height=24&width=24' },
  { symbol: 'SCALE', icon: '/placeholder.svg?height=24&width=24' },
  { symbol: 'tsTON', icon: '/placeholder.svg?height=24&width=24' },
  { symbol: 'stTON', icon: '/placeholder.svg?height=24&width=24' },
]

export function Swap() {
  const [offerToken, setOfferToken] = useState(TOKENS[0])
  const [askToken, setAskToken] = useState(TOKENS[1])
  const [offerAmount, setOfferAmount] = useState('')
  const [askAmount, setAskAmount] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [slippage, setSlippage] = useState(5)

  const [tonConnectUI] = useTonConnectUI()
  const connected = tonConnectUI.connected
  const tonWalletAddress = useSelector((state: any) => state.wallet.tonWalletAddress)

  const handleSwap = async () => {
    if (!connected || !tonWalletAddress) return
    // Implement swap logic here using @ston-fi/omniston-sdk-react
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex justify-between items-center px-5 mb-6">
        <h1 className="text-2xl font-bold text-white">Swap</h1>
        <button onClick={() => setIsSettingsOpen(true)} className="text-white">
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-dark text-white rounded-lg p-6 shadow-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">You offer</label>
            <div className="flex gap-2">
              <TokenSelector
                selectedToken={offerToken}
                onSelect={setOfferToken}
                tokens={TOKENS}
              />
              <input
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="flex-1 p-2 bg-gray-700 text-white border border-gray-600 rounded-lg outline-none focus:border-blue"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">You ask</label>
            <div className="flex gap-2">
              <TokenSelector
                selectedToken={askToken}
                onSelect={setAskToken}
                tokens={TOKENS}
              />
              <input
                type="number"
                value={askAmount}
                onChange={(e) => setAskAmount(e.target.value)}
                className="flex-1 p-2 bg-gray-700 text-white border border-gray-600 rounded-lg outline-none focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Offer amount:</span>
              <span>{offerAmount || '0'} {offerToken.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span>Ask amount:</span>
              <span>{askAmount || '0'} {askToken.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span>Protocol fee:</span>
              <span>0 TON</span>
            </div>
            <div className="flex justify-between">
              <span>Resolved by:</span>
              <a href="#" className="text-blue">Test</a>
            </div>
          </div>

          {connected ? (
            <button
              onClick={handleSwap}
              className="w-full bg-blue text-white py-3 rounded-lg transition-colors"
            >
              Swap
            </button>
          ) : (
            <TonConnectButton />
          )}
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        slippage={slippage}
        onSlippageChange={setSlippage}
      />
    </div>
  )
}
