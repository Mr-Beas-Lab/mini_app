import { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'

interface Token {
  symbol: string
  icon: string
}

interface TokenSelectorProps {
  selectedToken: Token
  onSelect: (token: Token) => void
  tokens: Token[]
}

export function TokenSelector({ selectedToken, onSelect, tokens }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTokens = tokens.filter(token =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative">
      {/* Button to show selected token */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg border border-gray-700 bg-gray-900 text-white"
      >
        <img src={selectedToken.icon} alt={selectedToken.symbol} className="w-6 h-6" />
        <span>{selectedToken.symbol}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg">
          {/* Search input */}
          <div className="p-2">
            <div className="flex items-center gap-2 px-2 py-1 border border-gray-600 rounded bg-gray-900">
              <Search className="w-6 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search asset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full outline-none bg-transparent text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Token list */}
          <div className="max-h-60 overflow-auto">
            {filteredTokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => {
                  onSelect(token)
                  setIsOpen(false)
                }}
                className="flex items-center gap-2 w-full p-2 hover:bg-gray-700 transition-colors"
              >
                <img src={token.icon} alt={token.symbol} className="w-6 h-6" />
                <span>{token.symbol}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
