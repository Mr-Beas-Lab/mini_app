import { useState, useEffect } from 'react';
import { ArrowDownUp, ChevronDown } from 'lucide-react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { useSelector } from 'react-redux';
import { formatBalance } from '@/libs/formatBalance';
import { formatAddress } from '@/libs/formatAddress';

interface Token {
  symbol: string;
  name: string;
  balance?: string;
  value?: string;
  icon?: string;
}

export default function TokenSwap() {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false);
  const [selectingToken, setSelectingToken] = useState<'from' | 'to'>('from');
  const [searchQuery, setSearchQuery] = useState('');
  const [amount, setAmount] = useState<string>('');
  
  const [convertedAmount, setConvertedAmount] = useState<string>('');
  const [conversionRate, setConversionRate] = useState<number>(1); // Simulated rate
  const [error, setError] = useState<string | null>(null);
  const { tonWalletAddress } = useSelector((state: any) => state.wallet);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const tokenURL = `https://tonapi.io/v2/accounts/${tonWalletAddress}/jettons?currencies=ton`;
        const response = await fetch(tokenURL);
        if (!response.ok) throw new Error('Failed to fetch tokens');

        const data = await response.json();
        const parsedJettons = data.balances.map((jetton: any) => ({
          symbol: jetton.jetton.symbol,
          name: jetton.jetton.name,
          balance: jetton.balance,
          value: jetton.value,
          icon: jetton.jetton.image,
        }));
        setTokens(parsedJettons);

        if (parsedJettons.length > 0) {
          setFromToken(parsedJettons[0]);
          setToToken(parsedJettons[1] || parsedJettons[0]);
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };

    fetchTokens();
  }, [tonWalletAddress]);

  // useEffect(() => {
  //   if (fromToken && toToken) {
  //     // Simulate fetching conversion rates
  //     setConversionRate(Math.random() * (1.5 - 0.5) + 0.5); // Random rate between 0.5 and 1.5
  //   }
  // }, [fromToken, toToken]);

  // useEffect(() => {
  //   // Calculate the converted amount based on the input amount and conversion rate
  //   if (amount && conversionRate) {
  //     const converted = (parseFloat(amount) * conversionRate).toFixed(4);
  //     setConvertedAmount(converted);
  //   } else {
  //     setConvertedAmount('');
  //   }
  // }, [amount, conversionRate]);

  const handleSwap = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Enter a valid amount to swap.');
      return;
    }
    if (fromToken && toToken) {
      console.log(`Swapping ${amount} ${fromToken.symbol} for ${convertedAmount} ${toToken.symbol}`);
      setError(null);
      alert(`Successfully swapped ${amount} ${fromToken.symbol} for ${convertedAmount} ${toToken.symbol}`);
    }
  };

  const filteredTokens = tokens.filter((token) =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="max-w-3xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-8">
          <img src="/placeholder.svg" alt="STON.fi" className="h-8" />
        </div>
        {tonWalletAddress ?
          <p className="mt-2">
              Connected Wallet: <b>{formatAddress(tonWalletAddress)}</b>
          </p> :
           <p>connct wallet</p>
        }
        
      </header>

      <Card className="max-w-xl mx-auto bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Swap tokens</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">You send</span>
                <span className="text-gray-400">
                  Balance: {fromToken?.balance ? formatBalance(fromToken.balance) : "0"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setSelectingToken('from');
                    setTokenSelectorOpen(true);
                  }}
                >
                  <img
                    src={fromToken?.icon || '/default-icon.png'}
                    alt={fromToken?.symbol || 'Token'}
                    className="w-6 h-6"
                  />
                  {fromToken?.symbol}
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="bg-transparent border-none text-2xl"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
            </div>

            <div className="flex justify-center">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">You receive</span>
                <span className="text-gray-400">
                  Balance: {toToken?.balance ? formatBalance(toToken.balance) : "0"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setSelectingToken('to');
                    setTokenSelectorOpen(true);
                  }}
                >
                  <img
                    src={toToken?.icon || '/default-icon.png'}
                    alt={toToken?.symbol || 'Token'}
                    className="w-6 h-6"
                  />
                  {toToken?.symbol}
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Input
                  type="text"
                  placeholder="0.00"
                  className="bg-transparent border-none text-2xl"
                  value={convertedAmount}
                  readOnly
                />
              </div>
            </div>

            <Button className="w-full bg-gray-700 hover:bg-gray-600" onClick={handleSwap}>
              Swap Tokens
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={tokenSelectorOpen} onOpenChange={setTokenSelectorOpen}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Select token</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Filter tokens"
            className="bg-gray-900 border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="space-y-2 my-4">
            {filteredTokens.map((token) => (
              <Button
                key={token.symbol}
                variant="outline"
                className="border-gray-700 w-full flex justify-between items-center p-4"
                onClick={() => {
                  if (selectingToken === 'from') {
                    setFromToken(token);
                  } else {
                    setToToken(token);
                  }
                  setTokenSelectorOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={token.icon || '/default-icon.png'}
                    alt={token.symbol}
                    className="w-6 h-6"
                  />
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-gray-400">{token.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-200">{token.balance}</div>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
