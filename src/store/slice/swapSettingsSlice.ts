
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const SLIPPAGE_TOLERANCE_OPTIONS = [0.005, 0.01, 0.05] as const;

const DEFAULT_SLIPPAGE_TOLERANCE = SLIPPAGE_TOLERANCE_OPTIONS[1];

type SwapSettingsState = {
  slippageTolerance: typeof SLIPPAGE_TOLERANCE_OPTIONS[number];
};

const initialState: SwapSettingsState = {
  slippageTolerance: DEFAULT_SLIPPAGE_TOLERANCE,
};

const swapSettingsSlice = createSlice({
  name: "swapSettings",
  initialState,
  reducers: {
    setSlippageTolerance: (
      state,
      action: PayloadAction<SwapSettingsState["slippageTolerance"]>
    ) => {
      state.slippageTolerance = action.payload;
    },
  },
});

export const { setSlippageTolerance } = swapSettingsSlice.actions;

export default swapSettingsSlice.reducer;
