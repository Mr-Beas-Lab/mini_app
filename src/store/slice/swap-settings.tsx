// src/store/slice/swap-settings.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const SLIPPAGE_TOLERANCE_OPTIONS = [0.01, 0.03, 0.05, 0.1];

interface SwapSettingsState {
  slippageTolerance: number;
}

const initialState: SwapSettingsState = {
  slippageTolerance: 0.05, // Default value
};

const swapSettingsSlice = createSlice({
  name: "swapSettings",
  initialState,
  reducers: {
    setSlippageTolerance(state, action: PayloadAction<number>) {
      state.slippageTolerance = action.payload;
    },
  },
});

export const { setSlippageTolerance } = swapSettingsSlice.actions;

export default swapSettingsSlice.reducer;
