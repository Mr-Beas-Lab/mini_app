import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AssetInfo } from "@ston-fi/api";
 
interface ExtendedAssetInfo extends AssetInfo {
  meta?: {
    symbol: string;
    displayName: string;
    imageUrl: string;
    decimals: number;
  };
}

interface SwapState {
  offerAsset: ExtendedAssetInfo | null;
  askAsset: ExtendedAssetInfo | null;
  offerAmount: string;
  askAmount: string;
}

const initialState: SwapState = {
  offerAsset: null,
  askAsset: null,
  offerAmount: "",
  askAmount: "",
};

const swapFormSlice = createSlice({
  name: "swapForm",
  initialState,
  reducers: {
    setOfferAsset(state, action: PayloadAction<AssetInfo | null>) {
      const shouldResetAsk =
        state.askAsset?.contractAddress === action.payload?.contractAddress;

      state.offerAsset = action.payload;
      if (shouldResetAsk) {
        state.askAsset = null;
        state.askAmount = "";
      }
    },
    setAskAsset(state, action: PayloadAction<AssetInfo | null>) {
      state.askAsset = action.payload;
    },
    setOfferAmount(state, action: PayloadAction<string>) {
      state.offerAmount = action.payload;
      state.askAmount = "";
    },
    setAskAmount(state, action: PayloadAction<string>) {
      state.askAmount = action.payload;
      state.offerAmount = "";
    },
  
  },
});

export const {
  setOfferAsset,
  setAskAsset,
  setOfferAmount,
  setAskAmount,
 
} = swapFormSlice.actions;

export default swapFormSlice.reducer;
