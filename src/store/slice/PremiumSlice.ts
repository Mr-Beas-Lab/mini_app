import { RootState } from '@/store/store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  loading: true,
  hasPurchased: false,
  hasMRBToken: false,
};

const premiumSlice = createSlice({
  name: 'premium',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
   
    sethasMRBToken: (state, action: PayloadAction<boolean>) => {
      state.hasMRBToken = action.payload;
    },
  },
});

// Selectors
export const selectPremiumState = (state: RootState) => state.premium;

// Export actions and reducer
export const { setLoading, sethasMRBToken } = premiumSlice.actions;
export default premiumSlice.reducer;
