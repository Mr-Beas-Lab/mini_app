import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  tonWalletAddress: string | null;
}

const initialState: WalletState = {
  tonWalletAddress: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setTonWalletAddress: (state, action: PayloadAction<string | null>) => {
      state.tonWalletAddress = action.payload;
    },
    clearWallet: (state) => {
      state.tonWalletAddress = null;
    },
  },
});

export const { setTonWalletAddress, clearWallet } = walletSlice.actions;

export default walletSlice.reducer;
