import { X } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSlippageChange: (value: number) => void
  slippage: number
}

export function SettingsModal({ isOpen, onClose, onSlippageChange, slippage }: SettingsModalProps) {
  const slippageOptions = [1, 5, 10]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Swap Settings</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Slippage Tolerance</h3>
          <div className="flex gap-2">
            <input
              type="number"
              value={slippage}
              onChange={(e) => onSlippageChange(Number(e.target.value))}
              className="w-24 px-3 py-1 border rounded"
            />
            <span className="text-gray-500">%</span>
            {slippageOptions.map((option) => (
              <button
                key={option}
                onClick={() => onSlippageChange(option)}
                className={`px-4 py-1 rounded ${
                  slippage === option ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                {option}%
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

