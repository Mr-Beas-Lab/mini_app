// src/redux/slices/swapSlippageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SwapSlippageState {
  slippage: number;
}

const initialState: SwapSlippageState = {
  slippage: 5, // Default slippage tolerance in percentage
};

const swapSlippageSlice = createSlice({
  name: 'swapSlippage',
  initialState,
  reducers: {
    setSlippage: (state, action: PayloadAction<number>) => {
      state.slippage = action.payload;
    },
  },
});

export const { setSlippage } = swapSlippageSlice.actions;
export default swapSlippageSlice.reducer;
