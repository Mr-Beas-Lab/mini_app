import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAssetsQuery } from "@/hooks/useAssetQuery";
import { setJetton0Address, setJetton1Address, setTonAmount, setJettonAmount } from "@/store/slice/LiqudityForm";
import { AssetSelect } from "../swap/AssetSelect";
import { validateFloatValue } from "@/libs/utils";
import { useState } from "react";

export default function LiquidityForm() {
  const dispatch = useDispatch();
  const [amounts, setAmounts] = useState({ ton: "", jetton: "" });

  const handleAmountChange = (amount: string, assetType: "ton" | "jetton") => {
    setAmounts((prev) => ({ ...prev, [assetType]: amount }));
    if (assetType === "ton") {
      dispatch(setTonAmount(amount));
    } else {
      dispatch(setJettonAmount(amount));
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="mx-auto max-w-xl">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm">Select pair</label>
              <div className="flex gap-2">
                <div className="flex-col gap-2">
                  <TokenAssetSelect
                    className="min-w-[150px] w-1/3 max-w-[150px]}"
                    assetIndex={0}
                  />
                  <TokenAssetInput
                    offerAmount={amounts.ton}
                    setAmount={(amount) => handleAmountChange(amount, "ton")}
                    amountType="ton"
                  />
                </div>
                <div className="flex-col gap-2">
                  <TokenAssetSelect
                    className="min-w-[150px] w-1/3 max-w-[150px]}"
                    assetIndex={1}
                  />
                  <TokenAssetInput
                    offerAmount={amounts.jetton}
                    setAmount={(amount) => handleAmountChange(amount, "jetton")}
                    amountType="jetton"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm">Select pool</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a pool" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pool1">Pool 1</SelectItem>
                  <SelectItem value="pool2">Pool 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            

            <Button className="w-full" size="lg" onClick={() => handleAddLiquidity(amounts)}>
              Add Liquidity
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Handling Add Liquidity button click
  function handleAddLiquidity(amounts: { ton: string, jetton: string }) {
    dispatch(setTonAmount(amounts.ton));
    dispatch(setJettonAmount(amounts.jetton));
  }
}



export const TokenAssetSelect = ({ className, assetIndex }: { className: string, assetIndex: number }) => {
    const dispatch = useDispatch();
    const { data, isLoading } = useAssetsQuery();
    const { jetton0Address, jetton1Address } = useSelector((state: RootState) => state.liquidityForm);
  
    const handleAssetSelect = (asset: any) => {
      if (assetIndex === 0) {
        dispatch(setJetton0Address(asset.contractAddress));
      } else {
        dispatch(setJetton1Address(asset.contractAddress));
      }
    };
  
    const selectedAsset = assetIndex === 0 
      ? data?.find((asset) => asset.contractAddress === jetton0Address) 
      : data?.find((asset) => asset.contractAddress === jetton1Address);
  
    return (
      <AssetSelect
        assets={data || []}
        selectedAsset={selectedAsset || null}
        onAssetSelect={handleAssetSelect}
        loading={isLoading}
        className={className}
      />
    );
  };
  

  export const TokenAssetInput = ({
    offerAmount,
    setAmount,
    amountType,
  }: {
    offerAmount: string;
    setAmount: (amount: string) => void;
    amountType: "ton" | "jetton";
  }) => {
    const handleInputUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trim();
      if (value && !validateFloatValue(value)) return;
      setAmount(value); // Call the setAmount function passed as prop
    };
  
    return <Input type="text" value={offerAmount} onChange={handleInputUpdate} />;
  };
  
