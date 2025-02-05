import { Card, CardContent, CardHeader, CardTitle } from "@/components/stonfi/ui/card"
import {   BitcoinIcon, DollarSignIcon, PercentIcon } from "lucide-react"

export default function Treasury() {
  return (
    <div className="  text-white">
  
      {/* Treasury Details */}
      <Card className="  ">
        <CardHeader>
          <CardTitle>Community Treasury</CardTitle>
        </CardHeader>
        <CardContent className="">
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-3">Balance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["MRB", "TON", "Bitcoin", "USDT"].map((token) => (
                <div key={token} className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800">
                  <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center">
                    {token === "Bitcoin" ? (
                      <BitcoinIcon className="h-4 w-4" />
                    ) : token === "USDT" ? (
                      <DollarSignIcon className="h-4 w-4" />
                    ) : (
                      <PercentIcon className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{token}</p>
                    <p className="text-xs text-zinc-400">0.00</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 mt-4 md:grid-cols-2 gap-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-zinc-400">Advertising</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300">Swap Commission</span>
                  <span className="text-sm font-medium">0.00%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-zinc-400">Lending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300">Active Opportunities</span>
                  <span className="text-sm font-medium">None</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

