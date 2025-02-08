import { ChangeEvent } from "react";
import { AssetSelect } from "./AssetSelect";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { type AssetInfo, useAssetsQuery } from "@/hooks/useAssetQuery";
import { bigNumberToFloat, cn, validateFloatValue } from "@/libs/utils";
import { useSelector, useDispatch } from "react-redux";

//redux import
import {
  setOfferAsset,
  setAskAsset,
  setOfferAmount,
  setAskAmount,
} from "@/store/slice/swapForm"; 
 
import { RootState } from "@/store/store";
import { SwapFormHeader } from "./SwapFormHeader";
import { SwapSimulationPreview } from "./SwapSimulationPreview";
import { SwapButton } from "./SwapButton";
import { formatBalance } from "@/libs/formatBalance";
import { useTranslation } from "react-i18next";

// Helper functions
function assetUsdValue(asset: AssetInfo) {
  const balance = asset.balance;
  const decimals = asset.meta?.decimals ?? 9;
  const priceUsd = asset.dexPriceUsd;

  if (!balance || !priceUsd) return 0;

  return Number(bigNumberToFloat(balance, decimals)) * Number(priceUsd);
}

function sortAssets(a: AssetInfo, b: AssetInfo): number {
  const aUsdValue = assetUsdValue(a);
  const bUsdValue = assetUsdValue(b);

  if (aUsdValue && bUsdValue) {
    return bUsdValue - aUsdValue;
  }

  if (aUsdValue && !bUsdValue) return -1;
  if (!aUsdValue && bUsdValue) return 1;

  return 0;
}

export const SwapForm = (props: { className?: string }) => {
  const dispatch = useDispatch();

  const { offerAmount, askAmount } = useSelector(
    (state: RootState) => state.swapForm  
  );

  return (
    <Card {...props} className=" ">
            <SwapFormHeader />

      <CardContent className="  ">
        <section>
          <OfferAssetHeader className="mb-1 mt-5" />
          <div className="flex gap-2 justify-between">
            <OfferAssetSelect className="min-w-[150px] w-1/3 max-w-[150px]" />
            <OfferAssetInput
              offerAmount={offerAmount}
              dispatch={dispatch}
            />
          </div>
        </section>

        <section className="flex flex-col gap-1">
          <AskAssetHeader />
          <div className="flex gap-2">
            <AskAssetSelect className="min-w-[150px] w-1/3 max-w-[150px]" />
            <AskAssetInput
              askAmount={askAmount}
              dispatch={dispatch}
            />
            
          </div>
        </section>
      </CardContent>
      <SwapSimulationPreview />
      <div className="flex justify-center">
        
      <SwapButton />
      </div>
    </Card>
  );
};

// Offer Asset Header
export const OfferAssetHeader = (props: { className?: string }) => {
  const { offerAsset } = useSelector((state: RootState) => state.swapForm);
  const { t } = useTranslation();

  return (
    <div
      {...props}
      className={cn(
        "flex items-center justify-between gap-2 text-sm text-muted-foreground",
        props.className
      )}
    >
      <small className="text-gray-500">
        {t("swap.form.youoffer")}
      </small>
      <small className="text-gray-500">
        { offerAsset?.balance ? formatBalance(offerAsset.balance)+ offerAsset?.meta?.symbol : ""  }
      </small>
    </div>
  );
};

// Offer Asset Select
export const OfferAssetSelect = (props: { className?: string }) => {
  const { offerAsset } = useSelector((state: RootState) => state.swapForm);
  
  const dispatch = useDispatch();
  const { data, isLoading } = useAssetsQuery({
    select: (data) => data.sort(sortAssets),
  });

  const handleAssetSelect = (asset ) => {
    dispatch(setOfferAsset(asset));
  };

  return (
    <AssetSelect
      {...props}
      assets={data}
      selectedAsset={offerAsset}
      onAssetSelect={handleAssetSelect}
      loading={isLoading}
    />
  );
};

// Offer Asset Input
export const OfferAssetInput = ({ offerAmount, dispatch }: { offerAmount: string, dispatch: any }) => {
  const handleInputUpdate = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const value = target.value.trim();

    if (value && !validateFloatValue(value)) return;  // Prevent invalid input
    dispatch(setOfferAmount(value)); // Update amount on valid input
  };

  const isAmountValid = offerAmount === "" || validateFloatValue(offerAmount);  


  return (

    <Input
      disabled={!isAmountValid}  
      value={offerAmount}
      onChange={handleInputUpdate}
    />
  );
};



// Ask Asset Header
export const AskAssetHeader = (props: { className?: string }) => {
  const { askAsset } = useSelector((state: RootState) => state.swapForm);
  const { t } = useTranslation();

  return (
    <div
      {...props}
      className={cn(
        "flex items-center justify-between gap-2 text-sm text-muted-foreground",
        props.className
      )}
    >
      <small className="text-gray-500">
      {t("swap.form.youask")}
      </small>
      <small className="text-gray-500">
      { askAsset?.balance ? formatBalance(askAsset.balance)+ askAsset?.meta?.symbol : ""  }
      </small>
    </div>
  );
};


// Ask Asset Select
export const AskAssetSelect = (props: { className?: string }) => {
  const { askAsset, offerAsset } = useSelector((state: RootState) => state.swapForm);
  const dispatch = useDispatch();
  const { data, isLoading } = useAssetsQuery({
    select: (data) =>
      data
        .filter((a) => a.contractAddress !== offerAsset?.contractAddress)
        .sort(sortAssets),
  });

  const handleAssetSelect = (asset ) => {
    dispatch(setAskAsset(asset));
  };

  return (
    <AssetSelect
      {...props}
      assets={data}
      selectedAsset={askAsset}
      onAssetSelect={handleAssetSelect}
      loading={isLoading}
    />
  );
};

// Ask Asset Input
export const AskAssetInput = ({ askAmount, dispatch }: { askAmount: string, dispatch: any }) => {
  const handleInputUpdate = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const value = target.value.trim();

    // Allow empty string or validate float value only if it's not empty
    if (value && !validateFloatValue(value)) return;  // Prevent invalid input
    dispatch(setAskAmount(value)); // Update amount on valid input
  };

  const isAmountValid = askAmount === "" || validateFloatValue(askAmount); // Allow empty string


  return (
    <Input
      disabled={!isAmountValid}  // Input is disabled if validation fails
      value={askAmount}
      onChange={handleInputUpdate}
    />
  );
};