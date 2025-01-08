import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Settings } from 'lucide-react'
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react'
import { AssetInfo, useAssetList } from '@ston-fi/omniston-sdk-react'
import { AssetSelect } from './TokenSelector'   
import { SettingsModal } from './SettingModal'

export function Swap() {
  const [offerAsset, setOfferAsset] = useState<AssetInfo | null>(null)
  const [askAsset, setAskAsset] = useState<AssetInfo | null>(null)
  const [offerAmount, setOfferAmount] = useState('')
  const [askAmount, setAskAmount] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [slippage, setSlippage] = useState(5)

  const [tonConnectUI] = useTonConnectUI()
  const connected = tonConnectUI.connected
  const tonWalletAddress = useSelector((state: any) => state.wallet.tonWalletAddress)

  // Fetch assets using the useAssetList hook
  const { data: assetsResponse, isLoading } = useAssetList()
  const assets = assetsResponse?.assets || [] 
  console.log(assets)
  const handleSwap = async () => {
    if (!connected || !tonWalletAddress || !offerAsset || !askAsset) return
    // Implement swap logic here using @ston-fi/omniston-sdk-react
  }

  // Select default assets if no asset selected
  useEffect(() => {
    if (assets.length > 0) {
      setOfferAsset(assets[0]) // Set first asset as default offer asset
      setAskAsset(assets[1])   // Set second asset as default ask asset
    }
  }, [assets])

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
          {/* Offer Asset Section */}
          <div>
            <label className="block text-sm font-medium mb-2">You offer</label>
            <div className="flex gap-2">
              <AssetSelect
                selectedAsset={offerAsset}
                onAssetSelect={setOfferAsset}
                assets={assets} // Now passing the correct array of assets
                loading={isLoading}
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

          {/* Ask Asset Section */}
          <div>
            <label className="block text-sm font-medium mb-2">You ask</label>
            <div className="flex gap-2">
              <AssetSelect
                selectedAsset={askAsset}
                onAssetSelect={setAskAsset}
                assets={assets} // Now passing the correct array of assets
                loading={isLoading}
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

          {/* Asset Information */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Offer amount:</span>
              <span>{offerAmount || '0'} {offerAsset?.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span>Ask amount:</span>
              <span>{askAmount || '0'} {askAsset?.symbol}</span>
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

          {/* Swap Button */}
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

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        slippage={slippage}
        onSlippageChange={setSlippage}
      />
    </div>
  )
}
