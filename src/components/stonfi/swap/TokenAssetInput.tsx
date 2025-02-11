import { Input } from "../ui/input"
import { validateFloatValue } from "@/libs/utils"
import type React from "react"  

interface TokenAssetInputProps {
  offerAmount: string
  setAmount: (amount: string) => void
  amountType: "ton" | "jetton"
}

export function TokenAssetInput({ offerAmount, setAmount, amountType }: TokenAssetInputProps) {
  const handleInputUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim()
    if (value && !validateFloatValue(value)) return
    setAmount(value)
  }

  return <Input type="text" value={offerAmount} onChange={handleInputUpdate} placeholder="0.0" className="text-right" />
}

