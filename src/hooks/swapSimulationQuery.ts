import type { SwapSimulation } from "@ston-fi/api";
import {
  type UseQueryOptions,
  skipToken,
  useQuery,
} from "@tanstack/react-query";
import { useTonAddress } from "@tonconnect/ui-react";
import { useSelector } from "react-redux";

import { useStonApi } from "./useStonApi";
import { floatToBigNumber } from "@/libs/utils";

import { useSwapStatusQuery } from "./swapStatusQuery";
import { RootState } from "@/store/store";
 
export type { SwapSimulation };

export const SWAP_SIMULATION_QUERY_KEY = "swap-simulation";

export function useSwapSimulation(
  options?: Omit<UseQueryOptions<SwapSimulation>, "queryKey" | "queryFn">,
) {
  // Replacing context hooks with Redux selectors
  const swapFormState = useSelector((state: RootState) => state.swapForm);
  const slippageTolerance = useSelector(
    (state: RootState) => state.swapSettings.slippageTolerance
  );

  const stonApi = useStonApi();
  const swapStatusQuery = useSwapStatusQuery();

  const walletAddress = useTonAddress();

  return useQuery({
    refetchInterval: 30 * 1000, // update every 30 seconds
    ...options,
    queryKey: [
      SWAP_SIMULATION_QUERY_KEY,
      swapFormState,
      walletAddress,
      slippageTolerance,
    ],
    queryFn:
      !swapStatusQuery.isFetching &&
      swapFormState.askAsset &&
      swapFormState.offerAsset &&
      (swapFormState.askAmount || swapFormState.offerAmount)
        ? async () => {
            const { askAsset, offerAsset, askAmount, offerAmount } = swapFormState;
  
            const shared = {
              slippageTolerance: (slippageTolerance / 100).toString(),
              dexV2: true,
            } as const;
  
            try {
              if (!offerAsset?.contractAddress || !askAsset?.contractAddress) {
                throw new Error("Invalid asset addresses provided for the swap.");
              }
  
              if (offerAmount && Number(offerAmount) <= 0) {
                throw new Error("Offer amount must be greater than zero.");
              }
  
              if (offerAsset && offerAmount && askAsset) {
                return await stonApi.simulateSwap({
                  ...shared,
                  offerAddress: offerAsset.contractAddress,
                  offerUnits: floatToBigNumber(
                    offerAmount,
                    offerAsset.meta?.decimals ?? 9,
                  ).toString(),
                  askAddress: askAsset.contractAddress,
                });
              }
  
              if (offerAsset && askAsset && askAmount) {
                return await stonApi.simulateReverseSwap({
                  ...shared,
                  offerAddress: offerAsset.contractAddress,
                  askAddress: askAsset.contractAddress,
                  askUnits: floatToBigNumber(
                    askAmount,
                    askAsset.meta?.decimals ?? 9,
                  ).toString(),
                });
              }
  
              throw new Error("Invalid swap form state.");
            } catch (error: any) {
              if (error.response) {
                throw new Error(
                  "No liquidity pool is available for swapping the selected assets."
                );
              }
              
              else{
                throw new Error(error.response?.data?.message || "An unexpected error occurred.");
              }
  
            }
          }
        : skipToken,
  });
  
}
